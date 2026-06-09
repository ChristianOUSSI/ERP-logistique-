'use client'

import Link from 'next/link'
import { Package, Users, FileText, Truck, Warehouse, ShoppingCart, Lock } from 'lucide-react'
import { PortIllustration } from '@/components/illustrations/PortIllustration'
import { ModuleLayout } from '@/components/layout/ModuleLayout'

export default function MagasinPage() {
  const menuItems = [
    {
      title: 'Clients',
      description: 'Gestion des profils clients',
      icon: Users,
      href: '/magasin/clients',
      color: 'bg-blue-500'
    },
    {
      title: 'Codes Article',
      description: 'Gestion des codes d\'article',
      icon: Package,
      href: '/magasin/articles',
      color: 'bg-green-500'
    },
    {
      title: 'Déclarations',
      description: 'Bill of Lading et déclarations',
      icon: FileText,
      href: '/magasin/declarations',
      color: 'bg-purple-500'
    },
    {
      title: 'Réceptions',
      description: 'Réception des marchandises',
      icon: Truck,
      href: '/magasin/receptions',
      color: 'bg-orange-500'
    },
    {
      title: 'Stocks',
      description: 'Vérification et gestion des stocks',
      icon: Warehouse,
      href: '/magasin/stocks',
      color: 'bg-cyan-500'
    },
    {
      title: 'Commandes',
      description: 'Commandes clients et livraisons',
      icon: ShoppingCart,
      href: '/magasin/commandes',
      color: 'bg-pink-500'
    },
    {
      title: 'Validation Paiements',
      description: 'Validation des paiements',
      icon: Lock,
      href: '/magasin/paiements',
      color: 'bg-red-500'
    }
  ]

  return (
    <ModuleLayout moduleName="magasin">
      <div className="container mx-auto p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">K-Magasin</h1>
            <p className="text-gray-600 mt-2">Système de gestion d'entrepôt</p>
          </div>
          <div className="w-32 h-20">
            <PortIllustration className="w-full h-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className={`absolute right-0 top-0 h-24 w-24 rounded-bl-full ${item.color} opacity-10 transition-all group-hover:opacity-20`} />
                <div className={`mb-4 inline-flex rounded-lg ${item.color} p-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </ModuleLayout>
  )
}
