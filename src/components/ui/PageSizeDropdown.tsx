import { useState, useRef, useEffect } from "react";

interface IProps {
  value: number;
  onChange: (value: number) => void;
}

const PageSizeDropdown = ({ value, onChange }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = [
    { value: 8, label: "8" },
    { value: 16, label: "16" },
    { value: 24, label: "24" },
    { value: 32, label: "32" },
  ];

  const selectedOption = options.find((opt) => opt.value === value) || options[1];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="appearance-none px-5 py-2.5 pr-3 border border-gray-300 rounded-md bg-white text-xs font-medium text-gray-800 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md min-w-[140px] text-left flex items-center justify-between gap-2"
      >
        <span>{selectedOption.label} per page</span>
        <svg
          className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full min-w-fit bg-white border border-gray-300 rounded-md shadow-lg">
          <ul className="py-1">
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-xs font-medium cursor-pointer transition-colors duration-200 ${
                    value === option.value 
                      ? "text-gray-800 underline decoration-primary decoration-1 underline-offset-4" 
                      : "text-gray-800 hover:text-gray-400"
                  }`}
                >
                  {option.label} per page
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PageSizeDropdown;

