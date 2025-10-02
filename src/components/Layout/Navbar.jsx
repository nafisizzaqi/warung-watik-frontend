import { Link } from "react-router-dom";
import { useState, useEffect, use } from "react";
import { FaShoppingCart } from "react-icons/fa"
import Logo from "../../../public/logo.png";
import Cart from "../../pages/Cart";

export default function Navbar({ user, onLogout }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const handleScrool = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScrool);
    return () => window.removeEventListener("scroll", handleScrool);
  }, []);
  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 
      ${isScrolled
            ? "bg-[#eeb626] rounded-none w-full h-20 p-4 shadow-md"
            : "bg-[#eeb626]/80 backdrop-blur-md rounded-full w-3/4 h-20 mx-auto mt-2 shadow-xl"
          }`}
      >
        <div className="grid grid-cols-2 items-center h-full">
          <div className="flex items-center ml-14">
            <img className="w-12 h-12" src={Logo} alt="Logo" />
            <h1 className="font-bold text-white text-xl">Warung Watik</h1>
          </div>
          <div className="flex items-center justify-end space-x-6 text-right mr-16">
            <Link
              to="/"
              className="relative text-white hover:text-white after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-white after:right-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="relative text-white hover:text-white after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-white after:right-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
            >
              Menu
            </Link>
            <Link
              to="/about"
              className="relative text-white hover:text-white after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-white after:right-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
            >
              Tentang
            </Link>
            <div
              onClick={() => setCartOpen(true)}
              className="relative !cursor-pointer"
            >
              <FaShoppingCart size={22} className="text-white hover:text-gray-200" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white px-1 rounded-full leading-none">
                3
              </span>
            </div>
          </div>
        </div>
      </nav>

      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)}></Cart>
    </>
  );
}
