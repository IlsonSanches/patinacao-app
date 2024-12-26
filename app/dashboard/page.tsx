'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { db } from '@/app/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

interface Equipe {
  id: string;
  nomeEquipe: string;
  email: string;
  createdAt: string;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEquipes = async () => {
      if (!user) return;
      
      try {
        const q = query(
          collection(db, 'equipes'),
          where('userId', '==', user.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const equipesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Equipe[];
        
        setEquipes(equipesData);
      } catch (error) {
        console.error('Erro ao carregar equipes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEquipes();
  }, [user]);

  return (
    <div className="min-h-screen bg-white">
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

      <main className="container mx-auto p-8">
        <h1 className="text-2xl font-bold text-[#1B224B] mb-6">
          Minhas Equipes
        </h1>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : equipes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Você ainda não cadastrou nenhuma equipe.</p>
            <button
              onClick={() => router.push('/dashboard/cadastrar-equipe')}
              className="mt-4 bg-[#00A3FF] text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Cadastrar Primeira Equipe
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipes.map((equipe) => (
              <div 
                key={equipe.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold text-[#1B224B] mb-2">
                  {equipe.nomeEquipe}
                </h3>
                <p className="text-gray-600 mb-4">{equipe.email}</p>
                <div className="flex justify-end">
                  <button
                    onClick={() => router.push(`/dashboard/equipe/${equipe.id}`)}
                    className="text-[#00A3FF] hover:text-blue-700"
                  >
                    Ver Detalhes
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 