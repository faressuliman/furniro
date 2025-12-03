import { lazy } from "react";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Layout from "../layout/Layout";
import Shop from "../pages/Shop";

const Home = lazy(() => import("../pages"));
const About = lazy(() => import("../pages/About"));
const Contact = lazy(() => import("../pages/Contact"));
const Register = lazy(() => import("../pages/Register"));
const NotFound = lazy(() => import("../pages/NotFound"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));
const Wishlist = lazy(() => import("../pages/Wishlist"));
const Checkout = lazy(() => import("../pages/Checkout"));
const Product = lazy(() => import("../pages/Product"));
const SearchResults = lazy(() => import("../pages/SearchResults"));
const Orders = lazy(() => import("../pages/Orders"));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<NotFound />}>
      <Route index element={  <Home /> } />
      <Route path="shop" element={<Shop />} />
      <Route path="about" element={ <About /> } />
      <Route path="contact" element={ <Contact /> } />
      <Route path="register" element={ <Register /> } />
      <Route path="forgotpassword" element={<ForgotPassword />} />
      <Route path="resetpassword" element={ <ResetPassword /> } />
      <Route path="checkout" element={ <Checkout /> } />
      <Route path="wishlist" element={ <Wishlist /> } />
      <Route path="product/:id" element={ <Product />} />
      <Route path="search" element={<SearchResults />} />
      <Route path="orders" element={<Orders />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

export default router;
