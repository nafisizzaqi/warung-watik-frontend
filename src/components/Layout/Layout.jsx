import Navbar from "../Layout/Navbar";
import HeroSlider from "../HeroSlider";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* HeroSlider jadi background full screen */}
      <div className="relative h-screen">
        <HeroSlider />

        {/* Navbar diposisikan absolute di atas slider */}
        <div className="absolute top-0 left-0 w-full">
          <Navbar />
        </div>
      </div>

      {/* Konten utama */}
      <main className="flex-1 p-6 bg-[#730302]">
        {children}
      </main>

      <footer className="bg-[#eeb626] text-white text-center p-4">
        © 2025 Warung Watik
      </footer>
    </div>
  );
}

