import type { Image } from "./Image";

export interface Career{
    "id": number,
    "name": string,
    "image_id": number,
    "created_at": Date,
    "updated_at": Date,
    "image": Image
}