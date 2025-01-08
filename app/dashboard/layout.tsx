'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { IconType } from 'react-icons';
import {
  FaGavel,
  FaSkating,
  FaUsers,
  FaMedal,
  FaLayerGroup,
  FaChild,
  FaTrophy,
  FaClipboardList
} from 'react-icons/fa';

interface MenuItem {
  text: string;
  href: string;
  icon: IconType;
}

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  const menuItems: MenuItem[] = [
    {
      text: 'Juízes',
      href: '/dashboard/juizes',
      icon: FaGavel
    },
    {
      text: 'Patinadores',
      href: '/dashboard/patinadores',
      icon: FaSkating
    },
    {
      text: 'Equipes',
      href: '/dashboard/equipes',
      icon: FaUsers
    },
    {
      text: 'Modalidades',
      href: '/dashboard/modalidades',
      icon: FaMedal
    },
    {
      text: 'Categorias',
      href: '/dashboard/categorias',
      icon: FaLayerGroup
    },
    {
      text: 'Faixas de Idade',
      href: '/dashboard/idades',
      icon: FaChild
    },
    {
      text: 'Exercícios Obrigatórios',
      href: '/dashboard/obrigatorios',
      icon: FaClipboardList
    },
    {
      text: 'Torneios',
      href: '/dashboard/torneios',
      icon: FaTrophy
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 w-64 h-screen transition-transform
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-800">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center p-2 text-base rounded-lg
                    ${
                      pathname === item.href
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="ml-3">{item.text}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-gray-900 bg-opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="md:ml-64">
        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-white shadow-sm">
          <div className="px-4 py-2 flex justify-between items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 md:hidden"
            >
              {isSidebarOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
            <div className="text-gray-600">
              {user?.email}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="min-h-screen bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
} 