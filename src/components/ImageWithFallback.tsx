import React, { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  fallbackIcon?: React.ReactNode;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = 'صورة مبادرة نفهم',
  className = '',
  fallbackSrc = '/assets/media/2a5ff57792804303d5ccab065dbeef27.png',
  fallbackIcon,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative inline-block overflow-hidden w-full h-full">
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-slate-100/60 animate-pulse rounded-[inherit] flex items-center justify-center">
          <span className="w-5 h-5 border-2 border-[#0c6aa7]/30 border-t-[#0c6aa7] rounded-full animate-spin" />
        </div>
      )}

      {hasError ? (
        <div
          className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#f0f7fb] to-[#e1eff8] border border-[#cbe3f3] text-[#0a4d7a] p-4 text-center rounded-[inherit] ${className}`}
        >
          {fallbackIcon || (
            <svg
              className="w-10 h-10 mb-2 text-[#0c6aa7]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          )}
          <span className="text-xs font-semibold text-[#0a4d7a]">{alt}</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
          {...props}
        />
      )}
    </div>
  );
};
