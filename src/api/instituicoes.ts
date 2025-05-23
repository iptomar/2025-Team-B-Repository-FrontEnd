import type { Instituicao } from "@/components/interfaces";

const API_BASE_URL = 'http://localhost:5039/api';

export async function fetchInstituicoes() {
  const response = await fetch(`${API_BASE_URL}/Instituicoes`);
  if (!response.ok) throw new Error("Erro ao buscar instituições");
  return await response.json();
}

/***
 * Esta função faz uma chamada à API para obter as instituições disponíveis.
 * @returns Uma lista de instituições disponíveis.
 * @throws Um erro se a chamada à API falhar.
 */
export async function getInstituicoes(): Promise<Instituicao[]> {
  const response = await fetch(`${API_BASE_URL}/instituicoes`);
  if (!response.ok) {
    throw new Error('Falha ao buscar instituições');
  }
  return await response.json();
}

/**
 * Esta função faz uma chamada à API para criar uma nova instituição.
 * @param instituicao Dados da instituição a ser criada.
 * @returns A instituição criada.
 * @throws Um erro se a chamada à API falhar.
 */
export async function createInstituicao(instituicao: { instituicao: string; localidadeFK: number }): Promise<Instituicao> {
  const response = await fetch(`${API_BASE_URL}/instituicoes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(instituicao),
  });

  if (!response.ok) {
    throw new Error('Falha ao criar instituição');
  }

  return await response.json();
}

/**
 * Atualiza uma instituição existente
 */
export async function updateInstituicao(id: number, instituicao: { instituicao: string; localidadeFK: number }): Promise<Instituicao> {
  const response = await fetch(`${API_BASE_URL}/instituicoes/${id}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          id: id,
          instituicao: instituicao.instituicao,
          localidadeFK: instituicao.localidadeFK,
      }),
  });

  if (!response.ok) {
      throw new Error('Falha ao atualizar instituição');
  }
}

/**
 * Esta função faz uma chamada à API para deletar uma instituição.
 * @param id O ID da instituição a ser deletada.
 * @throws Um erro se a chamada à API falhar.
 */
export async function deleteInstituicao(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/instituicoes/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Falha ao deletar instituição');
  }
}
