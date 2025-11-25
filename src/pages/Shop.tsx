import { useQuery } from "@tanstack/react-query";
import PageHeader from "../components/PageHeader";
import ProductCard from "../components/ui/ProductCard";
import ProductCardSkeleton from "../components/ui/ProductSkeleton";
import { fetchCategories, fetchProducts, getProductsByCategory } from "../lib/api";
import { IProduct } from "../interfaces";
import { useState } from "react";
import CategoryDrawer from "../components/CategoryDrawer";
import { useDispatch } from "react-redux";
import { openCategoryDrawer } from "../app/features/categoryDrawerSlice";
import { Menu } from "lucide-react";

const Shop = () => {

  // Redux
  const dispatch = useDispatch();

  // State
  const [selectedCategory, setSelectedCategory] = useState("");

  // Fetching products
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  // Fetching category-list
  const { data: categoryData, isLoading: categoryLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories
  })

  // Fetching products by category
  const { data: categoryProducts, isLoading: categoryProductsLoading } = useQuery<IProduct[]>({
    queryKey: ["category-products", selectedCategory],
    queryFn: () => getProductsByCategory(selectedCategory),
    enabled: !!selectedCategory
  })

  // Displaying products
  const displayedProducts = selectedCategory ? categoryProducts || [] : data?.products || [];

  // Capitalize first letter
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div>
      <PageHeader title="Shop" />

      {/* Category Drawer for Mobile/Tablet */}
      <CategoryDrawer 
        categories={categoryData || []}
        loading={categoryLoading}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />

      {/* Products Section */}
      <section className="mt-8 max-w-screen-3xl mx-auto p-4 px-6 lg:px-8 ">

        {/* Mobile/Tablet Hamburger Button */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => dispatch(openCategoryDrawer())}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-primary hover:text-primary transition duration-300 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
            <span className="text-sm font-semibold">Categories</span>
          </button>
        </div>

        <div className="flex gap-3 lg:gap-12">
          {/* Desktop Category Sidebar */}
          <div className="hidden lg:block w-80 h-fit px-4 py-6 border border-gray-300 rounded-lg shrink-0">
            <h3 className="font-bold text-sm text-start mb-4">PRODUCT CATEGORIES</h3>
            <div>
              {categoryLoading ? (
                <ul className="space-y-4">
                  {[...Array(15)].map((_, i) => (
                    <li key={i} className="h-5 bg-gray-200 rounded animate-pulse"></li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-4">
                  <li
                    className={`text-sm font-medium cursor-pointer transition duration-200 ${selectedCategory === "" ? "text-primary" : "text-gray-700 hover:text-gray-400"}`}
                    onClick={() => setSelectedCategory("")}
                  >
                    All Products
                  </li>
                  {categoryData?.map((cat: string) => (
                    <li
                      key={cat}
                      className={`text-sm font-medium cursor-pointer transition duration-200 w-fit ${selectedCategory === cat ? "text-primary" : "text-gray-700 hover:text-gray-400"}`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {capitalizeFirstLetter(cat)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <h3 className="mb-6 font-bold text-xl md:text-2xl">
              {selectedCategory ? capitalizeFirstLetter(selectedCategory) : "All Products"}
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 md:gap-8 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-8 xl:grid-cols-3 xl:gap-y-8 2xl:grid-cols-5">
              {isLoading || categoryProductsLoading
                ? [...Array(12)].map((_, i) => <ProductCardSkeleton key={i} />)
                : displayedProducts.map((product: IProduct) => (
                  <ProductCard
                    id={product.id}
                    key={product.id}
                    title={product.title}
                    category={product.category}
                    price={product.price}
                    thumbnail={product.thumbnail}
                  />
                ))}
            </div>
          </div>
        </div>

      </section>
    </div>
  );
};

export default Shop;
