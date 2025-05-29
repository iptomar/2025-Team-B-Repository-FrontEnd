import { API_BASE_URL } from "./api";

export async function fetchAulas() {
  const response = await fetch(`${API_BASE_URL}/Aulas`);
  if (!response.ok) throw new Error('Erro ao buscar aulas');
  return await response.json();
}

export async function fetchAula(id: number) {
  const response = await fetch(`${API_BASE_URL}/Aulas/${id}`);
  if (!response.ok) throw new Error('Aula não encontrada');
  return await response.json();
}

export async function createAula(aula: any) {
  const response = await fetch(`${API_BASE_URL}/Aulas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(aula),
  });

  if (!response.ok) throw new Error('Erro ao criar aula');
  return await response.json();
}

export async function updateAula(id: number, aula: any) {
  const response = await fetch(`${API_BASE_URL}/Aulas/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(aula),
  });

  if (!response.ok) throw new Error('Erro ao atualizar aula');
}

export async function deleteAula(id: number) {
  const response = await fetch(`${API_BASE_URL}/Aulas/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) throw new Error('Erro ao eliminar aula');
}
