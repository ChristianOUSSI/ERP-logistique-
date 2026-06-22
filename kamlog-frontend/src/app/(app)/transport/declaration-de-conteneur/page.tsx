import { ModuleLayout } from '@/components/layout/ModuleLayout';

export default function DeclarationDeConteneurPage() {
  return (
    <ModuleLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-headline-lg text-headline-lg text-on-surface">
            Déclaration de Conteneur
          </h1>
          <p className="text-body-md text-body-md text-on-surface-variant mt-1">
            Déclaration de conteneurs pour le module K-Transport
          </p>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6">
          <p className="text-body-md text-on-surface-variant">
            Interface de déclaration de conteneur - En cours de développement
          </p>
        </div>
      </div>
    </ModuleLayout>
  );
}
