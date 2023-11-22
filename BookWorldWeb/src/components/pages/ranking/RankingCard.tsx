import React from 'react';
import { Book } from '../book/BookList';
import './ranking_screen.css';
import { Link } from 'react-router-dom';

type RankingCardProps = {
  book: Book;
  rank: number; // Added rank prop
};

const RankingCard: React.FC<RankingCardProps> = ({ book, rank }) => {
  return (
    <div className="ranking-card">
      <div className="rank-number">{rank}</div> {/* Display rank */}
      <Link to={`/book/${book.id}`}><img src={book.coverUrl} alt={book.title} className="cover-image" /></Link>
      <div className="ranking-card-details">
      <Link to={`/book/${book.id}`}><h2>{book.title}</h2></Link>
        <p className="detail-text">Author: {" "}
        <Link to={`/author/${book.author.id}`}>
          <span>
            {book.author.name} {book.author.lastName}
            </span>
            </Link></p>
        <p className="detail-text">Genres: {
          book.genres.map((genre, index) => (
            <Link to={`/genre/${genre.id}`}>
            <span key={genre.id}>
              {index > 0 ? ', ' : ''}{genre.name}
            </span>
            </Link>
          ))
        }</p>
        <div className='ranking-rating'>{'\u2605'} {book.rating.value.toFixed(2)}/5</div>
      </div>
    </div>
  );
};

export default RankingCard;
