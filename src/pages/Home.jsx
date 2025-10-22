import { useState } from "react";
import Layout from "../components/Layout/Layout";
import Cart from "./Cart";

export default function Home({ user }) {
  return (
    <div>
      <h1 className="text-white text-2xl">Welcome, {user.name}</h1>
      {/* Konten halaman lainnya */}
    </div>
  );
}

