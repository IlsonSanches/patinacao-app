'use client';

import { useState } from 'react';
import { db } from '@/app/firebase';
import { collection, addDoc, query, where, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface JuizData {
  cpf: string;
  nomeCompleto: string;
  nivelAvaliacao: string;
  cidade: string;
  estado: string;
  telefone: string;
  email: string;
}

export default function CadastrarJuiz() {
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [cpf, setCpf] = useState('');
  const [nivelAvaliacao, setNivelAvaliacao] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(false);
  const [juizExistente, setJuizExistente] = useState<any>(null);
  const router = useRouter();

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  const niveisAvaliacao = [
    'Estadual',
    'Nacional',
    'Internacional'
  ];

  // Formatar CPF enquanto digita
  const formatarCPF = (value: string) => {
    const numeros = value.replace(/\D/g, '');
    if (numeros.length <= 11) {
      let cpfFormatado = numeros;
      if (numeros.length > 3) {
        cpfFormatado = `${numeros.slice(0, 3)}.${numeros.slice(3)}`;
      }
      if (numeros.length > 6) {
        cpfFormatado = `${cpfFormatado.slice(0, 7)}.${numeros.slice(6)}`;
      }
      if (numeros.length > 9) {
        cpfFormatado = `${cpfFormatado.slice(0, 11)}-${numeros.slice(9)}`;
      }
      setCpf(cpfFormatado);
    }
  };

  // Verificar se juiz já existe
  const verificarJuizExistente = async (cpfValue: string) => {
    const cpfNumeros = cpfValue.replace(/\D/g, '');
    if (cpfNumeros.length === 11) {
      try {
        const juizesRef = collection(db, 'juizes');
        const q = query(juizesRef, where('cpf', '==', cpfValue));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const juizDoc = querySnapshot.docs[0];
          setJuizExistente({
            id: juizDoc.id,
            ...juizDoc.data()
          });
          toast.error('CPF já cadastrado. Escolha uma ação abaixo.');
        } else {
          setJuizExistente(null);
        }
      } catch (error) {
        console.error('Erro ao verificar CPF:', error);
        toast.error('Erro ao verificar CPF');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const juizData = {
        nomeCompleto,
        cpf,
        nivelAvaliacao,
        cidade,
        estado,
        telefone,
        email,
        observacoes,
        dataCadastro: new Date().toISOString(),
        status: 'ativo'
      };

      const docRef = await addDoc(collection(db, 'juizes'), juizData);
      
      if (docRef.id) {
        toast.success('Juiz cadastrado com sucesso!');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Erro ao cadastrar juiz:', error);
      toast.error('Erro ao cadastrar juiz');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!juizExistente?.id) return;
    
    try {
      setLoading(true);
      await deleteDoc(doc(db, 'juizes', juizExistente.id));
      toast.success('Juiz deletado com sucesso!');
      setJuizExistente(null);
      // Limpar formulário
      setCpf('');
      setNomeCompleto('');
      setEmail('');
      setTelefone('');
      setCidade('');
      setEstado('');
      setNivelAvaliacao('');
      setObservacoes('');
    } catch (error) {
      console.error('Erro ao deletar juiz:', error);
      toast.error('Erro ao deletar juiz');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (juizId: string) => {
    // Implementação da função de atualização
    try {
      // Lógica de atualização
    } catch (error) {
      console.error('Erro ao atualizar:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Cadastrar Novo Juiz</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">CPF</label>
            <input
              type="text"
              value={cpf}
              onChange={(e) => {
                formatarCPF(e.target.value);
                verificarJuizExistente(e.target.value);
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              placeholder="000.000.000-00"
            />
          </div>

          {juizExistente && (
            <div className="bg-yellow-50 p-4 rounded-md">
              <p className="text-yellow-700">Juiz já cadastrado com este CPF.</p>
              <div className="mt-4 flex space-x-4">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                  disabled={loading}
                >
                  Deletar Cadastro
                </button>
                <button
                  type="button"
                  onClick={() => router.push(`/dashboard/editar-juiz/${cpf}`)}
                  className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700"
                  disabled={loading}
                >
                  Atualizar Dados
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
            <input
              type="text"
              value={nomeCompleto}
              onChange={(e) => setNomeCompleto(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nível de Avaliação</label>
            <select
              value={nivelAvaliacao}
              onChange={(e) => setNivelAvaliacao(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Selecione um nível</option>
              {niveisAvaliacao.map((nivel) => (
                <option key={nivel} value={nivel}>{nivel}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Estado</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Selecione um estado</option>
              {estados.map((uf) => (
                <option key={uf} value={uf}>{uf}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cidade</label>
            <input
              type="text"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Telefone</label>
            <input
              type="tel"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Observações</label>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || juizExistente !== null}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Cadastrando...' : 'Cadastrar Juiz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}