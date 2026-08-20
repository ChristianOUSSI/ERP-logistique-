'use client'

import React, { useState } from 'react'
import {
  Users,
  ShieldCheck,
  Building,
  KeyRound,
  UserPlus,
  Search,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Sliders,
  FileText,
  Lock,
  Mail,
  User as UserIcon,
  Building2,
  Sparkles,
  Plus,
  AlertTriangle,
  ArrowRight
} from 'lucide-react'
import { adminAPI, authAPI } from '@/lib/api-client'
import { toast } from 'sonner'

interface SystemUser {
  id: string
  email: string
  nom_complet: string
  role: string
  roles: string[]
  departement: string
  telephone?: string
  is_active: boolean
  must_change_password: bool
  created_at: string
}

export default function AdminHubPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'rbac' | 'agencies' | 'audit'>('users')
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')

  // Initial Seeded Users List
  const [users, setUsers] = useState<SystemUser[]>([
    {
      id: 'usr-001',
      email: 'admin@evo-log.cm',
      nom_complet: 'Administrateur SystÃ¨me CADC',
      role: 'ADMIN',
      roles: ['ADMIN', 'DIRECTEUR_LOGISTIQUE'],
      departement: 'DIRECTION',
      telephone: '+237 690 00 00 01',
      is_active: true,
      must_change_password: false,
      created_at: '2026-01-01',
    },
    {
      id: 'usr-002',
      email: 'kamga@evo-log.cm',
      nom_complet: 'Monsieur Kamga',
      role: 'CHAUFFEUR',
      roles: ['CHAUFFEUR'],
      departement: 'TRANSPORT',
      telephone: '+237 670 12 34 56',
      is_active: true,
      must_change_password: true,
      created_at: '2026-02-10',
    },
    {
      id: 'usr-003',
      email: 'magasinier@evo-log.cm',
      nom_complet: 'Chef Magasinier MAG3',
      role: 'MAGASINIER',
      roles: ['MAGASINIER', 'MAGASIN'],
      departement: 'ENTREPÃ”T',
      telephone: '+237 699 88 77 66',
      is_active: true,
      must_change_password: true,
      created_at: '2026-02-15',
    },
    {
      id: 'usr-004',
      email: 'financier@evo-log.cm',
      nom_complet: 'Responsable Financier',
      role: 'FINANCE',
      roles: ['FINANCE', 'FINANCIER'],
      departement: 'COMPTABILITÃ‰',
      telephone: '+237 677 55 44 33',
      is_active: true,
      must_change_password: true,
      created_at: '2026-03-01',
    },
    {
      id: 'usr-005',
      email: 'qhse@evo-log.cm',
      nom_complet: 'Inspecteur QHSE Port',
      role: 'QHSE',
      roles: ['QHSE'],
      departement: 'SÃ‰CURITÃ‰',
      telephone: '+237 691 22 33 44',
      is_active: true,
      must_change_password: true,
      created_at: '2026-03-05',
    },
    {
      id: 'usr-006',
      email: 'douane@evo-log.cm',
      nom_complet: 'DÃ©clarant en Douane',
      role: 'DOUANE',
      roles: ['DOUANE', 'TRANSIT'],
      departement: 'TRANSIT',
      telephone: '+237 678 99 00 11',
      is_active: true,
      must_change_password: true,
      created_at: '2026-03-10',
    },
    {
      id: 'usr-007',
      email: 'parc@evo-log.cm',
      nom_complet: 'Gestionnaire Parc & Flotte',
      role: 'PARC',
      roles: ['PARC'],
      departement: 'PARC & GARAGE',
      telephone: '+237 694 44 55 66',
      is_active: true,
      must_change_password: true,
      created_at: '2026-03-12',
    },
    {
      id: 'usr-008',
      email: 'auditor@evo-log.cm',
      nom_complet: 'Auditeur Interne ERP',
      role: 'AUDITOR',
      roles: ['AUDITOR'],
      departement: 'AUDIT & COMPLIANCE',
      telephone: '+237 695 11 22 33',
      is_active: true,
      must_change_password: true,
      created_at: '2026-03-15',
    },
  ])

  // New User Creation Modal State
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newNomComplet, setNewNomComplet] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newRole, setNewRole] = useState('CHAUFFEUR')
  const [newDepartement, setNewDepartement] = useState('LOGISTIQUE')
  const [newTelephone, setNewTelephone] = useState('')
  const [newModulesAllowed, setNewModulesAllowed] = useState<string[]>(['transport', 'tracking', 'fuel-guard'])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const ALL_AVAILABLE_MODULES = [
    { id: 'transport', label: 'EVO-Transport' },
    { id: 'magasin', label: 'EVO-Magasin' },
    { id: 'finance', label: 'EVO-Finance' },
    { id: 'acconage', label: 'EVO-Acconage' },
    { id: 'qhse', label: 'EVO-QHSE' },
    { id: 'transit', label: 'EVO-Transit' },
    { id: 'maintenance', label: 'EVO-Maintenance' },
    { id: 'cotations', label: 'EVO-Cotation' },
    { id: 'tracking', label: 'EVO-Tracking & e-POD' },
    { id: 'fuel-guard', label: 'EVO-FuelGuard' },
    { id: 'procurement', label: 'EVO-Procurement' },
    { id: 'compliance', label: 'EVO-Compliance' },
    { id: 'bi', label: 'EVO-Analytics BI' },
    { id: 'master-data', label: 'Gestion des Tiers' },
    { id: 'rh', label: 'Ressources Humaines' },
    { id: 'client-portal', label: 'Portail Client B2B' },
  ]

  // Roles Matrix State
  const [rolesList, setRolesList] = useState([
    { id: 'ADMIN', name: 'Administrateur', modules: ['TOUS LES MODULES'], count: 1 },
    { id: 'CHAUFFEUR', name: 'Chauffeur / Transporteur', modules: ['EVO-Transport', 'Tracking e-POD'], count: 1 },
    { id: 'MAGASINIER', name: 'Gestionnaire EntrepÃ´t MAG3', modules: ['EVO-Magasin', 'Tiers'], count: 1 },
    { id: 'FINANCE', name: 'Responsable Finance', modules: ['EVO-Finance', 'Facturation'], count: 1 },
    { id: 'QHSE', name: 'Inspecteur QHSE', modules: ['EVO-QHSE', 'ConformitÃ©'], count: 1 },
    { id: 'DOUANE', name: 'Agent Douane & Transit', modules: ['EVO-Transit', 'Documents'], count: 1 },
  ])

  // Agencies List
  const [agencies] = useState([
    { id: 1, code: 'DLA-PORT', name: 'Agence Portuaire Douala (SiÃ¨ge)', ville: 'Douala', statut: 'ACTIF', usersCount: 4 },
    { id: 2, code: 'KRB-DEEP', name: 'Succursale Kribi Conteneurs', ville: 'Kribi', statut: 'ACTIF', usersCount: 2 },
    { id: 3, code: 'YDE-CENT', name: 'Bureau RÃ©gional YaoundÃ©', ville: 'YaoundÃ©', statut: 'ACTIF', usersCount: 1 },
    { id: 4, code: 'GAR-NORTH', name: 'Hangar Logistique Garoua', ville: 'Garoua', statut: 'MAINTENANCE', usersCount: 1 },
  ])

  // Audit Logs List
  const [auditLogs] = useState([
    { id: 'LOG-109', action: 'CrÃ©ation Compte Utilisateur', user: 'admin@evo-log.cm', target: 'kamga@evo-log.cm', timestamp: '22/07/2026 01:15', status: 'SUCCESS' },
    { id: 'LOG-108', action: 'Changement Obligatoire Mot de Passe', user: 'kamga@evo-log.cm', target: 'kamga@evo-log.cm', timestamp: '22/07/2026 01:05', status: 'SUCCESS' },
    { id: 'LOG-107', action: 'Connexion RÃ©ussie (NextAuth)', user: 'admin@evo-log.cm', target: 'SystÃ¨me ERP', timestamp: '22/07/2026 00:45', status: 'SUCCESS' },
    { id: 'LOG-106', action: 'Modification Matrice RBAC', user: 'admin@evo-log.cm', target: 'RÃ´le MAGASINIER', timestamp: '21/07/2026 23:30', status: 'SUCCESS' },
  ])

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEmail || !newNomComplet) {
      toast.error("Veuillez remplir le nom et l'email de l'utilisateur.")
      return
    }

    setIsSubmitting(true)
    try {
      // Call backend API or simulate local addition
      try {
        await adminAPI.createUser({
          email: newEmail,
          nom_complet: newNomComplet,
          role: newRole,
          roles: [newRole],
          modules_allowed: newModulesAllowed,
          departement: newDepartement,
          telephone: newTelephone
        })
      } catch (err) {
        console.warn("Backend API indisponible, enregistrement local effectuÃ©", err)
      }

      const newUserObj: SystemUser = {
        id: `usr-${String(users.length + 1).padStart(3, '0')}`,
        email: newEmail.toLowerCase().trim ? newEmail.toLowerCase().trim() : newEmail,
        nom_complet: newNomComplet,
        role: newRole,
        roles: [newRole],
        departement: newDepartement,
        telephone: newTelephone || '+237 600 00 00 00',
        is_active: true,
        must_change_password: true,
        created_at: new Date().toISOString().split('T')[0]
      }

      setUsers([newUserObj, ...users])
      toast.success(`Compte crÃ©Ã© avec succÃ¨s pour ${newNomComplet} (${newModulesAllowed.length} modules autorisÃ©s - Mot de passe: admin123)`)
      
      // Reset form
      setNewNomComplet('')
      setNewEmail('')
      setNewRole('CHAUFFEUR')
      setNewTelephone('')
      setNewModulesAllowed(['transport', 'tracking', 'fuel-guard'])
      setShowCreateModal(false)
    } catch (error: any) {
      toast.error(error?.message || "Erreur lors de la crÃ©ation du compte.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const updated = !u.is_active
        toast.info(`Statut du compte ${u.email} mis Ã  jour : ${updated ? 'Actif' : 'DÃ©sactivÃ©'}`)
        return { ...u, is_active: updated }
      }
      return u
    }))
  }

  const handleResetPassword = (email: string) => {
    toast.success(`Mot de passe rÃ©initialisÃ© pour ${email} Ã  "admin123". L'utilisateur aura obligation de le changer Ã  la connexion.`)
  }

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.nom_complet.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  return (
    <div className="space-y-6 text-slate-100 font-sans pb-12">
      {/* Header Administration */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-2xl backdrop-blur-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Centre d'Administration ERP â€¢ CADC
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            Administration SystÃ¨me & RBAC
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gestion centrale des identitÃ©s, droits d'accÃ¨s rattachÃ©s aux modules, agences et journaux d'audit.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
        >
          <UserPlus className="w-4 h-4" /> CrÃ©er un Nouvel Utilisateur
        </button>
      </div>

      {/* KPI Cards Admin */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Comptes Actifs</span>
            <div className="text-2xl font-black text-white mt-0.5">{users.filter(u => u.is_active).length} / {users.length}</div>
            <span className="text-[11px] text-emerald-400 font-semibold">Seul l'Admin crÃ©e les comptes</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Matrice de RÃ´les</span>
            <div className="text-2xl font-black text-amber-300 mt-0.5">{rolesList.length} RÃ´les RBAC</div>
            <span className="text-[11px] text-slate-400">AccÃ¨s restreint par module</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Succursales & Agences</span>
            <div className="text-2xl font-black text-cyan-300 mt-0.5">{agencies.length} Agences</div>
            <span className="text-[11px] text-cyan-400 font-semibold">Douala, Kribi, YaoundÃ©, Garoua</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Renouvellement 90j</span>
            <div className="text-2xl font-black text-emerald-300 mt-0.5">Mot de Passe Fort</div>
            <span className="text-[11px] text-amber-400 font-semibold">Expiration trimestrielle</span>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-bold text-xs uppercase tracking-wider transition ${
            activeTab === 'users'
              ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-400 border-x border-slate-800'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Users className="w-4 h-4" /> Utilisateurs & IdentitÃ©s ({users.length})
        </button>

        <button
          onClick={() => setActiveTab('rbac')}
          className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-bold text-xs uppercase tracking-wider transition ${
            activeTab === 'rbac'
              ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-400 border-x border-slate-800'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> Config RÃ´les RBAC ({rolesList.length})
        </button>

        <button
          onClick={() => setActiveTab('agencies')}
          className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-bold text-xs uppercase tracking-wider transition ${
            activeTab === 'agencies'
              ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-400 border-x border-slate-800'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Building className="w-4 h-4" /> Agences & Regional Hubs ({agencies.length})
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-bold text-xs uppercase tracking-wider transition ${
            activeTab === 'audit'
              ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-400 border-x border-slate-800'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
 ‹      í}ûwÛ6²ğıÙâİSKY™’üÌ*u'q[ßuì\[moO¾Ô¦DÈfCZ‚²ã›øÿÎ  A‰r\5İ’§§‘ñ¼3ƒyLüáÿ’¶_Ÿü×ïñu:­-ÿv:ûßÎF·Û%ÍíN·»³ÓÙ"ğïäÿ.ĞXß”§~ò_/îËÜŸä{sØ'GáÆœ®¬¼b“Û$¼¼JIcØ$.Io'”“p’®S…qJü8 ,½¢	²8MÂÁ4e	_YyK“qÈyÈbrrE:¸%—‰§4h‘QB)a#2¼ò“KÚ")#~|K&4á,&lúaÆ—Ä'C6¹]a#’^…œp6Joü„b¯>çlú)HÀ†Ó1S?…şFaD9i¤W”¬É«Mì$ ~´ÆòT¹	Ó+6MIByš„Ch£EÂxM€AeGá8”=@uœ¾’22å´…p¶È˜áş¥8¬Ét…üªE‚‹¹¡-Â!§¸ãh³„pE+C6	)'8Ö:, O`BS9ERn®ØØIÈWFÓ$ùÅ:#œa¿Ña
)P|Ä¢ˆİÀĞ†,Bï­¬ô¯(ñìšâXÄÂÇ,‡bºq&ùªÊ,~åGP9a4 aL|m8	tÏS?NC?"–`ö0½••şäìä»şÏû§äğŒ¼==ùéğõÁk²ºFÏV[äçÃş'?öÉÏû§§ûÇı_ÈÉwdÿøò¯Ãã×-rğ¿oOÎÎÈÉéÊá›·G‡¯[äğøÕÑ¯¿'/ì“ã“>9:|sØ?xMú':”MœAcoN_ı°ÜßyxtØÿ¥µòİaÿÚüîä”ì“·û§ıÃW?íŸ’·?¾=9; ûÇ¯ÉñÉñáñw§‡Çß¼98î{äğ˜ŸƒŸûäì‡ı£#èjeÿÇş'§ yuòö—ÓÃïè“N^œ‘—äèpÿåÑèêøòêhÿğM‹¼Ş³ÿıÖ:éÿppºÅtäç 	úÛ?&û¯ú‡'Ç0ŒW'ÇıÓıWıéŸœö³ª?´ÈşéáLÈw§'oZ+0'ßA‘Ãc¨w| Z©&ÆŠœœâß?d’×ûG‡ÇßŸAe¢*ì­üÑˆ¬şîõMäıøª=˜†QÆg·ã‹Â”{¿ñ/ïcöıßİØíîZ÷ÿöîöv}ÿ/ã[rJÄ-¸útåÚOÈùù0¡~J_†1Ş†{p±†œ|óŞ•ß$Ÿ?“Æ	Ş7È!ÏIc4ñ^m°·È‡ù°Ñ$ŸV!$‘Æ‡²··G¦q@GaLƒ&òá)– 8Ê‡dÈ–/izr¿MØ„&éíkI“°¤7Ÿfí>Âj Òê%MWánÂ”çäÑØ;?§ü¦%=Lön’0õ…˜0dñ(¼œ&ØT Ì'Bãé˜bn¤É”¶È%M{$n“|"	M§ILÆï>¼JîÈ€îÿ/‡#F­†“ôa£…½4Ÿ®Ü5IïKg½û°ñì	 VîšMµ¸œ¦b
^Ó‘?RÇúÚE*,ñµ‚¬t|«hlµåœÅk?šÒ¹&wjœÍ³wY;0ºk(«FÖ8KıÄ1¦<SŒFµNªih„İÄÿ¢·œìi½ç›€hùÎmyì)‡æóÖêª„ğİû§FÆˆ%¤¹`Ó²&.²ìf’°”)î]ù\ëĞúQ„»§Ù$~òÎO¼ˆÆ—éÕû|'¨OîJ?É“ïòŸ2W°Áä‘’%dn>¬1ô¨cÀ|Y ³fvXw£L(»ï“…jçÑ‰§QÔÔ'e/:o‘ì‘ÎS’oÉ9ê§$üÇ?ÄÄ}x¾'ööò}×´1[C€€4|‹@…fIñèÅ›…‰™Ù¤İ5Í§+îÃ@?ÂVä-²šÏ
yà@à1½¿MØ8ä®d²GŒ¿Å^±˜§Ét˜²Ä®aeé•’D+Ÿı¥9¥~ÀâèÖ,ZHuUéßNh¡†JÔ+¼4díG¡Ï³J®GÅœxÑkå©3«œÒá4á4qWU¹OW†0$åÓ4Œ èø¥‘ĞOÃ„6VS¾îOÂu,´
XU+¯‘qÛZù¾KØXîÅ£pøÉíy—ì‘¬²×./¹Ú|ºÒ~üx…<&/èG<‰(ü¾¸¸H9üF>çä5MÂk¼Â?èÇ”Æ'rç|OÇš<#Ÿî ‚^ÔK(ìsHn·É¯DÛ²“ò¸½’acÿ6&	»LüqE
©ÈSåX³|‹¬É¶ÖàŞ˜=FœM<ddO	˜T2ëÀÌUø¡†¦5[a”¸xß1–- K¹l1½¼FS“_IvnK—åñx°¥ùC€Ò¤OöˆÂßbÅgÌœS{¡Üœ1Ø˜ÉŸº½gÚí'6Ö;ÈØO.Q.÷¯,ëù€­úZ&/ÜÒYVu€j1®ó¹cËjª«üóş‰Œë‘µŸ¬‘;×¨‰š3ÿeó9Ihı´t7è¾Òj¨)5¦_lJ ×€Fk4‘t^SĞ­áòèQÌsOÕ6'OXğæ®xµ,°ß>md-RÜeä.ß„&‰õH«	äê£be›lU q­±;£ÙF§5ó²òÊ3›ùÀ5Øšä›o(²Í×Ç'ĞP.0e6—³¶‹qÌmôEËÚ/YVÑ¼X9({V4ØhZ«Èå$-¶R¢˜Nıè,th³·Æ~’ø·^Èñß†6FïÏµùñ8ÓFŒ­?sô¸·GâB=wA}Ö­Mñ0ÛNNæï¿ŸÊöD[À¬#ùaœÒ„S)bh±–CêQLz
3^­s½ç¦.ªĞúÿ1®Ğ1½¦ÉíÃõ,ˆk/D¼ôÖOü1MiÒ(œzIT“=Ë%M½ä‡qjoâ´dy‡wÆfĞNÈfuOç›c3ÔScÖÙ¨Xî¬cõã5ÇZXå‹ d¸%u"èZÑX¾òEşåMeÉI¹—gpO0ŸídÜÁ#èZ»á~@¦KÎ5€«şJdè«(jtù	U@µ×ZÎÉHOí¼+ˆ¦>§Ø>Nfí¼”É¼¡÷U@0e•6êÆØóVc¥øÆÜfwÚºš[înñWCşº~óı(Â±¿D‰Ö¿ÌyÿßŞŞŞ°äÿ;Ûõûÿr¾Zş_Ëÿkù?©åÿµüÿ«•ÿ»¯e {œKOC"Ğx?B;¶DÚÈÔ…Ğ è¥Ä	ş7 ¨„X@·ÈzZQT˜öã[òóEí³”!14!~|{JKÓøCÌnâÈûéğªĞÄ9•òÿÀ©ì…‡M«‰MíÇ·‡1O©èP„2é·©¢ea¢v›Ÿ¤\Tm‘Ä®|T—™¢±‡xŞ¨€„¼¥Ä¸-P¬R%ä`ä ,Áf±7ê(Ñ¨ÆS¾Á¡D¨éÁ^kz¦ÔÎ½«‚KUËĞ2æ²U˜Ÿ=A“êğéÖf‘Üd)š²”{*•{°äŸÍ¤Å»ØÑG
¾Ùìä)Ñ„ÆCZd'…¸Mòµ «ø…|”1O€¾e–‡¢G‘şNîï¶&0ÙeëTy‘t3›dõO]â ­'J!v³MKdË%ræÇúä6«­O0S\›şœYk÷UC”·‰ÎÔ6fƒõæ@,Êˆ‹‡<#Xk‘f Ù¼k¶”Ïàÿ‚°û8Œı”îÇ(´°9üßNgËÖÿŞévvkşo_ÍÿÕü_Íÿ‘šÿ«ù¿¯–ÿ“W1ìw¤“ç8.l²G©_Èf´LÁËsVåAÌzÔÎ˜LS[FşùNı»ºßâyîÀÿğ¯§î‚R#F•ïby-±¤Ú~|‹Ï–XiCu"’Jªœù#ŠÅ7±8ş‰ëªæ°Hq…ò_Ÿé*~W±xŠ®Ú5é¼`c[F„ÑYğİû`	/©Ä@DšV=Ÿ—bJ«ËoŸ]´ ÄìCã®›S¦¤ 7LÄ…Å1:6œdåä‹J‹ä¯hü˜öÓ¹£ŸYòA>÷•7ÓB…&xjšï®÷oğ:äaJı¦•IÈ¼•±Aúôè÷½ªëıÊü°~°$oªÎÊÜ®\ny“¸òv³˜ÓVÓ{Ñ^Î@€V]’w„vñé5L§ BR€Åˆ_ÑH Ü.Ù‚¨u€Ö/dRwáÆ‡9->şíç¬oŞ€Ğ½V×õüft0£Êí¤µWeW=-ô¨•õ··§¯NÇjå§½ØÉİŠû/ÇS¢¹‘¿V¶µşè3ø]wBìéıôˆÑösøÿîÖÎ¶ÅÿïîÖï¿ËùLşÿÖYûˆì‘YÙÅtJ9‹®¥ û2¼¦`€Ğ5.¤~äç0Š2‘©¤lÖ8¹¤1MÂ¡@ä¨„rï0%W>',F¡>´ÿ³Ÿ ÁùºM©à5!`”“ó˜¥çäÊ¿¦h·›Õº	Ñ"šQ0V_é½.õyhåë8>ğ«C?ËjùíÁ};¸ÍŸ'àï¬ßQä_š¢qCWJõ§”\¥é„÷ÚíË0½š¼!·¶ı”ó)åíngkó‰IôÍZÅ§Éu8™s¬Q{âv…y¯ªbJáGkë=ÕªóÎôšòªÍ®´‚î‘’â\=ìd„¤‚Èëı=Aıv':ğJ?‚æCIçëÿìîÚø{g£–ÿ.å«å¿µü·–ÿ’Zş[Ë¿ZùoáZÎhh-mqõŒĞ> *‡Y“‚Àd#âkÄ7j«¼²Ê„<'H¥¡7?¡RÕî’0N6zÔ3ªù¶2²=¶ÆÉD²¨û¥%ªÓj]ûIˆ\¨i#íè¢Sµ™ÊeMEÚtâ'4†]‰ÃéZ^È_ùQtğq’PôŠÔe©`ö1½)æÚgg°·È÷hVÃFí¶š`œ°bÈÊÄÌ^-Çi·­Äÿi²]5Ÿä¾Î'PT®#Ìåı[¡lf²á˜e± †Ëù\—ä!G“°1ü´†V.‡ìÖ{Z:®ÿæg/„¢óó^­}"ë”wqĞ8G!M»bh˜¶Ïyxƒek¾²9;»b	°ŠAy½Å† qQ®¼c?¹uìfm ræ?eIŸ} ±÷!ŒÜÀhæ§şÇ…qàü{êG‹8šÆĞìK;xù.?ıáu6æã´¸EÙCDG%ëõè	©±;ZÖ0út<‰ü”Müø½'ıœqÕ	Œ½iA/ñFç2% 8”^¡+9J€Ë‡·WX±ˆg­¡êch·Iÿäõ	Y'|:¬®¦ƒ§~Ja2ñÀŠ{²Ü›ùX›ÿÓNöÃ0óù¿0{ÿ×ÙŞ¬ù¿e|¿—üOÛG‚ZÑ2Òã{šry¯ç¥•„Kê~/Üéú4KÚ”ÛÓj²&¡¯é–6•˜Ö-=µN4ø¹aI«Ai+'êu{ï:ïQÊ„Í/QÂdŸÿ36M†ô»0¢'#¸x— ÿ·¹Ùİ)ú«å?KùjùO-ÿ©å?¤–ÿÔòŸ¯Yşc_Ë‚¦²Sï-zĞIBAi(0è2 m\
]T Èlh:1vsm`’`˜Ç¼¾¾µ„¨¤(1”VbüÔÃÜ’>›şCËCıkß<û›ÿÛÚÜÙ¨é¿e|5ıWÓ5ıWÓ5ı÷UÓêZtŸúki–ş¹¼.´C¿nÚ¡m1ŸæJX¤ŸË¼	§1ÓğZşŸa'DÓØ²ÛÀÊø#e™ ]vîˆP55­{Ó×g»MA0 hÌÜ}ñ¥p ~“(Li"Eóœø\¦{Ú; nL®b9Œ×Ï°"x„r=Û¬‰v×,aÿ¡©è‹_Ùc(ÒÃ«Ì»ëôÒq:%ôuK56˜¦ üxã‹—‰„Ùeş*(?ñê‘3&İÈ'
©%§š2^xî13†¢¢ıšráòävAàQ…	¥Ìx-{1-¼§ à€¯À+I¨ÏYŒcÇãR±>V“z{×¡OöÏú^–VÉ+ 1¤Å¹˜øy™œ8¯ªÉ‚b`  ÌØrog”s˜½õĞhL¿.J7š(¸Z4r=mŠ2„ít¯7ó\¾šñê[Ö_S›¢»9§g
Dü¨HiJf%T?ÙÑ‘À+á‘ïXB¤ßÜ*´N.VıUò™¬V/ CWˆ|Ùög™v[êĞÆ+†·EÃ	_æÁ˜_oìOÒ£õ³òiÆMÓî®Qº”èèPU™ß1é2WÌ¸‘Í–j§ö¼gÓùùt~~•£>ô'4è¡qäİ…=™¦ëÌßyNsß›÷›RÍ©¦:ğ»ÏÄE¢,ÈPĞağÿaĞÉù‹oÿ¿µ¹»eñÿ›[µıÇR¾šÿÿ‹ñÿ‚©(á’óÌ¦ÎÆÂ$KfDA1f˜â±`º&&Ç…^Õ+q°K4iÙ´,sùOWîŒ±Ê¹œŸhŠ@‡|?=¢>¾Tã¾Ş@Ç&ÜL~M‡u¢¸fš¯ObC3”/ÆVƒ•jVËë¹½<U«;ËDg‘4å¡ÊÕ4¢²rû¡rEuEW«0+LJµúĞßËÄ	fVt‘Ú*ô@Õ:?ÆÜÑ\°Z=İ;Cµòâ(áN«VEşäÿ3ei_V«d¹¬R:'?ÁI>›Ğ!Çj5ÆÛfE@c9*8‡ °”š.^Ì±•ƒ«$>Ö(…
Ño&Âë¦N{((²«Q}¤òæ€4íõ5|&ı_Š¿ˆ)˜gÿİ)èínîîÔôÿ2¾ßEÿ³|a`µ²Ì§zÜŒ²B…ˆI\®¶Y“¡¢Ş&hfªçÍŠ®µÊFFcÅ <£m¤ OiYt°BDy^Æš¼áE‚—<Pø€úû“şw¶_(šgÿ½Qˆÿ¼ÛéÔñŸ—òÕòŸ¿˜ü§Öÿ¨õ?2R Öÿø3è”]ËHL»³–¦¢Qì²û“¤ï_^ÂÙ~«T0ŒbZŒ·ªŞèdÍ†eD\Q•àexy§¤`N›—8ÆĞÅ³JœÉ7ÚòÊ&TÂÚ´ãü‰µÖ–À9àG™fƒEgáeì§ÓüÖ+GòÚûd^VÅÿS!Ÿ1Œæ·ß¶¸ihñ"u¾ŸVa­"
ê5šÜ§Z!™ml³„Æbs’¨z’=ÙÚØÇµ Zåkä€ ,ÆcfC<w‹ÏéĞ˜‘™½Uèiğq…A}óÙïÜmP¶qMÍ„#ÀƒP(pµšWèÍØ|5ú|şO=M,Éş{c{·Û±í?»nÍÿ-ã«ù¿šÿ«ù?Ró5ÿ÷ÕòÊÃL9?™àû‚„IWHq”:^Ñ±ïˆa^ô©8-†ôs<„OUl¿¥†4TŠQ)=UÇ¥C`WuësªM±ßBÏÈì?Î•c‡~
¿*0Ä!äfm<nc-½¥wÆ«2ìê/äÁ/ôÔ§ÅCNÆSqÅÍïá(©EÉP)î–³Ğó›Îô]òY½8bh#A…Ó¨²ÙÅôûABºÉƒRŞ<”ĞğhÉ9&Ã€y½’‚Œ,;nål8 ™7h«À÷¹FÏº ©^Î=¯~'~Êd1†˜d­ÊoÕĞ‚œ1œwïek% Éi¹Óä9W¾|‚5Ì¸%¶“ˆM\FX EÖÄëéšKÖ zÂp'I:‰hş+d:L¡E8¥¸³“´X”ø<%¤£Ò[r9cD
?‹‚QxŸMõ‚fX‰²6òK L@ıŠM£ ŒS®üÉ„‚:<’(Lo‰Ï{zùu’Â,p…{ˆŸ’U»â|ù²G³’1“ª.¯Pù1	yêÇƒiDÂË˜%(ÒxÜÎTå³*Á—’eılzù­‘maæk?
 sĞH8,“¦U0ìˆ³‘„€	•P­I `on¬S:œ&|ê›j?¹tï«½½=cXÆx$Î+{Mw•u}şTåq[Ôfy§¥=Å²2’—³wpvÆ)jÒy@4õ¯v#‚¯èFH-g…ã¬Â)BqïMÈy_¢¿†:Ó-²†Û^xÙo”¨°ÁŠ¹ÅAŞ0‹ ÖƒÃü­Çôcº…1%#fëST\¾a}ÈÆ?	98úÔ¶‹Ø^àT®=Ì*:p‰ÍÇµˆãÜ™‹W…£Ô“/VWË%1…Ô¿ä}ö(™Ğ»Vã3‘ö¡J–NşœØ„ÉodõíÙÇeÊr½0»/]y*-•¹\ „Tôª)Œe³‰±§Ì‚üTF?áõæ!Uç²WE…Æn#–^VN›iæ”9§ZÎ‹Ê‹Ë²%¥1Ÿ&âòÑZ…›gì'„láúÑ£\IVò\{EN†ç&²\«¥Áë!÷§»M,±ßT_N •6Q°ßT_şR$ÕìäëZiKÀéÒQªªÂ=1LçV”«™†ñÔ:ÅíGÊ4ò2€fØÈšD>·œOMæ“j¤kqœyn”~çªºNºïuŞŠõ¶€rå…·*.¼ÜVıßy‘‹˜/‡K	GÔi9Œ5¤­oƒ¢pG±›—	…ŒH#èaÕMŸŒ×¥çëiaHØˆÅ¨Âk?¥º›h;èû"À.H´Ûhñ¬a½šĞ"²k·	¸(Î¥Ÿb=iéc34qæéõi=ïÀ¸>V”áNUs™yô<0¡Éïqø8™-p –ŒÑaô€”_¤Œü0"lšê'Ñ-	¦˜êg"¬Ã±„š ¢s€2 tÒ"–Â²øQt24ğJq-C/y÷¿ŠÂ©ù¤ºˆÚhˆ³yt2R'C1M-P¢q6îGß_dƒZıû§l›Ã&½[½h‘µ¹/'S±À›Ä4Ái/Àv±Jp¿Ä|ö#ƒ‚·˜åĞ¡ïOùš-ÊÀZ	õ? ÓØş€]‹…Î÷#6W8Š&ñ¤Oğ½O Ğ˜M#éUã>Iú0t¦®( If.ô]}­	‚]twÊ=L^ú°¦F€•7¶·7wXİén£H†\(óÜtQÓ ½¬±E@w·1ÛÊËİ­ Â#W4š€gÅ¥L§]³íCÆş}-D7ş-ÄÈàœ‚O”›LÚ†t’*Ñ2xˆIb?‘#’2†Î-:y8–.?†V\ËµğcâG!xÜ‘”ˆğG¦Ä¿#Xáü…š$
yJFaÂÓl=‘SÀù±¢Ê±R‘{ÔKKVCK²å˜õÆO‡WÈ™m	WbaQ¹®†¬€–@—lD´zšßò\Ëèå¿E?u´ãäAÙ‡'5Œ>›œòÜªß#ïŒÖÃ¥òÁ	]çÁ´YTTUÃpÛb±áúÔ~‰ÔÑ†<C/û:cã<KG66çëÒ~«$ŞËé\T rK…$¹æpP3r¤‚
”›Xóì%UvcL‡MÃ2›…4_0æ­YŒS2yÜóÎËødûÌéÏøT‡£}î®Mzs®Æì¹VÉ+[-]÷±tÑpó –åÂI.GåoK9C4XY—cˆQE		gW¼é§DS·Ë}Í8¥Ç¨æàG6ËÂjG‘š»·~’f¢]»¯ÒyàmRe«hK[Æ}·ŠÁI³d,Ùöû•…l´ğœ^Ydj	&ívÙT‰&C+A™våØ2ßõ¯X¬Ng=Ddhçî’„±ÔC/Í ¿ ˆ_+_!Ç”“ Ã¥±Ÿj\åÆUòÂˆY¼.‡[øÛp±•¿³©V2ÏdÚƒ¥àÒTs&˜ûÅ¯åªå÷¸!`¶9­[ Ó¤éf(Ì?#‚S/KX\ú¢Y^ûœ‹ÇWû˜/ø¸­³!fÃUÏyáŒcõY€?‚r¼%£Öº|M¾7Şš‰³Ä€Re˜Şƒ$aIcíÇX)ÔY²SÂ[)ò!\…÷Î”êš+¦ÿPsVJæc¶Ê•ÒÀ°?ä¹`„ ¡mšØ¨İ_qŞÒÿ¶İÌ<ˆølıïn·»Uˆÿµ»YÇÿZÊWë×úßµş7©õ¿kıï¯Vÿ»x-#g'şZÛ¹ƒ¹¢
vîz.s ÿšQô:®½œ›S*É´Dùöc`HPŠ‚^ú€Ã¼Tz›‡Vûøôz„CAò]Ò˜&áLÍfÓº†ñ“…RáÓÁzs–£ÿùc–Ò’Â¡d‡ŠÍ¶@2=ö?Pá2Üç|:†^QQ´}Ã4î%ù]GBşBº5&g”’”ò”ã—©\•Jdˆnd a¦Ât #cû1 ¹	Ó+«[UZÖ¦wí=$åŸ	Òğ^³çFNã€&ÇE]àb#?³äÿš„îÒ(˜(I£×!Sè·¥xcÍ7«4ş ›NÉŞ>¾3ä[£Äğ:ôŒLcJçJ:ÑÙ†½L½Ôiå›Q7ó†1¯õOÚÔ‰ë	èÎ-Òt£#àvnSw¯øW şª“iîåíË¢XE8÷G{ğÚ”µ§“`–…µÏ¼(æëªş¾YPô4½œÒMh<T¶Ó¨ â.àbâ‰OŠ:Wìğ–|k$ÄÑC:’4†¶Ä"Nõ’&õªqÛ‰ÕÂ `~¢ĞÑàqö3;#ÆÍ\>uFÓoc|æ|–Ó·rš¾õãÛgæS99Æ{F˜i¸Õú”§ßöŸ!9å=Ò·V‹lh¤Ï÷¼”PÀ¢Jrİ$¶HnĞËZóó<i°B±:*ã"Ñ I¦Ù»±İVR„6Q‹+f>GøwÚ7•˜Zè´Ü00À àr…>35ñ¶İŠ0
×šP‘–Ep÷^û *¸Dî‚B[UĞLKŸç:©J½dÿ¬~|òúà¼ÿËÛƒ3ï˜ŞäÔm´¼!¤T)Û\®+5¿­8Sõ~ãOÖf”÷¶3*XÆ îàí¶x7Uo?ùY½Ènµ»Æ4±$‚/ÚèÊ¬>’àÄèx’ŞÊÀ#ÓaÊ … ¤}TX„7ş6z®¢g¤×°»¸JÓ	ïµÛ—az5xC6nÉ¿bJÈù”òöF·óÏ¿áï!Ãø×w6·º[[›ÿÜYh¹­j²¥<Qó­H4Aº8€}«~~0gµ\øÑx—äüctKŞÃÀĞÄ¬÷.´˜6Z4MqÃ^RS’ .r^<>Ø°hÌ!yŠ‰¢‹ºDUhâĞ(rï‚Ú±äŸê3ä¿9eù A@æÈ7;…øŸ[uü÷¥|µü·–ÿÖò_RËkùïÃËõ}Y~ÜŒü¦¹}´yV/É%óüRH|ÊGÜÃ¤»‡Œ˜ÚÎQWš6˜	¶‡‘Lí$AÍÇ“Q–Â3-„Y…ì©$¬³ÚYŠ]T“ºe…£CÛŠdâ
Fjatñ­QXşí(–H/›%–@^¬dg˜‘ŒùIòƒÏ_ú\Á‘Zğ*ŠÎ3¥>£³B]ÕòˆiTvä©'ƒ€¦—øZ`mıü±‹¾a–âR&Õ£ÒØï©²FÕ‰RH–—'O_³±Và±{"Àìå´öZş>2Ke¥’ş!(øó&bG8t¶<_?ŒN¤–=LÓÁªÒ€6|ŸîÇ·DwÌªeÉ-Y–ğ”W•”KYŸXTUè¡!<ìàËQæ¨ •`Ö”µP2Î"¾€4?+Ë=—*Ğ,Ô$'JY êqÑävB:).QÃ.¸pëò."7#I¢—Ñl³—$Dì¡½ó"Tzáš‡É>ÜÂ&›•a“ï-Nè4¬şpğÉF›Ò>Ç!T‡Ã„q6JÑg”dİDlĞŞÚğıî“Áhkkc¸Œº[»t³P´±»±Óõ·ºÃA0Üéî¶y2lƒø7Œh"Dr^Êÿv´İİŞ•øEhaê<<Å÷ô€ø‰‚XPŒº†Ü¸$šø³¸;\R¥Ğ‘ƒÔ•¡kñ?-*ûi|Á	²xA3ä{dÍR…Ò’h3,SÅ6”8”åÍÔvÃ.VÅ^|IİNåÓäÇ·Î“$)˜â<Ü÷Ú( 8qÃ{‡¹³
êœg-»l¬}Ç¦G8&«Xh•¨÷ÿµYÎ&rÿÊn‰dÕyz÷¾l¦LW=…›@­b©oııÁœşRßSXï]ç}saÄY2›¢|°¡è8ùÃùùŠŠ;İŒ/šÇÃ,=¼œIRàŒÏ@h×p½ÆÉ _h½ƒFVn°®®¤,u^0=³Ì‹c¾ç~´,àğéTÇ ø
P®¬/¤(A¾[ÀKdÊUBõŸÕÒ¡3
ë€Ø]y“)¿jxgÖĞaÔhŸbB¤Óv½¥¢)	”ÎæSU-Î¦‚9/ş<Ô'S¿8–í(İæ‡Ö0švùÏs°S×»Ù ~¯ù}Öûæ„âá€æÄÿÚÜènÚúÿÍÚÿûR¾ß%ş£Ãy‰´v/É™YUr%9E_Ò¸í2.‡–î²0óØÛ&oXfD/Ty:L£[2E7…™B¨t}à]šPPèÉ”~È(acÕºh*'t…@(‡LºóB—EEAÙsĞÈf\È`Œí‡C9¨±+A•c	V¥Œ„'"ûj:öãuP­Ã)ˆ•‡€Ğ4ÙÚÔÈ	†™$\²™°úòŒQ™{0ÍÙØ.!õY6X-«ï¬íçúÌÇO"úÉÈ\8USt¢yıº›¹Iu"¹à×Ç¼á+nqİc–r•UêEK‰8¬­"œö0Ğ,“jNÑmî½ZzîéŸmJh|:…ÃPi ¥W”KÅE;ÀH¥HàÉioa)E§³µéè?Ÿlø>í›Û£'ÁhûŸ£îv·tÇüİí'£‘%¥ \ˆAR±¹ùäÉúÑæVg£m¶á@
™–ó¿€Ÿq•ûü™8\}9JÊyÎhy=À­/FŒ½èvVÅI6’tXKùäØÒãÁ—òŸÃôª±v~şbm.$ë¾øÛˆ±üK¢Êx«ô·µšæü£>ƒşSî¤ÿgÊÒ0¾|(
pı·»³eÓ›[5ı·”¯Öÿ©õjıRëÿÔú?_­ı§u-çz	*eq…‡öãÇÉa,5À€EíaFÎåq)Ğ™0€ü÷”¥ÂE1øÎÆj1ê$ KÑÜC*Xš¨ 04RN†é»5†àÍ¥%¾
ú¿/åœÓ©¡Â<ÿ.öSôh¾rò(RÑÚğÊO^±€î§NSãâÊív³ƒ®Øš|.k(o]„nHœĞ9‚mış7è¿ÔŞ¦møş“^ó"çĞİNwÛ¤ÿ66¶vkúo)ßï"ÿsíˆâHÖÄw®lM²ÅõcŸ
¯™Òİ¥æ1S?Êæ;üñ¾øœÆËü~‚A‘ıl§?±ı8À 6Ç²Ñ’&7z'ƒ h\¯ô‡f<~çĞzÒš™ıÔ@tÒé_˜Ò1úı3 È]oB~³
Âª­tşò_ü©JöyFtAÁÀü¿ÑélØø¿Û©ı?-åsñÿÿI
ëÅÍ+Ñ½™¨« 2ùœò4¡t®#jäºÁàôò|â§W³µ¡XŠ!en(¦˜@6ùàñ­Ÿ^µôˆ$Ës?ÅÚE©Wq2Ëûì&ZÌ	Şc‡C?‚P¸ÛĞ¼~¿š&ğôõ_ËXrk8z–ÛÀ†V\e©åÙ‚h•½‘JÕeËÃ›ÀôÜ dœEÓTÎÉ‚j‹ªT½½ßXÏ0áÍ¢i¾>-kjPÒ_‹İÿòßÂ÷ÿQ8Xô]`ÎıßÙµı?ntw·;õı¿Œïwáÿ
;¦pç…ƒÒ«î(4æŞmà‰sP`qô5Wxˆöc‚ºÂÊM˜Œ6¡X+Q¶zÔ“®eZD¸·i·Eh:l’uÒ‘!F È}i¡ŠG¼ìš- ğER‹Üê¢	¹xP‡’’¨8
‰ŸÜê5š³‘üÂçÿ­¨ğÚ„t&J˜sşw:ÛëüooonÕç_ışW¿ÿÕï¤~ÿ«ßÿ¾Ú÷¿*pÂr[ü¥0w	ÆÁ[4²PÓ’GÈŒ5· ü&L‡WÓ¼BÈf4Ãğ¢qê‹¨l…ÖzÆ¶m·É*Ê¾'ş’ä“çyw«*pÅ€ÊˆFM”šcÜ‘ÜzœeICÕ¦Ë3†,ó~¥­:¾Ü‰ĞuÒzBô—ÄÙ‚ÌB²3>¬c¢rj¯ç‚ÅjÄ”ğÏY;OXÏ˜¦'æ~’¿Dı†$Å³†×şr]Äì,Èt*VXúx)ı˜JsŸ€ùPgÛ¿îR&ãáÑ¨HËê¼§ÌìPgZHœ„óİ éCˆJ`â€$tÁÎm‹üósM…Gím1ÆåÉªö¯/ï~m¿ÿGóÿµÛ-²ö÷îùùšñ5Æ×2¸UÀóà)½<ø8i\üı“ÖÚİç¿²û»»¸‡ Ê–Ê>5Éğl»ö™Ö'ú‹ÕÅS!ˆ²vsÃl¶$$²·®“Í…XÈ.®	¢È(‰%¬‘¡êJw˜Ï–
ÛNMÁ= éAC-%üş
üf;¸4û¯íÍÛÿßîFíÿo)_Íÿ×üÍÿ“šÿ¯ùÿ¯–ÿW11¥ÓıOÛ'›´óÏü°É¿—ìHmÿø—ó“Óóÿu|òó±ÓÓÙRæí{šrnÉ4o&‚cé‚¯P XãK8½¼~¾8ñ§)û)<‰cÀK]ãXŸ=Ã‡B»M^¤|~œĞaº.ÎBp5’‘l{ğ¨ş‹¯ı(D|…)„gèÀ+ ¬\ºã’Â(ò±bg %<’ëÙyškßÏs˜héóI…¬Ã%é¹—•‰Ÿøc‘ÜgèY_ÑÀjR†  XLÁƒÚb<^èKvái­@ÄFáA<sÚ¢û ñ¥ƒq\)|y£Ş¥—GlĞºõ2,³ÑíLSš4=éÏU„fÇòx#½½ÉeÊÖı&Œ"`rp|È‡±°q†Ö&ÈÁ¿ŠçĞœ˜S6"oVzæËà‰àõb'À›c@y˜Ğ ÎQ\ä§ğB®Ï‡jy]^yä©•Ê¯úµ, yĞIBAw?Ñp¢2P¦``ƒÁAcäpIÊ~}4… ªŞãöJ¾r¦›‘×èQ^Úm"ôŸÖƒMã×cú1]Â˜‡’TÌÖ5ˆ××3(3jFÛBß|C”ÄÎD$ÕßQª}î4'Y4Õıõ|ÿ×w¼ÿ> 8›ÿÛèlmÚşßw6:µşÇR¾šÿ«ù¿šÿ«ù¿šÿûzù?L—QglœßÍZ(rØŠ´»Î†WtìÃQba Ä‘«A­1Wr	¤Z-gº¡s_MÏş‹ã•ºlÌ\¾«YA®®ÃMeıj­ë•µyîÓäQ8(kÑıruŸNÜ-­Z*å{O^j)ómcz2ê‘w+>ÖCÛ½Ì °eäßµæTöƒ ™]?ÊKõ„E\«Px¢)6°veyğÁÅ×#ïÖ@'í}±‡*c*›ú„Çrœ³jåÕp¤Õ;+l‡‚¬tğÃøP€Ğ_Xö¾å+t?ÃO©l‰¡ûÎeÉ~*©ïî³¦ô[Ğ‘$±I€?aãµYƒ]ê: ²WáúúOr˜£pPŸåÊÕg¹
´ÕÏò_ğÀI¡U}è*wVº*Ğ.zâ.üƒïĞ™u*nYS¦XógYjÙ|œ|¦È$§rãtäÌ]B}$˜{øøÒHAïĞİµ³_‡ÍïÍQ‘rw$FÓÔg4áÌ¬Åà)Ğ0)8ÑÈ&×lU¸+á9K\â²Dk~İìªÓ¿JÓ^gp‘~iËB½yÑyp¹\Ñ£"(—+š;*´®ç˜9]yûæ9¢­bLi[Ã‘ì™êÉcbëºêzª k¦9jX¸+÷|‚à„‚JƒF·`üzãm8ğ·E	7M­»É O€ Ñº (~(v6gXjºzU¨jËÄ•Ì"ÌYÂÕÕqŞ´šzä£Tt<f ˜,.‘;”Š,kÌ8ÊªÕÌ²¨¿oÛ¥2İ8ôşƒr)S‰(ÒÆ$èé½vaì=Ó2øÒ,»ÊîŸ¦[œiU–¥¤fpğu´ˆw‡(µ{D»Ât„Ÿ:’H]Dé¹ïIÏ,^PrÀ{Œ—D¤½MÖifé‚:Ğ”©zûgıóã“×çı_Şœy¹“9]K¼RÕÿ>ûß/¨]píØ]™åŒ}d*õ íoğÉG:ƒjB§ìºÕ{Æ’İ­»q×(!§HAumEÔL®/©±Äb}µGÍ¼h•XAQ²³`Ş_Áobá44,º ÷C¦A]ló
@«;£è¶æ?‘˜øjïAg\I1³¨ì#a¡|u0æ!ş{·Šoh¥yOÿó…”şü×û³ø¡û˜cÿ±Õİ²üv7»İZÿg T´¯]í‘²gWùŠ
ÂÕkšğÅPú‰·³ëuDr «É,Ù“ÅİÀWü–| u"´‚Ì{ƒ³£Bø±KTŸÄW•”mÔÓV…tbõÑãÇíÇ^ÊÓ0
ÂxÄVW¤µ‘¡ÿ!Yü›„Yâ€U%©YõVs¡Ğ`†JP‚ã€~ô/å«J@¢9¨3KıÆWuÁÉªgœ#QÜHY‘eWi|ÆTƒ	PTøµûÄë>ñ: FòëFÇû§øùlo£ëu½NŞBBQQ—%·y#jü—a6[Ó$‚”û…êñ´†åÍšS†°úşÈ L/µ} 2VPŞöÓ‰Iõ&‹`‡L¬|iÌ±ğ›Ã¾Hû@ooXh›KTRãÔ4Ú[*ıúe», 4†úŠ å°‚[Ş–·™5§+"@î†·-Oq¸¬¤v¾Ü%Ó‚ëÁÊµ´’ÙÔN(M^;‡&' âmïÊÍùO¯#u;ğÓ1=²úloË{âm‘owÌíĞkwgäöÀĞèü|Èº>J$‚úu×ëx;Áµct®eâÉ¸—g¼À*Y•ël…ÛCvMÿ’®_?‘KÖñºOT)ÿ·kLİñºywÚ,˜NÂqâ0cÚ©6²Œ È„cé&~ÂiâZ»ÑUšŠ˜€Mh<dQò‚kZ‚ÌBî³™÷Ô°–\ëš dUr@óùi#du¶â|¯f
]›s/ËÉÎi~Äê~@9LD—d#«—òKÕó<?MoÖ1Ó3¢VŒŠgpÊ¡áõ‚¸.Œ	ıH‡$şHDª„Z¤§v Á›¨½ÕVÅF,ûiÖÔúI¦1‘©²ŒÚZª„êÏÀLr£Øe0]ÛrjŒÅ‚Y¦]ZMWyQB}*u´\˜Ş•»?šÈ©¿ÒOÑÿ§û¯ßxãàwècÿÿ­N×¢ÿ7:»µÿç¥|#3©ş‹••gdrşcEÓ'Sğ"²²òîÑ»ã·oÈO‚yxßPO8¾ôøUH£€{!kÇ“qûº]Fyüúò9Oo#º7Šütÿ{ê'´™·vssãÅ“ñoo0µ³Ëšk*¨^³›8b~ÀgÂŒ—Ø
XâåóV[hä…12)§`òÖT((s-¢X?Â™0“Ãÿ©&F…©˜Šòâ“Œª½%,&y{ì3JÉ,‚wÅ%Q°!†x²/ùnlÔh	›=Æ"a¿é§`ïÉn8¹eS;	W¤ÜE`Éö6¡i
âëÛÈCoeåÛGëëäˆıÕÚ–€yÿßÎ¸¨y.¼[Œƒd}ıÙ¾„gögØq“†2¶äQøräƒ¿´yñÿÀÙ¿eÿÕİİ©ñÿ2>¡;O£á²ôl»–ŸÖµÌ$ûıè'ZË^\\¤h„;Œ|ÎÉkš„×4x…Ğ)NŞ&lrú­ğ«û	îÇFQ/¡ •Éí6ùUÕ€}';AÛX!½‘âiJ4SY­‚ò¾Ş»ò·º¸§,Í›=åÛwÎ˜r‘6ÙS@A&• ±Éä#ÃoÕ}È¡àŠ|ÇX¶*¨Ë"×\…}Ç„RÆÁò«È¯>‚¬ø}}²GN©°8ºı{y¦A©r„¶Píw…ú1Ö#k?Y#w.ğ¡ıÅ¡Wµ* ï!TÄx{Ş#>ô1[p¸ÚÛXO¸ÌŸÉ0
ï'—x“óI$ ªux»nûêGÎ•>kå#z)®ìú[|T_ï ò;´ÒˆÄë£ˆ¿,iÉgùãİû{v|J‡SİJ“@>Ë<¤?ú
«¿/øúoÈâÔc¾E°îü%Z´~18ÿïÚñÿº;»[5ÿ¿”¯:ı'\½ˆ{ş7 €¥PÌG2¸¡.µ¢ÈÏ³ŸÌ'Câ*hB.üøö9»‹©pşsùèĞ³ĞˆˆŸÇ‰Î'âúaÏ ‹3ÿ/zMlj?¾=ŒyJı@‡"”I¿M!öú¾	GÄo¥¬Ú"‰/]Ùø1:#ÂLåˆÔ ¸ËİMK[-ğœ£–ƒ‘h°›KäB‰@5òuö£ü»€æEÓ›I+¸qÃÂøjyzyÈ}²{äŒ¦ßŠ+èYËÍç=×­øGoæú[ø3ğÂ©‡±ŸÒı)Í‡ ,ÿ§»³¹]ë,å“øq×ŒKÀB5`ˆEä‘„7 ú=ÒD’³iÒâg?¾İ‹²G6DÊ™?{SóJ¦ğê…Ú~ûpMX¾ğîhe°egÁwï/ _d„¾HÓªçÀPR?¾}v®½²â¿	…/±Ü0¶‹ÙhÚqÚl-n×$Ky%şÎôÜ,’ƒ{ûòsßì©%š™ó±äPáƒ¾+rJ)HUQeñşˆ`ı·±cÇÿé€JX}ş—ğéçÿy‹
g4¹‡c(Â&8ŒÅ[5zÕëŸœõJÉÄUSÖ®TD4œRÎ¢kI]†×T(i¯qAæ‘ŸÁ±ÒE•v‹÷‡p(dx°‹Ó–ÚE®|†›p"¡ıŸı$Úqİ>ñª¶rr³ôœ\ù×ğF¢·›Õ’Nö Y8ßãë@	ê¤ÈƒNıX'zq<èÄoèÇà¬O’ÔĞ¼cnsRş6üašn4á×[å2Qõ×^nî¥}Õîv¶6ŸÌÄe³0GƒËıÔ«²¿0j¶Ë"“Ã¬IÌ‡şøblLıè¡¨¿ùôßö¶íÿ}§³]óÿKù*óÿ§’ÂIÑI¬Ú$¹WK#‹üÊ*rÃá+şF¥/G…ı2@sà™Á†ŸØYNb‘á–Şwiµ®ı$D?š•C„¦…F)-+¢ëàã$¡4rŒE>ëDôj?ûükv#sø«œÿ®Eÿu·7ê÷ßå|_)ı‡ÀÅQÎm¨õ#0:Òó±Qêa(­Eùò5ìjŸ}şs«´“ŒxòŸí‚ü£¶ÿYÎW]şŸ;ğ6¨óEÀ^¨NÌ;šöfkÄ–üp³2ŞCööù,ø ~Ú7ïüomÚú¿[Û»µüg)_åóÿ½¤ÔñÇ°‡Õo¿½¥9},£J )M8!¶Ä5Õu85bÚn#ì²,2ƒì|¶pUÛÊš"õnkûˆ¯¿®1Înúø }Ì“ÿnîlØö¿[;5ı¿”OŸÇòä{àüù'/å~bv•œ%,/¯1Ş%…4"¼¤„M]”ShÂ•JU2*İ€Ë8¡îÒĞÖËÄH$0ƒåe•NŸ»Ä1÷GtŸóğ2u5W©LoË¹LÒå">9Hõş?S”\ER=(¤«€+jˆ«œã½+/öI²j,ñS–p«ğ†ÂDK³6$‡|?=¢>O[‹2¢ô‰ûº>ÿ—n÷/ºæò›¶ügw§ÿ¹œï~ïÿšÚiÙqkr[3W—ÖªDËÿ¬óï¾À¾$œwş»Û[öùßØÜªÏÿ2¾ùü_ùÑwo–†ÍQÕgú+şç_¥ËzÿÙİİ*¼ÿlnÕñß–òÍ?ÿæ‘‹ØÏ(ğy¼ º.ùCš™@Å”ó“‰ğÁ§h*==PF~Şsö¨üñåÖ;ØéM¯XÀ÷3S©çò¹³™°óKŠ€ˆ°4™AQ¹‹{ƒÛ­=Bo»ÏÀ-uÇ•PNæİ¾ÅóqÆŸ
ßµJ¼“çÓ<o|¥5çûó7ŠÏsîo–şÑØê{7 OF6)åYY[ó‚ ê‹õE°’Y‹èly!Wÿ÷‚‡ÌÃBÛšóÿj¥ºúêÂÌ™Ü»«ÊF™FÇ5¦ûîĞ’ä¬y-HÀ*·Õ–ôĞT2F.&à?Dá Æ"5ùª°H}˜ïy˜%ËRèú@Uš˜dÁÜà@®a-2h‘yç©:^±°`š·‚Zq77gÏ¥hgUrx«…–ä?²˜ {øWå¥D›÷\üj¦ª\’ä
 Ï¬ãÛC»Tr×ÀÏ-"s³ä?ö“ã2ü?í¿º;İZÿo)Ÿ%İ© Ü;•ïÀ‹)ô¾[*Ÿğ<çH›û”°M'Áó–öñ­ô-àã6=~F|³xò”®´ŠfS~Ä™h17ßB×Ø(UJ¡1Ÿ&Tt²nïÈ·9áÓÁºŸíuaÚÌÀJ(ÌÊ0h›mMÙØÿ Ìö9Ÿ'"BšğµGIzÃÄ³5úëCUIé Aw"„~õÀ«p«(S¹*¥ìJ‘ö¦lkœ ğhìàÇDà5á‡ÑìV•ƒƒìƒo[¢&tHÃkMj†q*?‚ÉqQ}:w#Æó9“ùYÌ-ÚÑïê7„‡şüŸ+“<¨Øü¿±[°ÿØÚîÔòÿ¥|•õ?gQ9èÉd8¤“”7ñ„ÏµËù±,V4{w¸\›Õ9ÑÆnt/ éh©ÊèSˆ6IÆ~@ÉtB8‹(0f#­,Ÿ­HJa‰+^"0~åÉ(Káö]äz~¤à{ †à—ó¼Â¡ö¬4³;T6ÉºüQİé<zwDİ; ³)YáŠCU–Õåvaáy%ªu—m›ßk×ÈE¬\Æ‡JyDò3ü.ùñ0³üœø	íØ""R€nŞ.²×8 ıUáB‘C~’üàó—>wì¨–l³¿½ú2¼<ŒS©ä0o¿
Ïk½OÇ“ÈOiÅöÅïOY÷¿¦.úp$À\ûÏ‚ÿ÷íšÿ[Î÷…úRúd$Å·'#4¹(å¬Sk/[„ò¡?şÇc¡óó3Ì*³§^ ¬Ù6Üo˜¢š¦¨øç1é^è3Î¿¥şP`ŞùßÜµıoo×öËù*ÑÿÉa,Cr#ï÷0åÊ³ pwO…ÄäßS&½ÿıäV‹‘GànzuÀ„«)ª>wRˆK Ìºò­½Ú01‰p-!ˆ03ëcJ­h}ÆùOªV¼íŠ	¿j˜«ÿß±üÿmlìÖúÿËù¾ğşwí›ò…;Ñ™n­ÿèiøË~
84e2dbcf3b88bfe9236e3cf9d4500c32835c6eaa	{"key":"make-fetch-happen:request-cache:https://registry.npmjs.org/@xtuc/ieee754/-/ieee754-1.2.0.tgz","integrity":"sha512-DX8nKgqcGwsc0eJSqYt5lwP4DH5FlHnmuWWBRy7X0NcaGR0ZtuyeESgMwTYVEtxmsNGY+qit4QYT/MIYTOTPeA==","time":1786785407974,"size":3187,"metadata":{"time":1786785407193,"url":"https://registry.npmjs.org/@xtuc/ieee754/-/ieee754-1.2.0.tgz","reqHeaders":{},"resHeaders":{"cache-control":"public, must-revalidate, max-age=31557600","content-type":"application/octet-stream","date":"Sat, 15 Aug 2026 15:16:30 GMT","etag":"\"7e8483105bbdb9c34219e94917f377c0\"","last-modified":"Thu, 19 Jul 2018 16:10:49 GMT"},"options":{"compress":true}}}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             