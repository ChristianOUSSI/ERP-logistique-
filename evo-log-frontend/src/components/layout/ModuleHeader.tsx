'use client';

import { useState } from 'react';

export default function ModuleHeader() {
  const [user, setUser] = useState({ name: 'Admin', role: 'Super Admin' });

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">EVO-LOG</h1>
          <p className="text-sm text-gray-500">ERP Logistique Portuaire</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.role}</p>
          </div>
          <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
            {user.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}
