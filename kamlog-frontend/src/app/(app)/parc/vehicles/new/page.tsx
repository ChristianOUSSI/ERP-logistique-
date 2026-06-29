// src/app/(app)/parc/vehicles/new/page.tsx - K-Parc Enregistrement Nouveau Véhicule - Fidèle 100% au HTML original
'use client'


import { TCodeSearch } from '@/components/ui/TCodeSearch'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewVehicle() {
  const router = useRouter()
  const [plaque, setPlaque] = useState('')
  const [typeVehicule, setTypeVehicule] = useState('')
  const [chassis, setChassis] = useState('')
  const [chauffeur, setChauffeur] = useState('')
  const [pole, setPole] = useState('')

  const handleCancel = () => {
    router.push('/parc/vehicles')
  }

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!plaque || !typeVehicule || !chassis) {
      alert('Veuillez remplir les champs obligatoires.');
      return;
    }
    try {
      setIsSubmitting(true);
      const { transportAPI } = await import('@/lib/api-client');
      await transportAPI.createCamion({
        immatriculation: plaque,
        type_camion: typeVehicule,
        chassis: chassis,
        chauffeur_id: chauffeur ? parseInt(chauffeur) || null : null,
        actif: true,
        capacite_tonnes: 0,
        marque: 'N/A',
        modele: 'N/A',
        annee: new Date().getFullYear(),
        date_acquisition: new Date().toISOString()
      });
      alert('Véhicule créé avec succès !');
      router.push('/parc/overview'); // Redirect back to parc overview
    } catch (error) {
      console.error("Failed to create vehicle", error);
      alert('Erreur lors de la création du véhicule.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleChassisChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase()
    if (value.length <= 17) {
      setChassis(value)
    }
  }

  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
        }
        .material-symbols-outlined.fill {
          font-variation-settings: 'FILL 1';
        }
        .k-parc { color: #06b6d4; }
        input[type="file"]::file-selector-button {
          display: none;
        }
      `}</style>
      <div className="bg-surface-container-low text-on-surface font-body-md antialiased min-h-screen">
        {/* SideNavBar */}
        <nav className="fixed left-0 top-0 h-full w-[260px] bg-surface-container-lowest border-r border-outline-variant shadow-sm flex flex-col p-[1rem] z-50">
          {/* Header */}
          <div className="flex items-center gap-[0.5rem] mb-[2rem]">
            <div className="w-10 h-10 rounded-lg bg-surface-container-high overflow-hidden shrink-0 border border-outline-variant">
              <img alt="KAMLOG Company Logo" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrVYxYRBpThRAjgbHmAzUdkUHmsICCD1tgYdnEvd2-cLJVcrDtrRovX2FU51Zbt425pGmKXiCAcwAojI3cZbNfDmyA5Uyzbwhl0AzRsg1D08Ag7u7OjYvgK8qCIu0-es--WkG92n3HPbQxkEMBcfAgW0eckiBqS0S8YQV3zWER-aU2KmIarwxgeiE-jJ6K6lHL64syKAf7-OTRjNdvYaaVPDKoriED5e3bYW7D5LQvv3go-ZHi_ESXfIGtfqV7UL5J8Dtsvh6CYT8"/>
            </div>
            <div>
              <h1 className="font-headline-md text-headline-md text-primary font-bold">KAMLOG ERP</h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Port Operations</p>
            </div>
          </div>
          {/* CTA */}
          <button className="w-full bg-primary text-on-primary font-label-md text-label-md py-[0.5rem] px-[1rem] rounded-lg flex items-center justify-center gap-[0.25rem] mb-[1.5rem] hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Nouvelle Opération
          </button>
          {/* Main Navigation */}
          <div className="flex-1 overflow-y-auto pr-[0.25rem]">
            <ul className="space-y-[0.25rem]">
              <li>
                <a onClick={() => router.push('/dashboard')} className="flex items-center gap-[0.5rem] px-[0.5rem] py-2 rounded-lg text-secondary font-label-md text-label-md hover:bg-surface-container-high transition-colors active:scale-95 duration-150 cursor-pointer">
                  <span className="material-symbols-outlined text-[20px]">dashboard</span>
                  Tableau de bord
                </a>
              </li>
              <li>
                <a onClick={() => router.push('/transport')} className="flex items-center gap-[0.5rem] px-[0.5rem] py-2 rounded-lg text-secondary font-label-md text-label-md hover:bg-surface-container-high transition-colors active:scale-95 duration-150 cursor-pointer">
                  <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                  Transport
                </a>
              </li>
              <li>
                <a onClick={() => router.push('/finance')} className="flex items-center gap-[0.5rem] px-[0.5rem] py-2 rounded-lg text-secondary font-label-md text-label-md hover:bg-surface-container-high transition-colors active:scale-95 duration-150 cursor-pointer">
                  <span className="material-symbols-outlined text-[20px]">payments</span>
                  Finances
                </a>
              </li>
              <li>
                {/* Active State for K-Parc Module */}
                <a onClick={() => router.push('/parc')} className="flex items-center gap-[0.5rem] px-[0.5rem] py-2 rounded-lg text-primary bg-secondary-container font-label-md text-label-md font-bold border-l-4 border-k-parc active:scale-95 duration-150 cursor-pointer">
                  <span className="material-symbols-outlined fill text-[20px]">minor_crash</span>
                  Parc Automobile
                </a>
              </li>
              <li>
                <a onClick={() => router.push('/settings')} className="flex items-center gap-[0.5rem] px-[0.5rem] py-2 rounded-lg text-secondary font-label-md text-label-md hover:bg-surface-container-high transition-colors active:scale-95 duration-150 cursor-pointer">
                  <span className="material-symbols-outlined text-[20px]">settings</span>
                  Paramètres
                </a>
              </li>
            </ul>
          </div>
          {/* Footer Navigation */}
          <div className="pt-[1rem] border-t border-outline-variant mt-auto">
            <ul className="space-y-[0.25rem]">
              <li>
                <a onClick={() => router.push('/support')} className="flex items-center gap-[0.5rem] px-[0.5rem] py-2 rounded-lg text-secondary font-label-md text-label-md hover:bg-surface-container-high transition-colors active:scale-95 duration-150 cursor-pointer">
                  <span className="material-symbols-outlined text-[20px]">help_outline</span>
                  Support
                </a>
              </li>
              <li>
                <a onClick={() => router.push('/logout')} className="flex items-center gap-[0.5rem] px-[0.5rem] py-2 rounded-lg text-secondary font-label-md text-label-md hover:bg-surface-container-high transition-colors active:scale-95 duration-150 cursor-pointer">
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                  Déconnexion
                </a>
              </li>
            </ul>
          </div>
        </nav>
        {/* TopNavBar */}
        <header className="sticky top-0 w-full z-40 bg-surface border-b border-outline-variant flex justify-between items-center h-[64px] px-[1rem] ml-[260px] pl-[276px]">
          {/* Left: Product & Module Context */}
          <div className="flex items-center gap-[1rem]">
            <span className="font-title-sm text-title-sm text-on-surface font-black">KAMLOG EM-ERP</span>
            <div className="h-4 w-px bg-outline-variant"></div>
            {/* Sub-nav Links */}
            <nav className="hidden md:flex gap-[1rem]">
              <a onClick={() => router.push('/master-data/articles')} className="font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all cursor-pointer">Articles</a>
              <a onClick={() => router.push('/master-data/tiers')} className="font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all cursor-pointer">Clients</a>
              <a onClick={() => router.push('/magasin')} className="font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all cursor-pointer">Stocks</a>
              <a onClick={() => router.push('/reports')} className="font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all cursor-pointer">Rapports</a>
            </nav>
          </div>
          {/* Right: Actions & Profile */}
          <div className="flex items-center gap-[1rem]">
            {/* Search Bar (T-Code) */}
            <TCodeSearch />
            <div className="flex items-center gap-[0.25rem] text-on-surface-variant">
              <button className="p-2 rounded-full hover:bg-surface-container-high transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button onClick={() => router.push('/security')} className="p-2 rounded-full hover:bg-surface-container-high transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined">verified_user</span>
              </button>
            </div>
            <div onClick={() => router.push('/profile')} className="w-8 h-8 rounded-full bg-surface-container-highest border border-outline-variant overflow-hidden cursor-pointer ml-[0.25rem]">
              <img alt="User profile with MFA status" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBM7lQJwq-o8DZrRsecwzM3KOsPoGNQMIKET4yYR3Oy4IzZuPAYV3tALwQb43lsq58VNVlnKaUeWZMZuv5JJV0R-4d1STHwuq8Nz_okyBgtzgKJ8MkrfrduP2i4wVv6arcZB_PZBp-3xGFjNKii-xLm9PyLRcD-k3ov3TVM25uXXHkcRSb967CPyzZMiE7di_MuaOgWb86XzBsEjOClSswal4d7mAKrz6vLYFtpUOpwky2wc4JCmeJ1Ya3AiHWMOqp3ip8XVdgKM04"/>
            </div>
          </div>
        </header>
        {/* Main Content Canvas */}
        <main className="ml-[260px] p-[2rem] max-w-[1600px] mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 mb-[1rem] font-body-sm text-body-sm text-outline">
            <a onClick={() => router.push('/dashboard')} className="hover:text-primary transition-colors cursor-pointer">KAMLOG ERP</a>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <a onClick={() => router.push('/parc')} className="hover:text-k-parc transition-colors cursor-pointer">K-Parc</a>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-on-surface font-medium">Nouveau Véhicule</span>
          </div>
          {/* Page Header */}
          <div className="flex justify-between items-end mb-[1.5rem]">
            <div>
              <div className="flex items-center gap-[0.5rem] mb-1">
                <span className="material-symbols-outlined k-parc fill text-[28px]">directions_car</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">Enregistrement Véhicule</h2>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">Création d'une nouvelle fiche pour l'intégration d'une unité au parc automobile opérationnel.</p>
            </div>
            <div className="flex gap-[0.5rem]">
              <button onClick={handleCancel} className="px-[1rem] py-2 border border-outline text-on-surface rounded-lg font-label-md text-label-md hover:bg-surface-container-high transition-colors">
                Annuler
              </button>
              <button onClick={handleSave} disabled={isSubmitting} className="px-[1rem] py-2 bg-k-parc text-white rounded-lg font-label-md text-label-md hover:bg-[#0891b2] transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50">
                <span className="material-symbols-outlined text-[18px]">save</span>
                {isSubmitting ? "Sauvegarde..." : "Sauvegarder l'unité"}
              </button>
            </div>
          </div>
          {/* Form Layout (Bento-style Grid) */}
          <form className="grid grid-cols-12 gap-[1rem]">
            {/* Column 1: Core Details (8 cols) */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-[1rem]">
              {/* Identification Card */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-[1.5rem] shadow-sm">
                <h3 className="font-title-lg text-title-lg text-on-surface mb-[1rem] pb-[0.5rem] border-b border-surface-container-highest flex items-center gap-2">
                  <span className="material-symbols-outlined text-outline text-[20px]">badge</span>
                  Identification de l'Unité
                </h3>
                <div className="grid grid-cols-2 gap-[1rem]">
                  {/* Immatriculation */}
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-[0.5rem]" htmlFor="plaque">Plaque d'Immatriculation *</label>
                    <div className="relative">
                      <input 
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-[1rem] py-2.5 font-data-tabular text-data-tabular text-on-surface focus:border-k-parc focus:ring-1 focus:ring-k-parc uppercase transition-all" 
                        id="plaque" 
                        name="plaque" 
                        placeholder="Ex: AB-123-CD" 
                        required 
                        type="text"
                        value={plaque}
                        onChange={(e) => setPlaque(e.target.value.toUpperCase())}
                      />
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant text-[18px]">pin</span>
                    </div>
                  </div>
                  {/* Type de Véhicule */}
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-[0.5rem]" htmlFor="type_vehicule">Type d'Unité *</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-[1rem] pr-10 py-2.5 font-body-md text-body-md text-on-surface focus:border-k-parc focus:ring-1 focus:ring-k-parc appearance-none transition-all" 
                        id="type_vehicule" 
                        name="type_vehicule" 
                        required
                        value={typeVehicule}
                        onChange={(e) => setTypeVehicule(e.target.value)}
                      >
                        <option disabled selected value="">Sélectionner le type...</option>
                        <option value="tracteur">Tracteur Routier</option>
                        <option value="remorque">Remorque / Plateau</option>
                        <option value="utilitaire">Véhicule Utilitaire (VUL)</option>
                        <option value="manutention">Engin de Manutention</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none text-[18px]">expand_more</span>
                    </div>
                  </div>
                  {/* Numéro de Châssis (VIN) */}
                  <div className="col-span-2">
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-[0.5rem]" htmlFor="chassis">Numéro de Châssis (VIN) *</label>
                    <div className="relative">
                      <input 
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-[1rem] py-2.5 font-data-tabular text-data-tabular text-on-surface focus:border-k-parc focus:ring-1 focus:ring-k-parc uppercase transition-all" 
                        id="chassis" 
                        maxLength={17} 
                        name="chassis" 
                        placeholder="17 caractères alphanumériques" 
                        required 
                        type="text"
                        value={chassis}
                        onChange={handleChassisChange}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <span className={`text-xs font-data-tabular ${chassis.length === 17 ? 'text-[#16a34a]' : 'text-outline-variant'}`}>{chassis.length}/17</span>
                        <span className="material-symbols-outlined text-outline-variant text-[18px]">barcode_scanner</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Affectation Card */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-[1.5rem] shadow-sm">
                <h3 className="font-title-lg text-title-lg text-on-surface mb-[1rem] pb-[0.5rem] border-b border-surface-container-highest flex items-center gap-2">
                  <span className="material-symbols-outlined text-outline text-[20px]">assignment_ind</span>
                  Affectation Opérationnelle
                </h3>
                <div className="grid grid-cols-1 gap-[1rem]">
                  {/* Chauffeur Assigné */}
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-[0.5rem]" htmlFor="chauffeur">Chauffeur Principal / Opérateur</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant text-[18px]">search</span>
                      <input 
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-10 pr-[1rem] py-2.5 font-body-md text-body-md text-on-surface focus:border-k-parc focus:ring-1 focus:ring-k-parc transition-all" 
                        id="chauffeur" 
                        name="chauffeur" 
                        placeholder="Rechercher par nom ou matricule..." 
                        type="text"
                        value={chauffeur}
                        onChange={(e) => setChauffeur(e.target.value)}
                      />
                    </div>
                    <p className="mt-1 font-body-sm text-body-sm text-outline">Laissez vide si l'unité est mise en "Pool" (non assignée).</p>
                  </div>
                  {/* Pôle d'activité */}
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-[0.5rem]">Pôle d'activité par défaut</label>
                    <div className="flex flex-wrap gap-3">
                      <label className="flex items-center gap-2 px-3 py-2 border border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-low transition-colors has-[:checked]:bg-[#ecfeff] has-[:checked]:border-k-parc">
                        <input className="text-k-parc focus:ring-k-parc" name="pole" type="radio" value="terminal" checked={pole === 'terminal'} onChange={() => setPole('terminal')}/>
                        <span className="font-body-sm text-body-sm">Terminal Conteneurs</span>
                      </label>
                      <label className="flex items-center gap-2 px-3 py-2 border border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-low transition-colors has-[:checked]:bg-[#ecfeff] has-[:checked]:border-k-parc">
                        <input className="text-k-parc focus:ring-k-parc" name="pole" type="radio" value="vrac" checked={pole === 'vrac'} onChange={() => setPole('vrac')}/>
                        <span className="font-body-sm text-body-sm">Quai Vrac</span>
                      </label>
                      <label className="flex items-center gap-2 px-3 py-2 border border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-low transition-colors has-[:checked]:bg-[#ecfeff] has-[:checked]:border-k-parc">
                        <input className="text-k-parc focus:ring-k-parc" name="pole" type="radio" value="livraison" checked={pole === 'livraison'} onChange={() => setPole('livraison')}/>
                        <span className="font-body-sm text-body-sm">Livraison Externe</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Column 2: Documents & Status (4 cols) */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-[1rem]">
              {/* Status Preview Card */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-[1.5rem] shadow-sm">
                <h3 className="font-title-lg text-title-lg text-on-surface mb-[1rem] pb-[0.5rem] border-b border-surface-container-highest flex items-center gap-2">
                  <span className="material-symbols-outlined text-outline text-[20px]">info</span>
                  Statut d'Enregistrement
                </h3>
                <div className="bg-surface-container-high rounded-lg p-[1rem] mb-[1rem] flex items-center gap-[1rem]">
                  <div className="w-12 h-12 rounded-full bg-[#fef2f2] flex items-center justify-center shrink-0 border border-[#fecaca]">
                    <span className="material-symbols-outlined text-[#ef4444] text-[24px]">pending_actions</span>
                  </div>
                  <div>
                    <div className="font-label-md text-label-md text-on-surface mb-0.5">Brouillon Incomplet</div>
                    <div className="font-body-sm text-body-sm text-outline">Documents obligatoires manquants</div>
                  </div>
                </div>
              </div>
              {/* Documentation Card */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-[1.5rem] shadow-sm flex-1">
                <h3 className="font-title-lg text-title-lg text-on-surface mb-[1rem] pb-[0.5rem] border-b border-surface-container-highest flex items-center gap-2">
                  <span className="material-symbols-outlined text-outline text-[20px]">folder_open</span>
                  Dossier Réglementaire
                </h3>
                <div className="space-y-[1rem]">
                  {/* Carte Grise Upload */}
                  <div>
                    <div className="flex justify-between items-center mb-[0.5rem]">
                      <label className="font-label-md text-label-md text-on-surface-variant">Carte Grise *</label>
                      <span className="text-[10px] uppercase font-bold text-[#ef4444] bg-[#fef2f2] px-1.5 py-0.5 rounded">Requis</span>
                    </div>
                    <div className="border-2 border-dashed border-outline-variant rounded-lg p-[1rem] text-center hover:bg-surface-container-low transition-colors cursor-pointer group relative">
                      <input accept=".pdf,.jpg,.jpeg,.png" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" type="file"/>
                      <span className="material-symbols-outlined text-outline group-hover:text-k-parc transition-colors text-[24px] mb-2 block">cloud_upload</span>
                      <div className="font-body-sm text-body-sm text-on-surface">Glisser le fichier ou <span className="k-parc font-medium">Parcourir</span></div>
                      <div className="font-label-sm text-label-sm text-outline mt-1">PDF, JPG (Max 5MB)</div>
                    </div>
                  </div>
                  {/* Assurance Upload */}
                  <div>
                    <div className="flex justify-between items-center mb-[0.5rem]">
                      <label className="font-label-md text-label-md text-on-surface-variant">Attestation d'Assurance *</label>
                      <span className="text-[10px] uppercase font-bold text-[#ef4444] bg-[#fef2f2] px-1.5 py-0.5 rounded">Requis</span>
                    </div>
                    <div className="border-2 border-dashed border-outline-variant rounded-lg p-[1rem] text-center hover:bg-surface-container-low transition-colors cursor-pointer group relative">
                      <input accept=".pdf,.jpg,.jpeg,.png" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" type="file"/>
                      <span className="material-symbols-outlined text-outline group-hover:text-k-parc transition-colors text-[24px] mb-2 block">cloud_upload</span>
                      <div className="font-body-sm text-body-sm text-on-surface">Glisser le fichier ou <span className="k-parc font-medium">Parcourir</span></div>
                      <div className="font-label-sm text-label-sm text-outline mt-1">PDF, JPG (Max 5MB)</div>
                    </div>
                  </div>
                  {/* Contrôle Technique Upload (Optional) */}
                  <div>
                    <div className="flex justify-between items-center mb-[0.5rem]">
                      <label className="font-label-md text-label-md text-on-surface-variant">Contrôle Technique</label>
                      <span className="text-[10px] uppercase font-bold text-outline bg-surface-container-high px-1.5 py-0.5 rounded">Optionnel</span>
                    </div>
                    <div className="border border-outline-variant rounded-lg p-3 flex items-center justify-between hover:border-k-parc transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-surface-container-low flex items-center justify-center border border-outline-variant group-hover:bg-[#ecfeff] group-hover:border-[#a5f3fc]">
                          <span className="material-symbols-outlined text-outline group-hover:text-k-parc text-[16px]">attach_file</span>
                        </div>
                        <span className="font-body-sm text-body-sm text-outline">Ajouter un document...</span>
                      </div>
                      <button className="text-on-surface-variant hover:text-k-parc" type="button"><span className="material-symbols-outlined text-[20px]">add_circle</span></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>
    </>
  )
}
