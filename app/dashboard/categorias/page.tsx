'use client';
import { useState, useEffect } from 'react';
import { db } from '@/app/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Categoria {
  id: string;
  categoria: string;
  codigoCategoria: string;
  modalidade: string;
  dataCadastro: string;
}

export default function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [modalidades, setModalidades] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [modalidadesSnapshot, categoriasSnapshot] = await Promise.all([
          getDocs(collection(db, 'modalidades')),
          getDocs(collection(db, 'categorias'))
        ]);

        const modalidadesMap: Record<string, string> = {};
        modalidadesSnapshot.docs.forEach(doc => {
          modalidadesMap[doc.id] = doc.data().nomeModalidade;
        });
        setModalidades(modalidadesMap);

        const categoriasData = categoriasSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Categoria[];

        // Ordenar categorias por nome
        categoriasData.sort((a, b) => a.categoria.localeCompare(b.categoria));
        
        setCategorias(categoriasData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        toast.error('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        await deleteDoc(doc(db, 'categorias', id));
        setCategorias(prev => prev.filter(cat => cat.id !== id));
        toast.success('Categoria excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir categoria:', error);
        toast.error('Erro ao excluir categoria');
      }
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Categorias
          </h1>
          <button
            onClick={() => router.push('/dashboard/cadastrar-categoria')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Nova Categoria
          </button>
        </div>

        {categorias.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
            Nenhuma categoria cadastrada
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Modalidade
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categorias.map((categoria) => (
                  <tr key={categoria.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{categoria.categoria}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{categoria.codigoCategoria}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {modalidades[categoria.modalidade] || 'Não definida'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => router.push(`/dashboard/editar-categoria/${categoria.id}`)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(categoria.id)}
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
        )}
      </div>
    </div>
  );
} 