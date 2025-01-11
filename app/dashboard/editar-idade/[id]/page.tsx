'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { db } from '@/app/firebase';
import { doc, getDoc, updateDoc, getDocs, collection } from 'firebase/firestore';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';

interface Categoria {
  id: string;
  categoria: string;
}

export default function EditarIdade() {
  const router = useRouter();
  const params = useParams();
  const idadeId = params?.id as string;
  const { user } = useAuth();
  
  const [codIdade, setCodIdade] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDados, setLoadingDados] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      if (!idadeId) {
        toast.error('ID da idade não encontrado');
        router.push('/dashboard/idades');
        return;
      }

      try {
        setLoadingDados(true);

        // Carregar categorias
        const categoriasSnapshot = await getDocs(collection(db, 'categorias'));
        const categoriasData = categoriasSnapshot.docs.map(doc => ({
          id: doc.id,
          categoria: doc.data().categoria
        }));
        setCategorias(categoriasData);

        // Carregar dados da idade
        const idadeDoc = await getDoc(doc(db, 'idades', idadeId));
        if (idadeDoc.exists()) {
          const data = idadeDoc.data();
          setCodIdade(data.codIdade);
          setCategoriaId(data.categoria);
        } else {
          toast.error('Idade não encontrada');
          router.push('/dashboard/idades');
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar dados');
      } finally {
        setLoadingDados(false);
      }
    };

    carregarDados();
  }, [idadeId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!codIdade || !categoriaId) {
      toast.error('Todos os campos são obrigatórios');
      return;
    }

    setLoading(true);

    try {
      await updateDoc(doc(db, 'idades', idadeId), {
        codIdade,
        categoria: categoriaId,
        dataAtualizacao: new Date().toISOString(),
        usuarioAtualizacao: user?.email || 'sistema'
      });

      toast.success('Idade atualizada com sucesso!');
      router.push('/dashboard/idades');
    } catch (error) {
      console.error('Erro ao atualizar idade:', error);
      toast.error('Erro ao atualizar idade');
    } finally {
      setLoading(false);
    }
  };

  if (loadingDados) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Editar Idade
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código/Idade
              </label>
              <input
                type="text"
                value={codIdade}
                onChange={(e) => setCodIdade(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.categoria}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className={`
                  flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </button>

              <button
                type="button"
                onClick={() => router.push('/dashboard/idades')}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 