import React from 'react';

interface SearchBarProps {
  initialSearchTerm?: string;
}

function SearchBar({ initialSearchTerm }: SearchBarProps) {
  return (
    <form action="/" method="GET" className="w-full max-w-md mb-6">
      <div className="flex">
        <input
          type="text"
          name="search"
          placeholder="Išči turnirje..."
          className="w-full p-2 rounded-lg bg-quaternary border border-quinary text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-quinary"
          defaultValue={initialSearchTerm}
        />
        <button
          type="submit"
          className="bg-quinary text-white p-2 rounded-r hover:bg-senary transition duration-300 ease-in-out flex items-center justify-center"
          aria-label="Search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
    </form>
  );
}

SearchBar.defaultProps = {
  initialSearchTerm: '',
};

export default SearchBar;
