import React from 'react';
// Import the image so the bundler (Vite/Webpack) handles the path
import defaultWallpaper from '../assets/image/talk_default_wallpaper.png';

const TalkAppWallpaper = ({
  // Use the imported variable as the default value
  imageUrl = defaultWallpaper,
  opacity = 'opacity-10',
  tile = true
}) => {
  return (
    <div
      className={`
        absolute 
        inset-0 
        z-1
        w-full 
        h-full 
        overflow-hidden 
        pointer-events-none 
        ${opacity} 
        ${tile ? 'bg-repeat' : 'bg-cover bg-center'}
      `}
      // backgroundImage now points to the resolved path
      style={{ backgroundImage: `url(${imageUrl})` }}
      aria-hidden="true"
      data-testid="conversation-wallpaper"
    />
  );
};

export default TalkAppWallpaper;