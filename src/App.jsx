import React, { useRef, forwardRef, useEffect, useState, useMemo } from "react";
import HTMLFlipBook from "react-pageflip";
import { Sparkles, Heart, ChevronRight, ChevronLeft } from "lucide-react";

// Assets
import coverImg from "./assets/z7573615539870_435e94cab080c662c7ab24c9c59409c7.jpg";
import lastPage1 from "./assets/z7573615539870_435e94cab080c662c7ab24c9c59409c7.jpg";
import lastPage2 from "./assets/z7573632456257_f467bd3d6ba8341e042993735a3150a6.jpg";

/* ================= COMPONENTS (forwardRef là bắt buộc) ================= */

const Page = forwardRef(({ children, className = "" }, ref) => (
  <div ref={ref} className={`bg-[#fdfaf3] shadow-inner border-l border-amber-200/50 ${className}`}>
    {children}
  </div>
));

/* ================= MAIN APP ================= */

export default function App() {
  const bookRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, isMobile: false });
  const [isReady, setIsReady] = useState(false);

  // 1. Xử lý ảnh
  const allImages = useMemo(() => {
    const modules = import.meta.glob("./assets/*.{png,jpg,jpeg}", { eager: true });
    return Object.values(modules).map((m) => m.default);
  }, []);

  // 2. Cấu hình Responsive và Reset Book
  useEffect(() => {
    const handleResize = () => {
      setIsReady(false); // Tạm ẩn book để reset hoàn toàn
      const winW = window.innerWidth;
      const winH = window.innerHeight;
      
      if (winW < 768) {
        setDimensions({ width: winW * 0.9, height: winH * 0.7, isMobile: true });
      } else {
        setDimensions({ width: 450, height: 600, isMobile: false });
      }
      
      // Delay nhỏ để React dọn dẹp DOM cũ trước khi render lại Book mới
      setTimeout(() => setIsReady(true), 50);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 3. Phân chia trang (Logic trang chẵn)
  const finalPages = useMemo(() => {
    const photosPerPage = dimensions.isMobile ? 2 : 4;
    const groups = [];
    for (let i = 0; i < allImages.length; i += photosPerPage) {
      groups.push(allImages.slice(i, i + photosPerPage));
    }

    // Đảm bảo tổng số trang (Cover + Blank + N Content + Back) là số chẵn
    // Công thức: 1 (Cover) + 1 (Blank) + N (Content) + 1 (Back)
    // Nếu tổng này lẻ, ta thêm 1 trang Blank cuối.
    const currentTotal = 3 + groups.length;
    const hasExtraBlank = currentTotal % 2 !== 0;

    return { groups, hasExtraBlank };
  }, [allImages, dimensions.isMobile]);

  if (!isReady) return <div className="w-screen h-screen bg-[#2c4c3b]" />;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#2c4c3b] p-4 overflow-hidden">
      
      {/* Nút điều khiển Mobile */}
      <button 
        onClick={() => bookRef.current?.pageFlip().prev()}
        className="absolute left-2 z-50 p-3 bg-white/20 rounded-full text-white md:hidden active:scale-95"
      >
        <ChevronLeft size={24} />
      </button>

      <div className="relative shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
        <HTMLFlipBook
          key={`${dimensions.width}-${dimensions.isMobile}`} // Dùng KEY để ép React tạo mới hoàn toàn instance
          width={dimensions.width}
          height={dimensions.height}
          size="fixed"
          minWidth={280}
          maxWidth={1000}
          minHeight={400}
          maxHeight={1200}
          showCover={true}
          usePortrait={dimensions.isMobile}
          flippingTime={800}
          startZIndex={0}
          ref={bookRef}
        >
          {/* TRANG 1: BÌA TRƯỚC */}
          <Page className="bg-gradient-to-br from-amber-300 to-orange-400 p-0 overflow-hidden">
            <div className="w-full h-full flex flex-col items-center justify-center p-6 border-r-8 border-black/10">
              <h1 className="text-2xl md:text-4xl font-serif text-amber-900 mb-6 text-center font-bold">Memory Book</h1>
              <img src={coverImg} className="w-48 md:w-64 h-64 md:h-80 object-cover rounded shadow-2xl border-4 border-white" />
              <p className="mt-8 text-amber-900/60 text-sm italic animate-pulse">Flip to open the book</p>
            </div>
          </Page>

          {/* TRANG 2: TRANG TRỐNG ĐẦU */}
          <Page />

          {/* CÁC TRANG NỘI DUNG */}
          {finalPages.groups.map((images, idx) => (
            <Page key={`content-${idx}`} className="p-4 md:p-6">
              <div className={`grid ${dimensions.isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-3 h-full`}>
                {images.map((img, i) => (
                  <div key={i} className="bg-white p-1 rounded shadow-sm border h-full overflow-hidden">
                    <img src={img} className="w-full h-full object-cover" alt="" />
                  </div>
                ))}
              </div>
            </Page>
          ))}

          {/* TRANG TRỐNG CUỐI (NẾU CẦN ĐỂ ĐỦ CẶP) */}
          {finalPages.hasExtraBlank && <Page />}

          {/* TRANG CUỐI: BÌA SAU */}
          <Page className="bg-amber-500 border-none">
            <div className="w-full h-full flex flex-col items-center justify-center text-white p-8">
              <Heart className="w-12 h-12 mb-4 fill-white" />
              <h2 className="text-xl italic font-serif"> "This book may close here,<br/>but our story does not."</h2>
              <div className="mt-6 flex gap-2">
                <img src={lastPage1} className="w-16 h-16 rounded-full border-2 border-white -rotate-6" />
                <img src={lastPage2} className="w-16 h-16 rounded-full border-2 border-white rotate-6" />
              </div>
            </div>
          </Page>
        </HTMLFlipBook>
      </div>

      <button 
        onClick={() => bookRef.current?.pageFlip().next()}
        className="absolute right-2 z-50 p-3 bg-white/20 rounded-full text-white md:hidden active:scale-95"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}