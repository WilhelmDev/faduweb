
export interface Subject{
    "id": number,
    "name": string,
    "subject_category_id": number,
    "created_at": Date,
    "updated_at": Date,
    "subjectCategory": SubjectCategory,
    "userSubject": UserSubject[],
    "chairs": string[]
}
export interface UserSubject{
    "id": number,
    "user_id": number,
    "subject_id": number,
    "score": number,
    "finish": boolean,
    "created_at": Date,
    "updated_at": Date
}

export interface SubjectCategory{
    "id": number,
    "name": string,
    "career_id": number,
    "created_at": Date,
    "updated_at": Date
}