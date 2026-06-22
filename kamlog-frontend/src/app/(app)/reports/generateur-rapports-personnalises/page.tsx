import { ModuleLayout } from '@/components/layout/ModuleLayout';

export default function GenerateurRapportsPersonnalisesPage() {
  return (
    <ModuleLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-headline-lg text-headline-lg text-on-surface">
            Générateur de Rapports Personnalisés
          </h1>
          <p className="text-body-md text-body-md text-on-surface-variant mt-1">
            Création de rapports personnalisés selon vos besoins
          </p>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6">
          <p className="text-body-md text-on-surface-variant">
            Interface de générateur de rapports - En cours de développement
          </p>
        </div>
      </div>
    </ModuleLayout>
  );
}
