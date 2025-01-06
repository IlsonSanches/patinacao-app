'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Torneio {
  id: string;
  nomeTorneio: string;
  dataInicio: string;
  dataFim: string;
  cidade: string;
  estado: string;
  status: 'ATIVO' | 'INATIVO';
  dataCadastro: string;
}

export default function ListaTorneios() {
  const [torneios, setTorneios] = useState<Torneio[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    carregarTorneios();
  }, []);

  const carregarTorneios = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'torneios'));
      const torneiosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Torneio[];
      
      // Ordenar por data de início
      torneiosData.sort((a, b) => new Date(b.dataInicio).getTime() - new Date(a.dataInicio).getTime());
      setTorneios(torneiosData);
    } catch (error) {
      console.error('Erro ao carregar torneios:', error);
      toast.error('Erro ao carregar torneios');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletar = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este torneio?')) {
      try {
        await deleteDoc(doc(db, 'torneios', id));
        toast.success('Torneio excluído com sucesso!');
        carregarTorneios();
      } catch (error) {
        console.error('Erro ao excluir torneio:', error);
        toast.error('Erro ao excluir torneio');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Carregando torneios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Lista de Torneios</h1>
          <button
            onClick={() => router.push('/dashboard/cadastrar-torneio')}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Cadastrar Novo Torneio
          </button>
        </div>

        {torneios.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum torneio cadastrado.</p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome do Torneio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Período
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Local
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data de Cadastro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {torneios.map((torneio) => (
                    <tr key={torneio.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {torneio.nomeTorneio}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(torneio.dataInicio).toLocaleDateString('pt-BR')} a {new Date(torneio.dataFim).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {torneio.cidade}/{torneio.estado}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          torneio.status === 'ATIVO' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {torneio.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(torneio.dataCadastro).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => router.push(`/dashboard/editar-torneio/${torneio.id}`)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeletar(torneio.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}