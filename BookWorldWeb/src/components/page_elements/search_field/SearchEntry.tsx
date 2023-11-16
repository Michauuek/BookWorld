import React from 'react';

type SearchEntryProps = {
  thumbnail: string;
  name: string;
  underString?: string;
};

const SearchEntry: React.FC<SearchEntryProps> = ({ thumbnail, name, underString }) => {
    return (
        <li className="search-entry">
          <img className="thumbnail" src={thumbnail} alt={name} />
          <div className="details">
            <span className="name">{name}</span>
            {underString && <span className="under-string">{underString}</span>}
          </div>
        </li>
      );
};

export default SearchEntry;
