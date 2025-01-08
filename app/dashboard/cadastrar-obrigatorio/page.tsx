'use client';
import { useState } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { db } from '@/app/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function CadastrarObrigatorio() {
  const [abreviacao, setAbreviacao] = useState('');
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  // Formatar abreviação (5 caracteres)
  const handleAbreviacao = (value: string) => {
    const formatted = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (formatted.length <= 5) {
      setAbreviacao(formatted);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (abreviacao.length === 0 || abreviacao.length > 5) {
      toast.error('A abreviação deve ter entre 1 e 5 caracteres');
      return;
    }

    if (!nome.trim()) {
      toast.error('O nome é obrigatório');
      return;
    }

    if (!descricao.trim()) {
      toast.error('A descrição é obrigatória');
      return;
    }

    setLoading(true);

    try {
      // Verificar se já existe um exercício com a mesma abreviação
      const exercicioQuery = query(
        collection(db, 'exercicios'),
        where('abreviacao', '==', abreviacao)
      );
      const exercicioSnapshot = await getDocs(exercicioQuery);

      if (!exercicioSnapshot.empty) {
        toast.error('Já existe um exercício com esta abreviação');
        setLoading(false);
        return;
      }

      // Cadastrar novo exercício
      await addDoc(collection(db, 'exercicios'), {
        abreviacao,
        nome,
        descricao,
        dataCadastro: new Date().toISOString(),
        usuarioCadastro: user?.email || 'sistema'
      });

      toast.success('Exercício obrigatório cadastrado com sucesso!');
      router.push('/dashboard/obrigatorios');
    } catch (error) {
      console.error('Erro ao cadastrar exercício:', error);
      toast.error('Erro ao cadastrar exercício');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Cadastrar Novo Exercício Obrigatório
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Abreviação (até 5 caracteres)
              </label>
              <input
                type="text"
                value={abreviacao}
                onChange={(e) => handleAbreviacao(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                placeholder="XXXXX"
                maxLength={5}
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Use letras e números (até 5 caracteres)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Exercício
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite o nome do exercício"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição do Exercício
              </label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Descreva o exercício detalhadamente"
                rows={4}
                required
              />
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
                {loading ? 'Cadastrando...' : 'Cadastrar Exercício'}
              </button>

              <button
                type="button"
                onClick={() => router.push('/dashboard/obrigatorios')}
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