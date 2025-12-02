import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary relative overflow-hidden px-4">
      <div className="relative z-10 text-center p-8 bg-white/90 rounded-lg shadow-xl backdrop-blur-md border border-gray-200 max-w-md w-full">
        <h1 className="text-6xl md:text-7xl font-extrabold text-primary mb-2 drop-shadow">
          404
        </h1>
        <p className="text-xl md:text-2xl text-gray-800 mb-4 font-semibold">
          Sorry, we can&apos;t find that page.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          The page you&apos;re looking for might have been moved, deleted, or never existed.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-primary text-white rounded-lg shadow hover:bg-white hover:text-primary hover:border-primary border border-primary transition font-bold"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

