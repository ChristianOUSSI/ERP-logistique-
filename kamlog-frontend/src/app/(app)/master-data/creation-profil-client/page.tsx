import AppLayout from '@/components/layout/AppLayout';

export default function CreationProfilClientPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-headline-lg text-headline-lg text-on-surface">
            Création Profil Client
          </h1>
          <p className="text-body-md text-body-md text-on-surface-variant mt-1">
            Création de profils clients pour Master Data
          </p>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6">
          <p className="text-body-md text-on-surface-variant">
            Interface de création de profil client - En cours de développement
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
