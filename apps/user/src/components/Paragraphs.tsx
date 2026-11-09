/** Render plain text from the admin as paragraphs (blank line = new paragraph). No HTML is interpreted. */
export function Paragraphs({ text, className = 'mb-4' }: { text: string; className?: string }) {
  return (
    <>
      {text
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p, i) => (
          <p key={i} className={`whitespace-pre-line ${className}`}>
            {p}
          </p>
        ))}
    </>
  );
}
