import { useQuery } from "@tanstack/react-query";
import PageHeader from "../components/PageHeader";
import ProductCard from "../components/ui/ProductCard";
import ProductCardSkeleton from "../components/ui/ProductSkeleton";
import { fetchProducts } from "../lib/api";
import { IProduct } from "../interfaces";

const Shop = () => {

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  return (
    <div>
      <PageHeader title="Shop" />
      {/* Products*/}
      <section className="mt-16 max-w-screen-3xl mx-auto p-4 lg:px-8">

        <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] justify-items-center gap-x-8 sm:gap-x-0 lg:gap-x-4 gap-y-8 max-w-screen-3xl">
          {isLoading
            ? [...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)
            : data?.data?.map((product: IProduct) => (
              <ProductCard
                id={product.id}
                key={product.id}
                title={product.title}
                subtitle={product.subtitle}
                price={product.price}
                thumbnail={product.thumbnail}
              />
            ))}
        </div>


      </section>
    </div>
  );
};

export default Shop;
