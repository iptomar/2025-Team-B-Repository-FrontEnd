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
  cadeira: string;
  ano: number;
  semestre: number;
  ects: number;
}

export interface Turma {
  id: number;
  ano: number;
  letra: string;
  semestre: number;
  cursoFK: number;
  curso: {
    id: number;
    curso: string;
  }
}

export interface Localidade {
  id: number;
  localidade: string;
}

export interface Instituicao {
  id: number;
  instituicao: string;
  localidadeFK: number;
  localidade: Localidade;
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
  userName: string;
  email: string;
}

export interface Aula {
  id: number;
  duracao: string;
  CadeiraFK: number;
  cadeira: {
    id: number;
    cadeira: string;
    ano: number;
    semestre: number;
    ects: number;
  };
  TipologiaFK: number;
  tipologia: {
    id: number;
    tipologia: string;
  };
  TurmaFK: number;
  turma: {
    id: number;
    ano: number;
    letra: string;
    semestre: number;
    cursoFK: number;
    curso: {
      id: number;
      curso: string;
    };
  };
  ProfessorFK: string;
  professor: {
    id: string;
    userName: string;
    email: string;
  };
}

export interface Sala {
  id: number
  sala: string
  localidadeFK: number
  localidade: {
    id: number
    localidade: string
  }
}

export interface Users {
  id: string;
  userName: string;
  email: string;
  password: string;
  Roles: string[];
}

export interface Horario {
  id: number;
  inicio: string;
  fim: string;
  estado: number;
  turmaFK: number;
  turma: {
    id: number;
    letra: string;
    ano: number;
    semestre: number;
    cursoFK: number;
    curso: {
      id: number;
      curso: string;
    };
  };
  blocos: any[];
}