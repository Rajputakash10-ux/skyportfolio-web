// Pure server component — no JS, renders immediately as static HTML
// This is the LCP element: must have zero client-side delay
export default function HeroStats() {
  const stats = [
    { value: "5+", label: "Years Experience" },
    { value: "3+", label: "AI/ML Projects" },
    { value: "5+", label: "Companies" },
    { value: "10+", label: "Technologies" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
      {stats.map((s) => (
        <div key={s.label} className="text-center">
          <div className="font-sora font-extrabold text-3xl gradient-text">{s.value}</div>
          <div className="text-[#9CA3AF] text-xs mt-1 tracking-wide">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
