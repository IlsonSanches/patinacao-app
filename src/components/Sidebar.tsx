'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  UserCircleIcon, 
  UsersIcon, 
  UserGroupIcon, 
  ScaleIcon,
  TrophyIcon,
  BuildingOfficeIcon,
  ClipboardDocumentListIcon,
  TagIcon
} from '@heroicons/react/24/outline';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-white text-black">
      <div className="p-4">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-black">Sistema de Patinação</h2>
        </div>
        <nav className="space-y-1">
          <Link 
            href="/dashboard"
            className={`flex items-center px-4 py-3 text-black hover:bg-gray-100 transition-colors ${
              pathname === '/dashboard' ? 'bg-gray-200 font-semibold' : ''
            }`}
          >
            <UsersIcon className="h-5 w-5 mr-3" />
            <span>Dashboard</span>
          </Link>
          <Link 
            href="/dashboard/cadastrar-equipe"
            className={`flex items-center px-4 py-3 text-black hover:bg-gray-100 transition-colors ${
              pathname === '/dashboard/cadastrar-equipe' ? 'bg-gray-200 font-semibold' : ''
            }`}
          >
            <UserGroupIcon className="h-5 w-5 mr-3" />
            <span>Cadastrar Equipe</span>
          </Link>
          <Link 
            href="/dashboard/cadastrar-patinador"
            className={`flex items-center px-4 py-3 text-black hover:bg-gray-100 transition-colors ${
              pathname === '/dashboard/cadastrar-patinador' ? 'bg-gray-200 font-semibold' : ''
            }`}
          >
            <UserCircleIcon className="h-5 w-5 mr-3" />
            <span>Cadastrar Patinador</span>
          </Link>
          <Link 
            href="/dashboard/cadastrar-torneio"
            className={`flex items-center px-4 py-3 text-black hover:bg-gray-100 transition-colors ${
              pathname === '/dashboard/cadastrar-torneio' ? 'bg-gray-200 font-semibold' : ''
            }`}
          >
            <TrophyIcon className="h-5 w-5 mr-3" />
            <span>Cadastrar Torneio</span>
          </Link>
          <Link 
            href="/dashboard/cadastrar-modalidade"
            className={`flex items-center px-4 py-3 text-black hover:bg-gray-100 transition-colors ${
              pathname === '/dashboard/cadastrar-modalidade' ? 'bg-gray-200 font-semibold' : ''
            }`}
          >
            <TagIcon className="h-5 w-5 mr-3" />
            <span>Cadastrar Modalidade</span>
          </Link>
          <Link
            href="/dashboard/juizes"
            className={`flex items-center px-4 py-3 text-black hover:bg-gray-100 transition-colors ${
              pathname === '/dashboard/juizes' ? 'bg-gray-200 font-semibold' : ''
            }`}
          >
            <ScaleIcon className="h-5 w-5 mr-3" />
            <span>Juízes</span>
          </Link>
          <Link
            href="/dashboard/equipes"
            className={`flex items-center px-4 py-3 text-black hover:bg-gray-100 transition-colors ${
              pathname === '/dashboard/equipes' ? 'bg-gray-200 font-semibold' : ''
            }`}
          >
            <BuildingOfficeIcon className="h-5 w-5 mr-3" />
            <span>Equipes</span>
          </Link>
          <Link
            href="/dashboard/torneios"
            className={`flex items-center px-4 py-3 text-black hover:bg-gray-100 transition-colors ${
              pathname === '/dashboard/torneios' ? 'bg-gray-200 font-semibold' : ''
            }`}
          >
            <ClipboardDocumentListIcon className="h-5 w-5 mr-3" />
            <span>Torneios</span>
          </Link>
          <Link
            href="/dashboard/modalidades"
            className={`flex items-center px-4 py-3 text-black hover:bg-gray-100 transition-colors ${
              pathname === '/dashboard/modalidades' ? 'bg-gray-200 font-semibold' : ''
            }`}
          >
            <TagIcon className="h-5 w-5 mr-3" />
            <span>Modalidades</span>
          </Link>
        </nav>
      </div>
    </aside>
  );
}