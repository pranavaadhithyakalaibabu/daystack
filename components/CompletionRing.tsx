interface CompletionRingProps {
  rate: number;
}

export default function CompletionRing({ rate }: CompletionRingProps) {
  const clamped = Math.min(100, Math.max(0, rate));
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative mx-auto mb-10 h-36 w-36">
      <svg className="relative h-full w-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#e5e5ea"
          strokeWidth="8"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#0071e3"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading text-[32px] font-semibold text-text">
          {Math.round(clamped)}%
        </span>
        <span className="font-body text-[13px] text-text-secondary">
          complete
        </span>
      </div>
    </div>
  );
}
