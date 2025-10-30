import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaShoppingCart, FaUserCircle, FaBars, FaSignOutAlt, FaHome, FaUtensils } from "react-icons/fa";

export default function ProfileNavbar({ user, onLogout, onCartClick, children }) {
  const location = useLocation();
  const onProductPage = location.pathname === "/products";
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#eeb626] h-20 px-6 shadow-md flex items-center justify-between transition-all duration-500">
        {/* LOGO */}
        <div className="flex items-center">
          <img className="w-12 h-12" src="/logo.png" alt="Logo" />
          <h1 className="font-bold text-white text-3xl ml-2">Dashboard Admin</h1>
        </div>

        {/* TOMBOL HAMBURGER SELALU ADA */}
       <button
  onClick={() => setMenuOpen(!menuOpen)}
  className="relative flex flex-col justify-center items-center bg-[#eeb626] hover:scale-110 transition-all duration-200 border-none w-8 h-8 focus:outline-none z-50"
>
  <span
    className={`absolute block w-6 h-[3px] bg-white rounded transition-all duration-300 ${
      menuOpen ? "rotate-45" : "-translate-y-2"
    }`}
  ></span>
  <span
    className={`absolute block w-6 h-[3px] bg-white rounded transition-all duration-300 ${
      menuOpen ? "opacity-0" : ""
    }`}
  ></span>
  <span
    className={`absolute block w-6 h-[3px] bg-white rounded transition-all duration-300 ${
      menuOpen ? "-rotate-45" : "translate-y-2"
    }`}
  ></span>
</button>

      </nav>

      {/* MENU DROPDOWN */}
      {menuOpen && (
        <div className="fixed top-20 right-0 bg-[#eeb626] w-64 rounded-bl-2xl shadow-lg z-50 transition-all duration-300">
          <div className="flex flex-col p-4 space-y-3">
            {/* Home & Menu */}
            <Link
  to="/"
  onClick={() => setMenuOpen(false)}
  className="flex items-center gap-2 text-[#eeb626] text-lg bg-white hover:text-white font-medium border border-white hover:bg-[#eeb626] px-3 py-2 rounded-md transition duration-200"
>
  <FaHome className="text-xl" />
  Home
</Link>

<Link
  to="/products"
  onClick={() => setMenuOpen(false)}
  className="flex items-center gap-2 text-[#eeb626] text-lg bg-white hover:text-white font-medium border border-white hover:bg-[#eeb626] px-3 py-2 rounded-md transition duration-200"
>
  <FaUtensils className="text-xl" />
  Menu
</Link>


            {/* Cart */}
            <button
              onClick={() => {
                setMenuOpen(false);
                onCartClick && onCartClick();
              }}
              className="flex items-center gap-2 text-[#eeb626] appearance-none focus:outline-none hover:text-white text-lg hover:bg-[#eeb626] px-3 py-2 border border-white hover:border-white rounded-md transition"
            >
              <FaShoppingCart /> Keranjang
            </button>

             <button
                  onClick={() => {
                    setProfileOpen(false);
                    setMenuOpen(false);
                    onLogout && onLogout();
                  }}
                  className="flex items-center gap-2 text-[#eeb626] appearance-none focus:outline-none hover:text-white text-lg hover:bg-[#eeb626] px-3 py-2 border border-white hover:border-white rounded-md transition"
                >
                  <FaSignOutAlt />Logout
                </button>
          </div>
        </div>
      )}
      <div className="pt-20">{children}</div>
    </>
  );
}
