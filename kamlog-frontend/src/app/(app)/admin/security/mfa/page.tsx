// src/app/(app)/admin/security/mfa/page.tsx - Security MFA Configuration - Fidèle 100% au HTML original
'use client'

export default function MfaConfigurationPage() {
  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .material-symbols-outlined.fill {
          font-variation-settings: 'FILL 1';
        }
      `}</style>
      <div className="bg-surface-container-low text-on-surface font-body-md antialiased h-screen overflow-hidden flex">
        {/* SideNavBar */}
        <nav className="bg-surface-container-lowest shadow-sm border-r border-outline-variant fixed left-0 top-0 h-full w-[260px] flex flex-col p-stack-md z-50">
          <div className="px-md py-lg">
            <h1 className="font-headline-md text-headline-md text-primary font-bold">KAMLOG ERP</h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-xxs">Port Operations</p>
          </div>
          <button className="mx-md mb-lg bg-primary hover:bg-primary-fixed-dim text-on-primary font-label-md text-label-md rounded py-sm px-md flex items-center justify-center gap-xs transition-colors shadow-sm active:scale-95 duration-150">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Nouvelle Opération
          </button>
          <ul className="flex-1 flex flex-col gap-xs px-xs overflow-y-auto">
            <li>
              <a className="flex items-center gap-sm px-sm py-xs rounded font-label-md text-label-md text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150" href="/dashboard/global">
                <span className="material-symbols-outlined">dashboard</span>
                Tableau de bord
              </a>
            </li>
            <li>
              <a className="flex items-center gap-sm px-sm py-xs rounded font-label-md text-label-md text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150" href="/transport/control">
                <span className="material-symbols-outlined">local_shipping</span>
                Transport
              </a>
            </li>
            <li>
              <a className="flex items-center gap-sm px-sm py-xs rounded font-label-md text-label-md text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150" href="/finance/overview">
                <span className="material-symbols-outlined">payments</span>
                Finances
              </a>
            </li>
            <li>
              <a className="flex items-center gap-sm px-sm py-xs rounded font-label-md text-label-md text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150" href="/parc/overview">
                <span className="material-symbols-outlined">minor_crash</span>
                Parc Automobile
              </a>
            </li>
            <li>
              <a className="flex items-center gap-sm px-sm py-xs rounded font-label-md text-label-md text-primary bg-secondary-container font-bold transition-colors active:scale-95 duration-150" href="/settings/system/audit-health">
                <span className="material-symbols-outlined">settings</span>
                Paramètres
              </a>
            </li>
          </ul>
          <div className="mt-auto px-xs pb-md pt-md border-t border-outline-variant">
            <ul className="flex flex-col gap-xs">
              <li>
                <a className="flex items-center gap-sm px-sm py-xs rounded font-label-md text-label-md text-secondary hover:bg-surface-container-high transition-colors" href="/support">
                  <span className="material-symbols-outlined">help_outline</span>
                  Support
                </a>
              </li>
              <li>
                <a className="flex items-center gap-sm px-sm py-xs rounded font-label-md text-label-md text-secondary hover:bg-surface-container-high transition-colors" href="/login">
                  <span className="material-symbols-outlined">logout</span>
                  Déconnexion
                </a>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content Area */}
        <div className="flex-1 ml-[260px] flex flex-col h-full overflow-hidden">
          {/* TopNavBar */}
          <header className="bg-surface sticky top-0 w-full z-40 border-b border-outline-variant flex justify-between items-center h-[64px] px-gutter">
            <div className="flex items-center gap-lg">
              <span className="font-title-sm text-title-sm text-on-surface font-black">KAMLOG EM-ERP</span>
              <nav className="hidden lg:flex gap-md">
                <a className="font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all py-md" href="#">Articles</a>
                <a className="font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all py-md" href="#">Clients</a>
                <a className="font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all py-md" href="#">Stocks</a>
                <a className="font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all py-md" href="#">Rapports</a>
              </nav>
            </div>
            <div className="flex items-center gap-md">
              <div className="relative focus-within:ring-2 focus-within:ring-primary rounded">
                <span className="material-symbols-outlined absolute left-xs top-1/2 -translate-y-1/2 text-outline">search</span>
                <input className="pl-xl pr-sm py-xs text-body-sm font-body-sm bg-surface-container-lowest border border-outline-variant rounded focus:outline-none w-48" placeholder="Rechercher T-Code" type="text"/>
              </div>
              <div className="flex items-center gap-sm text-on-surface-variant">
                <button className="hover:text-primary transition-colors p-xs rounded-full hover:bg-surface-container-high"><span className="material-symbols-outlined">notifications</span></button>
                <button className="hover:text-primary transition-colors p-xs rounded-full hover:bg-surface-container-high"><span className="material-symbols-outlined">verified_user</span></button>
                <button className="hover:text-primary transition-colors p-xs rounded-full hover:bg-surface-container-high">
                  <img alt="User profile with MFA status" className="w-8 h-8 rounded-full border border-outline-variant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEzsWXfgdLygHWSnZ5xwM0RDWfpjAxx1LFL5ix51L0qxEFqEPbK2u-m-8Jy7U3Mq7JoHCpH45CEJ99ALa5azAnGAgWElTNJ5-GFJgwAfeMhyNC4u9P-X_IDFo-hwB-ZuicTMOgzEF4mOcyfRQ5XsbFH4LrC1ReZPydW_amSXNpn1SS610ilSB-jdBHRmmSdgGsPh1Nl9xkAiaEiUltRI1MrIhEecfCJBWDXOK3IAT58VTMG6U9XTCizTxbPCttPIASSrE37XQ9KfA"/>
                </button>
              </div>
            </div>
          </header>

          {/* Main Canvas */}
          <main className="flex-1 overflow-y-auto p-lg bg-surface-container-low">
            <div className="max-w-[1000px] mx-auto">
              {/* Breadcrumbs */}
              <nav className="flex text-label-md font-label-md text-on-surface-variant mb-md gap-xs items-center">
                <a className="hover:text-primary transition-colors" href="/settings/system/audit-health">Paramètres</a>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                <a className="hover:text-primary transition-colors" href="#">Sécurité</a>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                <span className="text-on-surface font-medium">Configuration MFA</span>
              </nav>

              <div className="flex justify-between items-end mb-lg">
                <div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface">Multi-Factor Authentication</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-xxs">Secure your KAMLOG ERP account with two-step verification.</p>
                </div>
                <div className="flex items-center gap-sm bg-surface-container-lowest px-md py-xs rounded border border-outline-variant">
                  <span className="material-symbols-outlined text-secondary fill text-[20px]">shield</span>
                  <span className="font-label-md text-label-md text-secondary">MFA Status: Inactive</span>
                </div>
              </div>

              {/* Bento Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                {/* QR Code Card */}
                <div className="md:col-span-1 bg-surface-container-lowest rounded-xl border border-outline-variant p-md flex flex-col shadow-sm">
                  <h3 className="font-title-md text-title-md text-on-surface mb-xs flex items-center gap-xs">
                    <span className="material-symbols-outlined text-primary">qr_code_scanner</span>
                    Authenticator App
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-md">Scan this QR code with an authenticator app (like Google Authenticator or Authy).</p>
                  <div className="flex-1 flex flex-col items-center justify-center py-md">
                    <div className="bg-surface p-sm border border-outline-variant rounded mb-md">
                      <img alt="QR Code" className="w-[150px] h-[150px]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkXBjcz88_HCOHCxIuxpAXtI_VBcXT9f4zjKgRihqX9isb81cfBlETKK4CaL_ZpCL5VGF5JmMvcA1C4rV-aZozdOUF_y545_fQbryKK0GFGG2DITyPTp8KziM4kuC6adYValmNn_OD_Dw1g6O-DDbWbsBCu3Dm_YabO1jekbQ8JFduBEqcDaO2zn0LxFp_Fl2S_4kVElMgGgzXzvBWW2ydSTaO788CzE-lq8G473GKOtv1QPkxK-RZUDmojOW7rWp1xd82j6N1v4s"/>
                    </div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant mb-xxs">Or enter this manual code:</p>
                    <code className="font-data-tabular text-data-tabular bg-surface-container px-sm py-xxs rounded text-on-surface border border-outline-variant select-all">JBSW Y3DP EHPK 3PXP</code>
                  </div>
                  <div className="mt-auto pt-md border-t border-outline-variant">
                    <label className="block font-label-md text-label-md text-on-surface mb-xs">Verification Code</label>
                    <div className="flex gap-xs">
                      <input className="flex-1 bg-surface border border-outline-variant rounded px-sm py-xs font-data-tabular text-data-tabular focus:ring-2 focus:ring-primary focus:outline-none text-center tracking-[0.2em]" placeholder="000 000" type="text"/>
                      <button className="bg-primary hover:bg-primary-fixed-dim text-on-primary rounded px-md py-xs font-label-md text-label-md transition-colors">Verify</button>
                    </div>
                  </div>
                </div>

                {/* Backup Codes Card */}
                <div className="md:col-span-2 bg-surface-container-lowest rounded-xl border border-outline-variant p-md flex flex-col shadow-sm relative overflow-hidden">
                  {/* Decorative gradient background subtle */}
                  <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/3"></div>
                  <div className="flex justify-between items-start mb-md">
                    <div>
                      <h3 className="font-title-md text-title-md text-on-surface mb-xs flex items-center gap-xs">
                        <span className="material-symbols-outlined text-tertiary">key</span>
                        Backup Codes
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Save these single-use codes in a secure location. Use them to access your account if you lose your device.</p>
                    </div>
                    <button className="text-primary hover:text-primary-fixed-variant font-label-md text-label-md flex items-center gap-xs bg-primary/10 px-sm py-xs rounded transition-colors">
                      <span className="material-symbols-outlined text-[18px]">download</span>
                      Download TXT
                    </button>
                  </div>
                  <div className="bg-surface border border-outline-variant rounded-lg p-md mb-md flex-1">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-sm gap-x-md">
                      <div className="font-data-tabular text-data-tabular text-on-surface flex items-center justify-between group">
                        <span>8472-9104</span>
                        <button className="opacity-0 group-hover:opacity-100 text-outline hover:text-primary transition-opacity"><span className="material-symbols-outlined text-[16px]">content_copy</span></button>
                      </div>
                      <div className="font-data-tabular text-data-tabular text-on-surface flex items-center justify-between group">
                        <span>3951-0284</span>
                        <button className="opacity-0 group-hover:opacity-100 text-outline hover:text-primary transition-opacity"><span className="material-symbols-outlined text-[16px]">content_copy</span></button>
                      </div>
                      <div className="font-data-tabular text-data-tabular text-on-surface flex items-center justify-between group">
                        <span>6105-8372</span>
                        <button className="opacity-0 group-hover:opacity-100 text-outline hover:text-primary transition-opacity"><span className="material-symbols-outlined text-[16px]">content_copy</span></button>
                      </div>
                      <div className="font-data-tabular text-data-tabular text-on-surface flex items-center justify-between group">
                        <span>9284-5710</span>
                        <button className="opacity-0 group-hover:opacity-100 text-outline hover:text-primary transition-opacity"><span className="material-symbols-outlined text-[16px]">content_copy</span></button>
                      </div>
                      <div className="font-data-tabular text-data-tabular text-on-surface flex items-center justify-between group">
                        <span>1048-2957</span>
                        <button className="opacity-0 group-hover:opacity-100 text-outline hover:text-primary transition-opacity"><span className="material-symbols-outlined text-[16px]">content_copy</span></button>
                      </div>
                      <div className="font-data-tabular text-data-tabular text-on-surface flex items-center justify-between group">
                        <span>7539-1826</span>
                        <button className="opacity-0 group-hover:opacity-100 text-outline hover:text-primary transition-opacity"><span className="material-symbols-outlined text-[16px]">content_copy</span></button>
                      </div>
                      <div className="font-data-tabular text-data-tabular text-on-surface flex items-center justify-between group">
                        <span>4820-9153</span>
                        <button className="opacity-0 group-hover:opacity-100 text-outline hover:text-primary transition-opacity"><span className="material-symbols-outlined text-[16px]">content_copy</span></button>
                      </div>
                      <div className="font-data-tabular text-data-tabular text-on-surface flex items-center justify-between group">
                        <span>2619-7485</span>
                        <button className="opacity-0 group-hover:opacity-100 text-outline hover:text-primary transition-opacity"><span className="material-symbols-outlined text-[16px]">content_copy</span></button>
                      </div>
                      <div className="font-data-tabular text-data-tabular text-on-surface flex items-center justify-between group">
                        <span className="line-through text-outline">5938-1024</span>
                        <span className="text-[10px] bg-outline-variant text-on-surface px-1 rounded ml-auto">USED</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto flex justify-end gap-sm border-t border-outline-variant pt-md">
                    <button className="text-on-surface-variant hover:text-on-surface font-label-md text-label-md px-md py-xs border border-outline-variant rounded transition-colors bg-surface-container-lowest">Print</button>
                    <button className="text-on-surface-variant hover:text-on-surface font-label-md text-label-md px-md py-xs border border-outline-variant rounded transition-colors bg-surface-container-lowest flex items-center gap-xs">
                      <span className="material-symbols-outlined text-[18px]">refresh</span>
                      Generate New Codes
                    </button>
                  </div>
                </div>

                {/* Security Preferences */}
                <div className="md:col-span-3 bg-surface-container-lowest rounded-xl border border-outline-variant p-md shadow-sm">
                  <h3 className="font-title-md text-title-md text-on-surface mb-md">Security Preferences</h3>
                  <div className="flex flex-col gap-sm">
                    <label className="flex items-start gap-md p-sm hover:bg-surface-container transition-colors rounded cursor-pointer border border-transparent hover:border-outline-variant">
                      <div className="relative inline-flex items-center cursor-pointer mt-1">
                        <input checked className="sr-only peer" type="checkbox" value=""/>
                        <div className="w-9 h-5 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                      </div>
                      <div>
                        <div className="font-label-md text-label-md text-on-surface">Require MFA for T-Code execution</div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant mt-xxs">Prompt for an authenticator code when executing high-risk transaction codes.</div>
                      </div>
                    </label>
                    <label className="flex items-start gap-md p-sm hover:bg-surface-container transition-colors rounded cursor-pointer border border-transparent hover:border-outline-variant">
                      <div className="relative inline-flex items-center cursor-pointer mt-1">
                        <input className="sr-only peer" type="checkbox" value=""/>
                        <div className="w-9 h-5 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                      </div>
                      <div>
                        <div className="font-label-md text-label-md text-on-surface">Remember this device</div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant mt-xxs">Skip MFA prompts on this browser for 30 days. Not recommended for shared computers.</div>
                      </div>
                    </label>
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
