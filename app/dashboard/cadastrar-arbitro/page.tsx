'use client';

import { useState } from 'react';
import { db } from '@/app/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface JuizData {
  nomeCompleto: string;
  cpf: string;
  nivelAvaliacao: string;
  cidade: string;
  estado: string;
  telefone: string;
  email: string;
  status: string;
}

export default function CadastrarJuiz() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  const niveisAvaliacao = [
    'Iniciante',
    'Regional',
    'Nacional',
    'Internacional'
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const juizData = {
      nomeCompleto: formData.get('nomeCompleto'),
      cpf: formData.get('cpf'),
      nivelAvaliacao: formData.get('nivelAvaliacao'),
      cidade: formData.get('cidade'),
      estado: formData.get('estado'),
      telefone: formData.get('telefone'),
      email: formData.get('email'),
      status: 'ativo',
    };

    try {
      // Verificar se já existe um árbitro com o mesmo CPF
      const juizesRef = collection(db, 'juizes');
      const q = query(juizesRef, where('cpf', '==', juizData.cpf), where('status', '==', 'ativo'));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        toast.error('Já existe um árbitro cadastrado com este CPF');
        return;
      }

      await addDoc(collection(db, 'juizes'), juizData);
      toast.success('Árbitro cadastrado com sucesso!');
      router.push('/dashboard/juizes');
    } catch (error) {
      console.error('Erro ao cadastrar árbitro:', error);
      toast.error('Erro ao cadastrar árbitro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Cadastrar Novo Árbitro</h1>
        
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                name="nomeCompleto"
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CPF
              </label>
              <input
                type="text"
                name="cpf"
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nível de Avaliação
              </label>
              <select
                name="nivelAvaliacao"
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione um nível</option>
                {niveisAvaliacao.map(nivel => (
                  <option key={nivel} value={nivel}>{nivel}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                name="estado"
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione um estado</option>
                {estados.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cidade
              </label>
              <input
                type="text"
                name="cidade"
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone
              </label>
              <input
                type="tel"
                name="telefone"
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

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
              {loading ? 'Cadastrando...' : 'Cadastrar Árbitro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}