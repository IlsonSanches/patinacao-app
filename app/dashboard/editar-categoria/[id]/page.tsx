'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { db } from '@/app/firebase';
import { doc, getDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';

interface Modalidade {
  id: string;
  nomeModalidade: string;
}

interface DadosAtualizacao {
  categoria: string;
  codigoCategoria: string;
  modalidade: string;
  dataAtualizacao: string;
  usuarioAtualizacao?: string;
}

export default function EditarCategoria() {
  const params = useParams();
  const categoriaId = params?.id as string;
  const [categoria, setCategoria] = useState('');
  const [codigoCategoria, setCodigoCategoria] = useState('');
  const [modalidade, setModalidade] = useState('');
  const [modalidades, setModalidades] = useState<Modalidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [codigoOriginal, setCodigoOriginal] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const carregarDados = async () => {
      if (!categoriaId) {
        toast.error('ID da categoria não encontrado');
        router.push('/dashboard/categorias');
        return;
      }

      try {
        // Carregar modalidades
        const modalidadesSnapshot = await getDocs(collection(db, 'modalidades'));
        const modalidadesData = modalidadesSnapshot.docs.map(doc => ({
          id: doc.id,
          nomeModalidade: doc.data().nomeModalidade
        }));
        setModalidades(modalidadesData);

        // Carregar dados da categoria
        const categoriaDoc = await getDoc(doc(db, 'categorias', categoriaId));
        if (categoriaDoc.exists()) {
          const data = categoriaDoc.data();
          setCategoria(data.categoria);
          setCodigoCategoria(data.codigoCategoria);
          setCodigoOriginal(data.codigoCategoria);
          setModalidade(data.modalidade);
        } else {
          toast.error('Categoria não encontrada');
          router.push('/dashboard/categorias');
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [categoriaId, router]);

  // Formatar código da categoria
  const handleCodigoCategoria = (value: string) => {
    const formatted = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (formatted.length <= 4) {
      setCodigoCategoria(formatted);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoriaId) {
      toast.error('ID da categoria não encontrado');
      return;
    }

    if (codigoCategoria.length === 0) {
      toast.error('O código da categoria é obrigatório');
      return;
    }

    if (codigoCategoria.length > 4) {
      toast.error('O código da categoria deve ter no máximo 4 caracteres');
      return;
    }

    if (!modalidade) {
      toast.error('A modalidade é obrigatória');
      return;
    }

    setLoading(true);

    try {
      // Verificar se já existe uma categoria com o mesmo código (exceto a atual)
      if (codigoCategoria !== codigoOriginal) {
        const categoriaQuery = query(
          collection(db, 'categorias'),
          where('codigoCategoria', '==', codigoCategoria)
        );
        const categoriaSnapshot = await getDocs(categoriaQuery);

        if (!categoriaSnapshot.empty) {
          toast.error('Já existe uma categoria com este código');
          setLoading(false);
          return;
        }
      }

      // Atualizar categoria
      await updateDoc(doc(db, 'categorias', categoriaId), {
        categoria,
        codigoCategoria,
        modalidade,
        dataAtualizacao: new Date().toISOString(),
        ...(user?.email ? { usuarioAtualizacao: user.email } : {})
      });

      toast.success('Categoria atualizada com sucesso!');
      router.push('/dashboard/categorias');
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      toast.error('Erro ao atualizar categoria');
    } finally {
      setLoading(false);
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
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Editar Categoria
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Categoria
              </label>
              <input
                type="text"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nome da categoria"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código da Categoria (até 4 caracteres)
              </label>
              <input
                type="text"
                value={codigoCategoria}
                onChange={(e) => handleCodigoCategoria(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                placeholder="ABC1"
                maxLength={4}
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Use letras e números (até 4 caracteres)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modalidade
              </label>
              <select
                value={modalidade}
                onChange={(e) => setModalidade(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Selecione uma modalidade</option>
                {modalidades.map((mod) => (
                  <option key={mod.id} value={mod.id}>
                    {mod.nomeModalidade}
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
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>

              <button
                type="button"
                onClick={() => router.push('/dashboard/categorias')}
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