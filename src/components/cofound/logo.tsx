import React from 'react';

const Logo = () => (
  <div className="flex items-center space-x-3">
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22 42C33.0457 42 42 33.0457 42 22C42 10.9543 33.0457 2 22 2C10.9543 2 2 10.9543 2 22C2 33.0457 10.9543 42 22 42Z"
        className="fill-primary"
      />
      <path
        d="M22 34C28.6274 34 34 28.6274 34 22C34 15.3726 28.6274 10 22 10"
        stroke="hsl(var(--background))"
        strokeWidth="4"
        strokeLinecap="round"
      />
       <path
        d="M22 10C15.3726 10 10 15.3726 10 22C10 28.6274 15.3726 34 22 34"
        stroke="hsl(var(--background))"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="0.1 12"
      />
    </svg>
    <span className="text-3xl font-bold text-foreground">
      CoFound
    </span>
  </div>
);

export default Logo;
