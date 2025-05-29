import { API_BASE_URL } from "./api";

export async function fetchProfessores() {
  const response = await fetch(`${API_BASE_URL}/Professores`);
  if (!response.ok) throw new Error("Erro ao buscar professores");
  return await response.json();
}

export async function fetchProfessoresDoCurso(cursoId: number) {
  const response = await fetch(`${API_BASE_URL}/Professores/curso/${cursoId}`);
  if (!response.ok) {
    throw new Error('Erro ao buscar professores');
  }
  return await response.json(); 
}

export async function adicionarProfessorAoCurso(professor: any) {
  const response = await fetch(`${API_BASE_URL}/Professores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(professor),
  });
  if (!response.ok) throw new Error("Erro ao adicionar professor");
  return await response.json();
}

export async function removeProfessorDoCurso(cursoId: number, professorId: string) {
  const response = await fetch(`${API_BASE_URL}/Professores?cursoId=${cursoId}&professorId=${professorId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) {
    const erro = await response.text();
    throw new Error(`Erro ao remover professor: ${erro}`);
  }
  return await response.json();
}