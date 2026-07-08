import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";

export function Nav() {
  return (
    <nav className="lav-nav">
      <Link to="/" className="lav-nav-brand">
        <img src={logo} alt="LavTudo" />
        <span>LavTudo</span>
      </Link>
      <div className="lav-nav-links">
        <Link
          to="/"
          className="lav-nav-link"
          activeProps={{ className: "lav-nav-link active" }}
          activeOptions={{ exact: true }}
        >
          Início
        </Link>
        <Link
          to="/scan"
          className="lav-nav-link"
          activeProps={{ className: "lav-nav-link active" }}
        >
          Scan
        </Link>
      </div>

    </nav>
  );
}
