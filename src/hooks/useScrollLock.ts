import { useEffect } from "react";

export default function useScrollLock(active: boolean) {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const getCount = () => parseInt(document.body.dataset.scrollLock || "0", 10);

    const lock = () => {
      const count = getCount();
      document.body.dataset.scrollLock = String(count + 1);
      if (count === 0) {
        document.body.style.overflow = "hidden";
      }
    };

    const unlock = () => {
      const count = Math.max(0, getCount() - 1);
      document.body.dataset.scrollLock = String(count);
      if (count === 0) {
        document.body.style.overflow = "";
      }
    };

    if (active) lock();

    return () => {
      if (active) unlock();
    };
  }, [active]);
}
