'use client';
import { useState, useEffect } from 'react';
import { db } from '@/app/firebase';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function EditarJuiz({ params }: { params: { id: string } }) {
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [cpf, setCpf] = useState('');
  const [nivelAvaliacao, setNivelAvaliacao] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const carregarJuiz = async () => {
      try {
        setLoading(true);
        const juizesRef = collection(db, 'juizes');
        const q = query(juizesRef, where('cpf', '==', params.id));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const juizDoc = querySnapshot.docs[0];
          const dados = juizDoc.data();
          
          setNomeCompleto(dados.nomeCompleto || '');
          setCpf(dados.cpf || '');
          setNivelAvaliacao(dados.nivelAvaliacao || '');
          setCidade(dados.cidade || '');
          setEstado(dados.estado || '');
          setTelefone(dados.telefone || '');
          setEmail(dados.email || '');
          setObservacoes(dados.observacoes || '');
        } else {
          toast.error('Juiz não encontrado');
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Erro ao carregar juiz:', error);
        toast.error('Erro ao carregar dados do juiz');
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      carregarJuiz();
    }
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const juizesRef = collection(db, 'juizes');
      const q = query(juizesRef, where('cpf', '==', cpf));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const juizDoc = querySnapshot.docs[0];
        
        await updateDoc(juizDoc.ref, {
          nomeCompleto,
          nivelAvaliacao,
          cidade,
          estado,
          telefone,
          email,
          observacoes,
          dataAtualizacao: new Date().toISOString()
        });

        toast.success('Juiz atualizado com sucesso!');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Erro ao atualizar juiz:', error);
      toast.error('Erro ao atualizar juiz');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Carregando dados do juiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Editar Juiz</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">CPF</label>
            <input
              type="text"
              value={cpf}
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
            />
          </div>

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
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 