import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaShoppingCart, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import PageTransition from "../Effect/PageTransition";

export default function Navbar({ user, onLogout, onCartClick }) {
  const location = useLocation();
  const onProductPage = location.pathname === "/products";
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [transitionText, setTransitionText] = useState("");
  const navigate = useNavigate();

  const handleNavClick = (path, text) => {
    setTransitionText(text);
    setTransitioning(true);

    setTimeout(() => {
      navigate(path);
      setTransitioning(false);
    }, 1500); // durasi animasi PageTransition (sesuaikan)
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 
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

          <div className={`flex items-center justify-end space-x-6 text-right ${isScrolled ? "mr-44" : "mr-16"}`}>
            <div className="flex gap-5">
              <span
                onClick={() => handleNavClick("/", "Welcome to Home")}
                className="relative cursor-pointer text-white hover:text-white 
             after:content-[''] after:absolute after:w-0 after:h-[2px] 
             after:bg-white after:right-0 after:bottom-0 after:transition-all 
             after:duration-300 hover:after:w-full hover:after:left-0"
              >
                Home
              </span>

              <span
                onClick={() => handleNavClick("/products", "Halaman Menu")}
                className="relative cursor-pointer text-white hover:text-white 
             after:content-[''] after:absolute after:w-0 after:h-[2px] 
             after:bg-white after:right-0 after:bottom-0 after:transition-all 
             after:duration-300 hover:after:w-full hover:after:left-0"
              >
                Menu
              </span>

              <span

                onClick={() => handleNavClick("/testimoni", "Halaman Testimoni")}
                className="relative cursor-pointer text-white hover:text-white after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-white after:right-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
              >
                Testimoni
              </span>
            </div>

            {/* Keranjang */}
            <div
              onClick={() => onCartClick && onCartClick()}
              className="relative cursor-pointer"
            >
              <FaShoppingCart size={22} className="text-white hover:text-gray-200" />
            </div>
          </div>
        </div>
      </nav>

      {/* PROFIL DI LUAR NAVBAR */}
      <div
        className={`fixed z-50 flex items-center transition-all duration-500
        ${isScrolled
            ? "top-4 right-8 text-[#eeb626]"
            : "top-6 right-5 text-[#eeb626]"
          }`}
      >
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className={`flex items-center gap-2 transition-colors duration-300 border-none focus:outline-none ${isScrolled ? "hover:text-gray-500" : "hover:text-yellow-600"
              }`}
          >
            <FaUserCircle size={28} />
            {user && (
              <span
                className="font-semibold text-[#eeb626]"
              >
                {user.name}
              </span>
            )}
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-40 rounded-lg overflow-hidden bg-[#eeb626] rounded-bl-2xl shadow-lg z-50 transition-all duration-300">
              <div className="flex flex-col p-4 space-y-3">
                <span
                  onClick={() => {
                    setProfileOpen(false);
                    handleNavClick("/profile", "My Profile");
                  }}
                  className="flex cursor-pointer items-center gap-2 text-[#eeb626] text-lg bg-white hover:text-white font-medium border border-white hover:bg-[#eeb626] px-3 py-2 rounded-md transition duration-200"
                >
                  <FaUserCircle />Profile
                </span>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    setTransitionText("Logout");
                    setTransitioning(true);

                    setTimeout(() => {
                      onLogout && onLogout();       // hapus token + setUser(null)
                      setTransitioning(false);      // matikan animasi
                    }, 1500); // durasi sesuai animasi
                  }}
                  className="flex items-center gap-2 text-[#eeb626] appearance-none focus:outline-none hover:text-white text-lg hover:bg-[#eeb626] px-3 py-2 border border-white rounded-md transition-all duration-300"
                >
                  <FaSignOutAlt />Logout
                </button>


              </div>
            </div>
          )}
        </div>
      </div>
      <PageTransition show={transitioning} text={transitionText} />
    </>
  );
}
