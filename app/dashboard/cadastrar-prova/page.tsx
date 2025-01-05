'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface FormData {
  nomeProva: string;
  categoria: string;
  dataRealizacao: string;
  elementos: {
    saltoAxel: number;
    saltoFlip: number;
    saltoLutz: number;
    saltoLoop: number;
    piruetaSentada: number;
    piruetaEmPe: number;
    sequenciaPassos: number;
    coreografia: number;
  };
  observacoes?: string;
}

export default function CadastrarProva() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const docRef = await addDoc(collection(db, 'provas'), {
        ...data,
        dataCadastro: new Date().toISOString(),
        status: 'ativa'
      });
      
      toast.success('Prova cadastrada com sucesso!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro ao cadastrar prova:', error);
      toast.error('Erro ao cadastrar prova. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Cadastrar Nova Prova</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Nome da Prova</label>
            <input
              type="text"
              {...register('nomeProva', { required: 'Nome da prova é obrigatório' })}
              className="w-full p-2 border rounded-md"
            />
            {errors.nomeProva && (
              <span className="text-red-500 text-sm">{errors.nomeProva.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Categoria</label>
            <select
              {...register('categoria', { required: 'Categoria é obrigatória' })}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Selecione uma categoria</option>
              <option value="iniciante">Iniciante</option>
              <option value="intermediario">Intermediário</option>
              <option value="avancado">Avançado</option>
              <option value="profissional">Profissional</option>
            </select>
            {errors.categoria && (
              <span className="text-red-500 text-sm">{errors.categoria.message}</span>
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
        </div>

        {/* Elementos Pontuáveis */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Elementos Pontuáveis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Salto Axel</label>
              <input
                type="number"
                step="0.01"
                {...register('elementos.saltoAxel', { 
                  required: 'Valor obrigatório',
                  min: { value: 0, message: 'Valor mínimo é 0' },
                  max: { value: 10, message: 'Valor máximo é 10' }
                })}
                className="w-full p-2 border rounded-md"
              />
              {errors.elementos?.saltoAxel && (
                <span className="text-red-500 text-sm">{errors.elementos.saltoAxel.message}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Salto Flip</label>
              <input
                type="number"
                step="0.01"
                {...register('elementos.saltoFlip', { 
                  required: 'Valor obrigatório',
                  min: { value: 0, message: 'Valor mínimo é 0' },
                  max: { value: 10, message: 'Valor máximo é 10' }
                })}
                className="w-full p-2 border rounded-md"
              />
              {errors.elementos?.saltoFlip && (
                <span className="text-red-500 text-sm">{errors.elementos.saltoFlip.message}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Salto Lutz</label>
              <input
                type="number"
                step="0.01"
                {...register('elementos.saltoLutz', { 
                  required: 'Valor obrigatório',
                  min: { value: 0, message: 'Valor mínimo é 0' },
                  max: { value: 10, message: 'Valor máximo é 10' }
                })}
                className="w-full p-2 border rounded-md"
              />
              {errors.elementos?.saltoLutz && (
                <span className="text-red-500 text-sm">{errors.elementos.saltoLutz.message}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Salto Loop</label>
              <input
                type="number"
                step="0.01"
                {...register('elementos.saltoLoop', { 
                  required: 'Valor obrigatório',
                  min: { value: 0, message: 'Valor mínimo é 0' },
                  max: { value: 10, message: 'Valor máximo é 10' }
                })}
                className="w-full p-2 border rounded-md"
              />
              {errors.elementos?.saltoLoop && (
                <span className="text-red-500 text-sm">{errors.elementos.saltoLoop.message}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Pirueta Sentada</label>
              <input
                type="number"
                step="0.01"
                {...register('elementos.piruetaSentada', { 
                  required: 'Valor obrigatório',
                  min: { value: 0, message: 'Valor mínimo é 0' },
                  max: { value: 10, message: 'Valor máximo é 10' }
                })}
                className="w-full p-2 border rounded-md"
              />
              {errors.elementos?.piruetaSentada && (
                <span className="text-red-500 text-sm">{errors.elementos.piruetaSentada.message}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Pirueta em Pé</label>
              <input
                type="number"
                step="0.01"
                {...register('elementos.piruetaEmPe', { 
                  required: 'Valor obrigatório',
                  min: { value: 0, message: 'Valor mínimo é 0' },
                  max: { value: 10, message: 'Valor máximo é 10' }
                })}
                className="w-full p-2 border rounded-md"
              />
              {errors.elementos?.piruetaEmPe && (
                <span className="text-red-500 text-sm">{errors.elementos.piruetaEmPe.message}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Sequência de Passos</label>
              <input
                type="number"
                step="0.01"
                {...register('elementos.sequenciaPassos', { 
                  required: 'Valor obrigatório',
                  min: { value: 0, message: 'Valor mínimo é 0' },
                  max: { value: 10, message: 'Valor máximo é 10' }
                })}
                className="w-full p-2 border rounded-md"
              />
              {errors.elementos?.sequenciaPassos && (
                <span className="text-red-500 text-sm">{errors.elementos.sequenciaPassos.message}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Coreografia</label>
              <input
                type="number"
                step="0.01"
                {...register('elementos.coreografia', { 
                  required: 'Valor obrigatório',
                  min: { value: 0, message: 'Valor mínimo é 0' },
                  max: { value: 10, message: 'Valor máximo é 10' }
                })}
                className="w-full p-2 border rounded-md"
              />
              {errors.elementos?.coreografia && (
                <span className="text-red-500 text-sm">{errors.elementos.coreografia.message}</span>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Observações</label>
          <textarea
            {...register('observacoes')}
            className="w-full p-2 border rounded-md h-24"
            placeholder="Informações adicionais sobre a prova..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Cadastrando...' : 'Cadastrar Prova'}
          </button>
        </div>
      </form>
    </div>
  );
} 