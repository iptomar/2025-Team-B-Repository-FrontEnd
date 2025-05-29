import { API_BASE_URL } from "./api";

export async function fetchCadeiras() {
  const response = await fetch(`${API_BASE_URL}/Cadeiras`);
  if (!response.ok) throw new Error('Erro ao buscar cadeiras');
  return await response.json();
}

export async function fetchCadeira(id: number) {
  const response = await fetch(`${API_BASE_URL}/Cadeiras/${id}`);
  if (!response.ok) throw new Error('Cadeira não encontrada');
  return await response.json();
}

export async function createCadeira(cadeira: any) {
  const response = await fetch(`${API_BASE_URL}/Cadeiras`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cadeira),
  });

  if (!response.ok) throw new Error('Erro ao criar cadeira');
  return await response.json();
}

export async function updateCadeira(id: number, cadeira: any) {
  const response = await fetch(`${API_BASE_URL}/Cadeiras/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cadeira),
  });

  if (!response.ok) throw new Error('Erro ao atualizar cadeira');
}

export async function deleteCadeira(id: number) {
  const response = await fetch(`${API_BASE_URL}/Cadeiras/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) throw new Error('Erro ao eliminar cadeira');
}
