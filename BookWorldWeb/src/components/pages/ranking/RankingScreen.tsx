import React, { FC, useEffect, useState, useRef } from 'react';
import "../../page_elements/default_style.css";
import RankingCard from './RankingCard';
import axios from 'axios';
import { Book } from '../book/BookList';

const RankingScreen: FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const pageRef = useRef<number>(1);
  const pageSize = 10;

  useEffect(() => {
    const loadBooks = async () => {
      if (!hasMore || loading) return;

      setLoading(true);

      const payload = {
        orderBy: {
          ratingValue: "desc"
        },
        pagination: {
          take: pageSize,
          skip: (pageRef.current - 1) * pageSize
        }
      };

      axios.post<Book[]>('/api/books/elastic/get', payload)
        .then(response => {
          if (response.data.length === 0) {
            setHasMore(false);
          } else {
            setBooks(prevBooks => [...prevBooks, ...response.data]);
            pageRef.current++;
          }
        })
        .catch(error => {
          console.error('Error:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadBooks();
      }
    }, { threshold: 0.5 });

    observer.observe(document.querySelector('.end-marker')!);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loading]);

  return (
    <div className="screen">
      {books.map((book, index) => (
        <RankingCard key={book.id} book={book} rank={index + 1} />
      ))}
      {loading && <p>Loading...</p>}
      <div className="end-marker"></div>
    </div>
  );
};

export default RankingScreen;
