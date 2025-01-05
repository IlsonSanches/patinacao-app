'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface FormData {
  nomeTorneio: string;
  dataRealizacao: string;
  cidade: string;
  estado: string;
  dataMaximaInscricao: string;
}

export default function EditarTorneio({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

  useEffect(() => {
    const carregarTorneio = async () => {
      try {
        const docRef = doc(db, 'torneios', params.id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as FormData;
          reset(data);
        } else {
          toast.error('Torneio não encontrado');
          router.push('/dashboard/torneios');
        }
      } catch (error) {
        console.error('Erro ao carregar torneio:', error);
        toast.error('Erro ao carregar dados do torneio');
      } finally {
        setLoading(false);
      }
    };

    carregarTorneio();
  }, [params.id, reset, router]);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const docRef = doc(db, 'torneios', params.id);
      await updateDoc(docRef, data);
      
      toast.success('Torneio atualizado com sucesso!');
      router.push('/dashboard/torneios');
    } catch (error) {
      console.error('Erro ao atualizar torneio:', error);
      toast.error('Erro ao atualizar torneio. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Editar Torneio</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Nome do Torneio</label>
            <input
              type="text"
              {...register('nomeTorneio', { required: 'Nome do torneio é obrigatório' })}
              className="w-full p-2 border rounded-md"
            />
            {errors.nomeTorneio && (
              <span className="text-red-500 text-sm">{errors.nomeTorneio.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Data de Realização</label>
            <input
              type="date"
              {...register('dataRealizacao', { required: 'Data de realização é obrigatória' })}
              className="w-full p-2 border rounded-md"
            />
            {errors.dataRealizacao && (
              <span className="text-red-500 text-sm">{errors.dataRealizacao.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Cidade</label>
            <input
              type="text"
              {...register('cidade', { required: 'Cidade é obrigatória' })}
              className="w-full p-2 border rounded-md"
            />
            {errors.cidade && (
              <span className="text-red-500 text-sm">{errors.cidade.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Estado</label>
            <select
              {...register('estado', { required: 'Estado é obrigatório' })}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Selecione um estado</option>
              <option value="AC">Acre</option>
              <option value="AL">Alagoas</option>
              <option value="AP">Amapá</option>
              <option value="AM">Amazonas</option>
              <option value="BA">Bahia</option>
              <option value="CE">Ceará</option>
              <option value="DF">Distrito Federal</option>
              <option value="ES">Espírito Santo</option>
              <option value="GO">Goiás</option>
              <option value="MA">Maranhão</option>
              <option value="MT">Mato Grosso</option>
              <option value="MS">Mato Grosso do Sul</option>
              <option value="MG">Minas Gerais</option>
              <option value="PA">Pará</option>
              <option value="PB">Paraíba</option>
              <option value="PR">Paraná</option>
              <option value="PE">Pernambuco</option>
              <option value="PI">Piauí</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="RN">Rio Grande do Norte</option>
              <option value="RS">Rio Grande do Sul</option>
              <option value="RO">Rondônia</option>
              <option value="RR">Roraima</option>
              <option value="SC">Santa Catarina</option>
              <option value="SP">São Paulo</option>
              <option value="SE">Sergipe</option>
              <option value="TO">Tocantins</option>
            </select>
            {errors.estado && (
              <span className="text-red-500 text-sm">{errors.estado.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Data Máxima para Inscrição</label>
            <input
              type="date"
              {...register('dataMaximaInscricao', { required: 'Data máxima para inscrição é obrigatória' })}
              className="w-full p-2 border rounded-md"
            />
            {errors.dataMaximaInscricao && (
              <span className="text-red-500 text-sm">{errors.dataMaximaInscricao.message}</span>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/dashboard/torneios')}
            className="px-6 py-2 border rounded-md hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}