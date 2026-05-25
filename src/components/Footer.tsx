export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 px-4 text-center">
      <p className="text-[#9CA3AF] text-sm">
        Built with{" "}
        <span className="gradient-text font-semibold">Next.js 14 + Framer Motion</span>
        {" "}by{" "}
        <span className="text-white font-semibold">Akash Singh</span>
      </p>
      <p className="text-[#4B5563] text-xs mt-2">© {new Date().getFullYear()} All rights reserved.</p>
    </footer>
  );
}
