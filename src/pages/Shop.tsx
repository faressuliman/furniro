import { useQuery } from "@tanstack/react-query";
import PageHeader from "../components/PageHeader";
import ProductCard from "../components/ui/ProductCard";
import ProductCardSkeleton from "../components/ui/ProductSkeleton";
import SortDropdown from "../components/ui/SortDropdown";
import Loader from "../components/ui/Loader";
import { fetchCategories, fetchProducts, getProductsByCategory } from "../lib/api";
import { IProduct } from "../interfaces";
import { useState, useEffect, useRef } from "react";
import CategoryDrawer from "../components/CategoryDrawer";
import { useDispatch } from "react-redux";
import { openCategoryDrawer } from "../app/features/categoryDrawerSlice";
import { Menu } from "lucide-react";

const Shop = () => {

  // Redux
  const dispatch = useDispatch();

  // State
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [isSorting, setIsSorting] = useState(false);
  const prevSortOptionRef = useRef(sortOption);

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
  const rawProducts = selectedCategory ? categoryProducts || [] : data?.products || [];

  // Sorting products
  const displayedProducts = [...rawProducts].sort((a, b) => {
    if (sortOption === "price-low") {
      return a.price - b.price;
    } else if (sortOption === "price-high") {
      return b.price - a.price;
    } else if (sortOption === "name-asc") {
      return a.title.localeCompare(b.title);
    } else if (sortOption === "name-desc") {
      return b.title.localeCompare(a.title);
    }
    // Default: no sorting (original order)
    return 0;
  });

  // Handle sorting loading state
  useEffect(() => {
    // Only show loader if sortOption actually changed (not on initial mount)
    if (prevSortOptionRef.current !== sortOption && prevSortOptionRef.current !== undefined) {
      setIsSorting(true);
      const timer = setTimeout(() => {
        setIsSorting(false);
      }, 500); // Show loader for 500ms

      prevSortOptionRef.current = sortOption;
      return () => clearTimeout(timer);
    } else {
      prevSortOptionRef.current = sortOption;
    }
  }, [sortOption]);

  // Capitalize first letter
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div>
      <PageHeader title="Shop" selectedCategory={selectedCategory} />

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
            <h3 className="font-bold text-md text-start mb-4">PRODUCT CATEGORIES</h3>
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
            <div className="mb-6 flex items-center">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Sort by</span>
                <SortDropdown value={sortOption} onChange={setSortOption} />
              </div>
            </div>
            {isLoading || categoryProductsLoading ? (
              <div className="products-grid grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 md:gap-8 lg:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] lg:gap-x-5 lg:gap-y-8 xl:gap-y-8">
                {[...Array(12)].map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : isSorting ? (
              <div className="flex items-center justify-center py-12">
                <Loader />
              </div>
            ) : (
              <div className="products-grid grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 md:gap-8 lg:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] lg:gap-x-5 lg:gap-y-8 xl:gap-y-8">
                {displayedProducts.map((product: IProduct) => (
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
            )}
          </div>
        </div>

      </section>
    </div>
  );
};

export default Shop;
