import type { Curso } from "@/components/cursos/columns";

export async function getData(): Promise<Curso[]> {
  // Simulação de chamada à API
  return [
    { id:1, grau: 'Licenciatura', curso: 'Engenharia Informática', respProf: 'Dr. Silva', cadeiras: [
        { id:1, nome: 'Programação Web', ano:1, ects:5, semestre:1 },
        { id:2, nome: 'Banco de Dados', ano:1, ects:5, semestre:2 },
        { id:3, nome: 'Estruturas de Dados', ano:1, ects:2, semestre:1 },
        { id:4, nome: 'Sistemas Operativos', ano:2, ects:4, semestre:1 },
        { id:5, nome: 'Redes de Computadores', ano:2, ects:7, semestre:2 },
        { id:6, nome: 'Engenharia de Software', ano:3, ects:6, semestre:1 },
        { id:7, nome: 'Inteligência Artificial', ano:3, ects:4, semestre:2 },
        { id:8, nome: 'Desenvolvimento Móvel', ano:1, ects:3, semestre:1 },], instituicao: 'ESTT', anoLetivo: '2024/2025', turmas: [
        { id:1, ano: 1, turma: 'A', semestre: 1 },
        { id:2, ano: 2, turma: 'B', semestre: 1 },
        { id:3, ano: 3, turma: 'C', semestre: 1 },
        { id:4, ano: 1, turma: 'A', semestre: 2 },
        { id:5, ano: 2, turma: 'B', semestre: 2 },
        { id:6, ano: 3, turma: 'C', semestre: 2 },],},
    { id:2, grau: 'Mestrado', curso: 'Matemática', respProf: 'Dra. Costa', cadeiras: [
        { id:1, nome: 'Cálculo I', ano:1, ects:5, semestre:1 },
        { id:2, nome: 'Álgebra Linear', ano:1, ects:2, semestre:1 },
        { id:3, nome: 'Probabilidade', ano:3, ects:6, semestre:2 },], instituicao: 'ESTA', anoLetivo: '2024/2025', turmas: [
          { id:7, ano: 1, turma: 'A', semestre: 1 },
          { id:8, ano: 2, turma: 'B', semestre: 1 },
          { id:9, ano: 3, turma: 'C', semestre: 1 },
          { id:10, ano: 1, turma: 'A', semestre: 2 },
          { id:11, ano: 2, turma: 'B', semestre: 2 },
          { id:12, ano: 3, turma: 'C', semestre: 2 },],},
    { id:3, grau: 'Doutoramento', curso: 'Física', respProf: 'Dr. Rodrigues', cadeiras: [], instituicao: 'ESTG', anoLetivo: '2024/2025', turmas: []},
    { id:4, grau: 'Licenciatura', curso: 'Química', respProf: 'Dra. Almeida', cadeiras: [], instituicao: 'ESTT', anoLetivo: '2024/2025', turmas: []},
    { id:5, grau: 'Mestrado', curso: 'Biologia', respProf: 'Dr. Pereira', cadeiras: [], instituicao: 'ESTT', anoLetivo: '2024/2025', turmas: []},
    { id:6, grau: 'Licenciatura', curso: 'Engenharia Civil', respProf: 'Dra. Santos', cadeiras: [], instituicao: 'ESTA', anoLetivo: '2024/2025', turmas: []},
    { id:7, grau: 'Mestrado', curso: 'Engenharia Eletrotécnica', respProf: 'Dr. Ferreira', cadeiras: [], instituicao: 'ESTG', anoLetivo: '2023/2024', turmas: []},
    { id:8, grau: 'Licenciatura', curso: 'Arquitetura', respProf: 'Dra. Martins', cadeiras: [], instituicao: 'ESTA', anoLetivo: '2022/2023', turmas: []},
    { id:9, grau: 'Doutoramento', curso: 'Psicologia', respProf: 'Dr. Oliveira', cadeiras: [], instituicao: 'ESTT', anoLetivo: '2021/2022', turmas: []},
    { id:10, grau: 'Licenciatura', curso: 'Educação Física', respProf: 'Dra. Costa', cadeiras: [], instituicao: 'ESTT', anoLetivo: '2020/2021', turmas: []},
    { id:11, grau: 'Mestrado', curso: 'História', respProf: 'Dr. Gomes', cadeiras: [], instituicao: 'ESTG', anoLetivo: '2023/2024', turmas: []},
    { id:12, grau: 'Licenciatura', curso: 'Geografia', respProf: 'Dra. Ribeiro', cadeiras: [], instituicao: 'ESTG', anoLetivo: '2023/2024', turmas: []},
    { id:13, grau: 'Mestrado', curso: 'Sociologia', respProf: 'Dr. Pinto', cadeiras: [], instituicao: 'Mafra', anoLetivo: '2023/2024', turmas: []},
    { id:14, grau: 'Licenciatura', curso: 'Antropologia', respProf: 'Dra. Ferreira', cadeiras: [], instituicao: 'Loures', anoLetivo: '2022/2023', turmas: []},
    { id:15, grau: 'Doutoramento', curso: 'Filosofia', respProf: 'Dr. Almeida', cadeiras: [], instituicao: 'ESTA', anoLetivo: '2022/2023', turmas: []},
    { id:16, grau: 'Licenciatura', curso: 'Arqueologia', respProf: 'Dra. Santos', cadeiras: [], instituicao: 'ESTG', anoLetivo: '2021/2022', turmas: []},
    { id:17, grau: 'Mestrado', curso: 'Literatura', respProf: 'Dr. Costa', cadeiras: [], instituicao: 'ESTT', anoLetivo: '2021/2022', turmas: []},
    { id:18, grau: 'Mestrado', curso: 'Antropologia Cultural', respProf: 'Dr. Oliveira', cadeiras: [], instituicao: 'ESTA', anoLetivo: '2020/2021', turmas: []},
    { id:19, grau: 'Licenciatura', curso: 'Ciências Políticas', respProf: 'Dra. Gomes', cadeiras: [], instituicao: 'ESTA', anoLetivo: '2020/2021', turmas: []},
    { id:20, grau: 'Doutoramento', curso: 'Direito Internacional', respProf: 'Dr. Ferreira', cadeiras: [], instituicao: 'ESTG', anoLetivo: '2022/2023', turmas: []},
  ]
}