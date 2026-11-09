export function SectionTitle({ children, accent }: { children: React.ReactNode; accent?: React.ReactNode }) {
  return (
    <h2 className="mb-10 text-center text-3xl font-bold text-navy sm:text-4xl">
      {children}
      {accent && <span className="text-gold"> {accent}</span>}
    </h2>
  );
}
