import { useState } from "react";
import "./rating.css";

type RatingInteractiveProps =
  {
    presetRating: number;
    onClick: (rating: number, comment: string) => void;
  };

const RatingInteractive = (props: RatingInteractiveProps) => {
  const [rating, setRating] = useState(props.presetRating);
  const [comment, setComment] = useState('');

  const handleClick = (index: number) => {
    setRating(index + 1);
    console.log(`rated value is: ${rating}`);
    props.onClick(index + 1, comment);
  };

  const handleHover = (index: number) => {
    setRating(index + 1);
  };

  const handleMouseLeave = () => {
    setRating(props.presetRating);
  };

  const stars = Array.from({ length: 5 }, (_, index) => (
    <span
      key={index}
      className={`star ${index < rating ? "filled" : ""}`}
      onClick={() => handleClick(index)}
      onMouseEnter={() => handleHover(index)}
      onMouseLeave={() => handleHover(rating - 1)}
    >
      &#9733;
    </span>
  ));

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value);
  };


  return (
    <div className="interactive-rating-container">
      <div className="interactive-rating" onMouseLeave={handleMouseLeave}>{stars}</div>
      <textarea
        className="comment-input" // Apply the newly created class
        value={comment}
        onChange={handleCommentChange}
        placeholder="Leave a comment"
        rows={4} // Set the number of visible lines
      />
    </div>
  );
};

export default RatingInteractive;
