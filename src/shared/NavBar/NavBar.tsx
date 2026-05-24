import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Inicio", href: "/catalogo", hash: "#hero" },
  { label: "Bloques", href: "/catalogo", hash: "#bloques" },
  { label: "Pasos", href: "/catalogo", hash: "#pasos" },
];

export const NavBar = () => {
  const { pathname, hash } = useLocation();

  const currentHash = hash || "#hero";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#47aa66]/20 bg-[#fdfbd7]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3 transition-transform duration-200 hover:scale-[1.02]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#47aa66]/25 bg-[#47aa66] text-sm font-black text-[#fdfbd7] shadow-lg shadow-[#47aa66]/20">
          FS
          </div>
          <span className="text-sm font-semibold uppercase tracking-[0.28em] text-[#245433]">Catalogo</span>
        </Link>

        <ul className="flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href && currentHash === link.hash;
            return (
              <li key={link.href}>
                <Link
                  to={{ pathname: link.href, hash: link.hash }}
                  className={`relative rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#47aa66] text-[#fdfbd7]"
                      : "text-[#245433]/80 hover:bg-[#47aa66]/10 hover:text-[#245433]"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#7b1f2a]" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};
