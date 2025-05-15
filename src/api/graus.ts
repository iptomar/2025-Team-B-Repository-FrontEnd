import { API_BASE_URL } from "./cursos";

export async function fetchGraus() {
  const response = await fetch(`${API_BASE_URL}/Graus`);
  if (!response.ok) throw new Error("Erro ao buscar graus");
  return await response.json();
}