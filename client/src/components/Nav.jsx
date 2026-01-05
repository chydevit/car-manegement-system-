import React, { useContext } from "react";
import { Sun, Moon } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

export default function Nav() {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  function doLogout() {
    logout();
    navigate("/");
  }

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="flex items-center gap-2">
      <Link className={`nav-link ${isActive("/") ? "active" : ""}`} to="/">
        Home
      </Link>
      <Link className={`nav-link ${isActive("/browse") ? "active" : ""}`} to="/browse">
        Browse
      </Link>

      <button
        onClick={toggleTheme}
        className="w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-95 shadow-sm"
        style={{ backgroundColor: 'var(--glass)', borderColor: 'var(--border)', borderWidth: '1px' }}
      >
        {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
      </button>

      <div className="h-6 w-[1px] bg-slate-200 mx-2 hidden md:block"></div>

      <div className="flex items-center gap-2">
        {user ? (
          <>
            <div className="hidden lg:flex flex-col items-end mr-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-tighter">{user.role}</span>
              <span className="text-[10px] text-slate-400 font-medium">{user.email}</span>
            </div>

            <Link className={`nav-link ${isActive("/dashboard") ? "active" : ""}`} to="/dashboard">
              Dashboard
            </Link>

            {user.role !== "admin" && user.role !== "seller" && (
              <>
                <Link className={`nav-link ${isActive("/favorites") ? "active" : ""}`} to="/favorites">
                  Favorites
                </Link>

                <Link className={`nav-link ${isActive("/collection") ? "active" : ""}`} to="/collection">
                  My Collection
                </Link>
              </>
            )}

            {user.role === "admin" && (
              <Link className={`nav-link ${isActive("/admin") ? "active" : ""}`} to="/admin">
                Admin
              </Link>
            )}
            {(user.role === "seller" || user.role === "admin") && (
              <Link className={`nav-link ${isActive("/seller") ? "active" : ""}`} to="/seller">
                Inventory
              </Link>
            )}

            <Link className={`nav-link ${isActive("/settings") ? "active" : ""}`} to="/settings">
              Settings
            </Link>

            <button
              className="ml-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all active:scale-95"
              onClick={doLogout}
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link className="btn-premium py-2 px-6" to="/login">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
