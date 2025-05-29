import { API_BASE_URL } from "./api";

export async function getTipologia(): Promise<Tipologia[]> {
    const response = await fetch(`${API_BASE_URL}/tipologias`);
    if (!response.ok) {
        throw new Error('Falha ao buscar tipologias');
    }
    return await response.json();
}

export async function fetchTurmas() {
  const response = await fetch(`${API_BASE_URL}/Turmas`);
  if (!response.ok) throw new Error("Erro ao buscar turmas");
  return await response.json();
}

export async function fetchTurmaById(id: number) {
  const response = await fetch(`${API_BASE_URL}/Turmas/${id}`);
  if (!response.ok) throw new Error("Erro ao buscar turma");
  return await response.json();
}

export async function createTurma(turma: any) {
  const response = await fetch(`${API_BASE_URL}/Turmas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(turma),
  });
  if (!response.ok) throw new Error("Erro ao criar turma");
  return await response.json();
}

export async function updateTurma(id: number, turma: any) {
  const response = await fetch(`${API_BASE_URL}/Turmas/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(turma),
  });
  if (!response.ok) throw new Error("Erro ao atualizar turma");
}

export async function deleteTurma(id: number) {
  const response = await fetch(`${API_BASE_URL}/Turmas/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Erro ao deletar turma");
}
