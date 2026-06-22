'use client'

import { useState } from 'react'
import { Search, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

interface Transaction {
  code_transaction: string
  nom: string
  description: string
  interface: string
}

const transactions: Transaction[] = [
  { code_transaction: 'KC34', nom: 'Création profil client', description: 'Création d\'un nouveau profil client', interface: '/magasin/clients/create' },
  { code_transaction: 'KM24', nom: 'Réception marchandise', description: 'Réception de marchandises dans un magasin', interface: '/magasin/receptions/create' },
  { code_transaction: 'KM01', nom: 'Visualisation stock par client', description: 'Visualisation du stock par client', interface: '/magasin/stocks/client' },
  { code_transaction: 'KM22', nom: 'Visualisation stock général', description: 'Visualisation du stock général tous magasins', interface: '/magasin/stocks' },
  { code_transaction: 'KM32', nom: 'Taux d\'occupation magasin', description: 'Visualisation du taux d\'occupation des magasins', interface: '/magasin/occupation' },
  { code_transaction: 'KT10', nom: 'Déclaration conteneur', description: 'Déclaration des conteneurs à venir', interface: '/magasin/declarations/create' },
  { code_transaction: 'KT32', nom: 'Lecture marchandises à arriver', description: 'Consultation des marchandises déclarées', interface: '/magasin/declarations' },
  { code_transaction: 'KA01', nom: 'Création article', description: 'Création d\'un nouvel article', interface: '/magasin/articles/create' },
  { code_transaction: 'KA02', nom: 'Recherche article', description: 'Recherche d\'articles par code ou nom', interface: '/magasin/articles' },
  { code_transaction: 'KO01', nom: 'Annulation opération', description: 'Annulation d\'une opération par numéro d\'OT', interface: '/magasin/operations/cancel' },
]

export function TransactionSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [showResults, setShowResults] = useState(false)

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    if (value.length >= 2) {
      const filtered = transactions.filter(
        (t) =>
          t.code_transaction.toLowerCase().includes(value.toLowerCase()) ||
          t.nom.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredTransactions(filtered)
      setShowResults(true)
    } else {
      setShowResults(false)
    }
  }

  const handleSelect = (transaction: Transaction) => {
    window.location.href = transaction.interface
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const exactMatch = transactions.find(
      (t) => t.code_transaction.toLowerCase() === searchTerm.toLowerCase()
    )
    if (exactMatch) {
      handleSelect(exactMatch)
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Tapez une transaction (ex: KM24, KT10...)"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" size="icon">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {showResults && filteredTransactions.length > 0 && (
          <div className="border rounded-lg overflow-hidden">
            {filteredTransactions.map((transaction) => (
              <button
                key={transaction.code_transaction}
                type="button"
                onClick={() => handleSelect(transaction)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b last:border-b-0 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">
                      {transaction.code_transaction} - {transaction.nom}
                    </div>
                    <div className="text-sm text-gray-600">{transaction.description}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        )}

        {showResults && filteredTransactions.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            Aucune transaction trouvée pour "{searchTerm}"
          </div>
        )}
      </form>
    </Card>
  )
}
