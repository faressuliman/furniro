export interface ISection {
    title: string,
    imageURL: string
}

export interface IProduct {
    id: number,
    title: string,
    description?: string,
    category?: string,
    price: number,
    thumbnail: string,
}