'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { db } from '@/app/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Categoria {
  id: string;
  categoria: string;
}

export default function CadastrarIdade() {
  const [codIdade, setCodIdade] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const carregarCategorias = async () => {
      try {
        const categoriasSnapshot = await getDocs(collection(db, 'categorias'));
        const categoriasData = categoriasSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Categoria[];

        // Ordenar categorias por nome
        categoriasData.sort((a, b) => {
          const nomeA = a.categoria || '';
          const nomeB = b.categoria || '';
          return nomeA.localeCompare(nomeB);
        });

        setCategorias(categoriasData);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        toast.error('Erro ao carregar categorias');
      } finally {
        setLoadingCategorias(false);
      }
    };

    carregarCategorias();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoriaId) {
      toast.error('Selecione uma categoria');
      return;
    }

    if (!codIdade) {
      toast.error('Digite o código/idade');
      return;
    }

    setLoading(true);

    try {
      // Encontrar a categoria selecionada
      const categoriaSelecionada = categorias.find(cat => cat.id === categoriaId);
      
      if (!categoriaSelecionada) {
        throw new Error('Categoria não encontrada');
      }

      await addDoc(collection(db, 'idades'), {
        codIdade,
        categoriaId,
        categoriaNome: categoriaSelecionada.categoria, // Armazenar o nome da categoria também
        dataCadastro: new Date().toISOString(),
        usuarioCadastro: user?.email || 'sistema'
      });

      toast.success('Idade cadastrada com sucesso!');
      router.push('/dashboard/idades');
    } catch (error) {
      console.error('Erro ao cadastrar idade:', error);
      toast.error('Erro ao cadastrar idade');
      setLoading(false);
    }
  };

  if (loadingCategorias) {
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
          Nova Idade
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-6">
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
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.categoria}
                  </option>
                ))}
              </select>
            </div>

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

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || loadingCategorias}
                className={`
                  flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${(loading || loadingCategorias) ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </button>

              <button
                type="button"
                onClick={() => router.push('/dashboard/idades')}
                disabled={loading || loadingCategorias}
                className={`
                  flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200
                  ${(loading || loadingCategorias) ? 'opacity-50 cursor-not-allowed' : ''}
                `}
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