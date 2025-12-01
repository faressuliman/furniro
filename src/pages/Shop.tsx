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
import Paginator from "../components/ui/Paginator";
import PageSizeDropdown from "../components/ui/PageSizeDropdown";

const Shop = () => {

  // Redux
  const dispatch = useDispatch();

  // State
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [isSorting, setIsSorting] = useState(false);
  const prevSortOptionRef = useRef(sortOption);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(16);
  const [isChangingPage, setIsChangingPage] = useState(false);
  const prevPageRef = useRef(currentPage);
  const prevPageSizeRef = useRef(pageSize);

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
    }

    else if (sortOption === "price-high") {
      return b.price - a.price;
    }

    else if (sortOption === "name-asc") {
      return a.title.localeCompare(b.title);
    }

    else if (sortOption === "name-desc") {
      return b.title.localeCompare(a.title);
    }

    return 0;
  });

  // Paginating products
  const totalPages = Math.ceil(displayedProducts.length / pageSize);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const paginatedProducts = displayedProducts.slice(start, end);


  // Handle sorting loading state
  useEffect(() => {
    if (prevSortOptionRef.current !== sortOption && prevSortOptionRef.current !== undefined) {
      setIsSorting(true);
      const timer = setTimeout(() => {
        setIsSorting(false);
      }, 300);

      prevSortOptionRef.current = sortOption;
      return () => clearTimeout(timer);
    }

    else {
      prevSortOptionRef.current = sortOption;
    }

  }, [sortOption]);

  // Reset to page 1 when sort, category, or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sortOption, selectedCategory, pageSize]);

  // Scroll back up to products section on changing page/sort by/category/page size
  const productsSectionRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const scrollThreshold = 300
    if (window.scrollY > scrollThreshold) {
      productsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }

  }, [sortOption, selectedCategory, pageSize, currentPage])

  // Handle page change loading state
  useEffect(() => {
    if (prevPageRef.current !== currentPage && prevPageRef.current !== undefined) {
      setIsChangingPage(true);
      const timer = setTimeout(() => {
        setIsChangingPage(false);
      }, 200);

      prevPageRef.current = currentPage;
      return () => clearTimeout(timer);
    }

    else {
      prevPageRef.current = currentPage;
    }

  }, [currentPage]);

  // Handle page size change loading state
  useEffect(() => {
    if (prevPageSizeRef.current !== pageSize && prevPageSizeRef.current !== undefined) {
      setIsChangingPage(true);
      const timer = setTimeout(() => {
        setIsChangingPage(false);
      }, 300);

      prevPageSizeRef.current = pageSize;
      return () => clearTimeout(timer);
    }

    else {
      prevPageSizeRef.current = pageSize;
    }

  }, [pageSize]);

  // Capitalize first letter
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="bg-[#f9f9f9]">
      <PageHeader title="Shop" />

      {/* Category Drawer for Mobile/Tablet */}
      <CategoryDrawer
        categories={categoryData || []}
        loading={categoryLoading}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />

      {/* Products Section */}
      <section ref={productsSectionRef} className="mt-8 max-w-screen-3xl mx-auto p-4 px-6 lg:px-8">

        <div className="flex gap-3 lg:gap-12">
          {/* Desktop Category Sidebar */}
          <div className="hidden lg:block w-80 h-fit px-4 py-6 border border-gray-200 bg-white rounded-xl shrink-0">
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
            {/* Mobile/Tablet Category Title and Button */}
            <div className="lg:hidden mb-6">
              <h2 className="font-bold text-xl mb-3">{selectedCategory ? capitalizeFirstLetter(selectedCategory) : "All Products"}</h2>
              <div className="flex items-center justify-between w-full">
                <button
                  onClick={() => dispatch(openCategoryDrawer())}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-primary hover:text-primary transition duration-300 cursor-pointer"
                >
                  <Menu className="w-5 h-5" />
                  <span className="text-xs">Show Categories</span>
                </button>
                <div className="hidden md:flex items-center gap-3">
                  <SortDropdown value={sortOption} onChange={setSortOption} />
                  <PageSizeDropdown value={pageSize} onChange={setPageSize} />
                </div>
              </div>
            </div>

            {/* Desktop Header */}
            <div className="mb-6 hidden lg:flex items-center justify-between lg:w-11/12 w-full">
              <div className="font-bold text-lg">{selectedCategory ? capitalizeFirstLetter(selectedCategory) : "All Products"}</div>
              <div className="flex items-center gap-3">
                <SortDropdown value={sortOption} onChange={setSortOption} />
                <PageSizeDropdown value={pageSize} onChange={setPageSize} />
              </div>
            </div>

            {/* Mobile Sort (below Show Categories button) */}
            <div className="md:hidden mb-6 flex items-center justify-between gap-3">
              <SortDropdown value={sortOption} onChange={setSortOption} />
              <PageSizeDropdown value={pageSize} onChange={setPageSize} />
            </div>
            {isLoading || categoryProductsLoading ? (
              <div className="lg:w-11/12 w-full products-grid grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 md:gap-8 lg:grid-cols-3 xl:grid-cols-4 lg:gap-x-5 lg:gap-y-8 xl:gap-y-8 lg:border lg:border-gray-200 lg:rounded-lg lg:p-8 justify-items-center">
                {[...Array(12)].map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : isSorting || isChangingPage ? (
              <div className="lg:w-11/12 w-full lg:border lg:border-gray-200 lg:rounded-lg lg:p-8 min-h-[480px] flex items-center justify-center">
                <Loader />
              </div>
            ) : (
              <div className="lg:w-11/12 w-full products-grid grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 md:gap-8 lg:grid-cols-3 xl:grid-cols-4 lg:gap-x-5 lg:gap-y-8 xl:gap-y-8 lg:border lg:border-gray-200 lg:rounded-lg lg:p-8 justify-items-center">
                {paginatedProducts.map((product: IProduct) => (
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

        {/* Paginator */}
        <div className="mb-4">
          <Paginator currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </section>

    </div>
  );
};

export default Shop;
