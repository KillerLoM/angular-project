export interface Course {
    id: number,
    title: string,
    subtitle: string,
    author: string,
    category: string,
    rating: number,
    thumbUrl: string,
    price: number,
    isFeatured: boolean,
    name_user: string,
    position?: number; 
}
