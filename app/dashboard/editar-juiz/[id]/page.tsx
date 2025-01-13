'use client';
import { useState, useEffect } from 'react';
import { db } from '@/app/firebase';
import { collection, query, where, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';

interface JuizData {
  id?: string;
  nomeCompleto: string;
  cpf: string;
  nivelAvaliacao: string;
  cidade: string;
  estado: string;
  telefone: string;
  email: string;
  status: string;
}

export default function EditarJuiz() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [juizData, setJuizData] = useState<JuizData | null>(null);

  useEffect(() => {
    const carregarJuiz = async () => {
      if (!params?.id) return;

      try {
        const juizRef = doc(db, 'juizes', params.id as string);
        const juizDoc = await getDoc(juizRef);

        if (juizDoc.exists()) {
          setJuizData({ id: juizDoc.id, ...juizDoc.data() } as JuizData);
        } else {
          toast.error('Árbitro não encontrado');
          router.push('/dashboard/juizes');
        }
      } catch (error) {
        console.error('Erro ao carregar dados do árbitro:', error);
        toast.error('Erro ao carregar dados do árbitro');
      }
    };

    carregarJuiz();
  }, [params?.id, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!params?.id) return;

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const dadosAtualizados = {
      nomeCompleto: formData.get('nomeCompleto'),
      cpf: formData.get('cpf'),
      nivelAvaliacao: formData.get('nivelAvaliacao'),
      cidade: formData.get('cidade'),
      estado: formData.get('estado'),
      telefone: formData.get('telefone'),
      email: formData.get('email')
    };

    try {
      const juizRef = doc(db, 'juizes', params.id as string);
      await updateDoc(juizRef, dadosAtualizados);
      toast.success('Árbitro atualizado com sucesso!');
      router.push('/dashboard/juizes');
    } catch (error) {
      console.error('Erro ao atualizar árbitro:', error);
      toast.error('Erro ao atualizar árbitro');
    } finally {
      setLoading(false);
    }
  };

  if (!juizData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Carregando dados do árbitro...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Editar Árbitro</h1>
        
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          {/* ... resto do formulário ... */}
          
          <div className="flex items-center justify-between mt-6">
            <button
              type="button"
              onClick={() => router.push('/dashboard/juizes')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 