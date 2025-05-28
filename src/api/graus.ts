import type { Grau } from "@/components/interfaces";
import { API_BASE_URL } from "./api";


export async function fetchGraus() {
  const response = await fetch(`${API_BASE_URL}/Graus`);
  if (!response.ok) throw new Error("Erro ao buscar graus");
  return await response.json();
}


/***
 * Esta função faz uma chamada à API para obter os graus disponíveis.
 * @returns Uma lista de graus disponíveis.
 * @throws Um erro se a chamada à API falhar.
 */
export async function getGrau(): Promise<Grau[]> {
  const response = await fetch(`${API_BASE_URL}/graus`);
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
  const response = await fetch(`${API_BASE_URL}/Graus`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(grauData)
  });
  
  if (!response.ok) {
    throw new Error('Erro ao criar grau');
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
  const response = await fetch(`${API_BASE_URL}/Graus/${grau.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(grau)
  });
  
  if (!response.ok) {
    throw new Error('Erro ao atualizar grau');
  }
}

/***
 * Esta função faz uma chamada à API para excluir um grau existente.
 * @param id O ID do grau a ser excluído.
 * @throws Um erro se a chamada à API falhar.
 */
export async function deleteGrau(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/Graus/${id}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) {
    throw new Error('Erro ao excluir grau');
  }
}