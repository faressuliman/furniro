import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchProducts } from "../lib/api";
import Loader from "./ui/Loader";

const SearchDropDown = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
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

    // Handle click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    // Handlers
    const handleProductClick = (id: number) => {
        navigate(`/product/${id}`);
        setIsOpen(false);
        setSearchTerm("");
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        if (e.target.value.length > 0) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    };

    const handleViewAll = () => {
        navigate(`/search?q=${searchTerm}`);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <div className="flex items-center gap-2 border-b border-gray-400 pb-1 focus-within:border-primary transition-colors group">
                <input
                    type="text"
                    placeholder="Search"
                    className="text-sm text-gray-500 bg-transparent border-none outline-none w-36"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={() => {
                        if (searchTerm.length > 0) setIsOpen(true);
                    }}
                />
                <Search className="w-4 h-4 text-gray-500" />
            </div>

            {isOpen && debouncedSearchTerm.length > 2 && (
                <div className="absolute top-full right-0 w-80 bg-white shadow-lg rounded-md mt-4.5 z-50 max-h-96 overflow-y-auto border border-gray-100">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-4">
                            <Loader />
                        </div>
                    ) : products.length > 0 ? (
                        <div className="py-2">
                            {products.map((product: any) => (
                                <div
                                    key={product.id}
                                    className="flex gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-none"
                                    onClick={() => handleProductClick(product.id)}
                                >
                                    <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                        <img
                                            src={product.thumbnail}
                                            alt={product.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-medium text-gray-900 truncate">
                                            {product.title}
                                        </h4>
                                        <p className="text-xs font-bold text-black mt-0.5">
                                            ${product.price}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div className="p-2 text-center border-t border-gray-100">
                                <button
                                    onClick={handleViewAll}
                                    className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer"
                                >
                                    View all {products.length} results
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 text-center text-sm text-gray-500">
                            No results found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchDropDown;
