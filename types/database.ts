// Tipos para a estrutura do banco de dados

export interface Modalidade {
  id: string;
  nome: string;        // Ex: "Circular"
  style: string;       // Ex: "CIR"
  categoria: string;   // Ex: "Iniciante", "Estreante", "Novatos", "Dente de Leite"
  subStyle: string;    // Ex: "IN", "ES", "NO", "DL"
  codigo: string;      // Ex: "IN1", "ES1", "NO1", "DL1"
  idadeMin: number;    // Idade mínima
  idadeMax: number;    // Idade máxima
  tempoMin: string;    // Tempo mínimo (formato "mm:ss")
  tempoMax: string;    // Tempo máximo (formato "mm:ss")
  ativo: boolean;      // Se a modalidade está ativa
  createdAt: Date;
  updatedAt: Date;
}

export interface Categoria {
  id: string;
  nome: string;        // Ex: "Iniciante", "Estreante"
  codigo: string;      // Ex: "IN", "ES"
  descricao: string;
  ordem: number;       // Para ordenação
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FaixaEtaria {
  id: string;
  nome: string;        // Ex: "5-6 anos", "7-8 anos"
  idadeMin: number;
  idadeMax: number;
  categoria: string;   // Referência à categoria
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TempoProva {
  id: string;
  categoria: string;   // Referência à categoria
  tempoMin: string;    // Tempo mínimo
  tempoMax: string;    // Tempo máximo
  descricao: string;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
} 