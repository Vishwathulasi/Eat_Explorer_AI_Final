import "../styles/Navbar.css";
import Logo from "../assets/logo.png";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-left">

        <div className="nav-brand">
          <img src={Logo} alt="FoodFinder Logo" className="nav-logo-img" />
          <span className="nav-logo">Eat Explorer</span>
        </div>

      </div>
    </nav>
  );
}
