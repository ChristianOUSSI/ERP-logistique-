'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MENU_ITEMS } from '@/lib/menu-config';

export default function ModuleSidebar() {
  const pathname = usePathname();

  const menuCategories = {
    'Operations': [
      { name: 'Dashboard', path: '/dashboard', icon: '📊' },
      { name: 'Magasin', path: '/magasin', icon: '📦' },
      { name: 'Transport', path: '/transport', icon: '🚚' },
      { name: 'Acconage', path: '/acconage', icon: '🚢' },
      { name: 'Transit', path: '/transit', icon: '📋' },
    ],
    'Finance': [
      { name: 'Finance', path: '/finance', icon: '💰' },
      { name: 'Paiements Locaux', path: '/paiement-local', icon: '💳' },
      { name: 'Fiscalité Cameroun', path: '/fiscalite-cameroun', icon: '📊' },
    ],
    'Cameroon': MENU_ITEMS,
    'Admin': [
      { name: 'Admin', path: '/admin', icon: '⚙️' },
      { name: 'Integration', path: '/integration', icon: '🔗' },
      { name: 'Intégration Cameroun', path: '/integration-cameroun', icon: '🇨🇲' },
    ],
  };

  return (
    <div className="w-64 bg-gray-900 text-white h-screen overflow-y-auto">
      <div className="p-4">
        <h1 className="text-xl font-bold text-yellow-500">EVO-LOG</h1>
        <p className="text-sm text-gray-400">ERP Logistique</p>
      </div>

      <nav className="mt-4">
        {Object.entries(menuCategories).map(([category, items]) => (
          <div key={category} className="mb-6">
            <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {category}
            </h3>
            {items.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center px-4 py-2 text-sm transition-colors ${
                  pathname === item.path
                    ? 'bg-yellow-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
        ))}
      </nav>
    </div>
  );
}
