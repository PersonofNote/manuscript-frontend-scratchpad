import React from 'react';

type Props = {
  text: string;
};


export const IlluminatedLetter: React.FC<Props> = ({ text }) => {
  if (!text) return null;

  const sanity = text.split('');

  // Find first alphabetic letter
  const match = text.trim().match(/^(\p{L})(.*)/u);
  if (!match) return <p>{text}</p>;

  const firstLetter = sanity[0].toUpperCase();
  const rest = sanity.slice(1, -1);
  
  return (
    <div className="illuminated-container">
      <span className="illuminated-letter" aria-hidden="true">
        <img src={`/illuminated-s.svg`} alt="" />
      </span>
      <span className="visually-hidden">{firstLetter}</span>
      {rest}
    </div>
  );
};