'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { modalidadeService } from '@/services/modalidadeService';
import { Modalidade } from '@/types/database';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function ModalidadesAdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [modalidades, setModalidades] = useState<Modalidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState('');

  // Verificar se o usuário está logado
  if (!user) {
    router.push('/login');
    return null;
  }

  useEffect(() => {
    carregarModalidades();
  }, []);

  const carregarModalidades = async () => {
    try {
      setLoading(true);
      const dados = await modalidadeService.listar();
      setModalidades(dados);
    } catch (error) {
      console.error('Erro ao carregar modalidades:', error);
      toast.error('Erro ao carregar modalidades');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletar = async (id: string, codigo: string) => {
    if (!confirm(`Tem certeza que deseja desativar a modalidade ${codigo}?`)) {
      return;
    }

    try {
      await modalidadeService.deletar(id);
      toast.success('Modalidade desativada com sucesso!');
      carregarModalidades();
    } catch (error) {
      console.error('Erro ao deletar modalidade:', error);
      toast.error('Erro ao desativar modalidade');
    }
  };

  const modalidadesFiltradas = modalidades.filter(modalidade => 
    filtroCategoria === '' || modalidade.categoria === filtroCategoria
  );

  const categorias = [...new Set(modalidades.map(m => m.categoria))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando modalidades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Gerenciar Modalidades
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Visualize e gerencie todas as modalidades do sistema
                </p>
              </div>
              <Link
                href="/admin/modalidades/nova"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Nova Modalidade
              </Link>
            </div>
          </div>

          <div className="p-6">
            {/* Filtros */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-4">
                <div>
                  <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
                    Filtrar por Categoria
                  </label>
                  <select
                    id="categoria"
                    value={filtroCategoria}
                    onChange={(e) => setFiltroCategoria(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Todas as categorias</option>
                    {categorias.map(categoria => (
                      <option key={categoria} value={categoria}>
                        {categoria}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Tabela de Modalidades */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Modalidade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Faixa Etária
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tempo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {modalidadesFiltradas.map((modalidade) => (
                    <tr key={modalidade.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {modalidade.codigo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {modalidade.nome} ({modalidade.style})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {modalidade.categoria}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {modalidade.idadeMin} - {modalidade.idadeMax === 99 ? '99+' : modalidade.idadeMax} anos
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {modalidade.tempoMin} - {modalidade.tempoMax}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          modalidade.ativo 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {modalidade.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/modalidades/editar/${modalidade.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Editar
                          </Link>
                          {modalidade.ativo && (
                            <button
                              onClick={() => handleDeletar(modalidade.id, modalidade.codigo)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Desativar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {modalidadesFiltradas.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhuma modalidade encontrada.</p>
              </div>
            )}

            {/* Estatísticas */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800">Total de Modalidades</h3>
                <p className="text-2xl font-bold text-blue-900">{modalidades.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-green-800">Modalidades Ativas</h3>
                <p className="text-2xl font-bold text-green-900">
                  {modalidades.filter(m => m.ativo).length}
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-yellow-800">Categorias</h3>
                <p className="text-2xl font-bold text-yellow-900">{categorias.length}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-purple-800">Modalidades Inativas</h3>
                <p className="text-2xl font-bold text-purple-900">
                  {modalidades.filter(m => !m.ativo).length}
                </p>
              </div>
            </div>

            {/* Botão para voltar */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <Link
                href="/admin"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Voltar à Administração
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 