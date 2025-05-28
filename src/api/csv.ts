import { API_BASE_URL } from "./api";

export async function filesSubmit(files: File[]): Promise<string> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await fetch(`${API_BASE_URL}/csv`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Error submitting files: ${response.statusText}`);
  }
  
  return response.text(); // texto que será posto no Toast

}