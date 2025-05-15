import { API_BASE_URL } from "./cursos";

export async function fetchInstituicoes() {
  const response = await fetch(`${API_BASE_URL}/Instituicoes`);
  if (!response.ok) throw new Error("Erro ao buscar instituições");
  return await response.json();
}