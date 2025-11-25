import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { closeCategoryDrawer, selectCategoryDrawer } from "../app/features/categoryDrawerSlice";

interface ICategoryDrawerProps {
    categories: string[];
    loading: boolean;
    selectedCategory: string;
    onCategorySelect: (category: string) => void;
}

const CategoryDrawer = ({ categories, loading, selectedCategory, onCategorySelect }: ICategoryDrawerProps) => {

    const dispatch = useDispatch();
    const isOpenCategoryDrawer = useSelector(selectCategoryDrawer);

    const handleCategoryClick = (category: string) => {
        onCategorySelect(category);
        dispatch(closeCategoryDrawer());
    };

    const capitalizeFirstLetter = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    return (
        <>
            {/* Backdrop */}
            {isOpenCategoryDrawer && (
                <div
                    className="fixed inset-0 bg-black/40 bg-opacity-50 z-30"
                    onClick={() => dispatch(closeCategoryDrawer())}
                />
            )}

            {/* Drawer */}
            <div
                id="category-drawer"
                className={`fixed top-0 left-0 z-40 h-screen p-4 overflow-y-auto bg-white w-72 lg:w-80 transform transition-transform duration-500 ease-in-out  
                ${isOpenCategoryDrawer ? "translate-x-0" : "-translate-x-full"}`}
                tabIndex={-1}
                aria-labelledby="category-drawer-label"
            >
                <h5 id="category-drawer-label" className="text-base font-bold mb-4 px-2">
                    PRODUCT CATEGORIES
                </h5>

                {/* Close button */}
                <button
                    type="button"
                    className="absolute top-4.5 right-2.5 text-gray-500 hover:text-primary transition duration-300 hover:cursor-pointer px-2"
                    onClick={() => dispatch(closeCategoryDrawer())}
                >
                    <X className="w-5 h-5" />
                    <span className="sr-only">Close menu</span>
                </button>

                <div className="py-4 px-2">
                    {loading ? (
                        <ul className="space-y-4">
                            {[...Array(15)].map((_, i) => (
                                <li key={i} className="h-5 bg-gray-200 rounded animate-pulse"></li>
                            ))}
                        </ul>
                    ) : (
                        <ul className="space-y-4">
                            <li
                                className={`text-sm font-medium cursor-pointer transition duration-200 ${selectedCategory === "" ? "text-primary" : "text-gray-700 hover:text-primary"}`}
                                onClick={() => handleCategoryClick("")}
                            >
                                All Products
                            </li>
                            {categories?.map((cat: string) => (
                                <li
                                    key={cat}
                                    className={`text-sm font-medium cursor-pointer transition duration-200 ${selectedCategory === cat ? "text-primary" : "text-gray-700 hover:text-primary"}`}
                                    onClick={() => handleCategoryClick(cat)}
                                >
                                    {capitalizeFirstLetter(cat)}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
};

export default CategoryDrawer;