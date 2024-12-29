'use client';
import { useState, useEffect } from 'react';
import { db } from '@/app/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Juiz {
  id: string;
  nomeCompleto: string;
  cpf: string;
  nivelAvaliacao: string;
  cidade: string;
  estado: string;
  telefone: string;
  email: string;
  status: string;
}

export default function ListaJuizes() {
  const [juizes, setJuizes] = useState<Juiz[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const carregarJuizes = async () => {
      try {
        const juizesRef = collection(db, 'juizes');
        const q = query(juizesRef, where('status', '==', 'ativo'));
        const querySnapshot = await getDocs(q);
        
        const juizesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Juiz[];

        // Ordenar por nome
        juizesData.sort((a, b) => a.nomeCompleto.localeCompare(b.nomeCompleto));
        setJuizes(juizesData);
      } catch (error) {
        console.error('Erro ao carregar juízes:', error);
        toast.error('Erro ao carregar lista de juízes');
      } finally {
        setLoading(false);
      }
    };

    carregarJuizes();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Carregando juízes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Lista de Juízes</h1>
          <button
            onClick={() => router.push('/dashboard/cadastrar-juiz')}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Cadastrar Novo Juiz
          </button>
        </div>

        {juizes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum juiz cadastrado.</p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CPF
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nível
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cidade/Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {juizes.map((juiz) => (
                    <tr key={juiz.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {juiz.nomeCompleto}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{juiz.cpf}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{juiz.nivelAvaliacao}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {juiz.cidade}/{juiz.estado}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          <div>{juiz.email}</div>
                          <div>{juiz.telefone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => router.push(`/dashboard/editar-juiz/${juiz.cpf}`)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Editar
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