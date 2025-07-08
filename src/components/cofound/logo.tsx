import { motion } from 'framer-motion';
import React from 'react';

const Logo = ({ onClick }: { onClick?: () => void }) => (
  <motion.div 
    onClick={onClick}
    className="flex flex-col items-start cursor-pointer"
    whileHover={{ scale: 1.05 }}
    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
  >
    <div className="flex items-center text-2xl font-extrabold tracking-tighter text-foreground">
      <span>C</span>
      <svg
        width="24"
        height="24"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mx-[-1px] relative top-[-2px]"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32ZM16 26C21.5228 26 26 21.5228 26 16C26 10.4772 21.5228 6 16 6C10.4772 6 6 10.4772 6 16C6 21.5228 10.4772 26 16 26Z"
          className="fill-current"
        />
      </svg>
      <span>FOUNDR</span>
    </div>
    <div className="text-[10px] font-medium text-primary -mt-1.5 tracking-wide">
        WHERE FOUNDERS MEET, AND FUTURES BEGIN
    </div>
  </motion.div>
);

export default Logo;
