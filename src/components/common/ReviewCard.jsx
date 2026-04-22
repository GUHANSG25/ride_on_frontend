import '../../styles/ReviewCard.css'

export default function ReviewCard({ review, author }) {
  return (
    <div className="review-card">
      <p>{review}</p>
      <h5>- {author}</h5>
    </div>
  );
}