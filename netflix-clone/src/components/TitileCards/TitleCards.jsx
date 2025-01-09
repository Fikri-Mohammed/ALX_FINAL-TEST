import React, { useEffect, useRef, useState } from 'react';
import './TitleCards.css'; // Assuming you already have this CSS file
import { Link } from 'react-router-dom';
import { TMDB_Access_Key } from '../../config'; // Your API key configuration file

const TitleCards = ({ title, category }) => {
  const [apiData, setApiData] = useState([]); // State for fetched data
  const cardsRef = useRef(); // Ref for horizontal scrolling

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_Access_Key}`,
    },
  };

  const handleWheel = (event) => {
    event.preventDefault();
    cardsRef.current.scrollLeft += event.deltaY;
  };

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${category || 'now_playing'}?language=en-US&page=1`,
      options
    )
      .then((response) => response.json())
      .then((response) => setApiData(response.results || []))
      .catch((err) => console.error(err));

    cardsRef.current.addEventListener('wheel', handleWheel);
    return () => {
      cardsRef.current.removeEventListener('wheel', handleWheel);
    };
  }, [category]);

  const dataToPass = { name: 'John Doe', age: 25 }; // Example data

  return (
    <div className="title-cards">
      <h2>{title || 'Popular on Netflix'}</h2>
      <div className="card-list" ref={cardsRef}>
        {apiData.map((card, index) => (
          <Link
            to={{ pathname: `/player/${card.id}`, state: dataToPass }}
            className="card"
            key={index}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${card.backdrop_path}`}
              alt={card.original_title}
            />
            <p>{card.original_title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TitleCards;
