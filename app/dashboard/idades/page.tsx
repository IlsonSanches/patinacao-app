'use client';
import { useState, useEffect } from 'react';
import { db } from '@/app/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { FaEdit, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface Idade {
  id: string;
  codIdade: string;
  categoriaId: string;
  categoriaNome: string;
}

export default function ListaIdades() {
  const [idades, setIdades] = useState<Idade[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const carregarIdades = async () => {
      try {
        const idadesSnapshot = await getDocs(collection(db, 'idades'));
        const idadesData = idadesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Idade[];

        // Ordenar por código da idade com verificação de segurança
        idadesData.sort((a, b) => {
          const codA = a.codIdade || '';
          const codB = b.codIdade || '';
          return codA.localeCompare(codB);
        });

        setIdades(idadesData);
      } catch (error) {
        console.error('Erro ao carregar idades:', error);
        toast.error('Erro ao carregar idades');
      } finally {
        setLoading(false);
      }
    };

    carregarIdades();
  }, []);

  const handleExcluir = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta idade?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'idades', id));
      setIdades(idades.filter(idade => idade.id !== id));
      toast.success('Idade excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir idade:', error);
      toast.error('Erro ao excluir idade');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Idades
          </h1>

          <button
            onClick={() => router.push('/dashboard/cadastrar-idade')}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Nova Idade
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código/Idade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {idades.map((idade) => (
                <tr key={idade.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {idade.codIdade}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {idade.categoriaNome}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => router.push(`/dashboard/editar-idade/${idade.id}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleExcluir(idade.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 