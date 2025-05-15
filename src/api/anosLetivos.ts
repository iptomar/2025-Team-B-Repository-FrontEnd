import { API_BASE_URL } from "./cursos";

export async function fetchAnosLetivos() {
  const response = await fetch(`${API_BASE_URL}/AnosLetivos`);
  if (!response.ok) throw new Error("Erro ao buscar anos letivos");
  return await response.json();
}