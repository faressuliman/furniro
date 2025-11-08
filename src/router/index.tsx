import { lazy } from "react";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Layout from "../layout/Layout";
import Shop from "../pages/Shop";
import CookieService from "../services/CookieService";

const Home = lazy(() => import("../pages"));
const About = lazy(() => import("../pages/About"));
const Contact = lazy(() => import("../pages/Contact"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Wishlist = lazy(() => import("../pages/Wishlist"));
const Checkout = lazy(() => import("../pages/Checkout"));

const token = CookieService.get("jwt")

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="shop" element={<Shop />} />
      <Route path="about" element={<About />} />
      <Route path="contact" element={<Contact />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="checkout" element={<Checkout />} />
      <Route path="wishlist" element={<Wishlist isAuthenticated={token}/>} />
    </Route>
  )
);

export default router;
