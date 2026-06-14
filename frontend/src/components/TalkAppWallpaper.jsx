import React from 'react';
// Import the image so the bundler (Vite/Webpack) handles the path
import defaultWallpaper from '../assets/image/talk_default_wallpaper.jpeg';

const TalkAppWallpaper = ({
  // Use the imported variable as the default value
  imageUrl = defaultWallpaper,
}) => {
  return (
    <div
      className={`
        absolute 
        inset-0 
        z-0
        w-full 
        h-dvh
        pointer-events-none 
        opacity-100
        bg-no-repeat
        bg-cover
        bg-center`}
      // backgroundImage now points to the resolved path
      style={{ backgroundImage: `url(${imageUrl})` }}
      aria-hidden="true"
      data-testid="conversation-wallpaper"
    />
  );
};

export default TalkAppWallpaper;