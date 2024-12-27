'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface FormData {
  nomeCompleto: string;
  registroCbhp: string;
  nivelAvaliacao: string;
  cidade: string;
  estado: string;
  telefone: string;
  email: string;
  especialidades: string[];
  observacoes?: string;
}

export default function CadastrarJuiz() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const especialidadesOpcoes = [
    'Figuras Obrigatórias',
    'Livre Individual',
    'Dupla',
    'Solo Dance',
    'Quarteto',
    'Show e Precisão',
    'In-Line'
  ];

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const docRef = await addDoc(collection(db, 'juizes'), {
        ...data,
        dataCadastro: new Date().toISOString(),
        status: 'ativo'
      });
      
      toast.success('Juiz cadastrado com sucesso!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro ao cadastrar juiz:', error);
      toast.error('Erro ao cadastrar juiz. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Cadastrar Novo Juiz</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Nome Completo</label>
            <input
              type="text"
              {...register('nomeCompleto', { required: 'Nome completo é obrigatório' })}
              className="w-full p-2 border rounded-md"
            />
            {errors.nomeCompleto && (
              <span className="text-red-500 text-sm">{errors.nomeCompleto.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Registro CBHP</label>
            <input
              type="text"
              {...register('registroCbhp', { required: 'Registro CBHP é obrigatório' })}
              className="w-full p-2 border rounded-md"
            />
            {errors.registroCbhp && (
              <span className="text-red-500 text-sm">{errors.registroCbhp.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nível de Avaliação</label>
            <select
              {...register('nivelAvaliacao', { required: 'Nível de avaliação é obrigatório' })}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Selecione um nível</option>
              <option value="regional">Regional</option>
              <option value="nacional">Nacional</option>
              <option value="internacional">Internacional</option>
            </select>
            {errors.nivelAvaliacao && (
              <span className="text-red-500 text-sm">{errors.nivelAvaliacao.message}</span>
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
            <label className="block text-sm font-medium mb-1">Telefone</label>
            <input
              type="tel"
              {...register('telefone', { required: 'Telefone é obrigatório' })}
              className="w-full p-2 border rounded-md"
            />
            {errors.telefone && (
              <span className="text-red-500 text-sm">{errors.telefone.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              {...register('email', { 
                required: 'Email é obrigatório',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido'
                }
              })}
              className="w-full p-2 border rounded-md"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email.message}</span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Especialidades</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {especialidadesOpcoes.map((especialidade) => (
              <div key={especialidade} className="flex items-center">
                <input
                  type="checkbox"
                  {...register('especialidades')}
                  value={especialidade}
                  className="mr-2"
                />
                <label className="text-sm">{especialidade}</label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Observações</label>
          <textarea
            {...register('observacoes')}
            className="w-full p-2 border rounded-md h-24"
            placeholder="Informações adicionais sobre o juiz..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Cadastrando...' : 'Cadastrar Juiz'}
          </button>
        </div>
      </form>
    </div>
  );
} 