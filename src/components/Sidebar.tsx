'use client';

import { useRouter } from 'next/navigation';
import {
  HomeIcon,
  UserGroupIcon,
  TrophyIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

type MenuItem = {
  name: string;
  icon: React.ElementType;
  path: string;
};

const menuItems: MenuItem[] = [
  { name: 'Início', icon: HomeIcon, path: '/dashboard' },
  { name: 'Participantes', icon: UserGroupIcon, path: '/dashboard/participantes' },
  { name: 'Competições', icon: TrophyIcon, path: '/dashboard/competicoes' },
  { name: 'Avaliações', icon: ClipboardDocumentListIcon, path: '/dashboard/avaliacoes' },
  { name: 'Resultados', icon: ChartBarIcon, path: '/dashboard/resultados' },
  { name: 'Configurações', icon: Cog6ToothIcon, path: '/dashboard/configuracoes' },
];

export default function Sidebar() {
  const router = useRouter();

  return (
    <div className="h-full w-64 bg-gray-800 text-white">
      <div className="p-4">
        <h2 className="text-xl font-bold">Sistema de Patinação</h2>
      </div>
      <nav className="mt-4">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => router.push(item.path)}
            className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          >
            <item.icon className="h-5 w-5 mr-3" />
            <span>{item.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
} 