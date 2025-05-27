'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { popularBancoDados } from '@/scripts/seedDatabase';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Verificar se o usuário está logado
  if (!user) {
    router.push('/login');
    return null;
  }

  const handlePopularBanco = async () => {
    if (!confirm('Tem certeza que deseja popular o banco de dados? Esta ação irá criar todas as categorias e modalidades iniciais.')) {
      return;
    }

    setLoading(true);
    try {
      await popularBancoDados();
      toast.success('Banco de dados populado com sucesso!');
    } catch (error) {
      console.error('Erro ao popular banco:', error);
      toast.error('Erro ao popular banco de dados. Verifique o console para mais detalhes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              Administração do Sistema
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Gerencie os dados fixos do sistema de patinação artística
            </p>
          </div>

          <div className="p-6">
            {/* Seção de População Inicial */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Configuração Inicial
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Popular Banco de Dados
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        Clique no botão abaixo para popular o banco de dados com as categorias e modalidades iniciais.
                        Esta ação deve ser executada apenas uma vez, na configuração inicial do sistema.
                      </p>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={handlePopularBanco}
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Populando...' : 'Popular Banco de Dados'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu de Administração */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Gerenciar Categorias */}
              <Link href="/admin/categorias" className="block">
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7l2 2-2 2m2-2H9m10 0V9M5 19l2-2-2-2m2 2H3m2 0v2" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Categorias</h3>
                      <p className="text-sm text-gray-500">Gerenciar categorias de competição</p>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Gerenciar Modalidades */}
              <Link href="/admin/modalidades" className="block">
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Modalidades</h3>
                      <p className="text-sm text-gray-500">Gerenciar modalidades e suas configurações</p>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Relatórios */}
              <Link href="/admin/relatorios" className="block">
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Relatórios</h3>
                      <p className="text-sm text-gray-500">Visualizar estatísticas e relatórios</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Botão para voltar ao dashboard */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Voltar ao Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 