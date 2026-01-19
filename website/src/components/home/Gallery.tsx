import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Images, Play, Pause } from 'lucide-react';
import { useScrollAnimation, useSwipe } from '@/hooks';
import { galleryImages } from '@/data/gallery';
import { GALLERY_CONFIG } from '@/utils/constants';
import { Tooltip } from '@/components/ui';
import { Lightbox } from './ui/Lightbox';

// Slider navigation button component
function SliderButton({
  direction,
  onClick
}: {
  direction: 'prev' | 'next';
  onClick: () => void;
}) {
  const tooltipContent = direction === 'prev' ? 'Previous slide' : 'Next slide';
  const tooltipPosition = direction === 'prev' ? 'right' : 'left';

  return (
    <div className={`absolute top-1/2 -translate-y-1/2 z-10 ${direction === 'prev' ? 'left-4' : 'right-4'}`}>
      <Tooltip content={tooltipContent} position={tooltipPosition}>
        <button
          onClick={onClick}
          className="p-3 rounded-full bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 text-white hover:bg-primary/80 hover:border-primary/50 transition-all duration-300 group"
          aria-label={tooltipContent}
        >
          {direction === 'prev' ? (
            <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
          ) : (
            <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
          )}
        </button>
      </Tooltip>
    </div>
  );
}


export function Gallery() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: sliderContainerRef, isVisible: sliderVisible } = useScrollAnimation({ threshold: 0.1 });

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && !lightboxOpen) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % galleryImages.length);
      }, GALLERY_CONFIG.autoPlayInterval);
    }
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, lightboxOpen]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
    // Reset autoplay timer when manually changing slides
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      if (isAutoPlaying) {
        autoPlayRef.current = setInterval(() => {
          setCurrentSlide(prev => (prev + 1) % galleryImages.length);
        }, GALLERY_CONFIG.autoPlayInterval);
      }
    }
  }, [isAutoPlaying]);

  const goToPrevSlide = useCallback(() => {
    goToSlide(currentSlide === 0 ? galleryImages.length - 1 : currentSlide - 1);
  }, [currentSlide, goToSlide]);

  const goToNextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % galleryImages.length);
  }, [currentSlide, goToSlide]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const lightboxPrev = () => {
    setLightboxIndex(prev => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const lightboxNext = () => {
    setLightboxIndex(prev => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  // Touch/swipe support for slider
  const { handlers: sliderSwipeHandlers, swiping, offset } = useSwipe({
    onSwipeLeft: goToNextSlide,
    onSwipeRight: goToPrevSlide,
    threshold: 50,
  });

  // Touch/swipe support for lightbox
  const { handlers: lightboxSwipeHandlers } = useSwipe({
    onSwipeLeft: lightboxNext,
    onSwipeRight: lightboxPrev,
    onSwipeDown: closeLightbox,
    threshold: 50,
  });

  return (
    <section id="gallery" className="py-16 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-slate-900/30 to-transparent" />
      <div className="absolute inset-0 particle-grid opacity-20" />
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={`text-center mb-8 transition-all duration-700 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 ring-1 ring-primary/20 text-primary text-sm font-medium mb-6">
            <Images className="w-4 h-4" />
            <span>Visual Tour</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="gradient-text">Screenshot Gallery</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Explore Trexo PDF Signer's intuitive interface and powerful features through our interactive gallery.
          </p>
        </div>

        {/* Featured Slider */}
        <div
          ref={sliderContainerRef}
          className={`relative transition-all duration-1000 ${sliderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
        >
          {/* Main slider container */}
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-linear-to-r from-primary/20 via-cyan-500/20 to-primary/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />

            <div
              ref={sliderRef}
              className="relative glass-card-premium rounded-2xl overflow-hidden touch-pan-y"
              {...sliderSwipeHandlers}
            >
              {/* Slider track - using original images at full height */}
              <div
                className={`flex transition-transform ${swiping ? 'duration-0' : 'duration-700'} ease-out`}
                style={{
                  transform: `translateX(calc(-${currentSlide * 100}% + ${swiping ? offset.x : 0}px))`,
                }}
              >
                {galleryImages.map((image, index) => (
                  <div
                    key={image.src}
                    className="w-full shrink-0 relative cursor-pointer"
                    onClick={() => openLightbox(index)}
                  >
                    {/* Full height image container */}
                    <div className="relative w-full" style={{ minHeight: '500px', maxHeight: '70vh' }}>
                      <img
                        src={image.src}
                        alt={image.title}
                        className="w-full h-full object-contain bg-slate-950/50"
                        style={{ minHeight: '500px', maxHeight: '70vh' }}
                        loading={index <= 2 ? 'eager' : 'lazy'}
                      />
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white">
                        <Maximize2 className="w-5 h-5" />
                        <span className="font-medium">Click to expand</span>
                      </div>
                    </div>
                    {/* Image info overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-black/80 via-black/40 to-transparent">
                      <h3 className="text-xl font-semibold text-white mb-1">{image.title}</h3>
                      <p className="text-white/70 text-sm">{image.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation buttons */}
              <SliderButton direction="prev" onClick={goToPrevSlide} />
              <SliderButton direction="next" onClick={goToNextSlide} />

              {/* Play/Pause button */}
              <div className="absolute top-4 right-4 z-10">
                <Tooltip content={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'} position="left">
                  <button
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className="p-2 rounded-full bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 text-white hover:bg-primary/80 transition-all duration-300"
                  >
                    {isAutoPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>
                </Tooltip>
              </div>

              {/* Current slide indicator */}
              <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 text-white text-sm">
                {currentSlide + 1} / {galleryImages.length}
              </div>
            </div>
          </div>

          {/* Slider indicators */}
          <div className="flex justify-center items-center gap-2 mt-4">
            {galleryImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative h-2 rounded-full transition-all duration-300 ${index === currentSlide
                  ? 'w-8 bg-primary'
                  : 'w-2 bg-slate-600 hover:bg-slate-500'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              >
                {index === currentSlide && isAutoPlaying && (
                  <span className="absolute inset-0 rounded-full bg-primary/50 animate-pulse" />
                )}
              </button>
            ))}
          </div>

          {/* Thumbnail strip under slider */}
          <div className="mt-4 overflow-x-auto scrollbar-thin pb-2">
            <div className="flex gap-3 justify-center min-w-max px-4">
              {galleryImages.map((image, index) => (
                <button
                  key={image.src}
                  onClick={() => goToSlide(index)}
                  className={`relative shrink-0 w-24 h-14 rounded-lg overflow-hidden transition-all duration-300 ${index === currentSlide
                    ? 'ring-2 ring-primary scale-105 shadow-lg shadow-primary/30'
                    : 'opacity-60 hover:opacity-100 ring-1 ring-slate-700/50 hover:ring-slate-600'
                    }`}
                >
                  <img
                    src={image.src}
                    alt={image.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {index === currentSlide && (
                    <div className="absolute inset-0 bg-primary/10" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        isOpen={lightboxOpen}
        currentIndex={lightboxIndex}
        onClose={closeLightbox}
        onPrev={lightboxPrev}
        onNext={lightboxNext}
        onIndexChange={setLightboxIndex}
        swipeHandlers={lightboxSwipeHandlers}
      />
    </section>
  );
}
