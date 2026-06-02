import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";
import logoImg from "../../../imagenes/Logo.png";

const navLinks = [
  { label: "Menu", href: "/catalogo", hash: "#hero" },
  { label: "Pedidos", href: "/pedidos", hash: "" },
];

export const NavBar = () => {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const totalItems = useCartStore((s) => s.totalItems);
  const { isAuthenticated, user, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentHash = hash || "#hero";

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#245433]/10 bg-[#fdfbd7] py-2">
      <div className="mx-4 flex h-16  items-center justify-between px-6">
        
        {/* Left Side: Brand Name & Logo */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <img src={logoImg} alt="BigPickle Logo" className="h-15 w-auto object-contain" />
          <span className="text-2xl font-black tracking-tight text-[#245433]">
            BigPickle
          </span>
        </Link>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center justify-center flex-1">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/catalogo"
                  ? pathname === "/catalogo" && currentHash === link.hash
                  : pathname === link.href;
              return (
                <li key={link.label}>
                  <Link
                    to={{ pathname: link.href, hash: link.hash }}
                    className={`text-sm font-semibold tracking-wide transition-all duration-200 hover:text-[#47aa66] ${
                      isActive ? "text-[#245433] font-bold border-b-2 border-[#245433] pb-1" : "text-[#245433]/70"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right Side: Action Icons */}
        <div className="flex items-center gap-5 text-[#245433]">
          
          {/* Cart Icon */}
          <Link
            to="/carrito"
            className="relative p-1 rounded-full hover:bg-[#245433]/5 transition-colors duration-200"
            aria-label="Carrito"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#7b1f2a] text-[10px] font-black text-white shadow-sm">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Bell Icon (Aesthetic / Notifications) */}
          <button
            className="p-1 rounded-full hover:bg-[#245433]/5 transition-colors duration-200 relative"
            aria-label="Notificaciones"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
              />
            </svg>
          </button>

          {/* User Profile Icon & Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="p-1 rounded-full hover:bg-[#245433]/5 transition-colors duration-200 flex items-center justify-center"
              aria-label="Usuario"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 origin-top-right rounded-2xl border border-[#245433]/15 bg-[#fdfbd7] p-2 shadow-xl ring-1 ring-black/5 animate-fade-in">
                {isAuthenticated && user ? (
                  <>
                    <div className="px-4 py-2.5 border-b border-[#245433]/10 mb-1">
                      <p className="text-xs text-[#245433]/50 font-bold uppercase tracking-wider">Sesión Activa</p>
                      <p className="text-sm font-black text-[#245433] truncate">{user.full_name}</p>
                      <p className="text-xs text-[#245433]/70 truncate">@{user.username}</p>
                    </div>
                    <Link
                      to="/pedidos"
                      onClick={() => setDropdownOpen(false)}
                      className="flex w-full items-center rounded-xl px-4 py-2 text-sm font-semibold text-[#245433] hover:bg-[#245433]/5 transition-colors"
                    >
                      Mis Pedidos
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                        navigate("/");
                      }}
                      className="flex w-full items-center rounded-xl px-4 py-2 text-sm font-bold text-[#7b1f2a] hover:bg-[#7b1f2a]/5 transition-colors mt-1"
                    >
                      Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-2.5 border-b border-[#245433]/10 mb-1">
                      <p className="text-sm font-bold text-[#245433]">¿Ya tienes cuenta?</p>
                      <p className="text-xs text-[#245433]/60">Inicia sesión para pedir.</p>
                    </div>
                    <Link
                      to="/login"
                      onClick={() => setDropdownOpen(false)}
                      className="flex w-full items-center rounded-xl px-4 py-2 text-sm font-bold text-[#245433] hover:bg-[#245433]/5 transition-colors"
                    >
                      Iniciar Sesión
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setDropdownOpen(false)}
                      className="flex w-full items-center rounded-xl px-4 py-2 text-sm font-bold text-white bg-[#1F8848] hover:bg-[#40A360] transition-colors mt-1 text-center justify-center shadow-md shadow-[#1F8848]/20"
                    >
                      Registrarse
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};



