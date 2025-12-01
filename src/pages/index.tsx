import hero from "../assets/hero-bg.png";
import Button from "../components/ui/Button";
import { useQuery } from "@tanstack/react-query";
import { getProductsByCategory } from "../lib/api";
import ProductCard from "../components/ui/ProductCard";
import ProductCardSkeleton from "../components/ui/ProductSkeleton";
import { IProduct } from "../interfaces";
import { useNavigate } from "react-router-dom";
import { featuresData } from "../data/features";

const Index = () => {
  const navigate = useNavigate();

  const { data: furnitureData, isLoading: furnitureLoading } = useQuery({
    queryKey: ["furniture"],
    queryFn: () => getProductsByCategory("furniture"),
  });

  const { data: decorationData, isLoading: decorationLoading } = useQuery({
    queryKey: ["home-decoration"],
    queryFn: () => getProductsByCategory("home-decoration"),
  });

  const isLoading = furnitureLoading || decorationLoading;

  const allFurnitureProducts = furnitureData?.slice(0, 4) || [];
  const allDecorationProducts = decorationData?.slice(0, 4) || [];

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <section className="absolute inset-0">
          <img
            src={hero}
            loading="eager"
            className="w-full h-full object-cover"
            alt="Stylish room with modern furniture"
          />
        </section>

        <section className="relative z-10 w-full max-w-7xl xl:max-w-8xl mx-auto px-6 lg:px-16">
          <div className="bg-secondary p-8 sm:p-10 lg:p-12 md:ml-auto w-11/12 max-w-lg sm:max-w-xl md:max-w-md lg:max-w-[600px] rounded-sm">
            <p className="tracking-widest text-sm font-bold mb-3 sm:mb-4 text-gray-900">
              New Arrival
            </p>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl text-primary font-bold mb-4 leading-tight">
              Discover Our <br /> New Collection
            </h1>

            <p className="font-medium text-sm sm:text-base mb-6 lg:mb-8 text-gray-700">
              Elevate your space with our latest curated furniture and decor.
              Experience the perfect blend of modern design, crafted for comfort
              and lasting style.
            </p>

            <Button
              onClick={() => navigate("/shop")}
              className="w-full md:w-48 py-4 text-white bg-primary border hover:bg-transparent hover:border-primary hover:text-primary transition-all duration-300 text-sm font-bold uppercase"
            >
              SHOP NOW
            </Button>
          </div>
        </section>
      </section>

      {/* Products Section */}
      <section className="py-16 px-4 max-w-screen-3xl mx-auto">
        {/* Furniture Category */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Furniture</h2>
            <button
              onClick={() => navigate("/shop")}
              className="text-xs font-medium text-gray-600 hover:text-gray-400 underline transition-colors hover:cursor-pointer duration-200"
            >
              Shop All
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-8 sm:gap-x-6 md:gap-8 lg:gap-x-5 lg:gap-y-8">
            {isLoading ? (
              <>
                {/* 4 on mobile, 3 on tablet (md), 4 on desktop (lg) */}
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={i === 3 ? "md:hidden lg:block" : ""}>
                    <ProductCardSkeleton />
                  </div>
                ))}
              </>
            ) : (
              <>
                {/* Show 4 on mobile, 3 on tablet (md), 4 on desktop (lg) */}
                {allFurnitureProducts.map((product: IProduct, index: number) => (
                  <div key={product.id} className={index === 3 ? "md:hidden lg:block" : ""}>
                    <ProductCard
                      id={product.id}
                      title={product.title}
                      category={product.category}
                      price={product.price}
                      thumbnail={product.thumbnail}
                    />
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        <hr className="my-16 text-gray-300 mx-auto lg:w-5/8" />

        {/* Decoration Category */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Decoration</h2>
            <button
              onClick={() => navigate("/shop")}
              className="text-xs font-medium text-gray-600 hover:text-gray-400 underline transition-colors hover:cursor-pointer duration-200"
            >
              Shop All
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-8 sm:gap-x-6 md:gap-8 lg:gap-x-5 lg:gap-y-8">
            {isLoading ? (
              <>
                {/* 4 on mobile, 3 on tablet (md), 4 on desktop (lg) */}
                {[...Array(4)].map((_, i) => (
                  <div
                    key={`decoration-${i}`}
                    className={i === 3 ? "md:hidden lg:block" : ""}
                  >
                    <ProductCardSkeleton />
                  </div>
                ))}
              </>
            ) : (
              <>
                {/* Show 4 on mobile, 3 on tablet (md), 4 on desktop (lg) */}
                {allDecorationProducts.map((product: IProduct, index: number) => (
                  <div key={product.id} className={index === 3 ? "md:hidden lg:block" : ""}>
                    <ProductCard
                      id={product.id}
                      title={product.title}
                      category={product.category}
                      price={product.price}
                      thumbnail={product.thumbnail}
                    />
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[#FAF3EA] py-8 md:py-4 mt-4">
        <div className="max-w-screen-3xl container mx-auto px-4 md:px-6 ">
          <div className="flex flex-col md:flex-row md:gap-x-8 lg:gap-x-32 gap-y-8 container md:mx-auto w-fit">
            {featuresData.map((feature, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="text-gray-900">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-md font-bold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-500 font-medium text-xs">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
