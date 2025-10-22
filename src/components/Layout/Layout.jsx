import Navbar from "../Layout/Navbar";
import HeroSlider from "../HeroSlider";

export default function Layout({ children, user, onLogout, onCartClick }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative h-screen">
        <HeroSlider />
        <div className="absolute top-0 left-0 w-full">
          <Navbar
            user={user}
            onLogout={onLogout}
            onCartClick={onCartClick} // Navbar manggil App handleOpenCart
          />
        </div>
      </div>

      <main className="flex-1 p-6 bg-[#730302]">{children}</main>

      <footer className="bg-[#eeb626] text-white text-center p-4">
        © 2025 Warung Watik
      </footer>
    </div>
  );
}

