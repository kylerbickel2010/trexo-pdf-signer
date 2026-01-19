import { useState, useEffect } from 'react';
import { X, Star, Share2, Github, Download, Heart } from 'lucide-react';
import { useGitHubStats } from '@/context/GitHubStatsContext';
import { GITHUB_URL, SOURCEFORGE } from '@/utils/constants';

const POPUP_DELAY = 6000; // 6 seconds
const DISMISS_KEY = 'emark_promo_dismissed_v2';
const DISMISS_DURATION = 1000 * 60 * 60 * 24 * 3; // 3 days

export function PromotionPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { stars, downloads } = useGitHubStats();

  useEffect(() => {
    // Check if popup was recently dismissed
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt) {
      const dismissTime = parseInt(dismissedAt, 10);
      if (Date.now() - dismissTime < DISMISS_DURATION) {
        return; // Don't show popup if dismissed within the last 3 days
      }
    }

    // Show popup after delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, POPUP_DELAY);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem(DISMISS_KEY, Date.now().toString());
    }, 300);
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Trexo PDF Signer',
      text: 'Check out this free, open-source PDF signing tool! Works on Windows, macOS, and Linux.',
      url: window.location.origin,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or error, fallback to copy
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.origin);
    alert('Link copied to clipboard!');
  };

  const formatNumber = (num: number | null): string => {
    if (num === null) return '0';
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      />

      {/* Popup */}
      <div
        className={`fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-md transition-all duration-300 ${
          isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        <div className="relative bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
          {/* Gradient border effect */}
          <div className="absolute inset-0 rounded-2xl p-px bg-gradient-to-br from-cyan-500/30 via-transparent to-purple-500/30 pointer-events-none" />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors z-10"
            aria-label="Close popup"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Content */}
          <div className="relative p-6 sm:p-8">
            {/* Header with icon */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center animate-bounce">
                  <Star className="w-3.5 h-3.5 text-yellow-900 fill-yellow-900" />
                </div>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-bold text-center text-white mb-2">
              Enjoying Trexo PDF Signer?
            </h2>
            <p className="text-slate-400 text-center text-sm sm:text-base mb-6">
              Help us grow by starring on GitHub and sharing with others!
            </p>

            {/* Stats - 2 column */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {/* GitHub Stars */}
              <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700/50">
                <div className="flex items-center justify-center gap-1.5 text-yellow-500 mb-1">
                  <Star className="w-4 h-4 fill-yellow-500" />
                  <span className="text-xl font-bold">{formatNumber(stars)}</span>
                </div>
                <span className="text-xs text-slate-500">GitHub Stars</span>
              </div>

              {/* GitHub Downloads */}
              <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700/50">
                <div className="flex items-center justify-center gap-1.5 text-emerald-500 mb-1">
                  <Download className="w-4 h-4" />
                  <span className="text-xl font-bold">{formatNumber(downloads)}+</span>
                </div>
                <span className="text-xs text-slate-500">Downloads</span>
              </div>
            </div>

            {/* SourceForge Badge */}
            <div className="flex justify-center mb-6">
              <a
                href={SOURCEFORGE.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://img.shields.io/sourceforge/dt/trexo-pdf-signer?style=for-the-badge&logo=sourceforge&logoColor=white&label=SourceForge&labelColor=1e293b&color=f97316"
                  alt="SourceForge Downloads"
                  className="h-7 hover:scale-105 transition-transform duration-300"
                />
              </a>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Star on GitHub */}
              <a
                href={`${GITHUB_URL}/stargazers`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
              >
                <Github className="w-5 h-5" />
                <span>Star on GitHub</span>
              </a>

              {/* Share */}
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-600 transition-all duration-200"
              >
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>

            {/* Skip link */}
            <button
              onClick={handleClose}
              className="w-full mt-4 text-sm text-slate-500 hover:text-slate-400 transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </>
  );
}