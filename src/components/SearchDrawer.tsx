import { X, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { closeSearchDrawer, selectSearchDrawer } from "../app/features/searchDrawerSlice";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchProducts } from "../lib/api";
import Loader from "./ui/Loader";
import useScrollLock from "../hooks/useScrollLock";

const SearchDrawer = () => {
    const dispatch = useDispatch();
    const isOpenSearchDrawer = useSelector(selectSearchDrawer);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const navigate = useNavigate();

    // Debounce logic
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Search products
    const { data: products = [], isLoading } = useQuery({
        queryKey: ["searchProducts", debouncedSearchTerm],
        queryFn: () => searchProducts(debouncedSearchTerm),
        enabled: debouncedSearchTerm.length > 2,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Handlers
    const handleClose = () => {
        dispatch(closeSearchDrawer());
        setSearchTerm("");
    };

    const handleProductClick = (id: number) => {
        navigate(`/product/${id}`);
        handleClose();
    };

    // lock background scroll when search drawer open
    useScrollLock(isOpenSearchDrawer);

    return (
        <>
            {/* Backdrop */}
            {isOpenSearchDrawer && (
                <div
                    className="fixed inset-0 bg-black/40 bg-opacity-50 z-30"
                    onClick={handleClose}
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed top-0 left-0 z-40 h-screen w-80 bg-white transform transition-transform duration-500 ease-in-out shadow-lg
                ${isOpenSearchDrawer ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="p-6 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h5 className="text-xl font-bold text-black">Search</h5>
                        <button
                            onClick={handleClose}
                            className="text-gray-500 hover:text-primary transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="relative mb-8">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full p-2 pr-10 bg-gray-50 border-none rounded-md focus:ring-1 focus:ring-primary outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus={isOpenSearchDrawer}
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>

                    {isLoading && debouncedSearchTerm.length > 2 && (
                        <div className="text-center text-gray-500 py-2 ml-3"><Loader /></div>
                    )}

                    {products.length > 0 && (
                        <div className="flex-1 overflow-y-auto">
                            <h6 className="text-xs font-bold text-gray-900 uppercase mb-4 tracking-wider">Product Results</h6>
                            <div className="space-y-6">
                                {products.map((product: any) => (
                                    <div
                                        key={product.id}
                                        className="group cursor-pointer"
                                        onClick={() => handleProductClick(product.id)}
                                    >
                                        <div className="flex gap-4 items-start">
                                            <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden shrink-0">
                                                <img
                                                    src={product.thumbnail}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                                                    {product.title}
                                                </h4>
                                                <p className="text-sm font-bold text-black mt-1">
                                                    ${product.price}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                                <button
                                    onClick={() => {
                                        navigate(`/search?q=${searchTerm}`);
                                        handleClose();
                                    }}
                                    className="text-sm font-semibold text-black hover:text-primary transition-colors cursor-pointer"
                                >
                                    VIEW ALL RESULTS ({products.length})
                                </button>
                            </div>
                        </div>
                    )}

                    {!isLoading && products.length === 0 && debouncedSearchTerm.length > 2 && (
                        <div className="text-center text-gray-500 py-4">No results found.</div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SearchDrawer;
