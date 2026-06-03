"use client";

import { useState } from "react";

interface UserAvatarProps {
  src: string | null;
  initials: string;
  profileEmoji?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 text-[11px]",
  md: "h-10 w-10 text-xs",
  lg: "h-14 w-14 text-lg",
  xl: "h-20 w-20 text-lg",
};

const emojiSizes = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
  xl: "text-2xl",
};

const badgeSizes = {
  sm: "h-[15px] w-[15px] text-[9px] ring-[1.5px]",
  md: "h-[17px] w-[17px] text-[10px] ring-2",
  lg: "h-[22px] w-[22px] text-[11px] ring-2",
  xl: "h-[26px] w-[26px] text-[13px] ring-2",
};

export default function UserAvatar({
  src,
  initials,
  profileEmoji,
  size = "sm",
  className = "",
}: UserAvatarProps) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  return (
    <div className={`relative shrink-0 ${sizeClasses[size]} ${className}`}>
      <div className="h-full w-full overflow-hidden rounded-full bg-surface-secondary">
        {showImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={src}
            alt=""
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : profileEmoji ? (
          <div className="flex h-full w-full items-center justify-center">
            <span className={emojiSizes[size]}>{profileEmoji}</span>
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-brand/10 font-body font-semibold text-brand">
            {initials}
          </div>
        )}
      </div>

      {showImage && profileEmoji && (
        <span
          className={`absolute -bottom-px -right-px flex items-center justify-center rounded-full bg-surface ring-surface ${badgeSizes[size]} shadow-sm`}
          aria-hidden
        >
          <span className="leading-none">{profileEmoji}</span>
        </span>
      )}
    </div>
  );
}
