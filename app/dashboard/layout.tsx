'use client';

import ProtectedRoute from '@/src/components/ProtectedRoute';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  UserCircleIcon, 
  UsersIcon, 
  UserGroupIcon, 
  ScaleIcon,
  TrophyIcon,
  UserPlusIcon 
} from '@heroicons/react/24/outline';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 text-white p-6">
          <nav className="space-y-2">
            <Link 
              href="/dashboard"
              className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded-md"
            >
              <UsersIcon className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link 
              href="/dashboard/cadastrar-equipe"
              className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded-md"
            >
              <UserGroupIcon className="h-5 w-5" />
              <span>Cadastrar Equipe</span>
            </Link>
            <Link 
              href="/dashboard/cadastrar-juiz"
              className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded-md"
            >
              <ScaleIcon className="h-5 w-5" />
              <span>Cadastrar Juiz</span>
            </Link>
            <Link 
              href="/dashboard/cadastrar-patinador"
              className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded-md"
            >
              <UserCircleIcon className="h-5 w-5" />
              <span>Cadastrar Patinador</span>
            </Link>
            <Link 
              href="/dashboard/cadastrar-prova"
              className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded-md"
            >
              <TrophyIcon className="h-5 w-5" />
              <span>Cadastrar Prova</span>
            </Link>
            <Link
              href="/dashboard/juizes"
              className={`flex items-center p-2 rounded-lg hover:bg-gray-100 ${
                pathname === '/dashboard/juizes' ? 'bg-gray-100' : ''
              }`}
            >
              <UserGroupIcon className="h-6 w-6 text-gray-600" />
              <span className="ml-3">Juízes</span>
            </Link>
            <Link
              href="/dashboard/cadastrar-juiz"
              className={`flex items-center p-2 rounded-lg hover:bg-gray-100 ${
                pathname === '/dashboard/cadastrar-juiz' ? 'bg-gray-100' : ''
              }`}
            >
              <UserPlusIcon className="h-6 w-6 text-gray-600" />
              <span className="ml-3">Cadastrar Juiz</span>
            </Link>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 bg-gray-100">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
} 