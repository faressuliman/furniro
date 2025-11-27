import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import MenuDrawer from "../components/MenuDrawer";
import UserDrawer from "../components/UserDrawer";
import CartDrawer from "../components/CartDrawer";
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
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ScrollToTopWrapper>
  );
};

export default Layout;
