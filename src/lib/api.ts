import axiosInstance from "./axios"
import { supabase } from "../lib/supabaseClient";

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