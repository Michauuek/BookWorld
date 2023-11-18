import { RatingResponse } from "./Opinions";
import "./opinions.css";


type OpinionCardProps = {
    rating: RatingResponse,
}

export const OpinionCard = (props: OpinionCardProps) => {

    return (
        <div className="opinion-card">
            <div className="opinion-card-rating">
            <div className="opinion-card-rating-star">{'\u2605'}</div>
                <div className="opinion-card-rating-value">{props.rating.rating}</div>
            </div>
            <div className="opinion-card-comment">{props.rating.comment}</div>
        </div>
    )
}