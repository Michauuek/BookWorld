import React, { FC, useEffect, useState, useRef } from 'react';
import { Book } from './BookList';
import "../../page_elements/default_style.css";
import RankingCard from './RankingCard';

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

      try {
        const response = await fetch(`/api/books/elastic/get`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (data.length === 0) {
          setHasMore(false);
        } else {
          setBooks(prevBooks => [...prevBooks, ...data]);
          pageRef.current++;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
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
