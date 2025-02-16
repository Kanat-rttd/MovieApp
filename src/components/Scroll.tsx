import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollRestoration() {
  const location = useLocation(); // Теперь мы внутри <BrowserRouter>, ошибки не будет

  useEffect(() => {
    // Проверяем, есть ли сохранённое положение скролла
    const savedScrollPosition = sessionStorage.getItem("scrollPosition");

    if (savedScrollPosition) {
      window.scrollTo(0, parseInt(savedScrollPosition, 10));
    }

    // Перед уходом со страницы сохраняем положение прокрутки
    const handleScroll = () => {
      sessionStorage.setItem("scrollPosition", window.scrollY.toString());
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]); // Срабатывает при изменении пути

  return null;
}
