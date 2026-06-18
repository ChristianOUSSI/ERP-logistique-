// src/app/(app)/transport/fuel/ticket/page.tsx - KT22 Saisie Ticket Carburant K-Transport - Fidèle 100% au HTML original
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function FuelTicket() {
  const router = useRouter()
  const [vehicle, setVehicle] = useState('TRK-902-AB')
  const [driver, setDriver] = useState('Jean Dupont (CH-042)')
  const [date, setDate] = useState('2023-10-24')
  const [time, setTime] = useState('08:45')
  const [odometer, setOdometer] = useState('145203')
  const [fuelType, setFuelType] = useState('diesel')
  const [volume, setVolume] = useState('450.00')
  const [unitPrice, setUnitPrice] = useState('1.854')
  const [total, setTotal] = useState('834.30')

  useEffect(() => {
    const vol = parseFloat(volume) || 0
    const price = parseFloat(unitPrice) || 0
    const calculatedTotal = vol * price
    setTotal(calculatedTotal.toFixed(2))
  }, [volume, unitPrice])

  const handleCancel = () => {
    router.push('/transport/fuel')
  }

  const handleSave = () => {
    // Save fuel ticket - will be connected to backend
    router.push('/transport/fuel')
  }

  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
        }
        .icon-fill {
          font-variation-settings: 'FILL 1, wght 400, GRAD 0, opsz 24';
        }
        .transport-accent { color: #f97316; }
        .transport-accent-light { background-color: #fed7aa; }
      `}</style>
      <div className="bg-surface-container-low text-on-surface font-body-md min-h-screen flex">
        {/* SideNavBar */}
        <nav className="bg-surface-container-low border-r border-outline-variant w-[240px] h-screen flex-shrink-0 flex flex-col z-40 fixed left-0 top-0 transition-all duration-200 ease-in-out hidden md:flex">
          {/* Header */}
          <div className="p-[1.5rem] border-b border-outline-variant flex items-center gap-[0.5rem]">
            <div className="w-10 h-10 bg-transport-accent rounded flex items-center justify-center text-on-error font-title-lg font-bold">PA</div>
            <div>
              <h1 className="font-title-lg text-title-lg font-bold text-on-surface">Port Ops</h1>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Terminal A1</p>
            </div>
          </div>
          {/* T-Code Search */}
          <div className="p-[1rem]">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
              <input className="w-full pl-10 pr-4 py-2 bg-surface rounded border border-outline-variant text-body-sm font-body-sm focus:outline-none focus:border-transport-accent focus:ring-1 focus:ring-transport-accent transition-colors" placeholder="T-Code Search" type="text"/>
            </div>
          </div>
          {/* Main Nav */}
          <ul className="flex-1 py-[0.5rem]">
            <li>
              <a onClick={() => router.push('/transport')} className="flex items-center gap-3 px-[1.5rem] py-3 text-transport-accent bg-surface-container-highest border-l-4 border-transport-accent font-bold font-label-md text-label-md transition-all hover:bg-surface-container cursor-pointer">
                <span className="material-symbols-outlined icon-fill">local_shipping</span>
                Transport
              </a>
            </li>
            <li>
              <a onClick={() => router.push('/magasin')} className="flex items-center gap-3 px-[1.5rem] py-3 text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-all hover:bg-surface-container cursor-pointer">
                <span className="material-symbols-outlined">inventory_2</span>
                Magasin
              </a>
            </li>
            <li>
              <a onClick={() => router.push('/finance')} className="flex items-center gap-3 px-[1.5rem] py-3 text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-all hover:bg-surface-container cursor-pointer">
                <span className="material-symbols-outlined">payments</span>
                Finance
              </a>
            </li>
            <li>
              <a onClick={() => router.push('/parc')} className="flex items-center gap-3 px-[1.5rem] py-3 text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-all hover:bg-surface-container cursor-pointer">
                <span className="material-symbols-outlined">local_parking</span>
                Parc
              </a>
            </li>
            <li>
              <a onClick={() => router.push('/audit')} className="flex items-center gap-3 px-[1.5rem] py-3 text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-all hover:bg-surface-container cursor-pointer">
                <span className="material-symbols-outlined">fact_check</span>
                Audit
              </a>
            </li>
          </ul>
          {/* Footer Nav */}
          <ul className="border-t border-outline-variant py-[0.5rem]">
            <li>
              <a onClick={() => router.push('/support')} className="flex items-center gap-3 px-[1.5rem] py-3 text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-all hover:bg-surface-container cursor-pointer">
                <span className="material-symbols-outlined">support_agent</span>
                Support
              </a>
            </li>
            <li>
              <a onClick={() => router.push('/logout')} className="flex items-center gap-3 px-[1.5rem] py-3 text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-all hover:bg-surface-container cursor-pointer">
                <span className="material-symbols-outlined">logout</span>
                Log out
              </a>
            </li>
          </ul>
        </nav>
        {/* Main Content Area */}
        <main className="flex-1 md:ml-[240px] flex flex-col min-h-screen">
          {/* TopNavBar */}
          <header className="bg-surface h-16 border-b border-outline-variant flex items-center justify-between px-[1.5rem] w-full mx-auto">
            <div className="flex items-center gap-[0.5rem] text-on-surface-variant font-label-md text-label-md">
              <a onClick={() => router.push('/transport')} className="hover:text-primary transition-colors cursor-pointer">Transport</a>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
              <a onClick={() => router.push('/transport/fuel')} className="hover:text-primary transition-colors cursor-pointer">Opérations</a>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
              <span className="text-on-surface font-bold">Saisie Ticket Carburant</span>
            </div>
            <div className="flex items-center gap-[1rem] text-on-surface-variant">
              <button className="p-2 rounded-full hover:bg-surface-container transition-colors"><span className="material-symbols-outlined">notifications</span></button>
              <div onClick={() => router.push('/profile')} className="w-8 h-8 rounded-full bg-surface-variant overflow-hidden cursor-pointer">
                <img alt="User profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDd0RGFdOgK86gkkc_yA-0pmtg7UfB_cBJFXgfySVDP67sNmIpf6KvRYjz3vFuUIWR-LqgldQdm4DiIeAcpGDPcnrisGZF3wEV7v2DN04zo1rzJcoXME8dHrt9fCy7a2ityJu73k4CCp5aYK9kagrjZ-hg2WFVdewkcjf6aeVlfzzeXNtNL7m1c3J2jznBnjHBmj1tsbF-93k_OMsNkCIA1j2u91ArMbL-rsDS8TWsBdIPqQlezb5u5YvP3th1PvcRbIzbyMDoZfbo"/>
              </div>
            </div>
          </header>
          {/* Content Canvas */}
          <div className="flex-1 p-[1.5rem] bg-surface-container-low max-w-[1600px] mx-auto w-full grid grid-cols-1 xl:grid-cols-12 gap-[1rem]">
            {/* Left Column: Form (8 cols) */}
            <div className="xl:col-span-8 flex flex-col gap-[1rem]">
              <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden">
                <div className="p-[1rem] border-b border-outline-variant bg-surface-bright">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">Détails de l'avitaillement</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Saisissez les informations du ticket de caisse ou bon de livraison.</p>
                </div>
                <form className="p-[1.5rem] grid grid-cols-1 md:grid-cols-2 gap-x-[1.5rem] gap-y-[1rem]">
                  {/* Vehicle Selection */}
                  <div className="col-span-1">
                    <label className="block font-label-md text-label-md text-on-surface mb-[0.5rem]">Véhicule (Immatriculation / Parc ID)</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">directions_car</span>
                      <input className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded font-data-tabular text-body-md focus:border-transport-accent focus:ring-1 focus:ring-transport-accent transition-colors" placeholder="Ex: TRK-123-CD" type="text" value={vehicle} onChange={(e) => setVehicle(e.target.value)}/>
                    </div>
                  </div>
                  {/* Driver Selection */}
                  <div className="col-span-1">
                    <label className="block font-label-md text-label-md text-on-surface mb-[0.5rem]">Conducteur</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">person</span>
                      <select className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded font-body-md text-body-md focus:border-transport-accent focus:ring-1 focus:ring-transport-accent transition-colors appearance-none" value={driver} onChange={(e) => setDriver(e.target.value)}>
                        <option>Jean Dupont (CH-042)</option>
                        <option>Marie Martin (CH-089)</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">arrow_drop_down</span>
                    </div>
                  </div>
                  {/* Date & Time */}
                  <div className="col-span-1">
                    <label className="block font-label-md text-label-md text-on-surface mb-[0.5rem]">Date & Heure du ticket</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">calendar_today</span>
                        <input className="w-full pl-10 pr-2 py-2 bg-surface border border-outline-variant rounded font-data-tabular text-body-md focus:border-transport-accent focus:ring-1 focus:ring-transport-accent transition-colors" type="date" value={date} onChange={(e) => setDate(e.target.value)}/>
                      </div>
                      <div className="relative w-24">
                        <input className="w-full px-2 py-2 bg-surface border border-outline-variant rounded font-data-tabular text-body-md focus:border-transport-accent focus:ring-1 focus:ring-transport-accent transition-colors" type="time" value={time} onChange={(e) => setTime(e.target.value)}/>
                      </div>
                    </div>
                  </div>
                  {/* Odometer */}
                  <div className="col-span-1">
                    <label className="block font-label-md text-label-md text-on-surface mb-[0.5rem]">Kilométrage (Compteur)</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">speed</span>
                      <input className="w-full pl-10 pr-12 py-2 bg-surface border border-outline-variant rounded font-data-tabular text-body-md focus:border-transport-accent focus:ring-1 focus:ring-transport-accent transition-colors text-right" type="number" value={odometer} onChange={(e) => setOdometer(e.target.value)}/>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-label-md">km</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 text-right">Dernier relevé: 144,850 km</p>
                  </div>
                  {/* Divider */}
                  <div className="col-span-1 md:col-span-2 border-t border-outline-variant my-[0.25rem]"></div>
                  {/* Fuel Type */}
                  <div className="col-span-1 md:col-span-2">
                    <label className="block font-label-md text-label-md text-on-surface mb-[0.5rem]">Type de Carburant</label>
                    <div className="flex gap-[1rem]">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input checked={fuelType === 'diesel'} className="text-transport-accent focus:ring-transport-accent" name="fuel_type" type="radio" value="diesel" onChange={() => setFuelType('diesel')}/>
                        <span className="font-body-md text-body-md">Diesel (Gazole)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input checked={fuelType === 'adblue'} className="text-transport-accent focus:ring-transport-accent" name="fuel_type" type="radio" value="adblue" onChange={() => setFuelType('adblue')}/>
                        <span className="font-body-md text-body-md">AdBlue</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input checked={fuelType === 'essence'} className="text-transport-accent focus:ring-transport-accent" name="fuel_type" type="radio" value="essence" onChange={() => setFuelType('essence')}/>
                        <span className="font-body-md text-body-md">Essence (SP95/98)</span>
                      </label>
                    </div>
                  </div>
                  {/* Volume */}
                  <div className="col-span-1">
                    <label className="block font-label-md text-label-md text-on-surface mb-[0.5rem]">Volume</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">local_gas_station</span>
                      <input className="w-full pl-10 pr-12 py-2 bg-surface border border-outline-variant rounded font-data-tabular text-body-md focus:border-transport-accent focus:ring-1 focus:ring-transport-accent transition-colors text-right" step="0.01" type="number" value={volume} onChange={(e) => setVolume(e.target.value)}/>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-label-md">L</span>
                    </div>
                  </div>
                  {/* Unit Price */}
                  <div className="col-span-1">
                    <label className="block font-label-md text-label-md text-on-surface mb-[0.5rem]">Prix Unitaire (TTC)</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">euro</span>
                      <input className="w-full pl-10 pr-12 py-2 bg-surface border border-outline-variant rounded font-data-tabular text-body-md focus:border-transport-accent focus:ring-1 focus:ring-transport-accent transition-colors text-right" step="0.001" type="number" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)}/>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-label-md">€/L</span>
                    </div>
                  </div>
                  {/* Total (Calculated) */}
                  <div className="col-span-1 md:col-span-2 bg-surface-container rounded p-[1rem] flex items-center justify-between border border-outline-variant">
                    <div>
                      <span className="font-label-md text-label-md text-on-surface-variant block">Montant Total TTC</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Calcul automatique</span>
                    </div>
                    <div className="text-right">
                      <span className="font-headline-sm text-headline-sm font-bold text-on-surface">{total} €</span>
                    </div>
                  </div>
                  {/* Divider */}
                  <div className="col-span-1 md:col-span-2 border-t border-outline-variant my-[0.25rem]"></div>
                  {/* Scan/Upload */}
                  <div className="col-span-1 md:col-span-2">
                    <label className="block font-label-md text-label-md text-on-surface mb-[0.5rem]">Justificatif (Scan du ticket)</label>
                    <div className="border-2 border-dashed border-outline-variant rounded-xl p-[1.5rem] flex flex-col items-center justify-center bg-surface hover:bg-surface-container-low transition-colors cursor-pointer group">
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant group-hover:text-transport-accent mb-2">document_scanner</span>
                      <p className="font-title-md text-title-md text-on-surface">Glissez-déposez le scan ici</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">ou cliquez pour parcourir (PDF, JPG, PNG)</p>
                    </div>
                  </div>
                </form>
                {/* Action Bar */}
                <div className="p-[1rem] border-t border-outline-variant bg-surface-bright flex justify-end gap-[1rem] items-center">
                  <button onClick={handleCancel} className="px-4 py-2 rounded font-label-md text-label-md text-on-surface hover:bg-surface-container transition-colors">Annuler</button>
                  <button onClick={handleSave} className="px-4 py-2 rounded bg-transport-accent text-on-error font-label-md text-label-md hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">save</span>
                    Enregistrer le ticket
                  </button>
                </div>
              </div>
            </div>
            {/* Right Column: Context/Summary (4 cols) */}
            <div className="xl:col-span-4 flex flex-col gap-[1rem]">
              {/* Vehicle Info Card */}
              <div className="bg-surface rounded-xl border border-outline-variant p-[1rem]">
                <div className="flex items-center gap-3 mb-[1rem] pb-[1rem] border-b border-outline-variant">
                  <div className="w-12 h-12 transport-accent-light rounded flex items-center justify-center transport-accent">
                    <span className="material-symbols-outlined">local_shipping</span>
                  </div>
                  <div>
                    <h3 className="font-title-md text-title-md font-bold text-on-surface">TRK-902-AB</h3>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">Tracteur Renault T480</p>
                  </div>
                </div>
                <h4 className="font-label-sm text-label-sm text-on-surface uppercase mb-[0.5rem]">Indicateurs de consommation</h4>
                <div className="space-y-[0.5rem]">
                  <div className="flex justify-between items-center">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Moy. 30 derniers jours</span>
                    <span className="font-data-tabular text-body-sm font-medium text-on-surface">32.4 L/100km</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Objectif Flotte</span>
                    <span className="font-data-tabular text-body-sm font-medium text-on-surface">31.0 L/100km</span>
                  </div>
                  {/* Status Bar */}
                  <div className="mt-[0.25rem]">
                    <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden flex">
                      <div className="bg-transport-accent h-full w-[85%]"></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="font-label-sm text-[10px] transport-accent">Surconsommation légère (+4.5%)</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Recent Tickets List */}
              <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden">
                <div className="p-[1rem] border-b border-outline-variant bg-surface-bright flex justify-between items-center">
                  <h3 className="font-title-md text-title-md font-medium text-on-surface">Derniers pleins</h3>
                  <a onClick={() => router.push('/transport/fuel/history')} className="font-label-sm text-label-sm transport-accent hover:underline cursor-pointer">Voir historique</a>
                </div>
                <ul className="divide-y divide-outline-variant">
                  <li className="p-[0.5rem] hover:bg-surface-container-lowest transition-colors cursor-pointer">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-label-md text-label-md text-on-surface">20 Oct 2023 - Total Energies</span>
                      <span className="font-data-tabular text-label-md font-medium">850.20 €</span>
                    </div>
                    <div className="flex justify-between items-center text-on-surface-variant font-body-sm text-[11px]">
                      <span>144,850 km</span>
                      <span>460.0 L</span>
                    </div>
                  </li>
                  <li className="p-[0.5rem] hover:bg-surface-container-lowest transition-colors cursor-pointer">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-label-md text-label-md text-on-surface">15 Oct 2023 - AS24</span>
                      <span className="font-data-tabular text-label-md font-medium">795.50 €</span>
                    </div>
                    <div className="flex justify-between items-center text-on-surface-variant font-body-sm text-[11px]">
                      <span>143,420 km</span>
                      <span>430.5 L</span>
                    </div>
                  </li>
                  <li className="p-[0.5rem] hover:bg-surface-container-lowest transition-colors cursor-pointer">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-label-md text-label-md text-on-surface">10 Oct 2023 - Shell</span>
                      <span className="font-data-tabular text-label-md font-medium">810.00 €</span>
                    </div>
                    <div className="flex justify-between items-center text-on-surface-variant font-body-sm text-[11px]">
                      <span>142,050 km</span>
                      <span>445.0 L</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
