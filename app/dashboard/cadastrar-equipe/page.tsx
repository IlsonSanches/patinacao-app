'use client';

import { useState, useEffect } from 'react';
import { db, auth } from '@/app/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function CadastrarEquipe() {
  const [nomeEquipe, setNomeEquipe] = useState('');
  const [codigoEquipe, setCodigoEquipe] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [email, setEmail] = useState('');
  const [celular, setCelular] = useState('');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        toast.error('Você precisa estar logado para cadastrar uma equipe');
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleCelularChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 11) {
      let formatted = numbers;
      
      if (numbers.length >= 2) {
        formatted = `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
      }
      if (numbers.length >= 7) {
        formatted = `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
      }
      
      setCelular(formatted);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = auth.currentUser;
      
      if (!user) {
        toast.error('Você precisa estar logado para cadastrar uma equipe');
        router.push('/login');
        return;
      }

      if (!nomeEquipe || !codigoEquipe || !responsavel || !email || !celular || !estado || !cidade) {
        toast.error('Por favor, preencha todos os campos obrigatórios');
        setLoading(false);
        return;
      }

      const equipeData = {
        userId: user.uid,
        nomeEquipe: nomeEquipe.trim(),
        codigoEquipe: codigoEquipe.toUpperCase().trim(),
        responsavel: responsavel.trim(),
        email: email.trim(),
        celular: celular.trim(),
        estado: estado.trim(),
        cidade: cidade.trim(),
        observacoes: observacoes.trim(),
        dataCadastro: new Date().toISOString(),
        status: 'ativo'
      };

      const docRef = await addDoc(collection(db, 'equipes'), equipeData);
      
      if (docRef.id) {
        toast.success('Equipe cadastrada com sucesso!');
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Erro ao cadastrar equipe:', error);
      toast.error('Erro ao cadastrar equipe. Por favor, tente novamente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Cadastrar Nova Equipe</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome da Equipe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Equipe
              </label>
              <input
                type="text"
                value={nomeEquipe}
                onChange={(e) => setNomeEquipe(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Código da Equipe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código da Equipe
              </label>
              <input
                type="text"
                value={codigoEquipe}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^A-Za-z]/g, '').toUpperCase();
                  if (value.length <= 4) setCodigoEquipe(value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                maxLength={4}
                required
                placeholder="Digite até 4 letras"
              />
            </div>

            {/* Responsável */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Responsável
              </label>
              <input
                type="text"
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Celular */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Celular
              </label>
              <input
                type="tel"
                value={celular}
                onChange={handleCelularChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="(00) 00000-0000"
                required
              />
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Selecione um estado</option>
                {estados.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>

            {/* Cidade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cidade
              </label>
              <input
                type="text"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Informações adicionais sobre a equipe..."
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Cadastrando...' : 'Cadastrar Equipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}