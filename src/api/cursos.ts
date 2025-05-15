export const API_BASE_URL = "https://localhost:7223/api";

export async function fetchCursos() {
  const response = await fetch(`${API_BASE_URL}/Cursos`);
  if (!response.ok) throw new Error("Erro ao buscar cursos");
  return await response.json();
}

export async function fetchCursoById(id: number) {
  const response = await fetch(`${API_BASE_URL}/Cursos/${id}`);
  if (!response.ok) throw new Error("Curso não encontrado");
  return await response.json();
}

export async function createCurso(curso: any) {
  const response = await fetch(`${API_BASE_URL}/Cursos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(curso),
  });
  if (!response.ok) throw new Error("Erro ao criar curso");
  return await response.json();
}

export async function updateCurso(id: number, curso: any) {
  const response = await fetch(`${API_BASE_URL}/Cursos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(curso),
  });
  if (!response.ok) throw new Error("Erro ao atualizar curso");
}

export async function deleteCurso(id: number) {
  const response = await fetch(`${API_BASE_URL}/Cursos/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Erro ao apagar curso");
}

export async function addCadeiraAoCurso(cursoId: number, cadeiraId: number) {
  const response = await fetch(
    `${API_BASE_URL}/Cursos/${cursoId}/cadeiras/${cadeiraId}`,
    {
      method: "POST",
    }
  );
  if (!response.ok) throw new Error("Erro ao adicionar cadeira ao curso");
}

export async function removeCadeiraDoCurso(cursoId: number, cadeiraId: number) {
  const response = await fetch(
    `${API_BASE_URL}/Cursos/${cursoId}/cadeiras/${cadeiraId}`,
    {
      method: "DELETE",
    }
  );
  if (!response.ok) throw new Error("Erro ao remover cadeira do curso");
}

export async function fetchCoordenadores() {
  const response = await fetch(`${API_BASE_URL}/Cursos/coordenadores`);
  if (!response.ok) throw new Error("Erro ao buscar coordenadores");
  return await response.json();
}

export async function fetchCursosPorAnoLetivo(anoLetivo: number) {
  const response = await fetch(`${API_BASE_URL}/Cursos/anoletivo/${anoLetivo}`);
  if (!response.ok) throw new Error("Erro ao buscar cursos por ano letivo");
  return await response.json();
}

export async function fetchCursosPorGrau(grau: number) {
  const response = await fetch(`${API_BASE_URL}/Cursos/grau/${grau}`);
  if (!response.ok) throw new Error("Erro ao buscar cursos por grau");
  return await response.json();
}