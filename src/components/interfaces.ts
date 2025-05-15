export interface Curso {
  id: number;
  curso: string;
  grau: string;
  instituicao: string;
  respProf: string;
  anoLetivo: string;
  cadeiras: Cadeira[];
  turmas: Turma[]
  professores: Professor[];
}

export interface Cadeira {
  id: number;
  nome: string;
  ano: number;
  semestre: number;
  ects: number;
}

export interface Turma {
  id: number;
  ano: number;
  turma: string;
  semestre: number;
}

export interface Localidade {
  id: number;
  Localidade: string;
}

export interface Instituicao {
  id: number;
  instituicao: string;
  localidade: string;
}

export interface Grau {
  id: number;
  grau: string;
}

export interface Tipologia {
  id: number;
  tipologia: string;
}

export interface Professor {
  id: number;
  nome: string;
}

export interface Sala {
  id: string
  Nome_sala: string
  Nome_localidade: string
}