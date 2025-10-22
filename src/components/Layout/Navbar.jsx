import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, use } from "react";
import { FaShoppingCart } from "react-icons/fa"
import Logo from "../../../public/logo.png";
import Cart from "../../pages/Cart";

export default function Navbar({ user, onLogout, onCartClick }) {
  const location = useLocation();
  const onProductPage = location.pathname === "/products";
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
          <div className="flex items-center ml-10">
            <img className="w-12 h-12" src="/logo.png" alt="Logo" />
            <h1 className="font-bold text-white text-xl ml-2">Warung Watik</h1>
          </div>
          <div className="flex items-center justify-end space-x-6 text-right mr-16">
            {!onProductPage && (
              <div className="flex gap-5">
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
              </div>
            )}

            {onProductPage && (
              <div className={`relative flex items-center ${isScrolled ? 'absolute right-56 transform -translate-x-1/2 h-full mx-auto' : ''}`}>
                {/* Tombol Menu */}
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center justify-center text-white font-bold px-4 py-2 bg-yellow-600 rounded hover:bg-yellow-500 transition-colors duration-300"
                >
                  Menu
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 w-36 bg-[#eeb626] rounded-lg shadow-lg overflow-hidden transition-all duration-300 opacity-100 scale-100">
                    <Link
                      to="/"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-white hover:bg-yellow-500 transition-colors duration-200"
                    >
                      Home
                    </Link>
                    <Link
                      to="/products"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-white hover:bg-yellow-500 transition-colors duration-200"
                    >
                      Menu
                    </Link>
                  </div>
                )}
              </div>
            )}

            <div
  onClick={() => {
    console.log("🖱 Cart icon clicked!");
    onCartClick && onCartClick(); // state cartOpen di App yang diubah
  }}
  className="relative !cursor-pointer"
>
  <FaShoppingCart size={22} className="text-white hover:text-gray-200" />
</div>


          </div>
        </div>
      </nav>

      {/* <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)}></Cart> */}
    </>
  );
}
