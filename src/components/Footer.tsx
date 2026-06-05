export default function Footer() {
  return (
    <footer className="border-t border-black/8 py-10 px-6 sm:px-8">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-black/25 text-xs tracking-widest uppercase">Akash Singh</p>
        <div className="flex items-center gap-6">
          <a href="https://github.com/Rajputakash10-ux" target="_blank" rel="noopener noreferrer" className="text-black/25 hover:text-white transition-colors text-xs tracking-widest uppercase">GitHub</a>
          <a href="https://www.linkedin.com/in/akash-rajput-9433aa368/" target="_blank" rel="noopener noreferrer" className="text-black/25 hover:text-white transition-colors text-xs tracking-widest uppercase">LinkedIn</a>
          <a href="mailto:rajputakash1656@gmail.com" className="text-black/25 hover:text-white transition-colors text-xs tracking-widest uppercase">Email</a>
        </div>
        <p className="text-black/15 text-xs">© {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
