import type { Opinion } from "@/interfaces/Opinion";
import Api from "@/services";

export async  function getOpinions(limit: number, offset: number, career_id?:number, subject_id?:number): Promise<Opinion[]> {
  try {
    const opinions = await Api.get<Opinion[]>('/opinion/all/web', { params: {
      limit, offset,
      ...((career_id && career_id > 0) ? { career_id }: {}),
      ...((subject_id && subject_id > 0) ? { subject_id }: {})
      }}
    )
    return opinions;
  } catch (error) {
    throw error;
  }
}

export async function getOpinionById(id: number): Promise<Opinion> {
  try {
    const opinion = await Api.get<Opinion>(`/opinion/${id}/web`);
    return opinion;
  } catch (error) {
    throw error;
  }
}