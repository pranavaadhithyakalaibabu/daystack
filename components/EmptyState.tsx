import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export default function EmptyState({
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: EmptyStateProps) {
  return (
    <div className="w-full">
      <div className="card w-full px-8 py-12 text-center">
        <h1 className="font-heading text-[28px] font-semibold tracking-tight text-text">
          {title}
        </h1>
        <p className="mx-auto mt-3 max-w-sm font-body text-[17px] leading-relaxed text-text-secondary">
          {description}
        </p>
        <div className="mt-8 space-y-3">
          <Link href={primaryHref} prefetch className="btn-primary">
            {primaryLabel}
          </Link>
          {secondaryLabel && secondaryHref && (
            <Link href={secondaryHref} prefetch className="btn-secondary">
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
