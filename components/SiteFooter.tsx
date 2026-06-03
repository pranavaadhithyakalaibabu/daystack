export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto w-full border-t border-border pt-6 text-center md:pt-8">
      <p className="font-heading text-[13px] font-semibold tracking-wide text-text">
        DayStack
      </p>
      <p className="mt-2 font-body text-[13px] text-text-secondary">
        © {year} DayStack · Built with love by{" "}
        <span className="font-medium text-text">
          Pranav Aadhithya Kalaibabu
        </span>{" "}
        <span aria-hidden>♥</span>
      </p>
    </footer>
  );
}
