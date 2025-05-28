import type { Localidade } from "@/components/interfaces";
import { API_BASE_URL } from "./api";

/***
 * Esta função faz uma chamada à API para obter as localidades disponíveis.
 * @returns Uma lista de localidades disponíveis.
 * @throws Um erro se a chamada à API falhar.
 */
export async function getLocalidades(): Promise<Localidade[]> {
    const response = await fetch(`${API_BASE_URL}/localidades`);
    if (!response.ok) {
        throw new Error('Falha ao buscar localidades');
    }
    return await response.json();
}
/**
 * Esta função faz uma chamada à API para enviar uma localidade.
 * @param localidade - A localidade a ser enviada.
 * @returns A resposta da API.
 * @throws Um erro se a chamada à API falhar.
 */
export async function createLocalidade(localidade: string): Promise<Response> {
        const response = await fetch(`${API_BASE_URL}/localidades`, {
                method: 'POST',
                headers: {
                        'Content-Type': 'application/json',
                },
                body: JSON.stringify({ localidade }),
        });

        if (!response.ok) {
                throw new Error('Falha ao enviar a localidade');
        }

        return response;
}


/**
 * Atualiza uma localidade existente
 */
export async function updateLocalidade(id: number, nome: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/localidades/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id, localidade: nome }),
        });
    
        if (!response.ok) {
            throw new Error('Falha ao atualizar localidade');
        }

        // Não faz mais o parsing da resposta, pois não é esperado um corpo
    }


/**
 * Esta função faz uma chamada à API para deletar uma localidade.
 * @param id - O ID da localidade a ser deletada.
 * @returns A resposta da API.
 * @throws Um erro se a chamada à API falhar.
 */
export async function deleteLocalidade(id: number): Promise<Response> {
        const response = await fetch(`${API_BASE_URL}/localidades/${id}`, {
                method: 'DELETE',
        });

        if (!response.ok) {
                throw new Error('Falha ao deletar a localidade');
        }

        return response;
}
