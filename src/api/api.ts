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

export async function getLocalidades(): Promise<Localidade[]> {
  // Simulação de chamada à API
  return [
    {
      id: 1,
      Localidade: "Tomar",
    },
    {
      id: 2,
      Localidade: "Torres Novas",
    },
    {
      id: 3,
      Localidade: "Abrantes",
    },
  ];
}


export async function getInstituicoes(): Promise<Instituicao[]> {
  // Simulação de chamada à API
  return [
    {
      id: 1,
      instituicao: "IPT",
      localidade: "Tomar",
    },
    {
      id: 2,
      instituicao: "ESTT",
      localidade: "Torres Novas",
    },
    {
      id: 3,
      instituicao: "ESTA",
      localidade: "Abrantes",
    },
  ];
}

export async function getGrau(): Promise<Grau[]> {
  // Simulação de chamada à API
  return [
    {
      id: 1,
      grau: "Licenciatura",
    },
    {
      id: 2,
      grau: "Mestrado"
    },
    {
      id: 3,
      grau: "Doutoramento"
    },
  ];
}


export async function getTipologia(): Promise<Tipologia[]> {
  // Simulação de chamada à API
  return [
    {
      id: 1,
      tipologia: "Teórica-Prática",
    },
    {
      id: 2,
      tipologia: "Pratica-laboratorial"
    },
  ];
}