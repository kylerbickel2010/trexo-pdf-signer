
import React, { useState, useEffect, useRef } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    X,
    ZoomIn,
    ZoomOut,
    RotateCcw,
} from 'lucide-react';
import { galleryImages } from '@/data/gallery';
import { Tooltip } from '@/components/ui';

// Lightbox component with zoom
export function Lightbox({
    isOpen,
    currentIndex,
    onClose,
    onPrev,
    onNext,
    onIndexChange,
    swipeHandlers,
}: {
    isOpen: boolean;
    currentIndex: number;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
    onIndexChange: (index: number) => void;
    swipeHandlers?: {
        onTouchStart: (e: React.TouchEvent) => void;
        onTouchMove: (e: React.TouchEvent) => void;
        onTouchEnd: (e: React.TouchEvent) => void;
    };
}) {
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const imageRef = useRef<HTMLDivElement>(null);

    // Reset zoom when image changes
    useEffect(() => {
        setZoom(1);
        setPosition({ x: 0, y: 0 });
    }, [currentIndex]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') onPrev();
            if (e.key === 'ArrowRight') onNext();
            if (e.key === '+' || e.key === '=') handleZoomIn();
            if (e.key === '-') handleZoomOut();
            if (e.key === '0') handleResetZoom();
        };

        window.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose, onPrev, onNext]);

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 4));
    const handleZoomOut = () => {
        setZoom(prev => {
            const newZoom = Math.max(prev - 0.5, 1);
            if (newZoom === 1) setPosition({ x: 0, y: 0 });
            return newZoom;
        });
    };
    const handleResetZoom = () => {
        setZoom(1);
        setPosition({ x: 0, y: 0 });
    };

    // Mouse drag for panning when zoomed
    const handleMouseDown = (e: React.MouseEvent) => {
        if (zoom > 1) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && zoom > 1) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y,
            });
        }
    };

    const handleMouseUp = () => setIsDragging(false);

    // Wheel zoom
    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        if (e.deltaY < 0) {
            handleZoomIn();
        } else {
            handleZoomOut();
        }
    };

    // Double click to toggle zoom
    const handleDoubleClick = () => {
        if (zoom === 1) {
            setZoom(2);
        } else {
            handleResetZoom();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            {/* Top toolbar */}
            <div
                className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-linear-to-b from-black/80 to-transparent"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-full bg-white/10 text-sm font-medium">
                        {currentIndex + 1} / {galleryImages.length}
                    </span>
                    <span className="text-white/80 text-sm hidden sm:block">
                        {galleryImages[currentIndex].title}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {/* Zoom controls */}
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 backdrop-blur-sm">
                        <Tooltip content="Zoom out (-)" position="bottom" disabled={zoom <= 1}>
                            <button
                                onClick={handleZoomOut}
                                disabled={zoom <= 1}
                                className="p-1.5 rounded hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ZoomOut className="w-4 h-4" />
                            </button>
                        </Tooltip>
                        <span className="px-2 text-sm font-mono min-w-12 text-center">
                            {Math.round(zoom * 100)}%
                        </span>
                        <Tooltip content="Zoom in (+)" position="bottom" disabled={zoom >= 4}>
                            <button
                                onClick={handleZoomIn}
                                disabled={zoom >= 4}
                                className="p-1.5 rounded hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ZoomIn className="w-4 h-4" />
                            </button>
                        </Tooltip>
                        <div className="w-px h-4 bg-white/20 mx-1" />
                        <Tooltip content="Reset zoom (0)" position="bottom">
                            <button
                                onClick={handleResetZoom}
                                className="p-1.5 rounded hover:bg-white/10 transition-colors"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                        </Tooltip>
                    </div>

                    {/* Close button */}
                    <Tooltip content="Close (Esc)" position="bottom">
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg bg-white/10 hover:bg-red-500/50 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </Tooltip>
                </div>
            </div>

            {/* Navigation arrows */}
            <Tooltip content="Previous (←)" position="right">
                <button
                    onClick={(e) => { e.stopPropagation(); onPrev(); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all hover:scale-110"
                >
                    <ChevronLeft className="w-8 h-8" />
                </button>
            </Tooltip>
            <Tooltip content="Next (→)" position="left">
                <button
                    onClick={(e) => { e.stopPropagation(); onNext(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all hover:scale-110"
                >
                    <ChevronRight className="w-8 h-8" />
                </button>
            </Tooltip>

            {/* Main image container */}
            <div
                ref={imageRef}
                className="absolute inset-0 flex items-center justify-center pt-16 pb-28 px-4 sm:px-20 overflow-hidden"
                onClick={e => e.stopPropagation()}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
                onDoubleClick={handleDoubleClick}
                {...(zoom === 1 && swipeHandlers ? swipeHandlers : {})}
                style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in' }}
            >
                <img
                    src={galleryImages[currentIndex].src}
                    alt={galleryImages[currentIndex].title}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-transform duration-200"
                    style={{
                        transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                    }}
                    draggable={false}
                />
            </div>

            {/* Bottom info and thumbnails */}
            <div
                className="absolute bottom-0 left-0 right-0 z-20 bg-linear-to-t from-black/90 via-black/60 to-transparent pt-8 pb-4"
                onClick={e => e.stopPropagation()}
            >
                {/* Image info */}
                <div className="text-center mb-4 px-4">
                    <h3 className="text-lg font-semibold text-white">{galleryImages[currentIndex].title}</h3>
                    <p className="text-sm text-white/60">{galleryImages[currentIndex].description}</p>
                </div>

                {/* Thumbnails strip */}
                <div className="flex justify-center gap-2 px-4 overflow-x-auto scrollbar-thin pb-2 mx-auto max-w-4xl">
                    {galleryImages.map((image, index) => (
                        <button
                            key={image.src}
                            onClick={() => onIndexChange(index)}
                            className={`relative shrink-0 w-20 h-12 rounded-lg overflow-hidden transition-all duration-300 ${index === currentIndex
                                    ? 'ring-2 ring-primary scale-105 shadow-lg shadow-primary/30'
                                    : 'opacity-50 hover:opacity-100 hover:scale-102'
                                }`}
                        >
                            <img
                                src={image.src}
                                alt={image.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                            {index === currentIndex && (
                                <div className="absolute inset-0 bg-primary/10" />
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
