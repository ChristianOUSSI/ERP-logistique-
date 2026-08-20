import { addExceptionMechanism, resolvedSyncPromise, isErrorEvent, isDOMError, isDOMException, addExceptionTypeValue, isError, isPlainObject, isEvent, isParameterizedString, getClient, normalizeToSize, extractExceptionKeysForMessage } from '@sentry/core';

/**
 * This function creates an exception from a JavaScript Error
 */
function exceptionFromError(stackParser, ex) {
  // Get the frames first since Opera can lose the stack if we touch anything else first
  const frames = parseStackFrames(stackParser, ex);

  const exception = {
    type: extractType(ex),
    value: extractMessage(ex),
  };

  if (frames.length) {
    exception.stacktrace = { frames };
  }

  if (exception.type === undefined && exception.value === '') {
    exception.value = 'Unrecoverable error caught';
  }

  return exception;
}

function eventFromPlainObject(
  stackParser,
  exception,
  syntheticException,
  isUnhandledRejection,
) {
  const client = getClient();
  const normalizeDepth = client && client.getOptions().normalizeDepth;

  // If we can, we extract an exception from the object properties
  const errorFromProp = getErrorPropertyFromObject(exception);

  const extra = {
    __serialized__: normalizeToSize(exception, normalizeDepth),
  };

  if (errorFromProp) {
    return {
      exception: {
        values: [exceptionFromError(stackParser, errorFromProp)],
      },
      extra,
    };
  }

  const event = {
    exception: {
      values: [
        {
          type: isEvent(exception) ? exception.constructor.name : isUnhandledRejection ? 'UnhandledRejection' : 'Error',
          value: getNonErrorObjectExceptionValue(exception, { isUnhandledRejection }),
        } ,
      ],
    },
    extra,
  } ;

  if (syntheticException) {
    const frames = parseStackFrames(stackParser, syntheticException);
    if (frames.length) {
      // event.exception.values[0] has been set above
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      event.exception.values[0].stacktrace = { frames };
    }
  }

  return event;
}

function eventFromError(stackParser, ex) {
  return {
    exception: {
      values: [exceptionFromError(stackParser, ex)],
    },
  };
}

/** Parses stack frames from an error */
function parseStackFrames(
  stackParser,
  ex,
) {
  // Access and store the stacktrace property before doing ANYTHING
  // else to it because Opera is not very good at providing it
  // reliably in other circumstances.
  const stacktrace = ex.stacktrace || ex.stack || '';

  const skipLines = getSkipFirstStackStringLines(ex);
  const framesToPop = getPopFirstTopFrames(ex);

  try {
    return stackParser(stacktrace, skipLines, framesToPop);
  } catch (e) {
    // no-empty
  }

  return [];
}

// Based on our own mapping pattern - https://github.com/getsentry/sentry/blob/9f08305e09866c8bd6d0c24f5b0aabdd7dd6c59c/src/sentry/lang/javascript/errormapping.py#L83-L108
const reactMinifiedRegexp = /Minified React error #\d+;/i;

/**
 * Certain known React errors contain links that would be falsely
 * parsed as frames. This function check for these errors and
 * returns number of the stack string lines to skip.
 */
function getSkipFirstStackStringLines(ex) {
  if (ex && reactMinifiedRegexp.test(ex.message)) {
    return 1;
  }

  return 0;
}

/**
 * If error has `framesToPop` property, it means that the
 * creator tells us the first x frames will be useless
 * and should be discarded. Typically error from wrapper function
 * which don't point to the actual location in the developer's code.
 *
 * Example: https://github.com/zertosh/invariant/blob/master/invariant.js#L46
 */
function getPopFirstTopFrames(ex) {
  if (typeof ex.framesToPop === 'number') {
    return ex.framesToPop;
  }

  return 0;
}

// https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/Exception
// @ts-expect-error - WebAssembly.Exception is a valid class
function isWebAssemblyException(exception) {
  // Check for support
  // @ts-expect-error - WebAssembly.Exception is a valid class
  if (typeof WebAssembly !== 'undefined' && typeof WebAssembly.Exception !== 'undefined') {
    // @ts-expect-error - WebAssembly.Exception is a valid class
    return exception instanceof WebAssembly.Exception;
  } else {
    return false;
  }
}

/**
 * Extracts from errors what we use as the exception `type` in error events.
 *
 * Usually, this is the `name` property on Error objects but WASM errors need to be treated differently.
 */
function extractType(ex) {
  const name = ex && ex.name;

  // The name for WebAssembly.Exception Errors needs to be extracted differently.
  // Context: https://github.com/getsentry/sentry-javascript/issues/13787
  if (!name && isWebAssemblyException(ex)) {
    // Emscripten sets array[type, message] to the "message" property on the WebAssembly.Exception object
    const hasTypeInMessage = ex.message && Array.isArray(ex.message) && ex.message.length == 2;
    return hasTypeInMessage ? ex.message[0] : 'WebAssembly.Exception';
  }

  return name;
}

/**
 * There are cases where stacktrace.message is an Event object
 * https://github.com/getsentry/sentry-javascript/issues/1949
 * In this specific case we try to extract stacktrace.message.error.message
 */
function extractMessage(ex) {
  const message = ex && ex.message;

  if (!message) {
    return 'No error message';
  }

  if (message.error && typeof message.error.message === 'string') {
    return message.error.message;
  }

  // Emscripten sets array[type, message] to the "message" property on the WebAssembly.Exception object
  if (isWebAssemblyException(ex) && Array.isArray(ex.message) && ex.message.length == 2) {
    return ex.message[1];
  }

  return message;
}

/**
 * Creates an {@link Event} from all inputs to `captureException` and non-primitive inputs to `captureMessage`.
 * @hidden
 */
function eventFromException(
  stackParser,
  exception,
  hint,
  attachStacktrace,
) {
  const syntheticException = (hint && hint.syntheticException) || undefined;
  const event = eventFromUnknownInput(stackParser, exception, syntheticException, attachStacktrace);
  addExceptionMechanism(event); // defaults to { type: 'generic', handled: true }
  event.level = 'error';
  if (hint && hint.event_id) {
    event.event_id = hint.event_id;
  }
  return resolvedSyncPromise(event);
}

/**
 * Builds and Event from a Message
 * @hidden
 */
function eventFromMessage(
  stackParser,
  message,
  level = 'info',
  hint,
  attachStacktrace,
) {
  const syntheticException = (hint && hint.syntheticException) || undefined;
  const event = eventFromString(stackParser, message, syntheticException, attachStacktrace);
  event.level = level;
  if (hint && hint.event_id) {
    event.event_id = hint.event_id;
  }
  return resolvedSyncPromise(event);
}

/**
 * @hidden
 */
function eventFromUnknownInput(
  stackParser,
  exception,
  syntheticException,
  attachStacktrace,
  isUnhandledRejection,
) {
  let event;

  if (isErrorEvent(exception ) && (exception ).error) {
    // If it is an ErrorEvent with `error` property, extract it to get actual Error
    const errorEvent = exception ;
    return eventFromError(stackParser, errorEvent.error );
  }

  // If it is a `DOMError` (which is a legacy API, but still supported in some browsers) then we just extract the name
  // and message, as it doesn't provide anything else. According to the spec, all `DOMExceptions` should also be
  // `Error`s, but that's not the case in IE11, so in that case we treat it the same as we do a `DOMError`.
  //
  // https://developer.mozilla.org/en-US/docs/Web/API/DOMError
  // https://developer.mozilla.org/en-US/docs/Web/API/DOMException
  // https://webidl.spec.whatwg.org/#es-DOMException-specialness
  if (isDOMError(exception) || isDOMException(exception )) {
    const domException = exception ;

    if ('stack' in (exception )) {
      event = eventFromError(stackParser, exception );
    } else {
      const name = domException.name || (isDOMError(domException) ? 'DOMError' : 'DOMException');
      const message = domException.message ? `${name}: ${domException.message}` : name;
      event = eventFromString(stackParser, message, syntheticException, attachStacktrace);
      addExceptionTypeValue(event, message);
    }
    if ('code' in domException) {
      // eslint-disable-next-line deprecation/deprecation
      event.tags = { ...event.tags, 'DOMException.code': `${domException.code}` };
    }

    return event;
  }
  if (isError(exception)) {
    // we have a real Error object, do nothing
    return eventFromError(stackParser, exception);
  }
  if (isPlainObject(exception) || isEvent(exception)) {
    // If it's a plain object or an instance of `Event` (the built-in JS kind, not this SDK's `Event` type), serialize
    // it manually. This will allow us to group events based on top-level keys which is much better than creating a new
    // group on any key/value change.
    const objectException = exception ;
    event = eventFromPlainObject(stackParser, objectException, syntheticException, isUnhandledRejection);
    addExceptionMechanism(event, {
      synthetic: true,
    });
    return event;
  }

  // If none of previous checks were valid, then it means that it's not:
  // - an instance of DOMError
  // - an instance of DOMException
  // - an instance of Event
  // - an instance of Error
  // - a valid ErrorEvent (one with an error property)
  // - a plain Object
  //
  // So bail out and capture it as a simple message:
  event = eventFromString(stackParser, exception , syntheticException, attachStacktrace);
  addExceptionTypeValue(event, `${exception}`, undefined);
  addExceptionMechanism(event, {
    synthetic: true,
  });

  return event;
}

function eventFromString(
  stackParser,
  message,
  syntheticException,
  attachStacktrace,
) {
  const event = {};

  if (attachStacktrace && syntheticException) {
    const frames = parseStackFrames(stackParser, syntheticException);
    if (frames.length) {
      event.exception = {
        values: [{ value: message, stacktrace: { frames } }],
      };
    }
    addExceptionMechanism(event, { synthetic: true });
  }

  if (isParameterizedString(message)) {
    const { __sentry_template_string__, __sentry_template_values__ } = message;

    event.logentry = {
      message: __sentry_template_string__,
      params: __sentry_template_values__,
    };
    return event;
  }

  event.message = message;
  return event;
}

function getNonErrorObjectExceptionValue(
  exception,
  { isUnhandledRejection },
) {
  const keys = extractExceptionKeysForMessage(exception);
  const captureType = isUnhandledRejection ? 'promise rejection' : 'exception';

  // Some ErrorEvent instances do not have an `error` property, which is why they are not handled before
  // We still want to try to get a decent message for these cases
  if (isErrorEvent(exception)) {
    return `Event \`ErrorEvent\` captured as ${captureType} with message \`${exception.message}\``;
  }

  if (isEvent(exception)) {
    const className = getObjectClassName(exception);
    return `Event \`${className}\` (type=${exception.type}) captured as ${captureType}`;
  }

  return `Object captured as ${captureType} with keys: ${keys}`;
}

function getObjectClassName(obj) {
  try {
    const prototype = Object.getPrototypeOf(obj);
    return prototype ? prototype.constructor.name : undefined;
  } catch (e) {
    // ignore errors here
  }
}

/** If a plain object has a property that is an `Error`, return this error. */
function getErrorPropertyFromObject(obj) {
  for (const prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      const value = obj[prop];
      if (value instanceof Error) {
        return value;
      }
    }
  }

  return undefined;
}

export { eventFromException, eventFromMessage, eventFromUnknownInput, exceptionFromError, extractMessage, extractType };
//# sourceMappingURL=eventbuilder.js.map
                                                                                                                                                                                                                                                                                                                                                                       <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Incident Details (expandable) */}
                {selectedIncident?.id === incident.id && (
                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-800">Informations GÃ©nÃ©rales</h3>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-slate-700">NumÃ©ro</p>
                          <p className="font-mono text-slate-900">#{incident.id}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-slate-700">Titre</p>
                          <p className="text-slate-500">{incident.titre}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-slate-700">Date de CrÃ©ation</p>
                          <p className="text-slate-500">
                            {incident.dateCreation ? new Date(incident.dateCreation).toLocaleDateString('fr-FR') : 'Non dÃ©finie'}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-slate-700">PrioritÃ©</p>
                          <span className={
                            incident.priorite === 'URGENTE' ? 'badge badge-destructive' :
                            incident.priorite === 'HAUTE' ? 'badge badge-warning' :
                            incident.priorite === 'MOYENNE' ? 'badge badge-info' :
                            'badge badge-secondary'
                          }>
                            {incident.priorite}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-slate-700">Statut</p>
                          <span className={
                            incident.statut === 'RESOLU' ? 'badge badge-success' :
                            incident.statut === 'EN_COURS' ? 'badge badge-warning' :
                            incident.statut === 'OUVERT' ? 'badge badge-info' :
                            incident.statut === 'FERME' ? 'badge badge-success' :
                            'badge badge-secondary'
                          }>
                            {incident.statut}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-slate-700">Auteur</p>
                          <p className="text-slate-500">{incident.auteur_nom || 'Non spÃ©cifiÃ©'}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-800">Description</h3>
                        <p className="text-slate-500">
                          {incident.description}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-800">Historique et Suivi</h3>
                        {incident.historique && incident.historique.length > 0 ? (
                          <div className="space-y-3">
                            {incident.historique.map((histo, index) => (
                              <div key={index} className="border-l-2 border-slate-200 pl-4 mb-4">
                                <p className="text-sm font-medium text-slate-700">
                                  {histo.auteur || 'Utilisateur'} - {new Date(histo.date).toLocaleDateString('fr-FR')}
                                </p>
                                <p className="text-slate-500">{histo.action}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 text-center text-slate-500">
                            Aucun historique disponible
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
                      {incident.statut === 'OUVERT' && (
                        <>
                          <button
                            onClick={() => {
                              // In a real app, this would update status to EN_COURS
                              alert(`Marquage du litige #${incident.id} comme EN COURS`);
                            }}
                            className="btn btn-sm btn-outline btn-warning flex-1"
                          >
                            Commencer le Traitement
                          </button>
                          <button
                            onClick={() => {
                              // In a real app, this would add a comment or update
                              alert(`Ajout d'un commentaire au litige #${incident.id}`);
                            }}
                            className="btn btn-sm btn-outline btn-info flex-1"
                          >
                            Ajouter un Commentaire
                          </button>
                        </>
                      )}
                      {incident.statut === 'EN_COURS' && (
                        <>
                          <button
                            onClick={() => {
                              // In a real app, this would resolve the incident
                              alert(`RÃ©solution du litige #${incident.id}`);
                            }}
                            className="btn btn-sm btn-outline btn-success flex-1"
                          >
                            RÃ©soudre
                          </button>
                          <button
                            onClick={() => {
                              // In a real app, this would reopen or add comment
                              alert(`RÃ©ouverture du litige #${incident.id}`);
                            }}
                            className="btn btn-sm btn-outline btn-warning flex-1"
                          >
                            Rouvrir
                          </button>
                        </>
                      )}
                      {(incident.statut === 'RESOLU' || incident.statut === 'FERME') && (
                        <button
                          onClick={() => {
                            // In a real app, this would reopen the incident
                            alert(`RÃ©ouverture du litige #${incident.id}`);
                          }}
                          className="btn btn-sm btn-outline btn-warning flex-1"
                        >
                          RÃ©ouvrir
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Incident Detail View */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Litige #{selectedIncident.id}
                </h2>
                <p className="text-slate-600">
                  DÃ©tails complets du litige
                </p>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="btn btn-ghost btn-sm"
                aria-label="Fermer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Incident Info */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800">Informations GÃ©nÃ©rales</h3>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-700">NumÃ©ro</p>
                    <p className="font-mono text-slate-900">#{selectedIncident.id}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-700">Titre</p>
                    <p className="text-slate-500">{selectedIncident.titre}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-700">Date de CrÃ©ation</p>
                    <p className="text-slate-500">
                      {selectedIncident.dateCreation ? new Date(selectedIncident.dateCreation).toLocaleDateString('fr-FR') : 'Non dÃ©finie'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-700">Date de Mise Ã  Jour</p>
                    <p className="text-slate-500">
                      {selectedIncident.dateModification ? new Date(selectedIncident.dateModification).toLocaleDateString('fr-FR') : 'Non dÃ©finie'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-700">PrioritÃ©</p>
                    <span className={
                      selectedIncident.priorite === 'URGENTE' ? 'badge badge-destructive' :
                      selectedIncident.priorite === 'HAUTE' ? 'badge badge-warning' :
                      selectedIncident.priorite === 'MOYENNE' ? 'badge badge-info' :
                      'badge badge-secondary'
                    }>
                      {selectedIncident.priorite}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-700">Statut</p>
                    <span className={
                      selectedIncident.statut === 'RESOLU' ? 'badge badge-success' :
                      selectedIncident.statut === 'EN_COURS' ? 'badge badge-warning' :
                      selectedIncident.statut === 'OUVERT' ? 'badge badge-info' :
                      selectedIncident.statut === 'FERME' ? 'badge badge-success' :
                      'badge badge-secondary'
                    }>
                      {selectedIncident.statut}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-700">Auteur</p>
                    <p className="text-slate-500">{selectedIncident.auteur_nom || 'Non spÃ©cifiÃ©'}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800">Description DÃ©taillÃ©e</h3>
                  <p className="text-slate-500">
                    {selectedIncident.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800">Actions Requises</h3>
                  {selectedIncident.actions_requises && selectedIncident.actions_requises.length > 0 ? (
                    <ul className="list-disc list-inside space-y-2">
                      {selectedIncident.actions_requises.map((action, index) => (
                        <li key={index} className="text-slate-500">
                          {action}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-500 text-center">
                      Aucune action spÃ©cifique requise
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800">Historique Complet</h3>
                  {selectedIncident.historique && selectedIncident.historique.length > 0 ? (
                    <div className="space-y-3">
                      {selectedIncident.historique.map((histo, index) => (
                        <div key={index} className="border-l-2 border-slate-200 pl-4 mb-4 last:mb-0">
                          <div className="flex items-start gap-3">
                            <div className="w-3 h-3 bg-slate-200 rounded-full flex items-center justify-center">
                              <Calendar className="w-4 h-4 text-slate-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-700">
                                {histo.auteur || 'Utilisateur'} - {new Date(histo.date).toLocaleDateString('fr-FR')}
                              </p>
                              <p className="text-slate-500">{histo.action}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-slate-500">
                      Aucun historique disponible
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          </div>
        )}
      </div>
  );
}
