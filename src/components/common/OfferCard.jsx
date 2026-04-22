import '../../styles/OfferCard.css'

export default function OfferCard({ image, alt, link = "/pages/offers.html" }) {
  return (
    <div className="card-offer">
      <a href={link}>
        <img src={image} alt={alt} />
      </a>
    </div>
  );
}