/**
 * i18n Hook for EVO-LOG ERP
 * Provides French/English translations for the application
 */

import { useSettings } from '@/components/layout/SettingsProvider'

const translations = {
  fr: {
    auth: {
      forgotTitle: 'Mot de passe oublié',
      forgotSubtitle: 'Entrez votre email pour réinitialiser votre mot de passe',
      forgotSuccessTitle: 'Email envoyé !',
      forgotSuccessBody: 'Si un compte existe pour cet email, vous recevrez un lien de réinitialisation.',
      forgotSpamNote: 'Pensez à vérifier votre dossier spam.',
      backToLogin: 'Retour à la connexion',
      emailInstitutionalLabel: 'Email Institutionnel',
      forgotSending: 'Envoi en cours...',
      forgotCta: 'Envoyer le lien',
    },
    parc: {
      zoneManagement: 'Gestion des Zones',
      subtitle: 'Gérez les zones du parc automobile',
      capacity: 'Capacité',
      newZone: 'Nouvelle Zone',
    },
    common: {
      loading: 'Chargement...',
      save: 'Enregistrer',
      cancel: 'Annuler',
      delete: 'Supprimer',
      edit: 'Modifier',
      create: 'Créer',
      search: 'Rechercher',
      filter: 'Filtrer',
      export: 'Exporter',
      import: 'Importer',
      actions: 'Actions',
      status: 'Statut',
      active: 'Actif',
      inactive: 'Inactif',
    },
  },
  en: {
    auth: {
      forgotTitle: 'Forgot Password',
      forgotSubtitle: 'Enter your email to reset your password',
      forgotSuccessTitle: 'Email sent!',
      forgotSuccessBody: 'If an account exists for this email, you will receive a reset link.',
      forgotSpamNote: 'Remember to check your spam folder.',
      backToLogin: 'Back to Login',
      emailInstitutionalLabel: 'Institutional Email',
      forgotSending: 'Sending...',
      forgotCta: 'Send Link',
    },
    parc: {
      zoneManagement: 'Zone Management',
      subtitle: 'Manage fleet park zones',
      capacity: 'Capacity',
      newZone: 'New Zone',
    },
    common: {
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      search: 'Search',
      filter: 'Filter',
      export: 'Export',
      import: 'Import',
      actions: 'Actions',
      status: 'Status',
      active: 'Active',
      inactive: 'Inactive',
    },
  },
} as const

export function useI18n() {
  const { language } = useSettings()
  return translations[language] || translations.fr
}
