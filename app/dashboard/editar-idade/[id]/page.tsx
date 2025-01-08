'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { db } from '@/app/firebase';
import { doc, getDoc, updateDoc, getDocs, query, collection, where } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const FAIXAS_IDADE = [
  'até 08 anos',
  'até 09 anos',
  'até 12 anos',
  '09 a 10 anos',
  '09 a 11 anos',
  '11 a 12 anos',
  '12 a 14 anos',
  '13 a 15 anos',
  '13 a 18 anos',
  '15 anos ou mais',
  '16 a 18 anos',
  '19 a 29 anos',
  '19 a 39 anos',
  '30 anos ou +',
  '40 anos ou +',
  'PNE',
  'PRD'
] as const;

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditarIdade({ params }: PageProps) {
  const [codigo, setCodigo] = useState('');
  const [faixaIdade, setFaixaIdade] = useState('');
  const [codigoOriginal, setCodigoOriginal] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const carregarIdade = async () => {
      try {
        const idadeDoc = await getDoc(doc(db, 'idades', params.id));
        if (idadeDoc.exists()) {
          const data = idadeDoc.data();
          setCodigo(data.codigo);
          setCodigoOriginal(data.codigo);
          setFaixaIdade(data.faixaIdade);
        } else {
          toast.error('Faixa de idade não encontrada');
          router.push('/dashboard/idades');
        }
      } catch (error) {
        console.error('Erro ao carregar faixa de idade:', error);
        toast.error('Erro ao carregar faixa de idade');
      } finally {
        setLoading(false);
      }
    };

    carregarIdade();
  }, [params.id, router]);

  // Formatar código (3 caracteres)
  const handleCodigo = (value: string) => {
    const formatted = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (formatted.length <= 3) {
      setCodigo(formatted);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (codigo.length !== 3) {
      toast.error('O código deve ter exatamente 3 caracteres');
      return;
    }

    if (!faixaIdade) {
      toast.error('Selecione uma faixa de idade');
      return;
    }

    setLoading(true);

    try {
      // Verificar se já existe uma idade com o mesmo código (exceto a atual)
      if (codigo !== codigoOriginal) {
        const idadeQuery = query(
          collection(db, 'idades'),
          where('codigo', '==', codigo)
        );
        const idadeSnapshot = await getDocs(idadeQuery);

        if (!idadeSnapshot.empty) {
          toast.error('Já existe uma faixa de idade com este código');
          setLoading(false);
          return;
        }
      }

      // Atualizar idade
      await updateDoc(doc(db, 'idades', params.id), {
        codigo,
        faixaIdade,
        dataAtualizacao: new Date().toISOString(),
        usuarioAtualizacao: user?.email || 'sistema'
      });

      toast.success('Faixa de idade atualizada com sucesso!');
      router.push('/dashboard/idades');
    } catch (error) {
      console.error('Erro ao atualizar faixa de idade:', error);
      toast.error('Erro ao atualizar faixa de idade');
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
          Editar Faixa de Idade
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código (3 caracteres)
              </label>
              <input
                type="text"
                value={codigo}
                onChange={(e) => handleCodigo(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                placeholder="ABC"
                maxLength={3}
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Use letras e números (exatamente 3 caracteres)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Faixa de Idade
              </label>
              <select
                value={faixaIdade}
                onChange={(e) => setFaixaIdade(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Selecione uma faixa de idade</option>
                {FAIXAS_IDADE.map((faixa) => (
                  <option key={faixa} value={faixa}>
                    {faixa}
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