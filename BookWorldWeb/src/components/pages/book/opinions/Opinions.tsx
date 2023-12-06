import { useEffect, useState } from "react";
import { OpinionCard } from "./OpinionCard";
import "./opinions.css";

type OpinionsProps = 
{
    bookId: number;
    rating: RatingResponse;
}

export type RatingResponse = {
    id: number;
    bookId: number;
    userId: string;
    comment: string | null;
    rating: number;
}  


export const Opinions = (props: OpinionsProps) => {
    const [ratings, setRatings] = useState<RatingResponse[]>([])

    const payload = {
        where: {
          AND: [
            {
              bookId: {
                equals: props.bookId
              }
            }
          ]
        },
        pagination: {
          take: 20,
          skip: 0
        },
      }
      useEffect(() => {
        fetch(`/api/ratings/elastic/get/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
          .then(response => response.json())
          .then(data => setRatings(data))
      }, [props.bookId, props.rating])

    const opinionsList = ratings.map(rating => {
        return (
            <OpinionCard rating={rating}/>
        )
    })

    return (
        <div className="opinions-list">
            {ratings.length === 0 && <div className="opinions-list-empty">No opinions yet :/</div>}
            {opinionsList}
        </div>
    )
}