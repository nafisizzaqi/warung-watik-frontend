import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaShoppingCart, FaUserCircle, FaSignOutAlt, FaBars, FaTimes, FaHome, FaUtensils, FaCommentDots } from "react-icons/fa";
import PageTransition from "../Effect/PageTransition";

export default function Navbar({ user, onLogout, onCartClick }) {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [transitionText, setTransitionText] = useState("");
  const navigate = useNavigate();

  const menuItems = [
    { label: "Home", path: "/", text: "Welcome to Home", icon: <FaHome /> },
    { label: "Menu", path: "/products", text: "Halaman Menu", icon: <FaUtensils /> },
    { label: "Testimoni", path: "/testimoni", text: "Halaman Testimoni", icon: <FaCommentDots /> }
  ];

  const handleNavClick = (path, text) => {
    setTransitionText(text);
    setTransitioning(true);

    setTimeout(() => {
      navigate(path);
      setTransitioning(false);
    }, 1500);
    setMobileOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 
        ${isScrolled
            ? "bg-[#eeb626] w-full h-20 shadow-md px-4"
            : "bg-[#eeb626]/80 backdrop-blur-md w-[70%] h-20 mx-auto mt-2 rounded-full px-4 shadow-xl"
          }`}
      >
        <div className="flex items-center justify-between h-full mx-0 lg:mx-8">
          <div className="flex items-center gap-2">
            <img className="w-12 h-12" src="/logo.png" alt="Logo" />
            <h1 className="font-bold text-white text-xl">Warung Watik</h1>
          </div>

          {/* DESKTOP MENU */}
          <div className={`${isScrolled ? "hidden md:flex items-center gap-10 mx-24" : "hidden md:flex items-center gap-10"}`}>
            <div className="flex gap-6">
              {menuItems.map((item) => (
                <span
                  key={item.path}
                  onClick={() => handleNavClick(item.path, item.text)}
                  className="relative text-white !cursor-pointer flex items-center gap-2
                    after:absolute after:w-0 after:h-[2px] after:bg-white 
                    after:right-0 after:bottom-0 after:duration-300 
                    hover:after:w-full hover:after:left-0"
                >
                  {item.icon} {item.label}
                </span>
              ))}
            </div>

            {/* Keranjang */}
            <div onClick={onCartClick} className="relative !cursor-pointer mr-10">
              <FaShoppingCart size={22} className="text-white hover:text-gray-200" />
            </div>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden text-white p-3 bg-transparent"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <FaTimes size={26} /> : <FaBars size={26} />}
          </button>
        </div>

        {/* MOBILE DROPDOWN */}
        {mobileOpen && (
          <div className="md:hidden flex flex-col bg-[#eeb626] mt-3 rounded-lg shadow-md p-4 space-y-4 text-white">
            {menuItems.map((item) => (
              <span
                key={item.path}
                onClick={() => handleNavClick(item.path, item.text)}
                className="text-lg font-medium cursor-pointer flex items-center gap-2"
              >
                {item.icon} {item.label}
              </span>
            ))}

            <div onClick={onCartClick} className="flex items-center gap-2 cursor-pointer text-lg">
              <FaShoppingCart /> Keranjang
            </div>
            <div onClick={() => handleNavClick("/profile", "My Profile")} className="flex items-center gap-2 cursor-pointer text-lg">
              <FaUserCircle /> Profile
            </div>
            <div onClick={() => {
              setTransitionText("Logout");
              setTransitioning(true);
              setTimeout(() => {
                onLogout && onLogout();
                setTransitioning(false);
              }, 1500);
            }} className="flex items-center gap-2 cursor-pointer text-lg">
              <FaSignOutAlt /> Logout
            </div>
          </div>
        )}
      </nav>

      {/* PROFILE BUTTON */}
      <div className={`hidden md:flex fixed z-50 items-center transition-all duration-500 ${isScrolled ? "top-4 right-4" : "top-6 right-6"}`}>
        <div className="relative">
          <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center bg-white gap-2 text-[#eeb626]">
            <FaUserCircle size={30} />
            <span className="hidden md:inline font-semibold">{user?.name}</span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-40 rounded-lg overflow-hidden bg-[#eeb626] shadow-lg p-4 space-y-3">
              <span onClick={() => { setProfileOpen(false); handleNavClick("/profile", "My Profile"); }}
                className="flex items-center gap-2 bg-white text-[#eeb626] hover:bg-[#eeb626] hover:text-white px-3 py-2 rounded-md !cursor-pointer">
                <FaUserCircle /> Profile
              </span>
              <button onClick={() => {
                setProfileOpen(false); setTransitionText("Logout"); setTransitioning(true);
                setTimeout(() => { onLogout && onLogout(); setTransitioning(false); }, 1500);
              }}
                className="flex items-center gap-2 bg-white text-[#eeb626] hover:bg-[#eeb626] hover:text-white px-3 py-2 rounded-md w-full">
                <FaSignOutAlt /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <PageTransition show={transitioning} text={transitionText} />
    </>
  );
}
