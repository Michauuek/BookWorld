import { useState } from "react";
import "./rating.css";

type RatingInteractiveProps =
{
  presetRating: number;
  onClick: (rating: number) => void;
};

const RatingInteractive = (props:RatingInteractiveProps) => {
  const [rating, setRating] = useState(props.presetRating);

  const handleClick = (index: number) => {
    setRating(index + 1);
    console.log(`rated value is: ${rating}`);
    props.onClick(index + 1);
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

  return <div className="interactive-rating" onMouseLeave={handleMouseLeave}>{stars}</div>;
};

export default RatingInteractive;
