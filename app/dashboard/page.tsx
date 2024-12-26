export default function Dashboard() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#00A3FF] p-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/logo.png" alt="GP Logo" className="h-12" />
        </div>
        <button className="text-white">Cadastrar Vaga</button>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-8 flex gap-8">
        {/* Left Section */}
        <div className="w-1/2 bg-[#E6E9F2] p-8 rounded-lg">
          <h1 className="text-2xl font-bold text-[#1B224B] mb-4">
            Grande Premio de Patinação 2025<br />
            App -Cadastramento e Inscrição.
          </h1>
          <p className="text-[#1B224B]">
            Grandes equipes, atletas iniciantes formato livre sob regulamento 
            compartilhado e desenvolvimento continuo.
          </p>
        </div>

        {/* Right Section - Form */}
        <div className="w-1/2">
          <h2 className="text-2xl font-bold text-[#1B224B] mb-6">
            Cadastrar uma Equipe
          </h2>
          <p className="mb-6 text-[#1B224B]">
            Você técnico de equipe pode cadastras sua equipe e atletas no Grande Premio de Patinação 2025
          </p>

          <form className="space-y-4">
            <div>
              <label className="block text-[#1B224B] mb-2">Endereço de Email</label>
              <input 
                type="email" 
                className="w-full p-2 border rounded-lg bg-[#F8F9FE]"
                placeholder="Endereço de Email"
              />
            </div>

            <div>
              <label className="block text-[#1B224B] mb-2">Nome da Equipe</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-lg bg-[#F8F9FE]"
                placeholder="Nome da Equipe"
              />
            </div>

            <div>
              <label className="block text-[#1B224B] mb-2">Palavra-chave</label>
              <input 
                type="password" 
                className="w-full p-2 border rounded-lg bg-[#F8F9FE]"
                placeholder="Palavra-chave"
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#00A3FF] text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Cadastrar Equipe
            </button>
          </form>
        </div>
      </main>
    </div>
  )
} 