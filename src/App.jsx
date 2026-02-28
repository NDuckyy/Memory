import React, { useRef, forwardRef, useEffect, useState, useMemo } from "react";
import HTMLFlipBook from "react-pageflip";
import cover from "./assets/z7571395424349_31fc958f508e7ec06b6447d5eff2d3bc.jpg"
import lastPage1 from "./assets/z7571395423291_8f1d4aff153136d57b01d37a75285cc2.jpg"
import lastPage2 from "./assets/z7571395156264_26907e23e3ed919ca28818b6e5dac8d3.jpg"
import { Sparkles, Heart } from "lucide-react";
export default function App() {
  const bookRef = useRef();
  const isEndRef = useRef(false);
  const handleFlip = (e) => {
    const pageIndex = e.data;
    const pageFlip = bookRef.current?.pageFlip();
    const totalPages = pageFlip?.getPageCount();

    if (pageIndex === totalPages - 2) {
      isEndRef.current = true;
    }
  };

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


  /* ========================= */
  /*        COMPONENTS         */
  /* ========================= */

  const CoverPage = forwardRef((props, ref) => (
    <div
      ref={ref}
    >
      <div
        className="absolute w-full h-full bg-gradient-to-br from-amber-300 to-orange-300 rounded-xl shadow-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-700 hover:scale-105"
      >
        <div className="absolute left-0 top-0 h-full w-6 bg-amber-400 rounded-l-xl shadow-inner"></div>

        <h1 className="text-5xl font-serif text-amber-900 mb-6">
          Our Unforgettable Memories
        </h1>

        <img
          src={cover}
          className="w-80 h-56 object-cover rounded-lg shadow-xl border-4 border-amber-100"
        />

        <p className="mt-6 italic text-amber-900">
          Slide to open the book
        </p>
      </div>
    </div>
  ));

  const BlankPageFirst = forwardRef((props, ref) => (
    <div
      ref={ref}
      className="w-full h-full bg-[#f8f1e4]"
    >
      Huhuhu
      <div className="absolute inset-0 border-[8px] border-white pointer-events-none"></div>
    </div>
  ));

  const BlankPageLast = forwardRef((props, ref) => (
    <div
      ref={ref}
      className="w-full h-full bg-[#f8f1e4]"
    >
      Huhuhu
      <div className="absolute inset-0 border-[8px] border-white pointer-events-none"></div>
    </div>
  ));

  const PhotoPage = forwardRef(({ images }, ref) => (
    <div
      ref={ref}
      className="w-full h-full bg-amber-400 p-8 relative"
    >
      {/* Viền trắng sát mép */}
      <div className="absolute inset-0 pointer-events-none"></div>

      <div className="grid grid-cols-2 gap-6">
        {images.map((img, i) => (
          <div
            key={i}
            className="bg-white p-3 rounded-md"
          >
            <img
              src={`${img}?auto=format&fit=crop&w=900&q=80`}
              alt=""
              className="w-full h-52 object-cover rounded"
            />
          </div>
        ))}
      </div>
    </div>
  ));

  const BackCover = forwardRef((props, ref) => (
    <div
      ref={ref}
      className="w-full h-full bg-amber-400 relative rounded-md overflow-hidden"
    >
      {/* Border */}
      <div className="absolute inset-0 border-[10px] border-amber-400 rounded-md"></div>


      {/* Bottom Left Image - rotate right 45deg */}
      <img
        src={lastPage1}
        alt="memory"
        className="absolute bottom-50 left-4 w-24 h-24 object-cover rounded-md shadow-xl rotate-[-45deg]"
      />

      <img
        src={lastPage2}
        alt="memory"
        className="absolute bottom-2 right-4 w-24 h-24 object-cover rounded-md shadow-xl rotate-[-45deg]"
      />

      {/* Decorative Icons */}
      <div className="absolute inset-0 pointer-events-none opacity-90">

        {/* Top */}
        <Sparkles className="absolute top-6 left-8 w-10 h-10 text-white" />
        <Heart className="absolute top-10 right-10 w-12 h-12 text-pink-200 rotate-12" />

        {/* Left */}
        <Sparkles className="absolute top-1/3 left-6 w-8 h-8 text-white rotate-12" />
        <Heart className="absolute bottom-1/3 left-8 w-10 h-10 text-pink-200 -rotate-12" />

        {/* Right */}
        <Sparkles className="absolute top-1/2 right-6 w-10 h-10 text-white -rotate-6" />
        <Heart className="absolute bottom-1/4 right-10 w-12 h-12 text-pink-200 rotate-6" />

        {/* Bottom */}
        <Sparkles className="absolute bottom-8 left-12 w-10 h-10 text-white" />
        <Heart className="absolute bottom-6 right-1/3 w-12 h-12 text-pink-200 rotate-12" />

      </div>
      {/* Content */}
      <div className="flex items-center justify-center text-center h-full text-white font-bold px-6 z-50">
        <h2 className="text-xl tracking-widest leading-relaxed">
          <span className="text-2xl font-serif block mb-4">
            This book may close here, but our story does not
          </span>
          <span className="block mb-4">
            One day, we will sit down together and write the next pages
          </span>
          <span className="block mb-4">With new memories</span>
          <span className="block mb-4">With joyful reunions</span>
          <span className="block">
            This place will always hold everything we’ve shared
          </span>
          <span className="block mt-6 text-sm italic">
            Looking forward to the day we meet again and continue our story
          </span>
        </h2>
      </div>
    </div>
  ));

  /* ========================= */
  /*           UI              */
  /* ========================= */

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#6bc38f]">

      <div className="relative">

        {/* ================= RUỘT SÁCH ================= */}
        <div className="relative m-6 rounded-md overflow-hidden">

          {/* Mép giấy xếp tầng bên phải */}
          <div className="absolute top-0 right-[-12px] h-full w-4 flex flex-col justify-between">
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className="h-[2px] bg-[#e8dcc2]"
                style={{
                  transform: `translateX(${Math.random() * 2}px)`
                }}
              />
            ))}
          </div>

          <HTMLFlipBook
            width={720}
            height={550}
            showCover={true}
            usePortrait={false}
            ref={bookRef}
            onFlip={handleFlip}
            className="rounded-md"
          >
            {/* ====== BÌA TRƯỚC ====== */}
            <CoverPage />

            {/* Mặt sau bìa trước */}
            <BlankPageFirst />

            {/* ====== NỘI DUNG ====== */}
            {contentPages.map((page, index) => (
              <PhotoPage key={`photo-${index}`} images={page} />
            ))}

            {/* Mặt trong bìa sau */}
            <BlankPageLast />

            {/* ====== BÌA SAU ====== */}
            <BackCover />

          </HTMLFlipBook>
        </div>

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