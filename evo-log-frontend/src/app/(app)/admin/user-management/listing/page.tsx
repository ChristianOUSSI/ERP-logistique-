"use client";

import React, { useState } from "react";
import {
  Users, Plus, Search, Edit, Trash2, Shield, CheckCircle,
  XCircle, Eye, Filter, RefreshCw, Mail, Phone,
  UserCheck, UserX, ChevronDown
} from "lucide-react";

interface UserEntry {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: string;
  departement: string;
  statut: "ACTIF" | "INACTIF" | "SUSPENDU";
  derniere_connexion: string;
  avatar_initiales: string;
}

const roleColors: Record<string, string> = {
  ADMIN: "text-red-400 bg-red-400/10 border-red-400/30",
  MANAGER: "text-orange-400 bg-orange-400/10 border-orange-400/30",
  DISPATCHER: "text-cyan-400 bg-cyan-400/10 border-cyan-400/30",
  CHAUFFEUR: "text-sky-400 bg-sky-400/10 border-sky-400/30",
  MAGASINIER: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  RH: "text-pink-400 bg-pink-400/10 border-pink-400/30",
  FINANCE: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  TRANSIT: "text-violet-400 bg-violet-400/10 border-violet-400/30",
  QHSE: "text-rose-400 bg-rose-400/10 border-rose-400/30",
  MAINTENANCE: "text-indigo-400 bg-indigo-400/10 border-indigo-400/30",
};

const USERS: UserEntry[] = [
  { id: 1, nom: "NJOYA", prenom: "Christian", email: "admin@evo-log.cm", telephone: "+237 699 000 001", role: "ADMIN", departement: "Direction Générale", statut: "ACTIF", derniere_connexion: new Date().toISOString(), avatar_initiales: "CN" },
  { id: 2, nom: "NGUEMA", prenom: "Marie-Claire", email: "rh@evo-log.cm", telephone: "+237 677 890 123", role: "RH", departement: "Ressources Humaines", statut: "ACTIF", derniere_connexion: new Date(Date.now() - 7200000).toISOString(), avatar_initiales: "MN" },
  { id: 3, nom: "KAMGA", prenom: "Paul", email: "dispatcher@evo-log.cm", telephone: "+237 699 222 333", role: "DISPATCHER", departement: "Transport", statut: "ACTIF", derniere_connexion: new Date(Date.now() - 1800000).toISOString(), avatar_initiales: "PK" },
  { id: 4, nom: "EBANG", prenom: "Patrick", email: "finance@evo-log.cm", telephone: "+237 677 444 555", role: "FINANCE", departement: "Finance & Comptabilité", statut: "ACTIF", derniere_connexion: new Date(Date.now() - 3600000).toISOString(), avatar_initiales: "PE" },
  { id: 5, nom: "MVONDO", prenom: "Jean-Marc", email: "jm.mvondo@evo-log.cm", telephone: "+237 655 678 901", role: "CHAUFFEUR", departement: "Transport", statut: "ACTIF", derniere_connexion: new Date(Date.now() - 86400000).toISOString(), avatar_initiales: "JM" },
  { id: 6, nom: "ONDOUA", prenom: "Pierre", email: "magasin@evo-log.cm", telephone: "+237 699 111 222", role: "MAGASINIER", departement: "Magasin WMS", statut: "ACTIF", derniere_connexion: new Date(Date.now() - 14400000).toISOString(), avatar_initiales: "PO" },
  { id: 7, nom: "EKOTTO", prenom: "Jules", email: "transit@evo-log.cm", telephone: "+237 677 333 444", role: "TRANSIT", departement: "Transit & Douane", statut: "ACTIF", derniere_connexion: new Date(Date.now() - 21600000).toISOString(), avatar_initiales: "JE" },
  { id: 8, nom: "MBIDA", prenom: "Albert", email: "qhse@evo-log.cm", telephone: "+237 655 555 666", role: "QHSE", departement: "QHSE & Sécurité", statut: "SUSPENDU", derniere_connexion: new Date(Date.now() - 604800000).toISOString(), avatar_initiales: "AM" },
];

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "À l'instant";
  if (diff < 3600) return `${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}j`;
  return `${Math.floor(diff / 604800)}sem`;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserEntry[]>(USERS);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("TOUS");
  const [filterStatut, setFilterStatut] = useState("TOUS");
  const [view, setView] = useState<"grid" | "table">("table");

  const roles = [...new Set(USERS// TypeScript Version: 3.0

/// <reference types="node" />

import * as fs from "fs";
import { EventEmitter } from "events";
import { Matcher } from 'anymatch';

export class FSWatcher extends EventEmitter implements fs.FSWatcher {
  options: WatchOptions;

  /**
   * Constructs a new FSWatcher instance with optional WatchOptions parameter.
   */
  constructor(options?: WatchOptions);

  /**
   * Add files, directories, or glob patterns for tracking. Takes an array of strings or just one
   * string.
   */
  add(paths: string | ReadonlyArray<string>): this;

  /**
   * Stop watching files, directories, or glob patterns. Takes an array of strings or just one
   * string.
   */
  unwatch(paths: string | ReadonlyArray<string>): this;

  /**
   * Returns an object representing all the paths on the file system being watched by this
   * `FSWatcher` instance. The object's keys are all the directories (using absolute paths unless
   * the `cwd` option was used), and the values are arrays of the names of the items contained in
   * each directory.
   */
  getWatched(): {
    [directory: string]: string[];
  };

  /**
   * Removes all listeners from watched files.
   */
  close(): Promise<void>;

  on(event: 'add'|'addDir'|'change', listener: (path: string, stats?: fs.Stats) => void): this;

  on(event: 'all', listener: (eventName: 'add'|'addDir'|'change'|'unlink'|'unlinkDir', path: string, stats?: fs.Stats) => void): this;

  /**
   * Error occurred
   */
  on(event: 'error', listener: (error: Error) => void): this;

  /**
   * Exposes the native Node `fs.FSWatcher events`
   */
  on(event: 'raw', listener: (eventName: string, path: string, details: any) => void): this;

  /**
   * Fires when the initial scan is complete
   */
  on(event: 'ready', listener: () => void): this;

  on(event: 'unlink'|'unlinkDir', listener: (path: string) => void): this;

  on(event: string, listener: (...args: any[]) => void): this;

  ref(): this;
  
  unref(): this;
}

export interface WatchOptions {
  /**
   * Indicates whether the process should continue to run as long as files are being watched. If
   * set to `false` when using `fsevents` to watch, no more events will be emitted after `ready`,
   * even if the process continues to run.
   */
  persistent?: boolean;

  /**
   * ([anymatch](https://github.com/micromatch/anymatch)-compatible definition) Defines files/paths to
   * be ignored. The whole relative or absolute path is tested, not just filename. If a function
   * with two arguments is provided, it gets called twice per path - once with a single argument
   * (the path), second time with two arguments (the path and the
   * [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) object of that path).
   */
  ignored?: Matcher;

  /**
   * If set to `false` then `add`/`addDir` events are also emitted for matching paths while
   * instantiating the watching as chokidar discovers these file paths (before the `ready` event).
   */
  ignoreInitial?: boolean;

  /**
   * When `false`, only the symlinks themselves will be watched for changes instead of following
   * the link references and bubbling events through the link's path.
   */
  followSymlinks?: boolean;

  /**
   * The base directory from which watch `paths` are to be derived. Paths emitted with events will
   * be relative to this.
   */
  cwd?: string;

  /**
   *  If set to true then the strings passed to .watch() and .add() are treated as literal path
   *  names, even if they look like globs. Default: false.
   */
  disableGlobbing?: boolean;

  /**
   * Whether to use fs.watchFile (backed by polling), or fs.watch. If polling leads to high CPU
   * utilization, consider setting this to `false`. It is typically necessary to **set this to
   * `true` to successfully watch files over a network**, and it may be necessary to successfully
   * watch files in other non-standard situations. Setting to `true` explicitly on OS X overrides
   * the `useFsEvents` default.
   */
  usePolling?: boolean;

  /**
   * Whether to use the `fsevents` watching interface if available. When set to `true` explicitly
   * and `fsevents` is available this supercedes the `usePolling` setting. When set to `false` on
   * OS X, `usePolling: true` becomes the default.
   */
  useFsEvents?: boolean;

  /**
   * If relying upon the [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) object that
   * may get passed with `add`, `addDir`, and `change` events, set this to `true` to ensure it is
   * provided even in cases where it wasn't already available from the underlying watch events.
   */
  alwaysStat?: boolean;

  /**
   * If set, limits how many levels of subdirectories will be traversed.
   */
  depth?: number;

  /**
   * Interval of file system polling.
   */
  interval?: number;

  /**
   * Interval of file system polling for binary files. ([see list of binary extensions](https://gi
   * thub.com/sindresorhus/binary-extensions/blob/master/binary-extensions.json))
   */
  binaryInterval?: number;

  /**
   *  Indicates whether to watch files that don't have read permissions if possible. If watching
   *  fails due to `EPERM` or `EACCES` with this set to `true`, the errors will be suppressed
   *  silently.
   */
  ignorePermissionErrors?: boolean;

  /**
   * `true` if `useFsEvents` and `usePolling` are `false`). Automatically filters out artifacts
   * that occur when using editors that use "atomic writes" instead of writing directly to the
   * source file. If a file is re-added within 100 ms of being deleted, Chokidar emits a `change`
   * event rather than `unlink` then `add`. If the default of 100 ms does not work well for you,
   * you can override it by setting `atomic` to a custom value, in milliseconds.
   */
  atomic?: boolean | number;

  /**
   * can be set to an object in order to adjust timing params:
   */
  awaitWriteFinish?: AwaitWriteFinishOptions | boolean;
}

export interface AwaitWriteFinishOptions {
  /**
   * Amount of time in milliseconds for a file size to remain constant before emitting its event.
   */
  stabilityThreshold?: number;

  /**
   * File size polling interval.
   */
  pollInterval?: number;
}

/**
 * produces an instance of `FSWatcher`.
 */
export function watch(
  paths: string | ReadonlyArray<string>,
  options?: WatchOptions
): FSWatcher;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        