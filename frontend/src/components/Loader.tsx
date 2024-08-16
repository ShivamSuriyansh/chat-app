import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <span
        className="inline-block w-[3px] h-[20px] bg-white/50 rounded-[10px]"
        style={{
          animation: 'scale-up4 1s linear infinite',
          animationTimingFunction: 'linear',
        }}
      ></span>
      <span
        className="inline-block w-[3px] h-[35px] bg-white/50 rounded-[10px] mx-[5px]"
        style={{
          animation: 'scale-up4 1s linear infinite',
          animationTimingFunction: 'linear',
          animationDelay: '0.25s',
        }}
      ></span>
      <span
        className="inline-block w-[3px] h-[20px] bg-white/50 rounded-[10px]"
        style={{
          animation: 'scale-up4 1s linear infinite',
          animationTimingFunction: 'linear',
          animationDelay: '0.5s',
        }}
      ></span>
    </div>
  );
};

export default Loader;
