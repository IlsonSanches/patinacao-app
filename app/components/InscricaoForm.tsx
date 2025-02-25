import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function InscricaoForm() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      await handleInscricao(data);
      toast.success('Inscrição realizada com sucesso!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Erro ao realizar inscrição');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Categoria
        </label>
        <select 
          {...register('categoria')}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          required
        >
          <option value="">Selecione uma categoria</option>
          <option value="INCENTIVO">INCENTIVO</option>
          <option value="INICIANTE">INICIANTE</option>
          <option value="INTERMEDIÁRIO">INTERMEDIÁRIO</option>
          <option value="AVANÇADO">AVANÇADO</option>
        </select>
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Realizar Inscrição
        </button>
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
} 