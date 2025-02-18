'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { db } from '@/app/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Equipe {
  id: string;
  nomeEquipe: string;
}

interface Patinador {
  id: string;
  nome: string;
  equipe: string;
  dataNascimento: string;
}

interface Modalidade {
  id: string;
  nomeModalidade: string;
}

interface Categoria {
  id: string;
  categoria: string;
  modalidade: string;
}

interface Idade {
  id: string;
  codIdade: string;
  categoria: string;
}

export default function CadastrarInscricao() {
  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [patinadores, setPatinadores] = useState<Patinador[]>([]);
  const [modalidades, setModalidades] = useState<Modalidade[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [idades, setIdades] = useState<Idade[]>([]);
  
  const [equipeId, setEquipeId] = useState('');
  const [patinadorId, setPatinadorId] = useState('');
  const [modalidadeId, setModalidadeId] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [idadeId, setIdadeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingDados, setLoadingDados] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Carregar equipes
        const equipesSnapshot = await getDocs(collection(db, 'equipes'));
        const equipesData = equipesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Equipe[];
        setEquipes(equipesData);

        // Carregar patinadores
        const patinadoresSnapshot = await getDocs(collection(db, 'patinadores'));
        const patinadoresData = patinadoresSnapshot.docs.map(doc => ({
          id: doc.id,
          nome: doc.data().nome,
          equipe: doc.data().equipe,
          dataNascimento: doc.data().dataNascimento
        }));
        console.log('Patinadores carregados:', patinadoresData);
        setPatinadores(patinadoresData);

        // Carregar modalidades
        const modalidadesSnapshot = await getDocs(collection(db, 'modalidades'));
        const modalidadesData = modalidadesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Modalidade[];
        setModalidades(modalidadesData);

        // Carregar categorias
        const categoriasSnapshot = await getDocs(collection(db, 'categorias'));
        const categoriasData = categoriasSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Categoria[];
        setCategorias(categoriasData);

        // Carregar idades
        const idadesSnapshot = await getDocs(collection(db, 'idades'));
        const idadesData = idadesSnapshot.docs.map(doc => ({
          id: doc.id,
          codIdade: doc.data().codIdade,
          categoria: doc.data().categoria
        }));
        console.log('Idades carregadas:', idadesData);
        setIdades(idadesData);

      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar dados');
      } finally {
        setLoadingDados(false);
      }
    };

    carregarDados();
  }, []);

  // Filtrar patinadores por equipe
  const patinadoresFiltrados = patinadores.filter(patinador => 
    !equipeId || patinador.equipe === equipeId
  );

  // Filtrar categorias por modalidade
  const categoriasFiltradas = categorias.filter(categoria => 
    !modalidadeId || categoria.modalidade === modalidadeId
  );

  // Filtrar idades por categoria
  const idadesFiltradas = idades.filter(idade => 
    !categoriaId || idade.categoria === categoriaId
  );
  console.log('Idades filtradas:', idadesFiltradas);

  // Função para calcular idade
  const calcularIdade = (dataNascimento: string): string => {
    if (!dataNascimento) return 'Data não informada';
    
    try {
      const hoje = new Date();
      const nascimento = new Date(dataNascimento);
      let idade = hoje.getFullYear() - nascimento.getFullYear();
      const mesAtual = hoje.getMonth();
      const mesNascimento = nascimento.getMonth();
      
      if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
        idade--;
      }
      
      return `${idade} anos`;
    } catch (error) {
      console.error('Erro ao calcular idade:', error);
      return 'Erro ao calcular idade';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!equipeId || !patinadorId || !modalidadeId || !categoriaId) {
      toast.error('Equipe, Patinador, Modalidade e Categoria são obrigatórios');
      return;
    }

    setLoading(true);

    try {
      const patinador = patinadores.find(p => p.id === patinadorId);
      if (!patinador) {
        throw new Error('Patinador não encontrado');
      }

      const equipe = equipes.find(e => e.id === equipeId);
      const modalidade = modalidades.find(m => m.id === modalidadeId);
      const categoria = categorias.find(c => c.id === categoriaId);

      const idadeCalculada = calcularIdade(patinador.dataNascimento);
      console.log('Idade calculada:', idadeCalculada);

      await addDoc(collection(db, 'inscricoes'), {
        equipeId,
        equipeNome: equipe?.nomeEquipe || '',
        patinadorId,
        patinadorNome: patinador.nome,
        modalidadeId,
        modalidadeNome: modalidade?.nomeModalidade || '',
        categoriaId,
        categoriaNome: categoria?.categoria || '',
        idade: idadeCalculada,
        dataCadastro: new Date().toISOString(),
        usuarioCadastro: user?.email || 'sistema'
      });

      toast.success('Inscrição realizada com sucesso!');
      router.push('/dashboard/inscricoes');
    } catch (error) {
      console.error('Erro ao realizar inscrição:', error);
      toast.error('Erro ao realizar inscrição');
    } finally {
      setLoading(false);
    }
  };

  if (loadingDados) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Nova Inscrição
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equipe
              </label>
              <select
                value={equipeId}
                onChange={(e) => {
                  setEquipeId(e.target.value);
                  setPatinadorId(''); // Resetar patinador ao mudar de equipe
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Selecione uma equipe</option>
                {equipes.map((equipe) => (
                  <option key={equipe.id} value={equipe.id}>
                    {equipe.nomeEquipe}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patinador
              </label>
              <select
                value={patinadorId}
                onChange={(e) => setPatinadorId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Selecione um patinador</option>
                {patinadoresFiltrados.map((patinador) => (
                  <option key={patinador.id} value={patinador.id}>
                    {patinador.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modalidade
              </label>
              <select
                value={modalidadeId}
                onChange={(e) => {
                  setModalidadeId(e.target.value);
                  setCategoriaId(''); // Resetar categoria ao mudar de modalidade
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Selecione uma modalidade</option>
                {modalidades.map((modalidade) => (
                  <option key={modalidade.id} value={modalidade.id}>
                    {modalidade.nomeModalidade}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={categoriaId}
                onChange={(e) => {
                  setCategoriaId(e.target.value);
                  setIdadeId(''); // Resetar idade ao mudar de categoria
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Selecione uma categoria</option>
                {categoriasFiltradas.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.categoria}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Idade do Patinador
              </label>
              <div className="w-full p-2 border border-gray-300 rounded-md bg-gray-50">
                {patinadorId ? (
                  (() => {
                    const patinador = patinadores.find(p => p.id === patinadorId);
                    console.log('Patinador selecionado:', patinador);
                    return patinador ? calcularIdade(patinador.dataNascimento) : 'Patinador não encontrado';
                  })()
                ) : (
                  'Selecione um patinador para ver a idade'
                )}
              </div>
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
                {loading ? 'Realizando Inscrição...' : 'Realizar Inscrição'}
              </button>

              <button
                type="button"
                onClick={() => router.push('/dashboard/inscricoes')}
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