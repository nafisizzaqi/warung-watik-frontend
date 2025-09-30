import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-6 bg-gray-50">
        {children}
      </main>
      <footer className="bg-blue-600 text-white text-center p-4">
        © 2025 Warung Watik
      </footer>
    </div>
  );
}
