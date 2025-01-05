'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface FormData {
  nomeModalidade: string;
  codigoModalidade: string;
  sexo: 'F' | 'M';
  status: 'ATIVO' | 'INATIVO';
}

export default function EditarModalidade({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

  useEffect(() => {
    const carregarModalidade = async () => {
      try {
        const docRef = doc(db, 'modalidades', params.id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as FormData;
          reset(data);
        } else {
          toast.error('Modalidade não encontrada');
          router.push('/dashboard/modalidades');
        }
      } catch (error) {
        console.error('Erro ao carregar modalidade:', error);
        toast.error('Erro ao carregar dados da modalidade');
      } finally {
        setLoading(false);
      }
    };

    carregarModalidade();
  }, [params.id, reset, router]);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const docRef = doc(db, 'modalidades', params.id);
      await updateDoc(docRef, data);
      
      toast.success('Modalidade atualizada com sucesso!');
      router.push('/dashboard/modalidades');
    } catch (error) {
      console.error('Erro ao atualizar modalidade:', error);
      toast.error('Erro ao atualizar modalidade. Tente novamente.');
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
      <h1 className="text-2xl font-bold mb-6">Editar Modalidade</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Nome da Modalidade</label>
            <input
              type="text"
              {...register('nomeModalidade', { required: 'Nome da modalidade é obrigatório' })}
              className="w-full p-2 border rounded-md"
            />
            {errors.nomeModalidade && (
              <span className="text-red-500 text-sm">{errors.nomeModalidade.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Código da Modalidade</label>
            <input
              type="text"
              {...register('codigoModalidade', { required: 'Código da modalidade é obrigatório' })}
              className="w-full p-2 border rounded-md"
            />
            {errors.codigoModalidade && (
              <span className="text-red-500 text-sm">{errors.codigoModalidade.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Sexo</label>
            <select
              {...register('sexo', { required: 'Sexo é obrigatório' })}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Selecione o sexo</option>
              <option value="F">Feminino</option>
              <option value="M">Masculino</option>
            </select>
            {errors.sexo && (
              <span className="text-red-500 text-sm">{errors.sexo.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              {...register('status', { required: 'Status é obrigatório' })}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Selecione o status</option>
              <option value="ATIVO">ATIVO</option>
              <option value="INATIVO">INATIVO</option>
            </select>
            {errors.status && (
              <span className="text-red-500 text-sm">{errors.status.message}</span>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/dashboard/modalidades')}
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