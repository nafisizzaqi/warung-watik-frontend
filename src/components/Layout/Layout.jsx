// Layout.js
import Navbar from "../Layout/Navbar";
import { useLocation } from "react-router-dom";
import HeroSlider from "../HeroSlider";

export default function Layout({ children, user, onLogout, onCartClick }) {
  const location = useLocation();
  const { pathname } = location;

  let pageTitle = "Selamat Datang di Warung Watik";
  if (pathname === "/products") pageTitle = "Menu Spesial Hari Ini 🍽️";
  else if (pathname === "/testimoni") pageTitle = "Lihat umpan balik pelanggan lain";

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative">
        <HeroSlider title={pageTitle} />
        <div className="absolute top-0 left-0 w-full">
          <Navbar user={user} onLogout={onLogout} onCartClick={onCartClick} />
        </div>
      </div>

      <main className="flex-1 p-4 md:p-6 bg-[#730302]">{children}</main>

      <footer className="bg-[#eeb626] text-brown-900 py-8 px-4 md:px-6 shadow-inner">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center md:text-left">
          {/* Kolom 1 */}
          <div className="mb-4 md:mb-0">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <img className="w-12 h-12" src="/logo.png" alt="Logo" />
              <h2 className="text-2xl font-bold">Warung Watik</h2>
            </div>
            <p className="text-sm font-medium opacity-90">
              Tempat makan favorit warga! Masakan rumahan, sambal pedas, dan suasana hangat setiap hari.
            </p>
          </div>

          {/* Kolom 2 */}
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold mb-2 flex mx-10 justify-start gap-2">Kontak Kami</h3>
            <ul className="text-sm space-y-2">
              <li className="flex items-center mx-10 justify-start gap-2">
                {/* Telepon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-brown-900" viewBox="0 0 24 24">
                  <path d="M3 5a2 2 0 0 1 2-2h2.2a1 1 0 0 1 .98.804l.7 3.496a1 1 0 0 1-.36.968l-1.52 1.14a11.036 11.036 0 0 0 5.034 5.034l1.14-1.52a1 1 0 0 1 .968-.36l3.496.7a1 1 0 0 1 .804.98V19a2 2 0 0 1-2 2h-1c-7.18 0-13-5.82-13-13V5z" />
                </svg>
                0812-3456-7890
              </li>
              <li className="flex items-center mx-10 justify-start gap-2">
                {/* Email */}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-brown-900" viewBox="0 0 24 24">
                  <path d="M4 4h16a2 2 0 0 1 2 2v1.2l-10 6.25L2 7.2V6a2 2 0 0 1 2-2zm0 5.8V18h16V9.8l-8 5-8-5z" />
                </svg>
                warungwatik@gmail.com
              </li>
              <li className="flex items-start mx-10 justify-start gap-2">
                {/* Lokasi */}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-brown-900 mt-1" viewBox="0 0 24 24">
                  <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
                </svg>
                <span className="text-sm break-words max-w-xs">
                  Jl. Darun Na'im, Karangduren, Kec. Tengaran
                </span>
              </li>
            </ul>
          </div>

          {/* Kolom 3 */}
          <div>
            <h3 className="text-lg font-semibold mb-2 flex mx-10 justify-start gap-2">Ikuti Kami</h3>
            <div className="flex mx-10 justify-start gap-4">
              <a href="https://www.facebook.com/Nafis Izzaqi"
                target="_blank"
                rel="noopener noreferrer" className="hover:scale-110 transition-transform" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 fill-brown-900 hover:fill-white transition-colors" viewBox="0 0 24 24">
                  <path d="M22 12.073C22 6.49 17.523 2 12 2S2 6.49 2 12.073C2 17.09 5.657 21.128 10.438 21.954v-6.273H7.898v-2.61h2.54V10.41c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.63.774-1.63 1.562v1.875h2.773l-.443 2.61h-2.33v6.273C18.343 21.128 22 17.09 22 12.073z" />
                </svg>
              </a>

              {/* Instagram */}
              <a href="https://www.instagram.com/mr.z4q"
                target="_blank"
                rel="noopener noreferrer" className="hover:scale-110 transition-transform" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 fill-brown-900 hover:fill-white transition-colors" viewBox="0 0 24 24">
                  <path d="M7.75 2h8.5A5.76 5.76 0 0 1 22 7.75v8.5A5.76 5.76 0 0 1 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5A5.76 5.76 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 4A4.75 4.75 0 1 1 7.25 12a4.75 4.75 0 0 1 4.75-4.5zm0 1.5A3.25 3.25 0 1 0 15.25 12a3.25 3.25 0 0 0-3.25-3.25zm5.75-.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5z" />
                </svg>
              </a>

              {/* TikTok */}
              <a href="https://www.tiktok.com/@zaqstudents"
                target="_blank"
                rel="noopener noreferrer" className="hover:scale-110 transition-transform" aria-label="TikTok">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 fill-brown-900 hover:fill-white transition-colors" viewBox="0 0 24 24">
                  <path d="M12.5 2h2.8a4.5 4.5 0 0 0 4.5 4.5v2.8a7.3 7.3 0 0 1-4.5-1.5v8.7a5.3 5.3 0 1 1-5.3-5.3h1v2.9h-1a2.4 2.4 0 1 0 2.4 2.4V2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-yellow-300 mt-6 pt-4 text-center text-sm font-medium">
          © {new Date().getFullYear()} Warung Watik — Rasa lokal, suasana kekeluargaan ❤️
          <div className="mt-1 text-xs opacity-80">Dibuat dengan ❤️ oleh tim UMKM kreatif</div>
        </div>
      </footer>
    </div>
  );
}
