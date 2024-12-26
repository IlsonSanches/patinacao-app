'use client';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#00A3FF] p-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/logo.png" alt="GP Logo" className="h-12" />
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => router.push('/dashboard/cadastrar-equipe')}
            className="text-white hover:text-blue-100"
          >
            Cadastrar Equipe
          </button>
          <button 
            onClick={logout}
            className="text-white hover:text-blue-100"
          >
            Sair
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-8">
        <h1>Dashboard em construção...</h1>
      </main>
    </div>
  )
} 