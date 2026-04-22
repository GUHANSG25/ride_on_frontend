import React from 'react'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'
import '../styles/global.css'
import { Link } from "react-router-dom";

export default function Contact() {
  return (
    <div>
      <Header />
      <section className="page-section">
        <Link to="/home" className="back-link">← Back</Link>
        <h3 className="page-title">Contact Us</h3>
        <div className="page-content">

          <div className="contact-cards">
            <div className="contact-card">
              <h5>Email</h5>
              <p>support@rideon.com</p>
            </div>
            <div className="contact-card">
              <h5>Phone</h5>
              <p>+91 98989 89898</p>
            </div>
            <div className="contact-card">
              <h5>Customer Care</h5>
              <p>24/7 Support</p>
            </div>
            <div className="contact-card">
              <h5>Head Office</h5>
              <p>No. 74, Main Road, Erode, Tamil Nadu, India</p>
            </div>
          </div>

          <p style={{ textAlign: "justify" }}>
            Our support team is dedicated to assisting you with booking queries, payment concerns, ticket modifications,
            cancellations, and travel guidance. We strive to provide quick and reliable responses so that your travel
            plans remain smooth and stress free.
          </p>
          <p style={{ textAlign: "justify" }}>
            For urgent assistance, passengers can reach our helpline anytime, where trained representatives are available
            to resolve issues efficiently. We also provide step by step support for first time users, ensuring a simple
            and comfortable booking experience.
          </p>
          <p style={{ textAlign: "justify" }}>
            We value customer feedback and continuously work to improve our services based on your suggestions. Your
            experience helps us enhance platform reliability, expand route availability, and introduce features that
            make travel more convenient for everyone.
          </p>
          <p style={{ textAlign: "justify" }}>
            You can also connect with us through our social media platforms for updates, offers, and travel tips.
            Your journey matters to us, and our mission is to provide dependable support at every step — from search
            and booking to boarding and arrival. Thank you for choosing RideOn as your trusted travel partner.
          </p>
          <p className="page-tagline">RideOn — Book Smart. Travel Easy.</p>
        </div>
      </section>
      <Footer />
    </div>
  )
}