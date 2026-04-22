import React from 'react'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'
import '../styles/global.css'
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div>
      <Header />
      <section className="page-section">
        <Link to="/home" className="back-link">← Back</Link>
        <h3 className="page-title">About Us</h3>
        <div className="page-content" style={{ textAlign: "justify" }}>
          <p>
            <b>RideOn</b> is a smart and reliable bus booking platform designed to make travel simple, fast, and stress free.
            We connect passengers with trusted bus operators, providing a seamless booking experience from search to seat confirmation.
            Our intuitive interface and efficient booking system allow travelers to plan journeys with confidence and convenience.
          </p>
          <p>
            Our goal is to transform the way people travel by offering a convenient digital solution for bus reservations.
            With RideOn, users can easily search routes, compare schedules, choose preferred seats, and complete bookings within minutes.
            The platform is built to reduce travel uncertainty by providing accurate information, real-time availability, and instant booking confirmations.
          </p>
          <p>
            We focus on safety, affordability, and customer satisfaction. Our platform ensures transparent pricing, secure payments,
            and real time booking updates. Whether you are traveling for work, education, or leisure, RideOn makes every journey
            comfortable and well planned by giving access to multiple operators, flexible schedules, and verified service providers.
          </p>
          <p>
            RideOn also prioritizes user experience through modern design and innovative technology. Features such as seat selection,
            pickup and drop point customization, route insights, and travel policies help passengers make informed decisions.
            We continuously integrate feedback from our users to enhance performance, improve reliability, and introduce new functionalities
            that simplify travel management.
          </p>
          <p>
            For bus operators, RideOn serves as a digital growth partner. The platform helps operators reach a wider audience,
            optimize seat occupancy, and manage bookings efficiently. By bridging the gap between passengers and operators,
            RideOn contributes to a more organized and accessible transportation ecosystem.
          </p>
          <p>
            At RideOn, we believe travel should be accessible to everyone. That is why we continuously work to expand our network,
            strengthen partnerships, and improve service quality. Our vision is to become a trusted travel companion that supports
            safe, affordable, and comfortable journeys across cities and regions.
          </p>
          <p className="page-tagline">RideOn – Book Smart. Travel Easy.</p>
        </div>
      </section>
      <Footer />
    </div>
  )
}