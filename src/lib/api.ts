import axiosInstance from "./axios"
import { supabase } from "../lib/supabaseClient";
import { ICreateOrderItemPayload, ICreateOrderPayload } from "../interfaces";

// User function

export const fetchUser = async () => {
    const { data, error } = await supabase.auth.getUser()

    if (error) throw error
    return data.user
}

// Products functions

export const fetchProducts = async () => {
    const res = await axiosInstance.get("/products");
    return res.data
}
export const getProductById = async (id: string) => {
    const res = await axiosInstance.get(`/products/${id}`)
    return res.data
}

export const getProductsByCategory = async (category: string) => {
    const res = await axiosInstance.get(`/products/category/${category}`)
    return res.data.products
}

export const fetchCategories = async () => {
    const res = await axiosInstance.get(`/products/category-list`)
    return res.data
}

export const searchProducts = async (query: string) => {
    const res = await axiosInstance.get(`/products/search?q=${query}`)
    return res.data.products
}

// Cart functions

export const fetchCartFromDB = async (userId: string) => {
    const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)

    if (error) throw error
    return data
}

export const addToCartDB = async (userId: string, productId: number, quantity: number) => {
    const { data, error } = await supabase
        .from('cart_items')
        .insert([{ user_id: userId, product_id: productId, quantity }])
        .select()

    if (error) throw error
    return data
}

export const updateCartItemDB = async (id: number, quantity: number) => {
    const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', id)
        .select()

    if (error) throw error
    return data
}

export const removeFromCartDB = async (id: number) => {
    const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', id)

    if (error) throw error
}

// Wishlist functions

export const fetchWishlistFromDB = async (userId: string) => {
    const { data, error } = await supabase
        .from('wishlist_items')
        .select('*')
        .eq('user_id', userId)

    if (error) throw error
    return data
}

export const addToWishlistDB = async (userId: string, productId: number) => {
    const { data, error } = await supabase
        .from('wishlist_items')
        .insert([{ user_id: userId, product_id: productId }])
        .select()

    if (error) throw error
    return data
}

export const removeFromWishlistDB = async (id: number) => {
    const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('id', id)

    if (error) throw error
}

// Helper functions

export const hydrateCart = async (cartItems: any[]) => {
    const promises = cartItems.map(async (item) => {
        const product = await getProductById(item.product_id.toString())
        return {
            ...product,
            quantity: item.quantity,
            cartItemId: item.id // Store the Supabase row ID
        }
    })
    return await Promise.all(promises)
}

export const hydrateWishlist = async (wishlistItems: any[]) => {
    const promises = wishlistItems.map(async (item) => {
        const product = await getProductById(item.product_id.toString())
        return {
            ...product,
            wishlistItemId: item.id // Store the Supabase row ID
        }
    })
    return await Promise.all(promises)
}

export const checkProductInCartDB = async (userId: string, productId: number) => {
    const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
}

export const checkProductInWishlistDB = async (userId: string, productId: number) => {
    const { data, error } = await supabase
        .from('wishlist_items')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
}

// Order functions

export const createOrder = async (payload: ICreateOrderPayload) => {
    const { userId, ...rest } = payload;

    const { data, error } = await supabase
        .from("orders")
        .insert([
            {
                user_id: userId,
                ...rest,
            },
        ])
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const createOrderItems = async (items: ICreateOrderItemPayload[]) => {
    if (items.length === 0) return [];

    const { data, error } = await supabase
        .from("order_items")
        .insert(items)
        .select();

    if (error) throw error;
    return data;
};

export const fetchOrders = async (userId: string) => {
    const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
};