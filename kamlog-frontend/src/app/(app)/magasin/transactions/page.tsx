'use client'

import { TransactionSearch } from '@/components/magasin/TransactionSearch'
import { OperationCancel } from '@/components/magasin/OperationCancel'
import { ModuleLayout } from '@/components/layout/ModuleLayout'

export default function TransactionsPage() {
  return (
    <ModuleLayout moduleName="magasin">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Transactions et Opérations</h1>
          <p className="text-gray-600">Gérez les transactions et annulez les opérations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TransactionSearch />
          <OperationCancel />
        </div>
      </div>
    </ModuleLayout>
  )
}
