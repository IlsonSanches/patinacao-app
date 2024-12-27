'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import toast from 'react-hot-toast';

interface Equipe {
  id: string;
  nomeEquipe: string;
}

interface FormData {
  nomeCompleto: string;
  dataNascimento: string;
  categoria: string;
  email: string;
  telefone: string;
  equipeId: string;
  responsavel?: {
    nome: string;
    telefone: string;
    email: string;
  };
  historicoMedico: string;
  observacoes: string;
}

export default function CadastrarPatinador() {
  const [isLoading, setIsLoading] = useState(false);
  const [isMenorIdade, setIsMenorIdade] = useState(false);
  const [equipes, setEquipes] = useState<Equipe[]>([]);
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  useEffect(() => {
    const carregarEquipes = async () => {
      try {
        const equipesRef = collection(db, 'equipes');
        const snapshot = await getDocs(equipesRef);
        const equipesData = snapshot.docs.map(doc => ({
          id: doc.id,
          nomeEquipe: doc.data().nomeEquipe
        }));
        setEquipes(equipesData);
      } catch (error) {
        console.error('Erro ao carregar equipes:', error);
        toast.error('Erro ao carregar equipes. Por favor, recarregue a página.');
      }
    };

    carregarEquipes();
  }, []);

  const onSubmit = async (data: FormData) => {
    if (!data.equipeId) {
      toast.error('Por favor, selecione uma equipe');
      return;
    }

    try {
      setIsLoading(true);
      const docRef = await addDoc(collection(db, 'patinadores'), {
        ...data,
        dataCadastro: new Date().toISOString(),
        status: 'ativo'
      });
      
      toast.success('Patinador cadastrado com sucesso!');
      // Limpar formulário ou redirecionar
    } catch (error) {
      console.error('Erro ao cadastrar patinador:', error);
      toast.error('Erro ao cadastrar patinador. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const verificarIdade = (data: string) => {
    const hoje = new Date();
    const nascimento = new Date(data);
    const idade = hoje.getFullYear() - nascimento.getFullYear();
    setIsMenorIdade(idade < 18);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Cadastrar Novo Patinador</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Nome Completo</label>
            <input
              type="text"
              {...register('nomeCompleto', { required: 'Nome é obrigatório' })}
              className="w-full p-2 border rounded-md"
            />
            {errors.nomeCompleto && (
              <span className="text-red-500 text-sm">{errors.nomeCompleto.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Equipe</label>
            <select
              {...register('equipeId', { required: 'Equipe é obrigatória' })}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Selecione uma equipe</option>
              {equipes.map((equipe) => (
                <option key={equipe.id} value={equipe.id}>
                  {equipe.nomeEquipe}
                </option>
              ))}
            </select>
            {errors.equipeId && (
              <span className="text-red-500 text-sm">{errors.equipeId.message}</span>
            )}
            {equipes.length === 0 && (
              <span className="text-yellow-600 text-sm block mt-1">
                Nenhuma equipe cadastrada. Por favor, cadastre uma equipe primeiro.
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Data de Nascimento</label>
            <input
              type="date"
              {...register('dataNascimento', { required: 'Data de nascimento é obrigatória' })}
              onChange={(e) => verificarIdade(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
            {errors.dataNascimento && (
              <span className="text-red-500 text-sm">{errors.dataNascimento.message}</span>
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
        </div>

        {isMenorIdade && (
          <div className="bg-gray-50 p-4 rounded-md space-y-4">
            <h3 className="font-medium">Dados do Responsável</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome do Responsável</label>
                <input
                  type="text"
                  {...register('responsavel.nome', { required: 'Nome do responsável é obrigatório' })}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Telefone do Responsável</label>
                <input
                  type="tel"
                  {...register('responsavel.telefone', { required: 'Telefone do responsável é obrigatório' })}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email do Responsável</label>
                <input
                  type="email"
                  {...register('responsavel.email', { required: 'Email do responsável é obrigatório' })}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Histórico Médico Relevante</label>
          <textarea
            {...register('historicoMedico')}
            className="w-full p-2 border rounded-md h-24"
            placeholder="Informe alergias, lesões anteriores, condições médicas relevantes..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Observações Adicionais</label>
          <textarea
            {...register('observacoes')}
            className="w-full p-2 border rounded-md h-24"
            placeholder="Outras informações relevantes..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || equipes.length === 0}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Cadastrando...' : 'Cadastrar Patinador'}
          </button>
        </div>
      </form>
    </div>
  );
} 