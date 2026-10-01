const HeroSection = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[#f7f7f7]">
      <div className="mx-auto flex min-h-screen max-w-[1400px] flex-col items-center justify-center px-6 py-12 md:flex-row md:justify-start md:px-12 md:py-0 lg:px-20">

        <div className="relative w-full md:w-[52%]">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f5c85b] text-[10px]">
              %
            </span>
            <span className="text-xs font-medium text-gray-700">
              50% OFF Summer Super Sale
            </span>
          </div>

          <h1 className="max-w-[550px] text-3xl font-bold leading-tight text-[#222] md:text-4xl lg:text-5xl">
            Step into Style: Your
            <br />
            Ultimate Fashion Destination
          </h1>

          <p className="mt-5 max-w-[500px] text-sm leading-6 text-gray-500">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore.
          </p>

          <button className="mt-7 flex items-center gap-3 bg-[#4b1208] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#321008]">
            Shop Now
            <span>→</span>
          </button>
        </div>

        <div className="absolute bottom-0 right-0 hidden h-full w-[52%] md:block">
          <img
            src="/src/assets/hero.png"
            alt="Fashion Model"
            className="absolute bottom-0 right-0 h-[100%] w-full object-contain object-bottom"
          />

          
        </div>

        <div className="mt-8 w-full md:hidden">
          <img
            src="/src/assets/hero.png"
            alt="Fashion Model"
            className="mx-auto max-h-80 max-w-full object-contain"
          />
        </div>
      </div>

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