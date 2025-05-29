export const API_BASE_URL = "https://localhost:7223/api";

export async function loginAPI(values: any) {
  const url = `${API_BASE_URL}/auth/login`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    localStorage.setItem("token", json.token);
    return json;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erro ao fazer login:", error.message);
    } else {
      console.error("Erro ao fazer login:", error);
    }
    throw error;
  }
}

/**
 *  Estas funções estão responsaveis pela obtenção dos dados relativos a pagina de administrador.
 */

/***
 * Esta função faz uma chamada à API para obter as localidades disponíveis.
 * @returns Uma lista de localidades disponíveis.
 * @throws Um erro se a chamada à API falhar.
 */
export async function getLocalidades(): Promise<Localidade[]> {
  const response = await fetch('http://localhost:5039/api/localidades');
  if (!response.ok) {
    throw new Error('Falha ao buscar localidades');
  }
  return await response.json();
}

/***
 * Esta função faz uma chamada à API para obter as instituições disponíveis.
 * @returns Uma lista de instituições disponíveis.
 * @throws Um erro se a chamada à API falhar.
 */
export async function getInstituicoes(): Promise<Instituicao[]> {
  const response = await fetch('http://localhost:5039/api/instituicoes');
  if (!response.ok) {
    throw new Error('Falha ao buscar instituições');
  }
  return await response.json();
}


/***
 * Esta função faz uma chamada à API para obter os graus disponíveis.
 * @returns Uma lista de graus disponíveis.
 * @throws Um erro se a chamada à API falhar.
 */
export async function getGrau(): Promise<Grau[]> {
  const response = await fetch('http://localhost:5039/api/graus');
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
  const response = await fetch('http://localhost:5039/api/graus', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(grauData)
  });
  
  if (!response.ok) {
    throw new Error('Falha ao criar grau');
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
  const response = await fetch(`http://localhost:5039/api/graus/${grau.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(grau)
  });
  
  if (!response.ok) {
    throw new Error('Falha ao atualizar grau');
  }
}

/***
 * Esta função faz uma chamada à API para excluir um grau existente.
 * @param id O ID do grau a ser excluído.
 * @throws Um erro se a chamada à API falhar.
 */
export async function deleteGrau(id: string): Promise<void> {
  const response = await fetch(`http://localhost:5039/api/graus/${id}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) {
    throw new Error('Falha ao excluir grau');
  }
}


/***
 * Esta função faz uma chamada à API para obter as tipologias disponíveis.
 * @returns Uma lista de tipologias disponíveis.
 * @throws Um erro se a chamada à API falhar.
 */
export async function getTipologia(): Promise<Tipologia[]> {
  const response = await fetch('http://localhost:5039/api/tipologias');
  if (!response.ok) {
    throw new Error('Falha ao buscar tipologias');
  }
  return await response.json();
}

/***
 * Esta função faz uma chamada à API para criar uma nova tipologia.
 * @param tipologia Os dados da tipologia a serem criados.
 * @returns A tipologia criada.
 * @throws Um erro se a chamada à API falhar.
 */
export async function createTipologia(tipologia: { tipologia: string }): Promise<Tipologia> {
  const response = await fetch('http://localhost:5039/api/tipologias', {
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