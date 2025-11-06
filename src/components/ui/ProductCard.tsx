import { ShoppingCart, Heart } from "lucide-react";
import { IProduct } from "../../interfaces";
import Button from "./Button"

const ProductCard = ({ title, subtitle, price, thumbnail }: Pick<IProduct, "title" | "subtitle" | "price" | "thumbnail">) => {

  return (
    <div className="w-[190px] sm:w-[250px] rounded-md xl:w-[280px] bg-white border border-gray-200 shadow-md flex flex-col h-[400px]">
      {/* Product Image */}
      <img
        className="rounded-t-lg w-full h-48 object-cover"
        src={thumbnail}
        alt={title}
      />

      {/* Product Details */}
      <div className="flex flex-col justify-between grow p-4 bg-[#F4F5F7] rounded-b-lg">
        <div>
          <h5 className="mb-2 text-sm md:text-md xl:text-lg font-semibold tracking-tight text-gray-900">
            {title}
          </h5>
          <p className="mb-3 font-normal text-gray-700 text-xs md:text-sm">
            {subtitle}
          </p>
        </div>

        {/* Price & Buttons */}
        <div className="flex flex-col mt-auto">
          <span className="text-sm md:text-lg font-semibold text-gray-900 mb-3">
            ${price}
          </span>

          <div className="flex items-center justify-center gap-2 w-full">
            <Button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 text-white bg-primary border hover:bg-white hover:-translate-y-1 hover:border-primary hover:text-primary text-xs sm:text-sm font-medium rounded-md transition-all whitespace-nowrap">
              <ShoppingCart size={16} />
              Add To Cart
            </Button>


            <button className="p-2 border border-gray-300 rounded-lg hover:border-primary hover:cursor-pointer transition-colors">
              <Heart size={16} className="text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </div>

  );
};

export default ProductCard;
