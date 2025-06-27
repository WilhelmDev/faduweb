import type { Opinion } from "@/interfaces/Opinion";
import Api from "@/services";

export async  function getOpinions(limit: number, offset: number): Promise<Opinion[]> {
  try {
    const opinions = await Api.get<Opinion[]>('/opinion/all/web', { params: { limit, offset } });
    return opinions;
  } catch (error) {
    throw error;
  }
}