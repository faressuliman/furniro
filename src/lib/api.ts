import axiosInstance from "./axios"
import CookieService from "../services/CookieService";


const token = CookieService.get("jwt")

export const fetchProducts = async () => {
    const res = await axiosInstance.get("/products");
    return res.data
}

export const fetchUser = async () => {
    const res = await axiosInstance.get("/api/users/me", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
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