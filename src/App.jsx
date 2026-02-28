import React, { useRef, forwardRef, useEffect, useState, useMemo } from "react";
import HTMLFlipBook from "react-pageflip";
import cover from "./assets/z7571395424349_31fc958f508e7ec06b6447d5eff2d3bc.jpg";
import lastPage1 from "./assets/z7571395423291_8f1d4aff153136d57b01d37a75285cc2.jpg";
import lastPage2 from "./assets/z7571395156264_26907e23e3ed919ca28818b6e5dac8d3.jpg";
import { Sparkles, Heart } from "lucide-react";

export default function App() {
  const bookRef = useRef();
  const isEndRef = useRef(false);

  const [bookSize, setBookSize] = useState({
    width: 720,
    height: 550,
  });

  /* ================= RESPONSIVE ================= */

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;

      if (screenWidth < 768) {
        const width = screenWidth - 20;
        const height = width * 0.75; // giữ tỉ lệ 4:3
        setBookSize({ width, height });
      } else {
        setBookSize({ width: 720, height: 550 });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ================= FLIP LOGIC ================= */

  const handleFlip = (e) => {
    const pageIndex = e.data;
    const pageFlip = bookRef.current?.pageFlip();
    const totalPages = pageFlip?.getPageCount();

    if (pageIndex === totalPages - 2) {
      isEndRef.current = true;
    }
  };

  /* ================= LOAD IMAGES ================= */

  const images = Object.values(
    import.meta.glob("./assets/*.{png,jpg,jpeg}", { eager: true })
  ).map((module) => module.default);

  const contentPages = useMemo(() => {
    const pages = [];

    for (let i = 0; i < images.length; i += 4) {
      pages.push(images.slice(i, i + 4));
    }

    if ((2 + pages.length + 1) % 2 !== 0) {
      pages.push([]);
    }

    return pages;
  }, [images]);

  /* ================= COMPONENTS ================= */

  const CoverPage = forwardRef((props, ref) => (
    <div ref={ref}>
      <div className="absolute w-full h-full bg-gradient-to-br from-amber-300 to-orange-300 rounded-xl shadow-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-700 hover:scale-105">
        <div className="absolute left-0 top-0 h-full w-6 bg-amber-400 rounded-l-xl shadow-inner"></div>

        <h1 className="text-3xl md:text-5xl font-serif text-amber-900 mb-6 text-center px-4">
          Our Unforgettable Memories
        </h1>

        <img
          src={cover}
          className="w-60 md:w-80 h-40 md:h-56 object-cover rounded-lg shadow-xl border-4 border-amber-100"
        />

        <p className="mt-6 italic text-amber-900">
          Slide to open the book
        </p>
      </div>
    </div>
  ));

  const PhotoPage = forwardRef(({ images }, ref) => (
    <div
      ref={ref}
      className="w-full h-full bg-amber-400 p-4 md:p-8 relative"
    >
      <div className="grid grid-cols-2 gap-4 md:gap-6">
        {images.map((img, i) => (
          <div key={i} className="bg-white p-2 md:p-3 rounded-md">
            <img
              src={img}
              alt=""
              className="w-full h-32 md:h-52 object-cover rounded"
            />
          </div>
        ))}
      </div>
    </div>
  ));

  const BlankPage = forwardRef((props, ref) => (
    <div ref={ref} className="w-full h-full bg-[#f8f1e4]" />
  ));

  const BackCover = forwardRef((props, ref) => (
    <div
      ref={ref}
      className="w-full h-full bg-amber-400 relative rounded-md overflow-hidden"
    >
      <div className="absolute inset-0 border-[10px] border-amber-400 rounded-md"></div>

      <img
        src={lastPage1}
        className="absolute bottom-50 left-4 w-20 md:w-24 h-20 md:h-24 object-cover rounded-md shadow-xl rotate-[-45deg]"
      />

      <img
        src={lastPage2}
        className="absolute bottom-4 right-4 w-20 md:w-24 h-20 md:h-24 object-cover rounded-md shadow-xl rotate-[-45deg]"
      />

      {/* Decorative Icons */}
      <div className="absolute inset-0 pointer-events-none opacity-90">
        <Sparkles className="absolute top-6 left-8 w-8 md:w-10 h-8 md:h-10 text-white" />
        <Heart className="absolute top-10 right-10 w-10 md:w-12 h-10 md:h-12 text-pink-200 rotate-12" />
        <Sparkles className="absolute bottom-8 left-12 w-8 md:w-10 h-8 md:h-10 text-white" />
        <Heart className="absolute bottom-6 right-1/3 w-10 md:w-12 h-10 md:h-12 text-pink-200 rotate-12" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center text-center h-full text-white font-bold px-6">
        <h2 className="text-sm md:text-xl tracking-widest leading-relaxed">
          <span className="text-lg md:text-2xl font-serif block mb-4">
            This book may close here, but our story does not
          </span>
          <span className="block mb-2 md:mb-4">
            One day, we will sit down together and write the next pages
          </span>
          <span className="block mb-2 md:mb-4">With new memories</span>
          <span className="block mb-2 md:mb-4">With joyful reunions</span>
          <span className="block">
            This place will always hold everything we’ve shared
          </span>
          <span className="block mt-4 md:mt-6 text-xs md:text-sm italic">
            Looking forward to the day we meet again and continue our story
          </span>
        </h2>
      </div>
    </div>
  ));

  /* ================= UI ================= */

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#6bc38f] overflow-hidden">

      <div className="max-w-full overflow-hidden">
        <HTMLFlipBook
          width={bookSize.width}
          height={bookSize.height}
          showCover={true}
          usePortrait={bookSize.width < 500}
          ref={bookRef}
          onFlip={handleFlip}
          className="rounded-md"
        >
          <CoverPage />
          <BlankPage />
          {contentPages.map((page, index) => (
            <PhotoPage key={index} images={page} />
          ))}
          <BlankPage />
          <BackCover />
        </HTMLFlipBook>
      </div>

      <div className="absolute bottom-4 right-4 border-2 border-black rounded-md p-2 bg-white shadow-lg">
        <button
          onClick={() => {
            if (isEndRef.current) {
              bookRef.current.pageFlip().flip(0);
              isEndRef.current = false;
            }
          }}
        >
          Đóng sách
        </button>
      </div>
    </div>
  );
}