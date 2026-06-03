interface StreakBannerProps {
  streak: number;
}

export default function StreakBanner({ streak }: StreakBannerProps) {
  if (streak < 3) {
    return null;
  }

  return (
    <div className="card mb-8 px-4 py-3.5 text-center">
      <p className="font-body text-[15px] text-text">
        <span className="font-semibold">{streak} day</span> streak
      </p>
    </div>
  );
}
