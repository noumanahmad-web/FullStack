const HeroSection = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[#f7f7f7]">
      <div className="mx-auto flex min-h-screen max-w-[1400px] items-center px-6 md:px-12 lg:px-20">

        {/* LEFT CONTENT */}
        <div className="relative  w-full md:w-[52%]">
          {/* Sale Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f5c85b] text-[10px]">
              %
            </span>
            <span className="text-xs font-medium text-gray-700">
              50% OFF Summer Super Sale
            </span>
          </div>

          {/* Heading */}
          <h1 className="max-w-[550px] text-3xl font-bold leading-tight text-[#222] md:text-4xl lg:text-5xl">
            Step into Style: Your
            <br />
            Ultimate Fashion Destination
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-[500px] text-sm leading-6 text-gray-500">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore.
          </p>

          {/* Button */}
          <button className="mt-7 flex items-center gap-3 bg-[#4b1208] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#321008]">
            Shop Now
            <span>→</span>
          </button>
        </div>

        {/* RIGHT IMAGE */}
        <div className="absolute bottom-0 right-0 hidden h-full w-[52%] md:block">
          <img
            src="/src/assets/hero.png"
            alt="Fashion Model"
            className="absolute bottom-0 right-0 h-[100%] w-full object-contain object-bottom"
          />

          {/* Yellow Circle Badge */}
          <div className="absolute right-[12%] top-[14%] flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-gray-400 bg-[#f5c64d]">
            <div className="text-center">
              <span className="text-xl">😎</span>
              <p className="mt-1 text-[7px] font-bold uppercase">
                Summer
                <br />
                Collection
              </p>
            </div>
          </div>
        </div>

        {/* MOBILE IMAGE */}
        <div className="mt-8 md:hidden">
          <img
            src="/src/assets/hero.png"
            alt="Fashion Model"
            className="mx-auto max-h-[420px] object-contain"
          />
        </div>
      </div>

      {/* Decoration */}
      <div className="absolute left-[40%] top-0 grid grid-cols-5 gap-2 opacity-20">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="h-[3px] w-[3px] rounded-full bg-gray-500"
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;