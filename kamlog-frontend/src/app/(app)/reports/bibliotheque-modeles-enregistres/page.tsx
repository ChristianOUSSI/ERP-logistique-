import { ModuleLayout } from '@/components/layout/ModuleLayout';

export default function BibliothequeModelesEnregistresPage() {
  return (
    <ModuleLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-headline-lg text-headline-lg text-on-surface">
            Bibliothèque de Modèles Enregistrés
          </h1>
          <p className="text-body-md text-body-md text-on-surface-variant mt-1">
            Bibliothèque de modèles de rapports enregistrés
          </p>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6">
          <p className="text-body-md text-on-surface-variant">
            Interface de bibliothèque de modèles - En cours de développement
          </p>
        </div>
      </div>
    </ModuleLayout>
  );
}
