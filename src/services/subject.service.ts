import type { Subject } from "@/interfaces/Subject";
import Api from "@/services";

export async function getSubjects() {
  try {
    const subjects = await Api.get<Subject[]>('/subject/all/web');
    return subjects;
  } catch (error) {
    throw error;
  }
}