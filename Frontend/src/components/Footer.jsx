import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">

        <p className="footer-tagline">
          Helping you discover the best food near you
        </p>

        <div className="footer-links">
          <a href="#">About</a>
          <a href="#">Contact</a>
          <a href="#">Privacy</a>
        </div>

        <p className="footer-copy">© 2025 FoodFinder. All rights reserved.</p>
      </div>
    </footer>
  );
}
