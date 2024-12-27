'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { db } from '@/app/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { PencilIcon } from '@heroicons/react/24/outline';

interface Equipe {
  id: string;
  nomeEquipe: string;
  responsavel: string;
  email: string;
  telefone: string;
  codigoEquipe: string;
  cidade: string;
  estado: string;
  numeroPatinadoresAtivos: number;
}

export default function Dashboard() {
  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const { user, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const loadEquipesEPatinadores = async () => {
      if (!user) return;

      try {
        // Buscar equipes
        const equipesQuery = query(
          collection(db, 'equipes'),
          where('userId', '==', user.uid)
        );
        const equipesSnapshot = await getDocs(equipesQuery);
        const equipesData = equipesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          numeroPatinadoresAtivos: 0 // Inicializa com 0
        })) as Equipe[];

        // Buscar patinadores para cada equipe
        for (let equipe of equipesData) {
          const patinadoresQuery = query(
            collection(db, 'patinadores'),
            where('equipeId', '==', equipe.id)
          );
          const patinadoresSnapshot = await getDocs(patinadoresQuery);
          equipe.numeroPatinadoresAtivos = patinadoresSnapshot.size;
        }

        setEquipes(equipesData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    loadEquipesEPatinadores();
  }, [user]);

  const handleEditarEquipe = (equipeId: string) => {
    router.push(`/dashboard/editar-equipe/${equipeId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <img className="h-8 w-auto" src="/logo.png" alt="Logo" />
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => signOut()}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <div className="space-x-4">
              <button
                onClick={() => router.push('/dashboard/cadastrar-equipe')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Cadastrar Equipe
              </button>
              <button
                onClick={() => router.push('/dashboard/cadastrar-patinador')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Cadastrar Patinador
              </button>
              <button
                onClick={() => router.push('/dashboard/cadastrar-juiz')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Cadastrar Juiz
              </button>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {equipes.map((equipe) => (
                <li key={equipe.id}>
                  <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-medium text-blue-600 truncate">
                          {equipe.nomeEquipe} - {equipe.codigoEquipe}
                        </p>
                        <button
                          onClick={() => handleEditarEquipe(equipe.id)}
                          className="ml-2 p-1 text-gray-400 hover:text-blue-600"
                          title="Editar equipe"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          Responsável: {equipe.responsavel}
                        </p>
                        <p className="text-sm text-gray-600">
                          Email: {equipe.email} | Telefone: {equipe.telefone}
                        </p>
                        <p className="text-sm text-gray-600">
                          Localização: {equipe.cidade}, {equipe.estado}
                        </p>
                        <p className="text-sm font-semibold text-blue-600 mt-2">
                          Patinadores Ativos: {equipe.numeroPatinadoresAtivos}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
              {equipes.length === 0 && (
                <li>
                  <div className="px-4 py-4 text-center text-gray-500">
                    Nenhuma equipe cadastrada ainda.
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 