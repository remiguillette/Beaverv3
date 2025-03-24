import React from 'react';

interface BeaverLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const BeaverLogo: React.FC<BeaverLogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-24 h-24',
  };

  return (
    <svg 
      className={`${sizeClasses[size]} ${className}`}
      viewBox="0 0 100 100" 
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      stroke="none"
    >
      <path d="M94.81,37.21c-5.89-6.24-15.74-6.75-23.19-3.5C68.5,14.95,55.43,1.88,36.67,1.88c-12.7,0-23.08,10.37-23.08,23.08c0,1.49.15,2.96.42,4.38-6.62.96-12.2,5.57-14.13,12.04C-4.41,52.84,3.42,65.21,15,65.21h1.15c.19,0,.38-.01.57-.03,2.03,5.72,4.97,11.96,7.86,15.8,6.8,9.06,18.5,18.75,28.42,18.13,8.55-.54,15.76-7.22,17.94-15.48,8.06-6.31,13.76-15.57,16.89-27.29,3.6-13.49,15.27-11.48,7.98-19.13ZM31.35,45c-4.42,0-8-3.58-8-8s3.58-8,8-8,8,3.58,8,8-3.58,8-8,8Zm20.77,31.15c-3.21,0-5.81-2.6-5.81-5.81s2.6-5.81,5.81-5.81,5.81,2.6,5.81,5.81-2.6,5.81-5.81,5.81Z"/>
    </svg>
  );
};

export default BeaverLogo;
