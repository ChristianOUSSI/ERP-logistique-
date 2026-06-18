import { ModuleLayout } from '@/components/layout/ModuleLayout';

export default function EnregistrementNouveauVehiculePage() {
  return (
    <ModuleLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-headline-lg text-headline-lg text-on-surface">
            Enregistrement Véhicule
          </h1>
          <p className="text-body-md text-body-md text-on-surface-variant mt-1">
            Enregistrement de nouveaux véhicules dans le parc
          </p>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6">
          <p className="text-body-md text-on-surface-variant">
            Interface d'enregistrement de véhicule - En cours de développement
          </p>
        </div>
      </div>
    </ModuleLayout>
  );
}
