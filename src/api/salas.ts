import { API_BASE_URL } from "./api";

export async function fetchSalas() {
  const response = await fetch(`${API_BASE_URL}/Salas`);
  if (!response.ok) throw new Error("Erro ao buscar salas");
  return await response.json();
}

export async function fetchSalaById(id: number) {
  const response = await fetch(`${API_BASE_URL}/Salas/${id}`);
  if (!response.ok) throw new Error("Erro ao buscar sala");
  return await response.json();
}

export async function createSala(sala: any) {
  const response = await fetch(`${API_BASE_URL}/Salas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sala),
  });
  if (!response.ok) throw new Error("Erro ao criar sala");
  return await response.json();
}

export async function updateSala(id: number, sala: any) {
  const response = await fetch(`${API_BASE_URL}/Salas/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sala),
  });
  if (!response.ok) throw new Error("Erro ao atualizar sala");
}

export async function deleteSala(id: number) {
  const response = await fetch(`${API_BASE_URL}/Salas/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Erro ao deletar sala");
}
