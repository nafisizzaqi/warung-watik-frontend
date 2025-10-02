import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ImgLogin from "../assets/img-login.png";
import EmailIcon from "../assets/gmail.png";
import LockIcon from "../assets/lock.png";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://192.168.1.6:8000/api/customer/login", {
        email,
        password,
      });
      console.log(res.data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.customer));

      if (onLogin) onLogin();

      navigate("/");
    } catch (err) {
      setError("Email atau password salah");
    }
  };

  return (
    <div className="flex flex-col items-center h-screen bg-[#730302]">
      <img className="w-64 h-64" src={ImgLogin} alt="" />
      <h2 className="text-4xl font-bold text-white mb-8 text-center">Warung Mbak Watik</h2>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <form
        onSubmit={handleSubmit}
        className="w-80"
      >

        {/* Input Email */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-[18px]">
            <img className="w-6 h-6" src={EmailIcon} alt="" />
          </span>
          <input
            type="email"
            placeholder="Email"
            className="w-full pl-12 p-2 border rounded-full mb-3 bg-[#730302] placeholder:text-white text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Input Password dengan toggle */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-[14px]">
            <img className="w-6 h-6" src={LockIcon} alt="" />
          </span>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full pl-12 p-2 border rounded-full pr-10 bg-[#730302] placeholder:text-white text-white" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#730302] text-sm focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
        <div className="text-center">
          <div className="text-white">Belum punya akun? <span className="text-blue-800 !cursor-pointer" onClick={() => navigate("/register")}>Daftar Akun Baru</span></div>
        </div>
        {/* Tombol Login */}
        <div className="mx-auto outline outline-1 p-1 w-[185px] text-white rounded-full mt-6">
          <button className="w-44 bg-[#ef3d3d] text-white p-2 rounded-full">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
