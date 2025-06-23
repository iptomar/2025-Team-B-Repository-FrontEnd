import { API_BASE_URL } from "./api";
import type { Users } from "@/components/interfaces";

export async function fetchUsers(): Promise<Users[]> {
  const response = await fetch(`${API_BASE_URL}/Users`);
  if (!response.ok) throw new Error("Erro ao buscar utilizadores");
  return await response.json();
}

export async function getUsers(): Promise<Users[]> {
  const response = await fetch(`${API_BASE_URL}/Users`);
  if (!response.ok) {
    throw new Error('Falha ao buscar utilizadores');
  }
  return await response.json();
}

export async function fetchRoles(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/Users/roles`);
  if (!response.ok) throw new Error("Erro ao buscar roles");
  return await response.json();
}

export async function updateUser(
  id: string,
  email: string,
  username: string,
  roles: string[]
): Promise<{ id: string; email: string; username: string; updatedRoles: string[] }> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Email: email,
      Username: username,
      Roles: roles
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Erro ao atualizar utilizador: ${errorData.message || response.statusText}`);
  }

  return await response.json();
}