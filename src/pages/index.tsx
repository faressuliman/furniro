import hero from "../assets/hero-bg.png";
import Button from "../components/ui/Button";
import { sectionsData } from "../data";
import ProductCard from "../components/ui/ProductCard";
import { IProduct } from "../interfaces";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../lib/api";
import ProductCardSkeleton from "../components/ui/ProductSkeleton";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import decoration1 from "../assets/decoration1.jpg";
import decoration2 from "../assets/decoration2.jpg";
import decoration3 from "../assets/decoration3.jpg";

const slides = [decoration1, decoration2, decoration3];

const Index = () => {

  const renderSectionsData = sectionsData.map(({ title, imageURL }) => (
    <div key={title} className="h-[500px] flex flex-col items-center gap-4 pt-5">
      <div className="w-[380px] lg:w-[300px] xl:w-[380px] h-[480px] rounded-md overflow-hidden shadow-lg hover:opacity-70 transition-opacity duration-300 hover:cursor-pointer">
        <img src={imageURL} alt={title} className="w-full h-full object-cover" />
      </div>
      <h2 className="text-grey font-bold md:text-xl text-lg">{title}</h2>
    </div>
  ));

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const [current, setCurrent] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <section className="absolute inset-0">
          <img
            src={hero}
            className="w-full h-full object-cover"
            alt="Stylish room with modern furniture"
          />
        </section>

        <section className="relative z-10 w-full max-w-7xl xl:max-w-8xl mx-auto px-6 lg:px-16">
          <div className="bg-secondary p-8 sm:p-10 lg:p-12 md:ml-auto w-11/12 max-w-lg sm:max-w-xl md:max-w-md lg:max-w-[550px]">
            <p className="tracking-widest text-sm font-bold mb-3 sm:mb-4">
              New Arrival
            </p>

            <h1 className="tracking-wide text-2xl sm:text-3xl lg:text-5xl text-primary font-bold md:mb-2 sm:mb-4 leading-tight">
              Discover Our
            </h1>

            <h1 className="tracking-wide text-2xl sm:text-3xl lg:text-5xl text-primary font-bold mb-3 sm:mb-4 leading-tight">
              New Collection
            </h1>

            <p className="font-medium text-sm sm:text-base mb-4 sm:mb-6 lg:mb-8">
              Elevate your space with our latest curated furniture and decor.
              Experience the perfect blend of modern design, crafted for comfort
              and lasting style.
            </p>

            <Button className="w-full md:w-48 py-4 text-white bg-primary border hover:bg-secondary hover:-translate-y-1 hover:border-primary hover:text-primary mb-4 text-sm">
              SHOP NOW
            </Button>
          </div>
        </section>
      </section>

      {/* Dining/Living/Bedroom Section */}
      <section className="mt-8 max-w-screen-3xl mx-auto p-4 lg:px-12">
        <h2 className="text-grey font-bold md:text-3xl text-2xl text-center mb-1">
          Browse The Range
        </h2>
        <p className="md:text-lg text-md text-center mb-5">
          Intriguing and concise. Explore a world of possibilities with our
          diverse and ever-growing selection.
        </p>

        <div className="flex xl:flex xl:flex-row flex-col space-y-8 max-w-screen-3xl justify-center lg:grid lg:grid-cols-3 lg:gap-x-8">
          {renderSectionsData}
        </div>
      </section>




      {/* Featured Products Section */}
      <section className="mt-16 max-w-screen-3xl mx-auto p-4 lg:px-12">
        <h2 className="text-grey font-bold md:text-3xl text-2xl text-center mb-8">
          Featured Products
        </h2>

        <div className="flex flex-col items-center space-y-8 max-w-screen-3xl justify-center md:grid md:grid-cols-2 md:justify-items-center lg:grid lg:grid-cols-4 lg:gap-x-24 xl:gap-x-0 lg:justify-items-center">
          {isLoading
            ? [...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)
            : data?.data?.slice(0, 4).map((product: IProduct) => (
              <ProductCard
                key={product.id}
                title={product.title}
                subtitle={product.subtitle}
                price={product.price}
                thumbnail={product.thumbnail}
              />
            ))}
        </div>


        <div className="flex justify-center mt-10">
          <Button className="w-56 text-center bg-white border text-primary border-primary hover:bg-primary hover:-translate-y-1 hover:text-white text-sm">
            SHOP ALL
          </Button>
        </div>
      </section>

      {/* Room Inspiration Section */}
      <section className="mt-20 bg-secondary py-16">
        <div className="max-w-screen-3xl mx-auto p-4 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-10">

            {/* Text */}
            <div className="lg:w-1/3 w-full space-y-6 text-center lg:text-left">
              <h2 className="md:text-3xl text-2xl font-bold text-gray-800">
                50+ Beautiful rooms inspiration
              </h2>
              <p className="text-gray-600">
                Our designer already made a lot of beautiful prototypes of rooms that inspire you.
              </p>
              <div className="flex justify-center lg:justify-start">
                <Button className="bg-primary text-white border hover:bg-secondary hover:text-primary hover:border-primary transition-all hover:-translate-y-1">
                  Explore More
                </Button>
              </div>
            </div>

            {/* Slideshow */}
            <div className="lg:w-2/3 w-full relative">
              <div className="overflow-hidden rounded-lg shadow-md relative h-[400px]">
                {slides.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Room inspiration ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${index === current ? "opacity-100" : "opacity-0"
                      }`}
                  />
                ))}
              </div>

              {/* Navigation buttons */}
              <button
                onClick={() =>
                  setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
                }
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white shadow hover:cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              <button
                onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
                className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white shadow hover:cursor-pointer"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>

              {/* Dots */}
              <div className="flex justify-center mt-4 space-x-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrent(index)}
                    className={`w-3 h-3 rounded-full transition hover:cursor-pointer ${index === current
                      ? "bg-primary"
                      : "bg-gray-300 hover:bg-gray-400"
                      }`}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
};

export default Index;
