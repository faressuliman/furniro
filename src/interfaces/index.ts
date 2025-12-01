export interface IProduct {
    id: number,
    title: string,
    description?: string,
    category?: string,
    price: number,
    thumbnail: string,
}

export interface ICreateOrderPayload {
    userId: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postal_code?: string | null;
    order_notes?: string | null;
    payment_method: "card" | "cod";
    subtotal: number;
}

export interface ICreateOrderItemPayload {
    order_id: string;
    product_id: number;
    title: string;
    quantity: number;
    price: number;
}

export interface IOrder {
    id: string;
    created_at: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postal_code?: string | null;
    order_notes?: string | null;
    payment_method: "card" | "cod";
    subtotal: number;
}