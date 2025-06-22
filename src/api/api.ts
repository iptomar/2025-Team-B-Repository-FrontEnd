export const API_BASE_URL = "https://localhost:7223/api";

export async function loginAPI(values: any) {
  const url = `${API_BASE_URL}/auth/login`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
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

export async function registerAPI(values: any) {
  const url = `${API_BASE_URL}/auth/register`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }
}
