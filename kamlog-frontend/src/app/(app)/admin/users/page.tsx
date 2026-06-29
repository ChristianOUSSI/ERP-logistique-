// src/app/(app)/admin/users/page.tsx - Admin User Management & RBAC - Fidèle 100% au HTML original
'use client'

export default function AdminUserManagementRbac() {
  return (
    <>
      <style jsx global>{`
        body { font-family: 'Inter', sans-serif; }
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
      <div className="bg-surface-container-low text-on-surface h-screen flex overflow-hidden">
        {/* SideNavBar (JSON Component) */}
        <nav className="bg-surface-container-lowest text-primary fixed left-0 top-0 h-full w-[260px] border-r border-outline-variant shadow-sm flex flex-col p-md z-50">
          {/* Header */}
          <div className="mb-xl flex items-center gap-sm">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-primary-container" style={{ fontVariationSettings: 'FILL 1' }}>anchor</span>
            </div>
            <div>
              <h1 className="font-headline-md text-headline-md text-primary font-bold">KAMLOG ERP</h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Port Operations</p>
            </div>
          </div>
          {/* CTA */}
          <button className="w-full bg-primary hover:bg-primary-container text-on-primary font-title-md text-title-md py-sm px-md rounded-lg mb-xl transition-colors flex items-center justify-center gap-xs active:scale-95 duration-150">
            <span className="material-symbols-outlined">add</span>
            Nouvelle Opération
          </button>
          {/* Main Navigation */}
          <div className="flex-1 overflow-y-auto">
            <ul className="space-y-xs">
              <li>
                <a className="flex items-center gap-md px-md py-sm rounded-lg text-secondary hover:bg-surface-container-high transition-colors font-label-md text-label-md active:scale-95 duration-150" href="/dashboard/global">
                  <span className="material-symbols-outlined">dashboard</span>
                  Tableau de bord
                </a>
              </li>
              <li>
                <a className="flex items-center gap-md px-md py-sm rounded-lg text-secondary hover:bg-surface-container-high transition-colors font-label-md text-label-md active:scale-95 duration-150" href="/transport/control">
                  <span className="material-symbols-outlined">local_shipping</span>
                  Transport
                </a>
              </li>
              <li>
                <a className="flex items-center gap-md px-md py-sm rounded-lg text-secondary hover:bg-surface-container-high transition-colors font-label-md text-label-md active:scale-95 duration-150" href="/finance/overview">
                  <span className="material-symbols-outlined">payments</span>
                  Finances
                </a>
              </li>
              <li>
                <a className="flex items-center gap-md px-md py-sm rounded-lg text-secondary hover:bg-surface-container-high transition-colors font-label-md text-label-md active:scale-95 duration-150" href="/parc/overview">
                  <span className="material-symbols-outlined">minor_crash</span>
                  Parc Automobile
                </a>
              </li>
              <li>
                <a className="flex items-center gap-md px-md py-sm rounded-lg text-primary bg-secondary-container font-bold font-label-md text-label-md active:scale-95 duration-150 relative" href="/settings/system/audit-health">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-2/3 bg-primary rounded-r-full"></div>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: 'FILL 1' }}>settings</span>
                  Paramètres
                </a>
              </li>
            </ul>
          </div>
          {/* Footer Navigation */}
          <div className="mt-auto pt-md border-t border-outline-variant">
            <ul className="space-y-xs">
              <li>
                <a className="flex items-center gap-md px-md py-sm rounded-lg text-secondary hover:bg-surface-container-high transition-colors font-label-md text-label-md active:scale-95 duration-150" href="/support">
                  <span className="material-symbols-outlined">help_outline</span>
                  Support
                </a>
              </li>
              <li>
                <a className="flex items-center gap-md px-md py-sm rounded-lg text-secondary hover:bg-surface-container-high transition-colors font-label-md text-label-md active:scale-95 duration-150" href="/login">
                  <span className="material-symbols-outlined">logout</span>
                  Déconnexion
                </a>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content Wrapper */}
        <div className="flex-1 flex flex-col ml-[260px]">
          {/* TopNavBar (JSON Component) */}
          <header className="bg-surface sticky top-0 w-full z-40 border-b border-outline-variant flex justify-between items-center h-[64px] px-gutter">
            <div className="flex items-center gap-lg">
              <span className="font-title-sm text-title-sm text-on-surface font-black uppercase tracking-wider">KAMLOG EM-ERP</span>
              <nav className="hidden md:flex gap-md">
                <a className="font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all py-sm" href="#">Articles</a>
                <a className="font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all py-sm" href="#">Clients</a>
                <a className="font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all py-sm" href="#">Stocks</a>
                <a className="font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all py-sm" href="#">Rapports</a>
              </nav>
            </div>
            <div className="flex items-center gap-md">
              {/* Search */}
              <TCodeSearch />
              {/* Trailing Primary Action */}
              <button className="hidden lg:flex items-center gap-xs bg-surface-container-high hover:bg-surface-variant text-primary font-title-sm text-title-sm py-xs px-sm rounded-lg transition-colors border border-outline-variant">
                Rechercher T-Code
              </button>
              {/* Icon Actions */}
              <div className="flex items-center gap-xs">
                <button className="p-xs text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container-high">
                  <span className="material-symbols-outlined">notifications</span>
                </button>
                <button className="p-xs text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container-high">
                  <span className="material-symbols-outlined">verified_user</span>
                </button>
                <button className="p-xs text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container-high">
                  <span className="material-symbols-outlined">account_circle</span>
                </button>
              </div>
            </div>
          </header>

          {/* Main Canvas */}
          <main className="flex-1 overflow-y-auto p-margin-desktop bg-surface-container-low">
            {/* Breadcrumbs & Page Header */}
            <div className="mb-lg flex justify-between items-end">
              <div>
                <div className="flex items-center gap-xs font-label-sm text-label-sm text-on-surface-variant mb-xs uppercase tracking-wider">
                  <a className="hover:text-primary transition-colors" href="/settings/system/audit-health">Paramètres</a>
                  <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                  <span className="text-primary">User Management</span>
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">Access & Roles</h2>
              </div>
              <button className="bg-primary hover:bg-primary-container text-on-primary font-title-md text-title-md py-sm px-lg rounded-lg transition-colors flex items-center gap-xs shadow-sm">
                <span className="material-symbols-outlined">person_add</span>
                Add New User
              </button>
            </div>

            {/* Content Grid Layout */}
            <div className="flex gap-lg h-[calc(100vh-180px)]">
              {/* Main Users List Pane */}
              <div className="flex-1 bg-surface rounded-xl border border-outline-variant shadow-sm flex flex-col overflow-hidden">
                {/* Toolbar */}
                <div className="p-md border-b border-outline-variant bg-surface flex justify-between items-center">
                  <div className="relative w-72">
                    <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                    <input className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-xl pr-sm py-xs font-body-sm text-body-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-on-surface-variant transition-all" placeholder="Search users by name, ID or email..." type="text"/>
                  </div>
                  <div className="flex items-center gap-sm">
                    <button className="flex items-center gap-xs text-on-surface-variant hover:text-on-surface font-title-sm text-title-sm py-xs px-sm rounded-lg border border-outline-variant bg-surface hover:bg-surface-container-low transition-colors">
                      <span className="material-symbols-outlined text-[18px]">filter_list</span>
                      Filter
                    </button>
                    <button className="flex items-center gap-xs text-on-surface-variant hover:text-on-surface font-title-sm text-title-sm py-xs px-sm rounded-lg border border-outline-variant bg-surface hover:bg-surface-container-low transition-colors">
                      <span className="material-symbols-outlined text-[18px]">download</span>
                      Export
                    </button>
                  </div>
                </div>

                {/* Data Table */}
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-surface-container-low sticky top-0 z-10 border-b border-outline-variant">
                      <tr>
                        <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">User</th>
                        <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Department</th>
                        <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Role</th>
                        <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Status</th>
                        <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="font-data-tabular divide-y divide-outline-variant">
                      {/* Active Row Example */}
                      <tr className="bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer border-l-2 border-primary">
                        <td className="py-sm px-md">
                          <div className="flex items-center gap-sm">
                            <div className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-title-sm font-bold">JD</div>
                            <div>
                              <div className="font-title-sm text-on-surface font-medium">Jean Dupont</div>
                              <div className="text-on-surface-variant text-[11px]">jean.d@kamlog.com</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-sm px-md text-on-surface">Operations</td>
                        <td className="py-sm px-md">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-surface-container-high border border-outline-variant text-on-surface">
                            Dispatcher
                          </span>
                        </td>
                        <td className="py-sm px-md">
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-secondary">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Active
                          </span>
                        </td>
                        <td className="py-sm px-md text-right">
                          <button className="text-on-surface-variant hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-[18px]">more_vert</span>
                          </button>
                        </td>
                      </tr>
                      {/* Standard Row */}
                      <tr className="hover:bg-surface-container-low transition-colors cursor-pointer border-l-2 border-transparent">
                        <td className="py-sm px-md">
                          <div className="flex items-center gap-sm">
                            <div className="w-8 h-8 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center font-title-sm font-bold">ML</div>
                            <div>
                              <div className="font-title-sm text-on-surface font-medium">Marie Laurent</div>
                              <div className="text-on-surface-variant text-[11px]">marie.l@kamlog.com</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-sm px-md text-on-surface">Management</td>
                        <td className="py-sm px-md">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-primary-fixed border border-primary-fixed-dim text-on-primary-fixed">
                            Admin
                          </span>
                        </td>
                        <td className="py-sm px-md">
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-secondary">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Active
                          </span>
                        </td>
                        <td className="py-sm px-md text-right">
                          <button className="text-on-surface-variant hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-[18px]">more_vert</span>
                          </button>
                        </td>
                      </tr>
                      {/* Inactive Row */}
                      <tr className="hover:bg-surface-container-low transition-colors cursor-pointer border-l-2 border-transparent opacity-75">
                        <td className="py-sm px-md">
                          <div className="flex items-center gap-sm">
                            <div className="w-8 h-8 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center font-title-sm font-bold">PL</div>
                            <div>
                              <div className="font-title-sm text-on-surface font-medium">Paul Leroy</div>
                              <div className="text-on-surface-variant text-[11px]">paul.l@kamlog.com</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-sm px-md text-on-surface">Finance</td>
                        <td className="py-sm px-md">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-surface-container-high border border-outline-variant text-on-surface">
                            Analyst
                          </span>
                        </td>
                        <td className="py-sm px-md">
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-on-surface-variant">
                            <span className="w-1.5 h-1.5 rounded-full bg-outline"></span> Suspended
                          </span>
                        </td>
                        <td className="py-sm px-md text-right">
                          <button className="text-on-surface-variant hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-[18px]">more_vert</span>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Contextual Edit Pane */}
              <div className="w-[360px] bg-surface rounded-xl border border-outline-variant shadow-sm flex flex-col overflow-hidden shrink-0">
                {/* Panel Header */}
                <div className="p-md border-b border-outline-variant bg-surface-container-lowest flex justify-between items-start">
                  <div className="flex items-center gap-sm">
                    <div className="w-12 h-12 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-headline-md font-bold">JD</div>
                    <div>
                      <h3 className="font-title-lg text-title-lg text-on-surface font-semibold">Jean Dupont</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">ID: EMP-8492-A</p>
                    </div>
                  </div>
                  <button className="text-on-surface-variant hover:text-error transition-colors p-1 rounded hover:bg-error-container">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                {/* Panel Content */}
                <div className="flex-1 overflow-y-auto p-md space-y-lg">
                  {/* Account Status */}
                  <div>
                    <h4 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-xs">Account Status</h4>
                    <div className="flex items-center justify-between bg-surface-container p-sm rounded-lg border border-outline-variant">
                      <div className="flex items-center gap-sm">
                        <span className="material-symbols-outlined text-secondary">check_circle</span>
                        <span className="font-body-sm text-body-sm text-on-surface">Active</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input checked className="sr-only peer" type="checkbox" value=""/>
                        <div className="w-9 h-5 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>

                  {/* Role Assignment */}
                  <div>
                    <h4 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-xs">Role Assignment</h4>
                    <div className="space-y-xs">
                      <label className="block">
                        <select className="w-full bg-surface border border-outline-variant rounded-lg px-sm py-xs font-body-sm text-body-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all">
                          <option>Dispatcher</option>
                          <option>Admin</option>
                          <option>Finance Analyst</option>
                          <option>Fleet Manager</option>
                        </select>
                      </label>
                      <p className="font-body-sm text-body-sm text-on-surface-variant text-[11px] leading-snug">
                        Dispatchers have full access to Transport and Parc Automobile modules, read-only access to Dashboard.
                      </p>
                    </div>
                  </div>

                  {/* Granular Permissions */}
                  <div>
                    <h4 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-xs">Module Access Override</h4>
                    <div className="space-y-sm bg-surface-container-low p-sm rounded-lg border border-outline-variant">
                      <div className="flex items-start gap-sm">
                        <input checked className="mt-1 rounded text-primary focus:ring-primary bg-surface border-outline-variant" type="checkbox"/>
                        <div>
                          <div className="font-title-sm text-body-sm text-on-surface font-medium">Transport Operations</div>
                          <div className="text-[11px] text-on-surface-variant">Create, Edit, Delete shipments</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-sm">
                        <input checked className="mt-1 rounded text-primary focus:ring-primary bg-surface border-outline-variant" type="checkbox"/>
                        <div>
                          <div className="font-title-sm text-body-sm text-on-surface font-medium">Parc Automobile</div>
                          <div className="text-[11px] text-on-surface-variant">Assign vehicles, log maintenance</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-sm">
                        <input className="mt-1 rounded text-primary focus:ring-primary bg-surface border-outline-variant" type="checkbox"/>
                        <div>
                          <div className="font-title-sm text-body-sm text-on-surface font-medium">Financial Reports</div>
                          <div className="text-[11px] text-on-surface-variant">View invoices and operational costs</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Panel Footer */}
                <div className="p-md border-t border-outline-variant bg-surface-container-lowest flex gap-sm">
                  <button className="flex-1 bg-surface-container hover:bg-surface-variant text-on-surface font-title-sm text-title-sm py-xs px-sm rounded-lg transition-colors border border-outline-variant">
                    Cancel
                  </button>
                  <button className="flex-1 bg-primary hover:bg-primary-container text-on-primary font-title-sm text-title-sm py-xs px-sm rounded-lg transition-colors shadow-sm">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
