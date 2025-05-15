export interface Curso {
  id: number;
  curso: string;
  anoLetivoFK: number;
  anoLetivo: {
    id: number;
    anoLetivo: string;
  };
  instituicaoFK: number;
  instituicao: {
    id: number;
    instituicao: string;
    localidadeFK: number;
    localidade: any;
  };
  grauFK: number;
  grau: {
    id: number;
    grau: string;
  };
  professorFK: string;
  professor: {
    id: string;
    userName: string;
    email: string;
  };
}

export interface anoLetivo {
  id: number;
  anoLetivo: string;
};

export interface Cadeira {
  id: number;
  nome: string;
  ano: number;
  semestre: number;
  ects: number;
  aulas: Aula[];
}

export interface Turma {
  id: number;
  ano: number;
  turma: string;
  semestre: number;
}

export interface Professor {
  id: number;
  nome: string;
}

export interface Aula {
  id: number;
  duração: string;
  tipologia: string;
  professor: Professor;
  turmas: Turma[];
}
