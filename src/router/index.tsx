import { lazy, Suspense } from "react";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Layout from "../layout/Layout";
import Shop from "../pages/Shop";
import Loader from "../components/ui/Loader";

const Home = lazy(() => import("../pages"));
const About = lazy(() => import("../pages/About"));
const Contact = lazy(() => import("../pages/Contact"));
const Login = lazy(() => import("../pages/Login"));
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
      <Route
        index
        element={
          <Suspense fallback={<Loader />}>
            <Home />
          </Suspense>
        }
      />
      <Route path="shop" element={<Shop />} />
      <Route
        path="about"
        element={
          <Suspense fallback={<Loader />}>
            <About />
          </Suspense>
        }
      />
      <Route
        path="contact"
        element={
          <Suspense fallback={<Loader />}>
            <Contact />
          </Suspense>
        }
      />
      <Route
        path="login"
        element={
          <Suspense fallback={<Loader />}>
            <Login />
          </Suspense>
        }
      />
      <Route
        path="register"
        element={
          <Suspense fallback={<Loader />}>
            <Register />
          </Suspense>
        }
      />
      <Route
        path="forgotpassword"
        element={
          <Suspense fallback={<Loader />}>
            <ForgotPassword />
          </Suspense>
        }
      />
      <Route
        path="resetpassword"
        element={
          <Suspense fallback={<Loader />}>
            <ResetPassword />
          </Suspense>
        }
      />
      <Route
        path="checkout"
        element={
          <Suspense fallback={<Loader />}>
            <Checkout />
          </Suspense>
        }
      />
      <Route
        path="wishlist"
        element={
          <Suspense fallback={<Loader />}>
            <Wishlist />
          </Suspense>
        }
      />
      <Route
        path="product/:id"
        element={
          <Suspense fallback={<Loader />}>
            <Product />
          </Suspense>
        }
      />
      <Route
        path="search"
        element={
          <Suspense fallback={<Loader />}>
            <SearchResults />
          </Suspense>
        }
      />
      <Route
        path="orders"
        element={
          <Suspense fallback={<Loader />}>
            <Orders />
          </Suspense>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

export default router;
