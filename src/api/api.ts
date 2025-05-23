import type { Curso, Grau, Instituicao, Localidade, Tipologia } from "@/components/interfaces";

export async function getData(): Promise<Curso[]> {
  // Simulação de chamada à API
  return [
    {
      id: 1,
      grau: "Licenciatura",
      curso: "Engenharia Informática",
      respProf: "Dr. Silva",
      cadeiras: [
        {
          id: 1,
          nome: "Programação Web",
          ano: 1,
          ects: 5,
          semestre: 1,
          aulas: [
            {
              id: 3,
              duração: "02:00",
              tipologia: "Teórica",
              professor: { id: 4, nome: "Dr. Fernando" },
              turmas: [
                {
                  id: 1,
                  ano: 1,
                  turma: "A",
                  semestre: 1,
                },
                {
                  id: 2,
                  ano: 1,
                  turma: "B",
                  semestre: 1,
                },
              ],
            },
            {
              id: 4,
              duração: "02:00",
              tipologia: "Prática",
              professor: { id: 4, nome: "Dr. Fernando" },
              turmas: [
                {
                  id: 1,
                  ano: 1,
                  turma: "B",
                  semestre: 1,
                },
              ],
            },
            {
              id: 5,
              duração: "02:00",
              tipologia: "Prática",
              professor: { id: 4, nome: "Dr. Fernando" },
              turmas: [
                {
                  id: 1,
                  ano: 1,
                  turma: "A",
                  semestre: 1,
                },
              ],
            },
          ],
        },
        {
          id: 2,
          nome: "Banco de Dados",
          ano: 1,
          ects: 5,
          semestre: 2,
          aulas: [
            {
              id: 3,
              duração: "1:00",
              tipologia: "Teórica",
              professor: { id: 4, nome: "Dr. Fernando" },
              turmas: [
                {
                  id: 1,
                  ano: 1,
                  turma: "A",
                  semestre: 1,
                },
              ],
            },
          ],
        },
        {
          id: 3,
          nome: "Estruturas de Dados",
          ano: 1,
          ects: 2,
          semestre: 1,
          aulas: [
            {
              id: 3,
              duração: "1:00",
              tipologia: "Teórica",
              professor: { id: 4, nome: "Dr. Fernando" },
              turmas: [
                {
                  id: 1,
                  ano: 1,
                  turma: "A",
                  semestre: 1,
                },
              ],
            },
          ],
        },
        {
          id: 4,
          nome: "Sistemas Operativos",
          ano: 2,
          ects: 4,
          semestre: 1,
          aulas: [
            {
              id: 3,
              duração: "1:00",
              tipologia: "Teórica",
              professor: { id: 4, nome: "Dr. Fernando" },
              turmas: [
                {
                  id: 1,
                  ano: 1,
                  turma: "A",
                  semestre: 1,
                },
              ],
            },
          ],
        },
        {
          id: 5,
          nome: "Redes de Computadores",
          ano: 2,
          ects: 7,
          semestre: 2,
          aulas: [
            {
              id: 3,
              duração: "1:00",
              tipologia: "Teórica",
              professor: { id: 4, nome: "Dr. Fernando" },
              turmas: [
                {
                  id: 1,
                  ano: 1,
                  turma: "A",
                  semestre: 1,
                },
              ],
            },
          ],
        },
        {
          id: 6,
          nome: "Engenharia de Software",
          ano: 3,
          ects: 6,
          semestre: 1,
          aulas: [
            {
              id: 3,
              duração: "1:00",
              tipologia: "Teórica",
              professor: { id: 4, nome: "Dr. Fernando" },
              turmas: [
                {
                  id: 1,
                  ano: 1,
                  turma: "A",
                  semestre: 1,
                },
              ],
            },
          ],
        },
        {
          id: 7,
          nome: "Inteligência Artificial",
          ano: 3,
          ects: 4,
          semestre: 3,
          aulas: [
            {
              id: 3,
              duração: "1:00",
              tipologia: "Teórica",
              professor: { id: 4, nome: "Dr. Fernando" },
              turmas: [
                {
                  id: 1,
                  ano: 1,
                  turma: "A",
                  semestre: 1,
                },
              ],
            },
          ],
        },
        {
          id: 8,
          nome: "Desenvolvimento Móvel",
          ano: 1,
          ects: 3,
          semestre: 1,
          aulas: [
            {
              id: 3,
              duração: "1:00",
              tipologia: "Teórica",
              professor: { id: 4, nome: "Dr. Fernando" },
              turmas: [
                {
                  id: 1,
                  ano: 1,
                  turma: "A",
                  semestre: 1,
                },
              ],
            },
          ],
        },
      ],
      instituicao: "ESTT",
      anoLetivo: "2024/2025",
      turmas: [
        { id: 1, ano: 1, turma: "A", semestre: 1 },
        { id: 2, ano: 2, turma: "B", semestre: 1 },
        { id: 3, ano: 3, turma: "C", semestre: 1 },
        { id: 4, ano: 1, turma: "A", semestre: 2 },
        { id: 5, ano: 2, turma: "B", semestre: 2 },
        { id: 6, ano: 3, turma: "C", semestre: 2 },
      ],
      professores: [
        { id: 1, nome: "Dr. Silva" },
        { id: 2, nome: "Dra. Costa" },
        { id: 3, nome: "Dr. Rodrigues" },
      ],
    },
    {
      id: 2,
      grau: "Mestrado",
      curso: "Matemática",
      respProf: "Dra. Costa",
      cadeiras: [
        {
          id: 10,
          nome: "Cálculo I",
          ano: 1,
          ects: 5,
          semestre: 1,
          aulas: [],
        },
        {
          id: 2,
          nome: "Álgebra Linear",
          ano: 1,
          ects: 2,
          semestre: 1,
          aulas: [
            {
              id: 2,
              duração: "1:00",
              tipologia: "Teórica",
              professor: { id: 4, nome: "Dr. Fernando" },
              turmas: [
                {
                  id: 1,
                  ano: 1,
                  turma: "A",
                  semestre: 1,
                },
              ],
            },
          ],
        },
        {
          id: 3,
          nome: "Probabilidade",
          ano: 3,
          ects: 6,
          semestre: 2,
          aulas: [
            {
              id: 3,
              duração: "1:00",
              tipologia: "Teórica",
              professor: { id: 4, nome: "Dr. Fernando" },
              turmas: [
                {
                  id: 1,
                  ano: 1,
                  turma: "A",
                  semestre: 1,
                },
              ],
            },
          ],
        },
      ],
      instituicao: "ESTA",
      anoLetivo: "2024/2025",
      turmas: [
        { id: 7, ano: 1, turma: "A", semestre: 1 },
        { id: 8, ano: 2, turma: "B", semestre: 1 },
        { id: 9, ano: 3, turma: "C", semestre: 1 },
        { id: 10, ano: 1, turma: "A", semestre: 2 },
        { id: 11, ano: 2, turma: "B", semestre: 2 },
        { id: 12, ano: 3, turma: "C", semestre: 2 },
      ],
      professores: [
        { id: 1, nome: "Dr. Silva" },
        { id: 2, nome: "Dra. Costa" },
        { id: 3, nome: "Dr. Rodrigues" },
      ],
    },
    {
      id: 3,
      grau: "Doutoramento",
      curso: "Física",
      respProf: "Dr. Rodrigues",
      cadeiras: [],
      instituicao: "ESTG",
      anoLetivo: "2024/2025",
      turmas: [],
      professores: [],
    },
    {
      id: 4,
      grau: "Licenciatura",
      curso: "Química",
      respProf: "Dra. Almeida",
      cadeiras: [],
      instituicao: "ESTT",
      anoLetivo: "2024/2025",
      turmas: [],
      professores: [],
    },
    {
      id: 5,
      grau: "Mestrado",
      curso: "Biologia",
      respProf: "Dr. Pereira",
      cadeiras: [],
      instituicao: "ESTT",
      anoLetivo: "2024/2025",
      turmas: [],
      professores: [],
    },
    {
      id: 6,
      grau: "Licenciatura",
      curso: "Engenharia Civil",
      respProf: "Dra. Santos",
      cadeiras: [],
      instituicao: "ESTA",
      anoLetivo: "2024/2025",
      turmas: [],
      professores: [],
    },
    {
      id: 7,
      grau: "Mestrado",
      curso: "Engenharia Eletrotécnica",
      respProf: "Dr. Ferreira",
      cadeiras: [],
      instituicao: "ESTG",
      anoLetivo: "2023/2024",
      turmas: [],
      professores: [],
    },
    {
      id: 8,
      grau: "Licenciatura",
      curso: "Arquitetura",
      respProf: "Dra. Martins",
      cadeiras: [],
      instituicao: "ESTA",
      anoLetivo: "2022/2023",
      turmas: [],
      professores: [],
    },
    {
      id: 9,
      grau: "Doutoramento",
      curso: "Psicologia",
      respProf: "Dr. Oliveira",
      cadeiras: [],
      instituicao: "ESTT",
      anoLetivo: "2021/2022",
      turmas: [],
      professores: [],
    },
    {
      id: 10,
      grau: "Licenciatura",
      curso: "Educação Física",
      respProf: "Dra. Costa",
      cadeiras: [],
      instituicao: "ESTT",
      anoLetivo: "2020/2021",
      turmas: [],
      professores: [],
    },
    {
      id: 11,
      grau: "Mestrado",
      curso: "História",
      respProf: "Dr. Gomes",
      cadeiras: [],
      instituicao: "ESTG",
      anoLetivo: "2023/2024",
      turmas: [],
      professores: [],
    },
    {
      id: 12,
      grau: "Licenciatura",
      curso: "Geografia",
      respProf: "Dra. Ribeiro",
      cadeiras: [],
      instituicao: "ESTG",
      anoLetivo: "2023/2024",
      turmas: [],
      professores: [],
    },
    {
      id: 13,
      grau: "Mestrado",
      curso: "Sociologia",
      respProf: "Dr. Pinto",
      cadeiras: [],
      instituicao: "Mafra",
      anoLetivo: "2023/2024",
      turmas: [],
      professores: [],
    },
    {
      id: 14,
      grau: "Licenciatura",
      curso: "Antropologia",
      respProf: "Dra. Ferreira",
      cadeiras: [],
      instituicao: "Loures",
      anoLetivo: "2022/2023",
      turmas: [],
      professores: [],
    },
    {
      id: 15,
      grau: "Doutoramento",
      curso: "Filosofia",
      respProf: "Dr. Almeida",
      cadeiras: [],
      instituicao: "ESTA",
      anoLetivo: "2022/2023",
      turmas: [],
      professores: [],
    },
    {
      id: 16,
      grau: "Licenciatura",
      curso: "Arqueologia",
      respProf: "Dra. Santos",
      cadeiras: [],
      instituicao: "ESTG",
      anoLetivo: "2021/2022",
      turmas: [],
      professores: [],
    },
    {
      id: 17,
      grau: "Mestrado",
      curso: "Literatura",
      respProf: "Dr. Costa",
      cadeiras: [],
      instituicao: "ESTT",
      anoLetivo: "2021/2022",
      turmas: [],
      professores: [],
    },
    {
      id: 18,
      grau: "Mestrado",
      curso: "Antropologia Cultural",
      respProf: "Dr. Oliveira",
      cadeiras: [],
      instituicao: "ESTA",
      anoLetivo: "2020/2021",
      turmas: [],
      professores: [],
    },
    {
      id: 19,
      grau: "Licenciatura",
      curso: "Ciências Políticas",
      respProf: "Dra. Gomes",
      cadeiras: [],
      instituicao: "ESTA",
      anoLetivo: "2020/2021",
      turmas: [],
      professores: [],
    },
    {
      id: 20,
      grau: "Doutoramento",
      curso: "Direito Internacional",
      respProf: "Dr. Ferreira",
      cadeiras: [],
      instituicao: "ESTG",
      anoLetivo: "2022/2023",
      turmas: [],
      professores: [],
    },
  ];
}

/**
 *  Estas funções estão responsaveis pela obtenção dos dados relativos a pagina de administrador.
 */

/***
 * Esta função faz uma chamada à API para obter as localidades disponíveis.
 * @returns Uma lista de localidades disponíveis.
 * @throws Um erro se a chamada à API falhar.
 */
export async function getLocalidades(): Promise<Localidade[]> {
  const response = await fetch('http://localhost:5039/api/localidades');
  if (!response.ok) {
    throw new Error('Falha ao buscar localidades');
  }
  return await response.json();
}

/***
 * Esta função faz uma chamada à API para obter as instituições disponíveis.
 * @returns Uma lista de instituições disponíveis.
 * @throws Um erro se a chamada à API falhar.
 */
export async function getInstituicoes(): Promise<Instituicao[]> {
  const response = await fetch('http://localhost:5039/api/instituicoes');
  if (!response.ok) {
    throw new Error('Falha ao buscar instituições');
  }
  return await response.json();
}


/***
 * Esta função faz uma chamada à API para obter os graus disponíveis.
 * @returns Uma lista de graus disponíveis.
 * @throws Um erro se a chamada à API falhar.
 */
export async function getGrau(): Promise<Grau[]> {
  const response = await fetch('http://localhost:5039/api/graus');
  if (!response.ok) {
    throw new Error('Falha ao buscar graus');
  }
  return await response.json();
}

/***
 * Esta função faz uma chamada à API para criar um novo grau.
 * @param grauData Os dados do grau a serem criados.
 * @returns O grau criado.
 * @throws Um erro se a chamada à API falhar.
 */
export async function createGrau(grauData: { grau: string }): Promise<Grau> {
  const response = await fetch('http://localhost:5039/api/graus', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(grauData)
  });
  
  if (!response.ok) {
    throw new Error('Falha ao criar grau');
  }
  return await response.json();
}

/***
 * Esta função faz uma chamada à API para atualizar um grau existente.
 * @param grau Os dados do grau a serem atualizados.
 * @returns O grau atualizado.
 * @throws Um erro se a chamada à API falhar.
 */
export async function updateGrau(grau: Grau): Promise<void> {
  const response = await fetch(`http://localhost:5039/api/graus/${grau.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(grau)
  });
  
  if (!response.ok) {
    throw new Error('Falha ao atualizar grau');
  }
}

/***
 * Esta função faz uma chamada à API para excluir um grau existente.
 * @param id O ID do grau a ser excluído.
 * @throws Um erro se a chamada à API falhar.
 */
export async function deleteGrau(id: string): Promise<void> {
  const response = await fetch(`http://localhost:5039/api/graus/${id}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) {
    throw new Error('Falha ao excluir grau');
  }
}


/***
 * Esta função faz uma chamada à API para obter as tipologias disponíveis.
 * @returns Uma lista de tipologias disponíveis.
 * @throws Um erro se a chamada à API falhar.
 */
export async function getTipologia(): Promise<Tipologia[]> {
  const response = await fetch('http://localhost:5039/api/tipologias');
  if (!response.ok) {
    throw new Error('Falha ao buscar tipologias');
  }
  return await response.json();
}

/***
 * Esta função faz uma chamada à API para criar uma nova tipologia.
 * @param tipologia Os dados da tipologia a serem criados.
 * @returns A tipologia criada.
 * @throws Um erro se a chamada à API falhar.
 */
export async function createTipologia(tipologia: { tipologia: string }): Promise<Tipologia> {
  const response = await fetch('http://localhost:5039/api/tipologias', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tipologia),
  });
  
  if (!response.ok) {
    throw new Error('Falha ao criar tipologia');
  }
  return await response.json();
}