import React from 'react'
import { Link } from 'react-router-dom'       
import '../../styles/global.css'

export default function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <div className="footer-brand">
          <h3>Ride<span>On</span></h3>
          <p>Tamil Nadu's most trusted bus booking platform. Book smart, travel easy.</p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <Link to="/contact">Contact Us</Link>      {/* ← Link instead of <a> */}
          <Link to="/about">About Us</Link>
          <Link to="/offers">Offers</Link>
        </div>

        <div className="footer-social">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#"><img src="src/assets/logo/facebook.webp"   alt="Facebook"  /></a>
            <a href="#"><img src="src/assets/logo/instagram.avif"  alt="Instagram" /></a>
            <a href="#"><img src="src/assets/logo/twitter.avif"    alt="Twitter"   /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>rideonofficial@gmail.com</p>
        <p>&copy; 2026 RIDEON (INDIA) PRIVATE LIMITED. All rights reserved</p>  {/* ← &copy; */}
      </div>
    </footer>
  )
}