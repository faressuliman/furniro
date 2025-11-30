import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchProducts } from "../lib/api";
import PageHeader from "../components/PageHeader";
import ProductCard from "../components/ui/ProductCard";
import ProductCardSkeleton from "../components/ui/ProductSkeleton";
import { IProduct } from "../interfaces";

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";

    const { data: products = [], isLoading } = useQuery({
        queryKey: ["searchProducts", query],
        queryFn: () => searchProducts(query),
        enabled: query.length > 0,
    });

    return (
        <div>
            <PageHeader title="Search Results" />

            <div className="container mx-auto px-4 py-16 flex justify-center">
                {isLoading ? (
                    <div className="lg:w-11/12 w-full products-grid grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 md:gap-8 lg:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] lg:gap-x-5 lg:gap-y-8 xl:gap-y-8 justify-items-center">
                        {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
                    </div>
                ) : products.length > 0 ? (
                    <div className="lg:w-11/12 w-full products-grid grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 md:gap-8 lg:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] lg:gap-x-5 lg:gap-y-8 xl:gap-y-8 justify-items-center">
                        {products.map((product: IProduct) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                title={product.title}
                                category={product.category}
                                price={product.price}
                                thumbnail={product.thumbnail}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">No results found</h2>
                        <p className="text-gray-500">
                            We couldn't find any products matching "{query}". Try checking for typos or using different keywords.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResults;
