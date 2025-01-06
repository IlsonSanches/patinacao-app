'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface FormData {
  nomeModalidade: string;
  codigoModalidade: string;
  status: 'ATIVO' | 'INATIVO';
}

export default function CadastrarModalidade() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const docRef = await addDoc(collection(db, 'modalidades'), {
        ...data,
        dataCadastro: new Date().toISOString()
      });
      
      toast.success('Modalidade cadastrada com sucesso!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro ao cadastrar modalidade:', error);
      toast.error('Erro ao cadastrar modalidade. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Cadastrar Nova Modalidade</h1>
      
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

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Cadastrando...' : 'Cadastrar Modalidade'}
          </button>
        </div>
      </form>
    </div>
  );
}