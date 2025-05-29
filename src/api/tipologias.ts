import type { Tipologia } from "@/components/interfaces";
import { API_BASE_URL } from "./api";

export async function getTipologia(): Promise<Tipologia[]> {
    const response = await fetch(`${API_BASE_URL}/tipologias`);
    if (!response.ok) {
        throw new Error('Falha ao buscar tipologias');
    }
    return await response.json();
}

export async function createTipologia(tipologia: { tipologia: string }): Promise<Tipologia> {
    const response = await fetch(`${API_BASE_URL}/tipologias`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tipologia),
    });
    
    if (!response.ok) {
        throw new Error('Falha ao criar tipologia');
    }
    return await response.json();
}

export async function updateTipologia(tipologia: Tipologia): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/tipologias/${tipologia.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tipologia),
    });
    
    if (!response.ok) {
        throw new Error('Falha ao atualizar tipologia');
    }
}

export async function deleteTipologia(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/tipologias/${id}`, {
        method: 'DELETE',
    });
    
    if (!response.ok) {
        throw new Error('Falha ao deletar tipologia');
    }
}