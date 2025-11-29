import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface IProps {
  children: React.ReactNode;
}

const ScrollToTopWrapper = ({ children }: IProps) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });
  }, [pathname]);

  return <>{children}</>;
};

export default ScrollToTopWrapper;
