// src/app/(app)/admin/role-assignment/page.tsx - Role Assignment - Fidèle 100% au HTML original
'use client'

import { useState, useEffect } from 'react'

interface PermissionMap {
  [key: string]: {
    ops: string[]
    finance: string[]
    system: string[]
  }
}

export default function RoleAssignment() {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['Admin'])
  const [filterText, setFilterText] = useState('')

  const permissionMap: PermissionMap = {
    'Admin': {
      ops: ['Override Safety Protocols', 'Global Real-time Tracking'],
      finance: ['View Global Balance Sheet', 'Audit Payroll Records'],
      system: ['Create/Delete Users', 'Modify T-Code Routings', 'Security Log Access']
    },
    'Dispatcher': {
      ops: ['Dock Assignment', 'Truck Queue Mgmt', 'Manifest Signing'],
      finance: [],
      system: ['View Operational Dashboards']
    },
    'Finance': {
      ops: ['View Cargo Manifests'],
      finance: ['Issue Invoices', 'Approve Petty Cash', 'VAT Reporting'],
      system: []
    },
    'GateAgent': {
      ops: ['Vehicle Entry Log', 'Weight Bridge Record', 'Visitor Pass Issuance'],
      finance: [],
      system: []
    },
    'Inventory': {
      ops: ['Stock Adjustment', 'Bin Transfer', 'Cycle Counting'],
      finance: ['Inventory Value Report'],
      system: []
    }
  }

  const roles = [
    { id: 'Admin', name: 'System Administrator', icon: 'shield_person', description: 'Full read/write access to all modules including security and ERP configuration.', checked: true },
    { id: 'Dispatcher', name: 'Terminal Dispatcher', icon: 'hub', description: 'Manage vehicle flow, assign loading docks, and supervise gate movements.', checked: false },
    { id: 'Finance', name: 'Finance Specialist', icon: 'account_balance_wallet', description: 'Invoicing, expense auditing, and financial reporting across port activities.', checked: false },
    { id: 'GateAgent', name: 'Gate Agent', icon: 'gate', description: 'Operational gate control, vehicle scanning, and basic entry data logging.', checked: false },
    { id: 'Inventory', name: 'Inventory Controller', icon: 'warehouse', description: 'Warehouse auditing, stock level monitoring, and storage optimization.', checked: false }
  ]

  const handleRoleToggle = (roleId: string) => {
    setSelectedRoles(prev => {
      if (prev.includes(roleId)) {
        return prev.filter(r => r !== roleId)
      } else {
        return [...prev, roleId]
      }
    })
  }

  const getAggregatePermissions = () => {
    let opsSet = new Set<string>()
    let financeSet = new Set<string>()
    let systemSet = new Set<string>()

    selectedRoles.forEach(role => {
      if (permissionMap[role]) {
        permissionMap[role].ops.forEach(p => opsSet.add(p))
        permissionMap[role].finance.forEach(p => financeSet.add(p))
        permissionMap[role].system.forEach(p => systemSet.add(p))
      }
    })

    return {
      ops: Array.from(opsSet),
      finance: Array.from(financeSet),
      system: Array.from(systemSet)
    }
  }

  const permissions = getAggregatePermissions()

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(filterText.toLowerCase()) ||
    role.description.toLowerCase().includes(filterText.toLowerCase())
  )

  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
        }
        .active-module-bar {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background-color: #0058be;
        }
      `}</style>
      <div className="bg-surface-container-low text-on-surface">
        {/* SideNavBar Shell */}
        <aside className="h-screen w-60 fixed left-0 top-0 bg-surface-container-low border-r border-outline-variant flex flex-col z-50">
          <div className="px-lg py-xl">
            <h1 className="font-headline-sm text-headline-sm font-bold text-primary">KAMLOG ERP</h1>
            <p className="font-label-md text-label-md text-on-surface-variant opacity-70">Admin Suite</p>
          </div>
          
          <div className="mt-auto border-t border-outline-variant py-md">
            <div className="flex items-center gap-md px-lg py-sm cursor-pointer hover:bg-surface-container-highest transition-all text-on-surface-variant font-label-md text-label-md">
              <span className="material-symbols-outlined">contact_support</span>
              <span>Support</span>
            </div>
            <div className="flex items-center gap-md px-lg py-sm cursor-pointer hover:bg-surface-container-highest transition-all text-on-surface-variant font-label-md text-label-md">
              <span className="material-symbols-outlined">logout</span>
              <span>Logout</span>
            </div>
          </div>
        </aside>
        <div className="ml-60 flex flex-col min-h-screen">
          {/* TopNavBar Shell */}
          
          {/* Main Content Canvas */}
          <main className="p-lg space-y-lg max-w-[1600px] w-full mx-auto">
            {/* Breadcrumbs & Header */}
            <div className="space-y-xxs">
              <div className="flex items-center gap-xs text-on-surface-variant text-label-sm font-label-sm uppercase tracking-wider">
                <span>Admin</span>
                <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                <span>User Management</span>
                <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                <span className="text-primary font-bold">Role Assignment</span>
              </div>
              <h2 className="font-headline-md text-headline-md text-on-surface">Assign User Roles</h2>
            </div>
            {/* Role Assignment Grid */}
            <div className="grid grid-cols-12 gap-[1rem] items-start">
              {/* Left Panel: User Profile Summary */}
              <section className="col-span-3 space-y-md">
                <div className="bg-surface border border-outline-variant rounded p-lg space-y-lg">
                  <div className="flex flex-col items-center text-center space-y-sm">
                    <div className="w-24 h-24 rounded-full border-4 border-surface-container-high overflow-hidden">
                      <img alt="User Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBrbdE7i_0rRRKGxVlkwpZeAdzdNNWgxqPzeduVnyzvEgBdsFLNCJmZI1aVCjgG8pNvf8lB1a73Rc59OTkiRXiCAKGvHh9vD-2nwWp0s5v33bP5ukX_Xu0LtzOFPwGjQfH-UFxFlG03MK37Ywu7bNYd6U4bn8_SAP8rbQbWJjD4d8o0zBwdwLCNhTTOb_6-WsAfQoSxCqRUDyLGeoHhMGvxWDCWB7tmYwSFFaKiKRhuY6Ph10WIWtw3yRwVw7jgG6CBf0-MEveOA"/>
                    </div>
                    <div className="space-y-xxs">
                      <h3 className="font-title-lg text-title-lg text-on-surface">Marcus Vance</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">mvance.kam@logistics.corp</p>
                      <span className="inline-block bg-secondary-container text-on-secondary-container px-xs py-xxs rounded text-label-sm font-label-sm">Active Personnel</span>
                    </div>
                  </div>
                  <hr className="border-outline-variant"/>
                  <div className="space-y-md">
                    <div>
                      <p className="text-label-sm font-label-sm text-outline-variant uppercase">Department</p>
                      <p className="text-body-md font-body-md text-on-surface">Terminal Operations</p>
                    </div>
                    <div>
                      <p className="text-label-sm font-label-sm text-outline-variant uppercase">Employee ID</p>
                      <p className="text-body-md font-body-md text-on-surface">#KAM-8820-T</p>
                    </div>
                    <div>
                      <p className="text-label-sm font-label-sm text-outline-variant uppercase">Last Login</p>
                      <p className="text-body-md font-body-md text-on-surface">Oct 24, 2023 - 08:14 AM</p>
                    </div>
                  </div>
                </div>
                <div className="bg-surface-container-low border border-outline-variant rounded p-md flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary">info</span>
                  <p className="text-label-md font-label-md text-on-surface-variant">Changes will take effect after the user re-authenticates.</p>
                </div>
              </section>
              {/* Center Area: Role Selection */}
              <section className="col-span-6">
                <div className="bg-surface border border-outline-variant rounded flex flex-col min-h-[600px]">
                  <div className="p-lg border-b border-outline-variant flex justify-between items-center">
                    <h3 className="font-title-md text-title-md text-on-surface">Available System Roles</h3>
                    <div className="relative w-48">
                      <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline-variant text-[18px]">filter_list</span>
                      <input 
                        className="w-full pl-xl pr-sm py-xxs rounded border border-outline-variant bg-surface-container-lowest text-body-sm font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                        placeholder="Filter roles..." 
                        type="text"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex-1 p-lg overflow-y-auto max-h-[500px] space-y-xs">
                    {/* Role Items */}
                    {filteredRoles.map(role => (
                      <label key={role.id} className="group flex items-start gap-md p-md rounded border border-outline-variant hover:border-primary hover:bg-surface-container-low transition-all cursor-pointer">
                        <div className="mt-xxs">
                          <input 
                            checked={selectedRoles.includes(role.id)}
                            className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary" 
                            type="checkbox"
                            onChange={() => handleRoleToggle(role.id)}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-title-md text-title-md text-on-surface">{role.name}</span>
                            <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">{role.icon}</span>
                          </div>
                          <p className="text-body-sm font-body-sm text-on-surface-variant mt-xxs">{role.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  <div className="p-lg bg-surface-container-lowest border-t border-outline-variant flex items-center justify-end gap-md rounded-b">
                    <button className="px-lg py-sm text-on-surface-variant hover:bg-surface-container-high rounded font-label-md text-label-md transition-colors">Reset Selection</button>
                    <button className="px-xl py-sm bg-primary text-on-primary rounded font-label-md text-label-md hover:bg-primary-container transition-all shadow-sm active:scale-95">Confirm Assignments</button>
                  </div>
                </div>
              </section>
              {/* Right Panel: Permission Preview */}
              <section className="col-span-3 space-y-[1rem]">
                <div className="bg-surface border border-outline-variant rounded flex flex-col h-full min-h-[600px]">
                  <div className="p-lg border-b border-outline-variant">
                    <h3 className="font-title-md text-title-md text-on-surface">Permission Preview</h3>
                    <p className="text-label-sm font-label-sm text-on-surface-variant mt-xxs">Live aggregate of selected role capabilities</p>
                  </div>
                  <div className="p-lg flex-1 space-y-lg overflow-y-auto">
                    {/* Dynamic Content */}
                    <div className="space-y-sm">
                      <p className="text-label-sm font-label-sm text-outline uppercase tracking-wider">Operational Rights</p>
                      <div className="space-y-xxs">
                        {permissions.ops.length === 0 ? (
                          <p className="text-body-sm italic text-on-surface-variant opacity-50">No permissions in this category.</p>
                        ) : (
                          permissions.ops.map((perm, idx) => (
                            <div key={idx} className="flex items-center gap-xs text-body-sm font-body-sm text-on-surface py-xxs border-b border-outline-variant border-dotted last:border-0">
                              <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                              <span>{perm}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                    <div className="space-y-sm">
                      <p className="text-label-sm font-label-sm text-outline uppercase tracking-wider">Financial Access</p>
                      <div className="space-y-xxs">
                        {permissions.finance.length === 0 ? (
                          <p className="text-body-sm italic text-on-surface-variant opacity-50">No permissions in this category.</p>
                        ) : (
                          permissions.finance.map((perm, idx) => (
                            <div key={idx} className="flex items-center gap-xs text-body-sm font-body-sm text-on-surface py-xxs border-b border-outline-variant border-dotted last:border-0">
                              <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                              <span>{perm}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                    <div className="space-y-sm">
                      <p className="text-label-sm font-label-sm text-outline uppercase tracking-wider">System Privileges</p>
                      <div className="space-y-xxs">
                        {permissions.system.length === 0 ? (
                          <p className="text-body-sm italic text-on-surface-variant opacity-50">No permissions in this category.</p>
                        ) : (
                          permissions.system.map((perm, idx) => (
                            <div key={idx} className="flex items-center gap-xs text-body-sm font-body-sm text-on-surface py-xxs border-b border-outline-variant border-dotted last:border-0">
                              <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                              <span>{perm}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                    {/* Empty State Placeholder */}
                    {selectedRoles.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-center p-xl opacity-40">
                        <span className="material-symbols-outlined text-[48px] mb-sm">lock_open</span>
                        <p className="font-body-sm text-body-sm">Select one or more roles to see the effective permissions list.</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
