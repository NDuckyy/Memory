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

          {/* TRANG 2: THƯ TAY ( MESSAGE PAGE ) */}
          <Page className="p-4 md:p-8 flex flex-col justify-center bg-[#fdfaf3] border-l border-amber-200 relative">
            {/* Hiệu ứng lề giấy kẻ ngang cho giống thư tay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
              style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px)', backgroundSize: '100% 1.8rem' }}></div>

            {/* Khối nội dung chính, có scroll khi cần thiết cho điện thoại ngắn */}
            <div className="relative z-10 overflow-y-auto max-h-full space-y-3 pb-6 md:pb-8">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-amber-900 flex items-center gap-1.5">
                Bon bon ti ti bi bo <Heart size={16} className="fill-amber-900" />
              </h2>

              {/* text-sm md:text-base giúp chữ tự động thu nhỏ trên điện thoại */}
              <div className="text-sm md:text-base text-amber-800 leading-relaxed font-serif italic space-y-3">
                <p>I’m sorry for giving you the gift a bit late. Honestly, I’m not really used to giving gifts to someone, so I spent a lot of time thinking about what I should give you all.</p>

                <p>When I read what everyone wrote, I was truly touched. So touched that I didn’t even know what to say. The night before everyone left, I kept thinking about what I could do to make the gift meaningful.</p>

                <p>In the end, I decided to use my own strengths to create something, as a little memory for all of us. So that in the future, whenever you feel sad, bored, or lonely, looking at this album might at least make you feel a little better.</p>

                <p className="font-semibold text-amber-950">I hope you all like this gift.</p>

                <p>And I hope one day soon, all of <span className="text-orange-700">Bon bon ti ti bi bo</span> can gather together again in Vietnam.</p>
              </div>

              {/* Di chuyển With lots of love vào bên trong để chắc chắn nó không bị tràn */}
              <div className="mt-6 md:mt-8 text-right pr-2">
                <p className="text-sm md:text-base text-amber-900 font-serif font-medium">With lots of love 🤍</p>
              </div>
            </div>
          </Page>

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
              <h2 className="text-xl italic font-serif"> "This book may close here,<br />but our story does not."</h2>
              <div className="mt-6 flex gap-2">
                <img src={lastPage1} className="w-16 h-16 rounded-full border-2 border-white -rotate-6" />
                <img src={lastPage2} className="w-16 h-16 rounded-full border-2 border-white rotate-6" />
              </div>
            </div>
          </Page>
        </HTMLFlipBook>
      </div>
    </div>
  );
}