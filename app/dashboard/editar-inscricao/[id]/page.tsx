'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { db } from '@/app/firebase';
import { doc, getDoc, updateDoc, getDocs, collection } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface PageProps {
  params: {
    id: string;
  };
}

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
  categoria: string;
  modalidade: string;
}

interface Idade {
  id: string;
  codigo: string;
  faixaIdade: string;
  descricaoCompleta?: string;
}

export default function EditarInscricao({ params }: PageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingDados, setLoadingDados] = useState(true);
  
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

  // Carregar dados iniciais
  useEffect(() => {
    const carregarDados = async () => {
      if (!params?.id) {
        toast.error('ID da inscrição não encontrado');
        router.push('/dashboard/inscricoes');
        return;
      }

      try {
        setLoadingDados(true);
        
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

        // Carregar modalidades
        console.log('Carregando modalidades...');
        const modalidadesSnapshot = await getDocs(collection(db, 'modalidades'));
        const modalidadesData = modalidadesSnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Dados da modalidade:', { id: doc.id, ...data });
          return {
            id: doc.id,
            nomeModalidade: data.nomeModalidade || 'Modalidade sem nome'
          };
        });
        console.log('Modalidades carregadas:', modalidadesData);
        setModalidades(modalidadesData);

        // Carregar categorias
        console.log('Carregando categorias...');
        const categoriasSnapshot = await getDocs(collection(db, 'categorias'));
        const categoriasData = categoriasSnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Dados da categoria:', { id: doc.id, ...data });
          return {
            id: doc.id,
            categoria: data.categoria || 'Categoria sem nome',
            modalidade: data.modalidade || ''
          };
        });
        console.log('Categorias carregadas:', categoriasData);
        setCategorias(categoriasData);

        // Carregar idades
        const idadesSnapshot = await getDocs(collection(db, 'idades'));
        const idadesData = idadesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Idade[];
        setIdades(idadesData);

        // Carregar inscrição atual
        const inscricaoDoc = await getDoc(doc(db, 'inscricoes', params.id));
        if (inscricaoDoc.exists()) {
          const data = inscricaoDoc.data();
          console.log('Dados da inscrição:', data);
          setEquipeId(data.equipeId || '');
          setPatinadorId(data.patinadorId || '');
          setModalidadeId(data.modalidadeId || '');
          setCategoriaId(data.categoriaId || '');
          setIdadeId(data.idadeId || '');
        } else {
          toast.error('Inscrição não encontrada');
          router.push('/dashboard/inscricoes');
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar dados');
        router.push('/dashboard/inscricoes');
      } finally {
        setLoadingDados(false);
      }
    };

    carregarDados();
  }, [params?.id, router]);

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
    
    if (!params?.id) {
      toast.error('ID da inscrição não encontrado');
      return;
    }

    if (!equipeId || !patinadorId || !modalidadeId || !categoriaId || !idadeId) {
      toast.error('Todos os campos são obrigatórios');
      return;
    }

    try {
      setLoading(true);

      // Buscar os dados completos dos itens selecionados
      const equipe = equipes.find(e => e.id === equipeId);
      const patinador = patinadores.find(p => p.id === patinadorId);
      const modalidade = modalidades.find(m => m.id === modalidadeId);
      const categoria = categorias.find(c => c.id === categoriaId);
      const idade = idades.find(i => i.id === idadeId);

      if (!modalidade || !categoria || !equipe || !patinador || !idade) {
        throw new Error('Dados necessários não encontrados');
      }

      const inscricaoRef = doc(db, 'inscricoes', params.id);

      // Atualizar inscrição
      await updateDoc(inscricaoRef, {
        equipeId,
        equipeNome: equipe.nomeEquipe,
        patinadorId,
        patinadorNome: patinador.nome,
        modalidadeId,
        modalidadeNome: modalidade.nomeModalidade,
        categoriaId,
        categoriaNome: categoria.categoria,
        idadeId,
        idadeFaixa: idade.faixaIdade,
        dataAtualizacao: new Date().toISOString(),
        usuarioAtualizacao: user?.email || 'sistema'
      });

      toast.success('Inscrição atualizada com sucesso!');
      
      // Pequeno delay antes do redirecionamento para garantir que o toast seja exibido
      setTimeout(() => {
        setLoading(false);
        router.push('/dashboard/inscricoes');
      }, 1000);
    } catch (error) {
      console.error('Erro ao atualizar inscrição:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar inscrição');
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
          Editar Inscrição
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
                  console.log('Categoria selecionada:', e.target.value);
                  setCategoriaId(e.target.value);
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
                    {idade.descricaoCompleta || `${idade.codigo} - ${idade.faixaIdade}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || loadingDados}
                className={`
                  flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${(loading || loadingDados) ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>

              <button
                type="button"
                onClick={() => router.push('/dashboard/inscricoes')}
                disabled={loading || loadingDados}
                className={`
                  flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200
                  ${(loading || loadingDados) ? 'opacity-50 cursor-not-allowed' : ''}
                `}
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