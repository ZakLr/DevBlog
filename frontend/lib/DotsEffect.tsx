import React from 'react';

interface DotsEffectProps {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  scale?: number;
  rows?: number;
  columns?: number;
  rotation?: number;
  opacity?: number;
}

export default function DotsEffect({
  top,
  right,
  bottom,
  left,
  scale = 1,
  rows = 4,
  columns = 2,
  rotation = 0,
  opacity = 1,
  
}: DotsEffectProps) {
  const style = {
    top: top !== undefined ? `${top}rem` : 'auto',
    right: right !== undefined ? `${right}rem` : 'auto',
    bottom: bottom !== undefined ? `${bottom}rem` : 'auto',
    left: left !== undefined ? `${left}rem` : 'auto',
    transform: `scale(${scale}) rotate(${rotation}deg)`,
    opacity: `${opacity}`,

  };

  return (
    <div style={style} className="absolute flex gap-3 ">
      {Array.from({ length: columns }).map((_, colIndex) => (
        <div key={colIndex} className='flex flex-col gap-3'>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className='h-8 w-8 bg-highlight rounded-full'></div>
          ))}
        </div>
      ))}
    </div>
  );
}
