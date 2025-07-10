
import React from 'react';

interface RatingProps {
  rating: number;
  className?: string;
}

const Rating: React.FC<RatingProps> = ({ rating, className = "flex mb-4" }) => {
  return (
    <div className={className}>
      {[...Array(rating)].map((_, i) => (
        <span key={i} className="text-yellow-400 text-xl">⭐</span>
      ))}
    </div>
  );
};

export default Rating;
