import { ReactNode } from 'react';
import ModuleSidebar from '@/components/layout/ModuleSidebar';
import ModuleHeader from '@/components/layout/ModuleHeader';

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <ModuleSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <ModuleHeader />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
