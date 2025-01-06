'use client';

import ProtectedRoute from '@/src/components/ProtectedRoute';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { 
  UserCircleIcon, 
  UsersIcon, 
  UserGroupIcon, 
  ScaleIcon,
  TrophyIcon,
  TagIcon,
  ClipboardDocumentListIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const menuItems = [
    { href: '/dashboard', icon: UsersIcon, text: 'Dashboard' },
    { href: '/dashboard/equipes', icon: UserGroupIcon, text: 'Equipes' },
    { href: '/dashboard/juizes', icon: ScaleIcon, text: 'Juízes' },
    { href: '/dashboard/patinadores', icon: UserCircleIcon, text: 'Patinadores' },
    { href: '/dashboard/torneios', icon: TrophyIcon, text: 'Torneios' },
    { href: '/dashboard/modalidades', icon: TagIcon, text: 'Modalidades' },
    { href: '/dashboard/categorias', icon: TagIcon, text: 'Categorias' }
  ];

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        {/* Botão do Menu Mobile */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md md:hidden"
        >
          {isSidebarOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>

        {/* Overlay para dispositivos móveis */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0
        `}>
          <div className="p-6">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center space-x-2 p-2 rounded-md transition-colors
                    ${pathname === item.href ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'}
                  `}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.text}</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 bg-gray-100 md:ml-64">
          <div className="p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 