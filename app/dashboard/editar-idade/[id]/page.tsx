'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { db } from '@/app/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const FAIXAS_IDADE = [
  { codigo: 'BS1', faixa: 'até 08 anos' },
  { codigo: 'BS2', faixa: 'até 09 anos' },
  { codigo: 'BS3', faixa: 'até 12 anos' },
  { codigo: 'IN1', faixa: '09 a 10 anos' },
  { codigo: 'IN2', faixa: '09 a 11 anos' },
  { codigo: 'IN3', faixa: '11 a 12 anos' },
  { codigo: 'CA1', faixa: '12 a 14 anos' },
  { codigo: 'CA2', faixa: '13 a 15 anos' },
  { codigo: 'CA3', faixa: '13 a 18 anos' },
  { codigo: 'JV1', faixa: '15 anos ou mais' },
  { codigo: 'JV2', faixa: '16 a 18 anos' },
  { codigo: 'SR1', faixa: '19 a 29 anos' },
  { codigo: 'SR2', faixa: '19 a 39 anos' },
  { codigo: 'SR3', faixa: '30 anos ou +' },
  { codigo: 'SR4', faixa: '40 anos ou +' },
  { codigo: 'PNE', faixa: 'PNE' },
  { codigo: 'PRD', faixa: 'PRD' }
] as const;

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditarIdade({ params }: PageProps) {
  const [selectedFaixa, setSelectedFaixa] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const carregarIdade = async () => {
      try {
        const idadeDoc = await getDoc(doc(db, 'idades', params.id));
        if (idadeDoc.exists()) {
          const data = idadeDoc.data();
          // Encontrar a faixa correspondente pelo código
          const faixaEncontrada = FAIXAS_IDADE.find(f => f.codigo === data.codigo);
          if (faixaEncontrada) {
            setSelectedFaixa(faixaEncontrada.codigo);
          } else {
            toast.error('Faixa de idade não encontrada na lista');
          }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFaixa) {
      toast.error('Selecione uma faixa de idade');
      return;
    }

    setLoading(true);

    try {
      const faixaSelecionada = FAIXAS_IDADE.find(f => f.codigo === selectedFaixa);
      if (!faixaSelecionada) {
        throw new Error('Faixa de idade não encontrada');
      }

      // Atualizar idade
      await updateDoc(doc(db, 'idades', params.id), {
        codigo: faixaSelecionada.codigo,
        faixaIdade: faixaSelecionada.faixa,
        descricaoCompleta: `${faixaSelecionada.codigo} - ${faixaSelecionada.faixa}`,
        dataAtualizacao: new Date().toISOString(),
        usuarioAtualizacao: user?.email || 'sistema'
      });

      toast.success('Faixa de idade atualizada com sucesso!');
      router.push('/dashboard/idades');
    } catch (error) {
      console.error('Erro ao atualizar faixa de idade:', error);
      toast.error('Erro ao atualizar faixa de idade');
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
                Faixa de Idade
              </label>
              <select
                value={selectedFaixa}
                onChange={(e) => setSelectedFaixa(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Selecione uma faixa de idade</option>
                {FAIXAS_IDADE.map((faixa) => (
                  <option key={faixa.codigo} value={faixa.codigo}>
                    {`${faixa.codigo} - ${faixa.faixa}`}
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