$basePath = "c:\Users\chris\Documents\Projet\Documents\evo-log\ERP-logistique-\evo-log-frontend\src\app\(app)"

# Module mapping for titles and descriptions
$moduleMap = @{
    "acconage" = @{ title = "Acconage"; desc = "Gestion des opérations d'acconage" }
    "admin" = @{ title = "Administration"; desc = "Configuration et gestion du système" }
    "agencies" = @{ title = "Agences"; desc = "Gestion des agences" }
    "alerts" = @{ title = "Alertes"; desc = "Configuration des alertes système" }
    "audit" = @{ title = "Audit"; desc = "Traçabilité et audit système" }
    "operation-trace" = @{ title = "Trace des Opérations"; desc = "Historique des opérations" }
    "system-health" = @{ title = "Santé Système"; desc = "Monitoring et santé du système" }
    "configuration-des-roles-rbac" = @{ title = "Configuration RBAC"; desc = "Gestion des rôles et permissions" }
    "journal" = @{ title = "Journal"; desc = "Journal d'audit et de sécurité" }
    "user-management" = @{ title = "Gestion Utilisateurs"; desc = "Administration des utilisateurs" }
    "create" = @{ title = "Créer"; desc = "Formulaire de création" }
    "listing" = @{ title = "Liste"; desc = "Liste des utilisateurs" }
    "chauffeur" = @{ title = "Chauffeurs"; desc = "Gestion des chauffeurs" }
    "client-portal" = @{ title = "Portail Client"; desc = "Espace client" }
    "invoices" = @{ title = "Factures"; desc = "Factures client" }
    "litiges" = @{ title = "Litiges"; desc = "Gestion des litiges" }
    "orders" = @{ title = "Commandes"; desc = "Suivi des commandes" }
    "profile" = @{ title = "Profil"; desc = "Profil client" }
    "reports" = @{ title = "Rapports"; desc = "Rapports et statistiques" }
    "shipments" = @{ title = "Expéditions"; desc = "Suivi des expéditions" }
    "company" = @{ title = "Entreprise"; desc = "Configuration entreprise" }
    "compliance" = @{ title = "Conformité"; desc = "Gestion de la conformité" }
    "audits" = @{ title = "Audits"; desc = "Audits de conformité" }
    "cotations" = @{ title = "Cotations"; desc = "Gestion des cotations" }
    "calculateur" = @{ title = "Calculateur"; desc = "Outil de calcul" }
    "documents" = @{ title = "Documents"; desc = "Gestion documentaire" }
    "archive" = @{ title = "Archives"; desc = "Archives documents" }
    "finance" = @{ title = "Finance"; desc = "Gestion financière" }
    "billing" = @{ title = "Facturation"; desc = "Gestion de la facturation" }
    "encaissements" = @{ title = "Encaissements"; desc = "Suivi des encaissements" }
    "invoicing" = @{ title = "Facturation"; desc = "Création de factures" }
    "overview" = @{ title = "Vue d'ensemble"; desc = "Tableau de bord finance" }
    "requisitions" = @{ title = "Réquisitions"; desc = "Gestion des réquisitions" }
    "saisie-transaction-bancaire" = @{ title = "Transactions Bancaires"; desc = "Saisie des transactions" }
    "fuel-guard" = @{ title = "Fuel Guard"; desc = "Gestion du carburant" }
    "maintenance" = @{ title = "Maintenance"; desc = "GMAO - Maintenance assistée" }
    "master-data" = @{ title = "Données Maître"; desc = "Référentiels de données" }
    "notifications" = @{ title = "Notifications"; desc = "Centre de notifications" }
    "port-operations" = @{ title = "Opérations Portuaires"; desc = "Gestion des opérations port" }
    "purchase" = @{ title = "Achats"; desc = "Gestion des achats" }
    "qhse" = @{ title = "QHSE"; desc = "Qualité, Hygiène, Sécurité, Environnement" }
    "security" = @{ title = "Sécurité"; desc = "Gestion de la sécurité" }
    "settings" = @{ title = "Paramètres"; desc = "Configuration du système" }
    "suppliers" = @{ title = "Fournisseurs"; desc = "Gestion des fournisseurs" }
    "support" = @{ title = "Support"; desc = "Centre d'aide et support" }
    "tiers" = @{ title = "Tiers"; desc = "Gestion des tiers" }
    "tracking" = @{ title = "Suivi"; desc = "Tracking en temps réel" }
    "transit" = @{ title = "Transit"; desc = "Gestion du transit" }
}

function Get-ModuleInfo($dirName) {
    if ($moduleMap.ContainsKey($dirName)) {
        return $moduleMap[$dirName]
    }
    return @{ title = $dirName -replace '-', ' '; desc = "Module $dirName" }
}

function Create-PageFile($dirPath, $title, $description) {
    $pagePath = Join-Path $dirPath "page.tsx"
    
    $content = @"
'use client';

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function ${title -replace '[^a-zA-Z0-9]', ''}Page() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">$title</h1>
        <p className="text-gray-600 text-sm mt-1">$description</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Module en développement</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Ce module est en cours de développement et sera bientôt disponible.
          </p>
        </div>
      </div>
    </div>
  );
}
"@

    Set-Content -Path $pagePath -Value $content -Encoding UTF8
    Write-Output "Created: $pagePath"
}

# Find all directories without page.tsx
Get-ChildItem -Path $basePath -Directory -Recurse | ForEach-Object {
    $pagePath = Join-Path $_.FullName "page.tsx"
    if (-not (Test-Path $pagePath)) {
        $dirName = $_.Name
        $info = Get-ModuleInfo $dirName
        Create-PageFile $_.FullName $info.title $info.desc
    }
}

Write-Output "`nAll missing pages created successfully!"
