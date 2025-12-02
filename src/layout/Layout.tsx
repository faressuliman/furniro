import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import Loader from "../components/ui/Loader";
import Navbar from "./Navbar";
import MenuDrawer from "../components/MenuDrawer";
import UserDrawer from "../components/UserDrawer";
import CartDrawer from "../components/CartDrawer";
import SearchDrawer from "../components/SearchDrawer";
import ScrollToTopWrapper from "../components/ScrollToTopWrapper";
import Footer from "./Footer";

const Layout = () => {
  return (
    <ScrollToTopWrapper>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <MenuDrawer />
        <UserDrawer />
        <CartDrawer />
        <SearchDrawer />
        <main className="flex-1 relative">
          <Suspense
            fallback={
              <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                <Loader />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
        <Footer />
      </div>
    </ScrollToTopWrapper>
  );
};

export default Layout;
