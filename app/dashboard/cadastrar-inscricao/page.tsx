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
}

interface Modalidade {
  id: string;
  nomeModalidade: string;
}

interface Categoria {
  id: string;
  nome: string;
  modalidade: string;
}

interface Idade {
  id: string;
  codigo: string;
  faixaIdade: string;
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

  // Carregar dados iniciais
  useEffect(() => {
    const carregarDados = async () => {
      try {
        console.log('Iniciando carregamento das modalidades...');
        
        // Carregar modalidades
        const modalidadesRef = collection(db, 'modalidades');
        const modalidadesSnapshot = await getDocs(modalidadesRef);
        
        console.log('Total de modalidades encontradas:', modalidadesSnapshot.size);
        
        const modalidadesData = modalidadesSnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Dados da modalidade:', { id: doc.id, ...data });
          return {
            id: doc.id,
            nomeModalidade: data.nomeModalidade || ''
          };
        });

        console.log('Modalidades processadas:', modalidadesData);
        
        if (modalidadesData.length > 0) {
          setModalidades(modalidadesData);
        } else {
          console.log('Nenhuma modalidade encontrada');
        }

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
          ...doc.data()
        })) as Patinador[];
        setPatinadores(patinadoresData);

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
          ...doc.data()
        })) as Idade[];
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

  // Adicionar um useEffect para monitorar mudanças nas modalidades
  useEffect(() => {
    console.log('Estado atual das modalidades:', modalidades);
  }, [modalidades]);

  // Filtrar patinadores por equipe
  const patinadoresFiltrados = patinadores.filter(
    patinador => !equipeId || patinador.equipe === equipeId
  );

  // Filtrar categorias por modalidade
  const categoriasFiltradas = categorias.filter(
    categoria => !modalidadeId || categoria.modalidade === modalidadeId
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!equipeId || !patinadorId || !modalidadeId || !categoriaId || !idadeId) {
      toast.error('Todos os campos são obrigatórios');
      return;
    }

    setLoading(true);

    try {
      // Buscar os dados completos dos itens selecionados
      const equipe = equipes.find(e => e.id === equipeId);
      const patinador = patinadores.find(p => p.id === patinadorId);
      const modalidade = modalidades.find(m => m.id === modalidadeId);
      const categoria = categorias.find(c => c.id === categoriaId);
      const idade = idades.find(i => i.id === idadeId);

      if (!modalidade) {
        throw new Error('Modalidade não encontrada');
      }

      // Cadastrar inscrição
      await addDoc(collection(db, 'inscricoes'), {
        equipeId,
        equipeNome: equipe?.nomeEquipe || '',
        patinadorId,
        patinadorNome: patinador?.nome || '',
        modalidadeId,
        modalidadeNome: modalidade.nomeModalidade,
        categoriaId,
        categoriaNome: categoria?.nome || '',
        idadeId,
        idadeFaixa: idade?.faixaIdade || '',
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
                Modalidade {modalidades.length > 0 ? `(${modalidades.length})` : '(Carregando...)'}
              </label>
              <select
                value={modalidadeId}
                onChange={(e) => {
                  console.log('Modalidade selecionada:', e.target.value);
                  setModalidadeId(e.target.value);
                  setCategoriaId(''); // Resetar categoria ao mudar de modalidade
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Selecione uma modalidade</option>
                {modalidades.map((modalidade) => (
                  <option key={modalidade.id} value={modalidade.id}>
                    {modalidade.nomeModalidade || 'Sem nome'}
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
                onChange={(e) => setCategoriaId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Selecione uma categoria</option>
                {categoriasFiltradas.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Faixa de Idade
              </label>
              <select
                value={idadeId}
                onChange={(e) => setIdadeId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Selecione uma faixa de idade</option>
                {idades.map((idade) => (
                  <option key={idade.id} value={idade.id}>
                    {idade.faixaIdade}
                  </option>
                ))}
              </select>
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