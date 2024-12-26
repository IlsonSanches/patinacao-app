'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Card de Estatísticas */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Estatísticas</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total de Atletas</span>
            <span className="text-blue-600 font-semibold">0</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Competições Ativas</span>
            <span className="text-blue-600 font-semibold">0</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Avaliações Pendentes</span>
            <span className="text-blue-600 font-semibold">0</span>
          </div>
        </div>
      </div>

      {/* Card de Atividades Recentes */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Atividades Recentes</h3>
        <div className="space-y-4">
          <p className="text-gray-600">Nenhuma atividade recente</p>
        </div>
      </div>

      {/* Card de Próximos Eventos */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Próximos Eventos</h3>
        <div className="space-y-4">
          <p className="text-gray-600">Nenhum evento programado</p>
        </div>
      </div>
    </div>
  );
} 