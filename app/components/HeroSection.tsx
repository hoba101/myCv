/**
 * ============================================
 * HERO SECTION COMPONENT
 * ============================================
 * Two-column hero with soft brutalist typography
 * and decorative SVG elements.
 */

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden"
    >
      {/* --- Decorative Floating Shapes --- */}
      {/* Pink Star Top Left */}
      <div className="absolute top-32 left-[10%] animate-float delay-100">
        <svg width="48" height="48" viewBox="0 0 24 24" className="fill-accent-pink" stroke="var(--border-color)" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </div>
      
      {/* Blue Star Near Image */}
      <div className="absolute top-40 right-[45%] md:right-[35%] z-20 animate-float delay-300">
        <svg width="40" height="40" viewBox="0 0 24 24" className="fill-accent-blue -rotate-12" stroke="var(--border-color)" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </div>

      {/* Green Blob Bottom Left */}
      <div className="absolute bottom-20 left-[5%] animate-float delay-500">
        <svg width="60" height="60" viewBox="0 0 200 200" className="fill-accent-green" stroke="var(--border-color)" strokeWidth="6" xmlns="http://www.w3.org/2000/svg">
          <path d="M44.7,-76.4C58.3,-69.2,70.1,-58.1,79.5,-45.1C88.9,-32.1,95.9,-17.2,96.5,-2.1C97.1,13,91.3,28.4,81.4,41C71.5,53.6,57.5,63.4,42.5,70.6C27.5,77.8,11.5,82.4,-4.1,83.9C-19.7,85.4,-35.1,83.8,-48.6,76.5C-62.1,69.2,-73.8,56.2,-81.9,41.2C-90,26.2,-94.5,9.2,-93.6,-7.4C-92.7,-24,-86.4,-40.2,-75.4,-52.3C-64.4,-64.4,-48.7,-72.4,-33.6,-77.8C-18.5,-83.2,-4,-86,10.6,-83.9C25.2,-81.8,31.1,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
        </svg>
      </div>

      {/* --- Main Content Container --- */}
      <div className="section-container relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8">
          
          {/* --- Left Column: Typography --- */}
          <div className="flex-1 max-w-xl animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-theme leading-[1.1] tracking-tight">
              Hi , nice to meet you <br />
              <span className="relative inline-block mt-2">
                <span className="relative z-10">Welcome</span>
                <span className="absolute bottom-1 left-0 w-full h-3/5 bg-accent-highlight -z-10 -rotate-1"></span>
              </span>{" "}
              here{" "}
              <span className="relative inline-block">
                <span className="relative z-10"></span>
                <span className="absolute bottom-1 left-0 w-full h-3/5 bg-accent-highlight -z-10 rotate-1"></span>
              </span>
            </h1>
            
            {/* Small text arrow note */}
            <div className="mt-12 flex items-center gap-4 text-theme-muted animate-fade-in-up delay-200">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-theme -rotate-12">
                <path d="M10 9l-6 6 6 6" />
                <path d="M20 4v7a4 4 0 0 1-4 4H4" />
              </svg>
              <p className="font-semibold text-lg rotate-3" style={{ fontFamily: "cursive" }}>it&apos;s me, hi!</p>
            </div>
          </div>

          {/* --- Right Column: Image Box --- */}
          <div className="flex-1 w-full flex justify-center animate-fade-in-up delay-300">
            <div className="relative w-[280px] h-[280px] md:w-[350px] md:h-[350px]">
              
              {/* Drawn Frame Lines */}
              <div className="absolute -top-4 -bottom-4 left-0 w-[3px]" style={{ backgroundColor: 'var(--border-color)' }}></div>
              <div className="absolute -top-4 -bottom-4 right-0 w-[3px]" style={{ backgroundColor: 'var(--border-color)' }}></div>
              <div className="absolute top-0 -left-4 -right-4 h-[3px]" style={{ backgroundColor: 'var(--border-color)' }}></div>
              <div className="absolute bottom-0 -left-4 -right-4 h-[3px]" style={{ backgroundColor: 'var(--border-color)' }}></div>

              {/* Main Gray Square */}
              <div className="absolute inset-0 border-[3px] border-theme flex items-center justify-center" style={{ backgroundColor: '#A0A0A0' }}>
                <span className="text-7xl font-bold text-black">:)</span>
              </div>

              {/* Smiley Badge */}
              <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-accent-highlight border-[3px] border-theme rounded-full flex items-center justify-center" style={{ boxShadow: '2px 2px 0px 0px var(--shadow-color)' }}>
                <span className="text-2xl font-bold text-black">:)</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
