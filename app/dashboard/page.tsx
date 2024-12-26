export default function Dashboard() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#00A3FF] p-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/logo.png" alt="GP Logo" className="h-12" />
        </div>
        <button className="text-white hover:text-blue-100">
          Cadastrar Vaga
        </button>
      </header>

      {/* Conteúdo Principal - será implementado no próximo passo */}
      <main className="container mx-auto p-8">
        <h1>Dashboard em construção...</h1>
      </main>
    </div>
  )
} 