import { ModuleLayout } from '@/components/layout/ModuleLayout';

export default function SaisieTicketCarburantPage() {
  return (
    <ModuleLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-headline-lg text-headline-lg text-on-surface">
            Saisie Ticket Carburant
          </h1>
          <p className="text-body-md text-body-md text-on-surface-variant mt-1">
            Saisie des tickets de carburant pour les véhicules
          </p>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6">
          <p className="text-body-md text-on-surface-variant">
            Interface de saisie de ticket carburant - En cours de développement
          </p>
        </div>
      </div>
    </ModuleLayout>
  );
}
