'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Modalidade {
  id: string;
  nomeModalidade: string;
  codigoModalidade: string;
  status: 'ATIVO' | 'INATIVO';
  dataCadastro: string;
}

export default function ListaModalidades() {
  const [modalidades, setModalidades] = useState<Modalidade[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    carregarModalidades();
  }, []);

  const carregarModalidades = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'modalidades'));
      const modalidadesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Modalidade[];
      
      // Ordenar por nome
      modalidadesData.sort((a, b) => a.nomeModalidade.localeCompare(b.nomeModalidade));
      setModalidades(modalidadesData);
    } catch (error) {
      console.error('Erro ao carregar modalidades:', error);
      toast.error('Erro ao carregar modalidades');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletar = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta modalidade?')) {
      try {
        await deleteDoc(doc(db, 'modalidades', id));
        toast.success('Modalidade excluída com sucesso!');
        carregarModalidades();
      } catch (error) {
        console.error('Erro ao excluir modalidade:', error);
        toast.error('Erro ao excluir modalidade');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Carregando modalidades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Lista de Modalidades</h1>
          <button
            onClick={() => router.push('/dashboard/cadastrar-modalidade')}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Cadastrar Nova Modalidade
          </button>
        </div>

        {modalidades.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhuma modalidade cadastrada.</p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome da Modalidade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Código
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
                  {modalidades.map((modalidade) => (
                    <tr key={modalidade.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {modalidade.nomeModalidade}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {modalidade.codigoModalidade}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          modalidade.status === 'ATIVO' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {modalidade.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(modalidade.dataCadastro).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => router.push(`/dashboard/editar-modalidade/${modalidade.id}`)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeletar(modalidade.id)}
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