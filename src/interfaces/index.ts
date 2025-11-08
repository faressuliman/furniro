export interface ISection {
    title: string,
    imageURL: string
}

export interface IProduct {
    id: number,
    title: string,
    subtitle: string
    description?: string,
    price: number,
    thumbnail: string,
}