import React from 'react'
import Header from '../components/common/Header'
import "../styles/global.css";
import SearchBox from '../components/common/SearchBox';
import Hero from '../components/common/Hero';
import OfferCard from '../components/common/OfferCard';
import ReviewCard from "../components/common/ReviewCard";
import Footer from '../components/common/Footer';
import { Link } from 'react-router-dom';

const reviews = [
  { id: 1, review: "Clean Buses. Courteous Staff and well behaved", author: "Guhan" },
  { id: 2, review: "Super clean, good takecare of customers", author: "Dharshan" },
  { id: 3, review: "Great service and punctual buses, Super timing", author: "Sakthi" },
];

const offers = [
  { id: 1, image: "src/assets/images/offer1.avif", alt: "offer1" },
  { id: 2, image: "src/assets/images/offer2.jpg",  alt: "offer2" },
  { id: 3, image: "src/assets/images/offer3.jpg",  alt: "offer3" },
  { id: 4, image: "src/assets/images/offer4.jpg",  alt: "offer4" },
]; 

export default function Home() {
  return (
    <div>
        <Header/>
        <Hero/>
        <SearchBox/>
        <section className="container-section">
          <div className="section-header">
            <h3 style={{ fontWeight: "bold", marginLeft: 20 }}>Offers</h3>
            <Link to="/offers">View All</Link>
          </div>
          <div className="card-offers">
            {offers.map((offer) => (
              <OfferCard
                key={offer.id}
                image={offer.image}
                alt={offer.alt}
              />
            ))}
          </div>
        </section>

        <section className="container-section">
          <div className="section-header">
            <h3 style={{ fontWeight: "bold", marginLeft: 20 }}>Reviews</h3>
          </div>
          <div className="review-cards">
            {reviews.map((item) => (
              <ReviewCard
                key={item.id}
                review={item.review}
                author={item.author}
              />
            ))}
          </div>
        </section>

        <section className="about-rideon">                      
          <h3 style={{ fontWeight: "bold" }}>                      
            RideOn - TamilNadu's largest and user friendly Bus Booking Platform
          </h3>
          <p style={{ textAlign: "justify" }}>
            RideOn is a modern and user-friendly online bus booking platform designed to make travel simple, affordable, and convenient.
            With an easy search system, flexible ticket options, and exclusive offers, RideOn helps travelers book bus tickets quickly
            and confidently. The platform focuses on providing a smooth booking experience, transparent pricing, and reliable customer
            support. Whether planning daily commutes or long-distance trips, RideOn ensures comfort, safety, and value for every journey.
          </p>

          <h3 style={{ fontWeight: "bold" }}>Why to choose RideOn?</h3>
          <ul>
            <li>RideOn offers a simple and user-friendly booking process that lets you reserve your bus ticket in just a few clicks.</li>
            <li>With secure and trusted payment gateways, RideOn ensures your transactions are always safe and protected.</li>
            <li>Enjoy free cancellation on selected routes, giving you flexibility when your travel plans change.</li>
            <li>RideOn allows easy ticket modifications so you can reschedule your journey without hassle.</li>
            <li>Get access to exclusive discounts, seasonal offers, and special deals that help you save more on every trip.</li>
            <li>Choose from a wide network of verified bus operators covering multiple cities and routes.</li>
            <li>Make informed travel decisions by reading genuine customer reviews and ratings before booking.</li>
            <li>Receive dedicated 24/7 customer support to assist you with bookings, cancellations, or any travel queries.</li>
            <li>Experience transparent pricing with no hidden charges, so you always know exactly what you are paying for.</li>
            <li>Travel with confidence knowing RideOn prioritizes passenger safety, comfort, and overall journey satisfaction.</li>
          </ul>

          <h3 style={{ fontWeight: "bold" }}>About - RideOn</h3>
          <p style={{ textAlign: "justify" }}>
            RideOn is a smart and reliable bus booking platform designed to make travel simple, fast, and stress free. We connect
            passengers with trusted bus operators, providing a seamless booking experience from search to seat confirmation.
            Our goal is to transform the way people travel by offering a convenient digital solution for bus reservations. With RideOn,
            users can easily search routes, compare schedules, choose preferred seats, and complete bookings within minutes.
            We focus on safety, affordability, and customer satisfaction. Our platform ensures transparent pricing, secure payments,
            and real time booking updates. Whether you are traveling for work, education, or leisure, RideOn makes every journey
            comfortable and well planned. At RideOn, we believe travel should be accessible to everyone. That is why we continuously
            work to improve our services, expand our network, and enhance user experience through technology and innovation.{" "}
            <span style={{ color: "rgb(50, 50, 235)" }}>RideOn – Book Smart. Travel Easy.</span>
          </p>
        </section>

        <Footer/>
    </div>
  )
}
