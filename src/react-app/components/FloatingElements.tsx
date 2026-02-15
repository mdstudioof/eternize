export default function FloatingElements() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Floating circles */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute top-40 right-20 w-96 h-96 bg-violet-400/20 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-fuchsia-400/20 rounded-full blur-3xl animate-float-slow-reverse" />
      <div className="absolute bottom-40 right-1/3 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-float" />
      
      {/* Smaller floating dots */}
      <div className="absolute top-1/3 left-1/2 w-32 h-32 bg-violet-300/30 rounded-full blur-2xl animate-float-fast" />
      <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-purple-300/30 rounded-full blur-2xl animate-float-delayed" />
      <div className="absolute top-2/3 left-1/3 w-24 h-24 bg-fuchsia-300/30 rounded-full blur-xl animate-float-slow" />
    </div>
  );
}
