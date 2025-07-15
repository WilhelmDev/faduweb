import type { Opinion, OpinionPayload } from "@/interfaces/Opinion";
import type { PaginatedEp } from "@/interfaces/Response";
import Api from "@/services";

export async  function getOpinions(limit: number, offset: number, search:string, career_id?:number, subject_id?:number): Promise<PaginatedEp<Opinion[]>> {
  try {
    const response = await Api.get<PaginatedEp<Opinion[]>>('/opinion/all/web', { params: {
      limit, offset, search,
      ...((career_id && career_id > 0) ? { career_id }: {}),
      ...((subject_id && subject_id > 0) ? { subject_id }: {})
      }}
    )
    return response;
  } catch (error) {
    throw error;
  }
}

export async function getOpinionsByStudent(studentId: number): Promise<Opinion[]> {
  try {
    const opinions = await Api.get<Opinion[]>(`opinion/all?offset=0&student_id=${studentId}`);
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

export async function createOpinion(opinion: OpinionPayload): Promise<Opinion> {
  try {
    const createdOpinion = await Api.post<Opinion>('/opinion/create', opinion);
    return createdOpinion;
  } catch (error) {
    throw error;
  }
}