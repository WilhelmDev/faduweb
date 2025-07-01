import type { Career } from "@/interfaces/Career";
import Api from "@/services";
export async function getAllCareers() {
  try {
    const careers = await Api.get<Career[]>('/career/all/web')
    return careers;
  } catch (error) {
    throw error
  }
}