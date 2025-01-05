'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { db } from '@/app/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditarEquipe({ params }: PageProps) {
  const [nomeEquipe, setNomeEquipe] = useState('');
  const [codigoEquipe, setCodigoEquipe] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  // Carregar dados da equipe
  useEffect(() => {
    const loadEquipe = async () => {
      if (!user) return;

      try {
        const docRef = doc(db, 'equipes', params.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setNomeEquipe(data.nomeEquipe || '');
          setCodigoEquipe(data.codigoEquipe || '');
          setResponsavel(data.responsavel || '');
          setEmail(data.email || '');
          setTelefone(data.telefone || '');
          setEstado(data.estado || '');
          setCidade(data.cidade || '');
          setObservacoes(data.observacoes || '');
        } else {
          toast.error('Equipe não encontrada');
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Erro ao carregar equipe:', error);
        toast.error('Erro ao carregar dados da equipe');
      } finally {
        setLoading(false);
      }
    };

    loadEquipe();
  }, [user, params.id]);

  // Formatar código da equipe
  const handleCodigoEquipe = (value: string) => {
    const formatted = value.toUpperCase().replace(/[^A-Z]/g, '');
    if (formatted.length <= 4) {
      setCodigoEquipe(formatted);
    }
  };

  // Formatar telefone
  const formatTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/g, '($1) $2-$3');
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTelefone(e.target.value);
    if (formatted.length <= 15) {
      setTelefone(formatted);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (codigoEquipe.length !== 4) {
      toast.error('O código da equipe deve ter exatamente 4 letras');
      return;
    }

    setLoading(true);

    try {
      const docRef = doc(db, 'equipes', params.id);
      await updateDoc(docRef, {
        nomeEquipe,
        codigoEquipe,
        responsavel,
        email,
        telefone,
        estado,
        cidade,
        observacoes,
        updatedAt: new Date().toISOString()
      });

      toast.success('Equipe atualizada com sucesso!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro ao atualizar equipe:', error);
      toast.error('Erro ao atualizar equipe');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#00A3FF] p-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/logo.png" alt="GP Logo" className="h-12" />
        </div>
        <button 
          onClick={() => router.push('/dashboard')}
          className="text-white hover:text-blue-100"
        >
          Voltar
        </button>
      </header>

      <main className="container mx-auto p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-[#1B224B] mb-6">
            Editar Equipe
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Os mesmos campos do formulário de cadastro */}
            <div>
              <label className="block text-[#1B224B] mb-2">Nome da Equipe</label>
              <input 
                type="text" 
                value={nomeEquipe}
                onChange={(e) => setNomeEquipe(e.target.value)}
                className="w-full p-2 border rounded-lg bg-[#F8F9FE]"
                placeholder="Nome da equipe"
                required
              />
            </div>

            <div>
              <label className="block text-[#1B224B] mb-2">
                Código da Equipe (4 letras)
              </label>
              <input 
                type="text" 
                value={codigoEquipe}
                onChange={(e) => handleCodigoEquipe(e.target.value)}
                className="w-full p-2 border rounded-lg bg-[#F8F9FE] uppercase"
                placeholder="ABCD"
                required
                maxLength={4}
              />
            </div>

            <div>
              <label className="block text-[#1B224B] mb-2">Responsável pela Equipe</label>
              <input 
                type="text" 
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
                className="w-full p-2 border rounded-lg bg-[#F8F9FE]"
                placeholder="Nome do responsável"
                required
              />
            </div>

            <div>
              <label className="block text-[#1B224B] mb-2">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded-lg bg-[#F8F9FE]"
                placeholder="email@exemplo.com"
                required
              />
            </div>

            <div>
              <label className="block text-[#1B224B] mb-2">Telefone</label>
              <input 
                type="tel" 
                value={telefone}
                onChange={handleTelefoneChange}
                className="w-full p-2 border rounded-lg bg-[#F8F9FE]"
                placeholder="(00) 00000-0000"
                required
              />
            </div>

            <div>
              <label className="block text-[#1B224B] mb-2">Estado</label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full p-2 border rounded-lg bg-[#F8F9FE]"
                required
              >
                <option value="">Selecione o estado</option>
                {estados.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#1B224B] mb-2">Cidade</label>
              <input 
                type="text" 
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className="w-full p-2 border rounded-lg bg-[#F8F9FE]"
                placeholder="Nome da cidade"
                required
              />
            </div>

            <div>
              <label className="block text-[#1B224B] mb-2">Observações</label>
              <textarea 
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                className="w-full p-2 border rounded-lg bg-[#F8F9FE]"
                placeholder="Observações adicionais"
                rows={4}
              />
            </div>

            <div className="flex gap-4">
              <button 
                type="submit" 
                disabled={loading}
                className={`flex-1 bg-[#00A3FF] text-white py-2 px-4 rounded-lg hover:bg-blue-600
                  ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>

              <button 
                type="button"
                onClick={() => router.push('/dashboard')}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 