import type { Faculty } from "@/interfaces/Faculty";
import Api from "@/services";
export async function getAllFaculties() {
  try {
    const faculties = await Api.get<Faculty[]>('/faculties')
    return faculties;
  } catch (error) {
    throw error
  }
}