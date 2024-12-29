'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { 
  UserGroupIcon, 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  UserIcon,
  PencilSquareIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Equipe {
  id: string;
  nomeEquipe: string;
  cidade: string;
  estado: string;
  responsavel: string;
  telefone: string;
  email: string;
  dataCadastro: string;
  status: string;
  totalPatinadores?: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPatinadores, setTotalPatinadores] = useState(0);
  const [equipeDeletando, setEquipeDeletando] = useState<string | null>(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Carregar equipes
        const equipesRef = collection(db, 'equipes');
        const equipesQuery = query(equipesRef, orderBy('dataCadastro', 'desc'));
        const equipesSnapshot = await getDocs(equipesQuery);
        const equipesData = equipesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Equipe[];

        // Carregar patinadores para cada equipe
        const patinadoresRef = collection(db, 'patinadores');
        let totalGeralPatinadores = 0;

        const equipesComPatinadores = await Promise.all(
          equipesData.map(async (equipe) => {
            const patinadoresQuery = query(patinadoresRef, where('equipeId', '==', equipe.id));
            const patinadoresSnapshot = await getDocs(patinadoresQuery);
            const totalEquipePatinadores = patinadoresSnapshot.size;
            
            totalGeralPatinadores += totalEquipePatinadores;

            return {
              ...equipe,
              totalPatinadores: totalEquipePatinadores
            };
          })
        );

        setEquipes(equipesComPatinadores);
        setTotalPatinadores(totalGeralPatinadores);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    carregarDados();
  }, []);

  const handleEditarEquipe = (equipeId: string) => {
    router.push(`/dashboard/editar-equipe/${equipeId}`);
  };

  const handleDeletarEquipe = async (equipeId: string, nomeEquipe: string) => {
    if (window.confirm(`Tem certeza que deseja deletar a equipe "${nomeEquipe}"? Esta ação não pode ser desfeita.`)) {
      try {
        setEquipeDeletando(equipeId);
        
        // Verificar se existem patinadores vinculados
        const patinadoresRef = collection(db, 'patinadores');
        const patinadoresQuery = query(patinadoresRef, where('equipeId', '==', equipeId));
        const patinadoresSnapshot = await getDocs(patinadoresQuery);
        
        if (!patinadoresSnapshot.empty) {
          toast.error('Não é possível deletar esta equipe pois existem patinadores vinculados a ela.');
          return;
        }

        // Deletar a equipe
        await deleteDoc(doc(db, 'equipes', equipeId));
        
        // Atualizar a lista de equipes
        setEquipes(equipes.filter(equipe => equipe.id !== equipeId));
        toast.success('Equipe deletada com sucesso!');
      } catch (error) {
        console.error('Erro ao deletar equipe:', error);
        toast.error('Erro ao deletar equipe. Tente novamente.');
      } finally {
        setEquipeDeletando(null);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Visão geral das equipes e patinadores</p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <h2 className="text-lg font-semibold">Total de Equipes</h2>
              <p className="text-3xl font-bold text-blue-600">{equipes.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <UserIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <h2 className="text-lg font-semibold">Total de Patinadores</h2>
              <p className="text-3xl font-bold text-purple-600">{totalPatinadores}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <h2 className="text-lg font-semibold">Média de Patinadores/Equipe</h2>
              <p className="text-3xl font-bold text-green-600">
                {equipes.length > 0 ? Math.round(totalPatinadores / equipes.length) : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Equipes */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Equipes Cadastradas</h2>
        </div>
        
        <div className="divide-y">
          {equipes.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Nenhuma equipe cadastrada ainda.
            </div>
          ) : (
            equipes.map((equipe) => (
              <div key={equipe.id} className="p-6 hover:bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {equipe.nomeEquipe}
                      </h3>
                      <span className="ml-3 bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                        {equipe.totalPatinadores || 0} patinadores
                      </span>
                      <span className="ml-2 bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                        {equipe.codigoEquipe}
                      </span>
                    </div>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center text-gray-600">
                        <MapPinIcon className="h-5 w-5 mr-2" />
                        {equipe.cidade}, {equipe.estado}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <UserGroupIcon className="h-5 w-5 mr-2" />
                        Responsável: {equipe.responsavel}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <PhoneIcon className="h-5 w-5 mr-2" />
                        {equipe.telefone}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <EnvelopeIcon className="h-5 w-5 mr-2" />
                        {equipe.email}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-2">
                    <button
                      onClick={() => handleEditarEquipe(equipe.id)}
                      className="flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
                    >
                      <PencilSquareIcon className="h-4 w-4 mr-1" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeletarEquipe(equipe.id, equipe.nomeEquipe)}
                      disabled={equipeDeletando === equipe.id}
                      className="flex items-center justify-center px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 disabled:opacity-50"
                    >
                      {equipeDeletando === equipe.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-700"></div>
                      ) : (
                        <>
                          <TrashIcon className="h-4 w-4 mr-1" />
                          Deletar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 