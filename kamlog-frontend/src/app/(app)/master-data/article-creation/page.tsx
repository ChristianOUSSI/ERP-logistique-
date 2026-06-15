// src/app/(app)/master-data/article-creation/page.tsx - Master Data Article Creation (KA01) - Fidèle 100% au HTML original
'use client'

export default function MasterDataArticleCreation() {
  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
        }
        .icon-fill {
          font-variation-settings: 'FILL 1';
        }
      `}</style>
      <div className="bg-surface-container-low text-on-background antialiased flex h-screen overflow-hidden">
        {/* SideNavBar */}
        <nav className="bg-surface-container-lowest fixed left-0 top-0 h-full w-[260px] border-r border-outline-variant shadow-sm flex flex-col p-md z-50">
          {/* Brand/Header */}
          <div className="flex items-center space-x-3 mb-8 px-2">
            <div className="w-10 h-10 rounded bg-primary flex items-center justify-center text-on-primary shadow-sm">
              <span className="material-symbols-outlined">anchor</span>
            </div>
            <div>
              <h1 className="font-headline-md text-headline-md text-primary font-bold leading-tight">KAMLOG ERP</h1>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Port Operations</p>
            </div>
          </div>
          {/* CTA */}
          <button className="w-full bg-primary hover:bg-surface-tint text-on-primary py-2 px-4 rounded font-label-md text-label-md flex items-center justify-center space-x-2 transition-colors mb-6 shadow-sm active:scale-95 duration-150">
            <span className="material-symbols-outlined icon-fill">add_circle</span>
            <span>Nouvelle Opération</span>
          </button>
          {/* Main Navigation */}
          <div className="flex-1 overflow-y-auto space-y-1">
            <a className="flex items-center space-x-3 px-3 py-2.5 rounded text-secondary hover:bg-surface-container-high transition-colors group" href="#">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-label-caps text-label-caps tracking-wide">Tableau de bord</span>
            </a>
            <a className="flex items-center space-x-3 px-3 py-2.5 rounded text-secondary hover:bg-surface-container-high transition-colors group" href="#">
              <span className="material-symbols-outlined">local_shipping</span>
              <span className="font-label-caps text-label-caps tracking-wide">Transport</span>
            </a>
            <a className="flex items-center space-x-3 px-3 py-2.5 rounded text-secondary hover:bg-surface-container-high transition-colors group" href="#">
              <span className="material-symbols-outlined">payments</span>
              <span className="font-label-caps text-label-caps tracking-wide">Finances</span>
            </a>
            <a className="flex items-center space-x-3 px-3 py-2.5 rounded text-primary bg-secondary-container font-bold border-l-4 border-primary" href="#">
              <span className="material-symbols-outlined icon-fill">minor_crash</span>
              <span className="font-label-caps text-label-caps tracking-wide">Parc Automobile</span>
            </a>
            <a className="flex items-center space-x-3 px-3 py-2.5 rounded text-secondary hover:bg-surface-container-high transition-colors group" href="#">
              <span className="material-symbols-outlined">settings</span>
              <span className="font-label-caps text-label-caps tracking-wide">Paramètres</span>
            </a>
          </div>
          {/* Footer Navigation */}
          <div className="mt-auto pt-4 border-t border-outline-variant space-y-1">
            <a className="flex items-center space-x-3 px-3 py-2 rounded text-secondary hover:bg-surface-container-high transition-colors" href="#">
              <span className="material-symbols-outlined">help_outline</span>
              <span className="font-label-md text-label-md">Support</span>
            </a>
            <a className="flex items-center space-x-3 px-3 py-2 rounded text-secondary hover:bg-surface-container-high transition-colors" href="#">
              <span className="material-symbols-outlined">logout</span>
              <span className="font-label-md text-label-md">Déconnexion</span>
            </a>
          </div>
        </nav>
        {/* Main Content Wrapper */}
        <div className="flex-1 flex flex-col ml-[260px] w-[calc(100%-260px)] h-screen">
          {/* TopNavBar */}
          <header className="bg-surface sticky top-0 w-full z-40 border-b border-outline-variant flex justify-between items-center h-[64px] px-gutter">
            {/* Left: T-Code Search & Context */}
            <div className="flex items-center space-x-6 flex-1">
              <span className="font-title-sm text-title-sm text-on-surface font-black tracking-tight">KAMLOG EM-ERP</span>
              <div className="relative w-64 focus-within:ring-2 focus-within:ring-primary rounded bg-surface-container-lowest border border-outline-variant flex items-center px-3 py-1.5 transition-all">
                <span className="material-symbols-outlined text-outline text-[18px] mr-2">search</span>
                <input className="w-full bg-transparent border-none focus:ring-0 p-0 font-body-sm text-body-sm text-on-surface placeholder-outline-variant outline-none" placeholder="Rechercher T-Code" type="text"/>
              </div>
              <nav className="hidden lg:flex space-x-1">
                <a className="px-3 py-4 font-body-base text-body-base text-primary border-b-2 border-primary pb-1" href="#">Articles</a>
                <a className="px-3 py-4 font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all" href="#">Clients</a>
                <a className="px-3 py-4 font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all" href="#">Stocks</a>
                <a className="px-3 py-4 font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all" href="#">Rapports</a>
              </nav>
            </div>
            {/* Right: Actions & Profile */}
            <div className="flex items-center space-x-4">
              <button className="text-on-surface-variant hover:text-primary transition-colors relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border border-surface"></span>
              </button>
              <button className="text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">verified_user</span>
              </button>
              <div className="w-px h-6 bg-outline-variant mx-2"></div>
              <button className="flex items-center space-x-2 text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[28px]">account_circle</span>
              </button>
            </div>
          </header>
          {/* Stage (Main Content) */}
          <main className="flex-1 overflow-y-auto p-margin-desktop bg-surface-container-low">
            <div className="max-w-[1200px] mx-auto">
              {/* Breadcrumbs & Header */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 font-label-sm text-label-sm text-on-surface-variant mb-2">
                  <span>Master Data</span>
                  <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                  <span>Articles</span>
                  <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                  <span className="text-primary font-medium">Creation (KA01)</span>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="font-headline-lg text-headline-lg text-on-surface">Article Creation</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">T-Code: KA01 • Define new material parameters and UDB conversion metrics.</p>
                  </div>
                  <div className="flex space-x-3">
                    <button className="px-4 py-2 bg-surface-container-lowest border border-outline-variant text-on-surface-variant rounded font-title-md text-title-md hover:bg-surface-variant transition-colors shadow-sm">
                      Annuler
                    </button>
                    <button className="px-4 py-2 bg-primary text-on-primary rounded font-title-md text-title-md hover:opacity-90 transition-opacity shadow-sm flex items-center space-x-2">
                      <span className="material-symbols-outlined text-[18px]">save</span>
                      <span>Sauvegarder Article</span>
                    </button>
                  </div>
                </div>
              </div>
              {/* Form Layout (Bento-ish Grid) */}
              <div className="grid grid-cols-12 gap-6">
                {/* Left Column: Core Data */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                  {/* General Info Card */}
                  <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-6">
                    <h3 className="font-title-lg text-title-lg text-on-surface border-b border-outline-variant pb-3 mb-5 flex items-center space-x-2">
                      <span className="material-symbols-outlined text-primary">info</span>
                      <span>General Information</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="col-span-2 md:col-span-1 space-y-1">
                        <label className="font-label-md text-label-md text-on-surface-variant">Material Number (System Gen)</label>
                        <input className="w-full bg-surface-container border border-outline-variant rounded px-3 py-2 font-data-tabular text-data-tabular text-outline cursor-not-allowed" disabled type="text" value="ART-10492-XZ"/>
                      </div>
                      <div className="col-span-2 md:col-span-1 space-y-1">
                        <label className="font-label-md text-label-md text-on-surface-variant">Status</label>
                        <div className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 flex items-center justify-between cursor-pointer hover:border-primary">
                          <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 rounded-full bg-primary"></span>
                            <span className="font-body-sm text-body-sm">Active (Draft)</span>
                          </div>
                          <span className="material-symbols-outlined text-outline-variant">expand_more</span>
                        </div>
                      </div>
                      <div className="col-span-2 space-y-1">
                        <label className="font-label-md text-label-md text-on-surface-variant">Description (Short Text) <span className="text-error">*</span></label>
                        <input className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded px-3 py-2 font-body-sm text-body-sm text-on-surface outline-none transition-all" placeholder="e.g., Palletized Industrial Pumps" type="text"/>
                      </div>
                      <div className="col-span-2 md:col-span-1 space-y-1">
                        <label className="font-label-md text-label-md text-on-surface-variant">Base Unit of Measure <span className="text-error">*</span></label>
                        <select className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded px-3 py-2 font-body-sm text-body-sm text-on-surface outline-none transition-all appearance-none">
                          <option value="ea">EA - Each</option>
                          <option value="kg">KG - Kilogram</option>
                          <option value="pal">PAL - Pallet</option>
                        </select>
                      </div>
                      <div className="col-span-2 md:col-span-1 space-y-1">
                        <label className="font-label-md text-label-md text-on-surface-variant">Material Group</label>
                        <input className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded px-3 py-2 font-body-sm text-body-sm text-on-surface outline-none transition-all" placeholder="Search groups..." type="text"/>
                      </div>
                      <div className="col-span-2 space-y-1">
                        <label className="font-label-md text-label-md text-on-surface-variant">Transit Code <span className="text-tertiary">*</span></label>
                        <div className="relative">
                          <input className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded px-3 py-2 font-data-tabular text-data-tabular text-on-surface outline-none transition-all" placeholder="Ex: TR-2023-001" type="text"/>
                          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-tertiary text-[18px]">info</span>
                        </div>
                        <p className="font-label-sm text-label-sm text-on-surface-variant text-xs mt-1">Ce code transit sera utilisé pour la déclaration de marchandise</p>
                      </div>
                    </div>
                  </div>
                  {/* Dimensions & UDB Validation Card */}
                  <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-6 relative overflow-hidden">
                    {/* Subtle background accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>
                    <div className="flex justify-between items-center border-b border-outline-variant pb-3 mb-5">
                      <h3 className="font-title-lg text-title-lg text-on-surface flex items-center space-x-2">
                        <span className="material-symbols-outlined text-primary">aspect_ratio</span>
                        <span>Dimensions & Conversion</span>
                      </h3>
                      <span className="bg-surface-container-high text-on-surface-variant font-label-sm px-2 py-1 rounded border border-outline-variant">UDB Required</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="space-y-1">
                        <label className="font-label-md text-label-md text-on-surface-variant">Gross Weight</label>
                        <div className="flex border border-outline-variant rounded focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all overflow-hidden">
                          <input className="w-full bg-surface-container-lowest px-3 py-2 font-data-tabular text-data-tabular text-on-surface outline-none border-none" type="number"/>
                          <span className="bg-surface-container-high px-3 py-2 font-label-sm text-on-surface-variant border-l border-outline-variant flex items-center">KG</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="font-label-md text-label-md text-on-surface-variant">Net Weight</label>
                        <div className="flex border border-outline-variant rounded focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all overflow-hidden">
                          <input className="w-full bg-surface-container-lowest px-3 py-2 font-data-tabular text-data-tabular text-on-surface outline-none border-none" type="number"/>
                          <span className="bg-surface-container-high px-3 py-2 font-label-sm text-on-surface-variant border-l border-outline-variant flex items-center">KG</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="font-label-md text-label-md text-on-surface-variant">Volume</label>
                        <div className="flex border border-outline-variant rounded focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all overflow-hidden">
                          <input className="w-full bg-surface-container-lowest px-3 py-2 font-data-tabular text-data-tabular text-on-surface outline-none border-none" type="number"/>
                          <span className="bg-surface-container-high px-3 py-2 font-label-sm text-on-surface-variant border-l border-outline-variant flex items-center">M³</span>
                        </div>
                      </div>
                    </div>
                    {/* UDB Validation Block */}
                    <div className="bg-surface rounded border border-primary/30 p-4">
                      <h4 className="font-title-md text-title-md text-on-surface mb-3 flex items-center">
                        <span className="material-symbols-outlined text-primary mr-2 text-[18px]">calculate</span>
                        UDB (Unités de Base) Conversion Validation
                      </h4>
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-5 flex items-center space-x-2 border border-outline-variant rounded bg-surface-container-lowest px-3 py-2">
                          <input className="w-16 bg-transparent outline-none font-data-tabular text-data-tabular text-center border-b border-outline-variant focus:border-primary" type="number" value="1"/>
                          <span className="font-label-md text-on-surface-variant">= Base Unit (EA)</span>
                        </div>
                        <div className="col-span-2 flex justify-center text-outline">
                          <span className="material-symbols-outlined">sync_alt</span>
                        </div>
                        <div className="col-span-5 flex items-center space-x-2 border border-outline-variant rounded bg-surface-container-lowest px-3 py-2 focus-within:border-primary">
                          <input className="w-16 bg-transparent outline-none font-data-tabular text-data-tabular text-center border-b border-outline-variant focus:border-primary" placeholder="0.00" type="number"/>
                          <span className="font-label-md text-on-surface-variant">Target (PAL)</span>
                        </div>
                      </div>
                      <div className="mt-3 flex items-start space-x-2 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[16px] text-tertiary">warning</span>
                        <p className="font-body-sm text-body-sm text-xs">Conversion metrics must align with terminal storage parameters. Invalid UDB will reject at warehouse intake.</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Right Column: Categorization & Status */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                  {/* Category Selection */}
                  <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-6">
                    <h3 className="font-title-lg text-title-lg text-on-surface border-b border-outline-variant pb-3 mb-4 flex items-center space-x-2">
                      <span className="material-symbols-outlined text-primary">category</span>
                      <span>Categorization</span>
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="font-label-md text-label-md text-on-surface-variant">Material Type <span className="text-error">*</span></label>
                        <select className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded px-3 py-2 font-body-sm text-body-sm text-on-surface outline-none appearance-none">
                          <option value="">Select Type...</option>
                          <option value="ro">ROH - Raw Material</option>
                          <option value="ha">HALB - Semi-finished</option>
                          <option value="fe">FERT - Finished Product</option>
                          <option value="di">DIEN - Service</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="font-label-md text-label-md text-on-surface-variant">Storage Condition</label>
                        <div className="grid grid-cols-2 gap-2">
                          <label className="flex items-center space-x-2 p-2 border border-outline-variant rounded cursor-pointer hover:bg-surface-container-low transition-colors">
                            <input className="rounded text-primary focus:ring-primary bg-surface-container-lowest border-outline-variant" type="checkbox"/>
                            <span className="font-body-sm text-body-sm">Hazmat</span>
                          </label>
                          <label className="flex items-center space-x-2 p-2 border border-outline-variant rounded cursor-pointer hover:bg-surface-container-low transition-colors">
                            <input className="rounded text-primary focus:ring-primary bg-surface-container-lowest border-outline-variant" type="checkbox"/>
                            <span className="font-body-sm text-body-sm">Cold Chain</span>
                          </label>
                          <label className="flex items-center space-x-2 p-2 border border-outline-variant rounded cursor-pointer hover:bg-surface-container-low transition-colors">
                            <input className="rounded text-primary focus:ring-primary bg-surface-container-lowest border-outline-variant" type="checkbox"/>
                            <span className="font-body-sm text-body-sm">Oversized</span>
                          </label>
                          <label className="flex items-center space-x-2 p-2 border border-outline-variant rounded cursor-pointer hover:bg-surface-container-low transition-colors">
                            <input className="rounded text-primary focus:ring-primary bg-surface-container-lowest border-outline-variant" type="checkbox"/>
                            <span className="font-body-sm text-body-sm">Fragile</span>
                          </label>
                        </div>
                      </div>
                      <div className="space-y-1 pt-2">
                        <label className="font-label-md text-label-md text-on-surface-variant">Tax Classification</label>
                        <input className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded px-3 py-2 font-body-sm text-body-sm text-on-surface outline-none transition-all" placeholder="Tax code..." type="text"/>
                      </div>
                    </div>
                  </div>
                  {/* System Audit Log (Mock) */}
                  <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-5 bg-gradient-to-br from-surface-container-lowest to-surface">
                    <h4 className="font-label-md text-label-md text-on-surface-variant mb-3 uppercase tracking-wider">System Log</h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                        <div>
                          <p className="font-body-sm text-body-sm text-on-surface">Draft created</p>
                          <p className="font-label-sm text-label-sm text-outline">Today, 10:42 AM by Admin</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 opacity-50">
                        <div className="w-2 h-2 rounded-full border-2 border-outline-variant mt-1.5"></div>
                        <div>
                          <p className="font-body-sm text-body-sm text-on-surface">Awaiting UDB Validation</p>
                          <p className="font-label-sm text-label-sm text-outline">Pending Input</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
