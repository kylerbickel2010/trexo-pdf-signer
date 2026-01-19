
import React from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { categoryColors } from '@/data/faqs';
import { ANIMATION } from '@/utils/constants';
import type { FAQ } from '@/data/types';

// FAQ Item Component
export function FAQItem({
    faq,
    index,
    isOpen,
    onToggle,
    isVisible,
}: {
    faq: FAQ;
    index: number;
    isOpen: boolean;
    onToggle: () => void;
    isVisible: boolean;
}) {
    const colors = categoryColors[faq.category] || categoryColors.general;

    return (
        <div
            className={`group relative transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
            style={{ transitionDelay: `${index * ANIMATION.staggerDelay}ms` }}
        >
            {/* Subtle glow on open */}
            {isOpen && (
                <div className="absolute -inset-1 bg-linear-to-r from-primary/10 via-cyan-500/5 to-primary/10 rounded-2xl blur-xl opacity-60 pointer-events-none" />
            )}

            <div
                className={`
          relative overflow-hidden rounded-2xl backdrop-blur-xl
          transition-all duration-500 ease-out glass-card
          ${isOpen
                        ? 'bg-card/80 border-primary/20 shadow-lg shadow-primary/5'
                        : 'hover:border-primary/20 hover:bg-card/90'
                    }
        `}
            >
                <button
                    onClick={onToggle}
                    className="w-full px-6 py-5 flex items-start justify-between text-left"
                >
                    <div className="flex items-start gap-4 pr-4">
                        {/* Question icon */}
                        <div
                            className={`
                mt-0.5 w-8 h-8 rounded-lg ${colors.bg}
                flex items-center justify-center shrink-0
                ring-1 ring-white/5
                transition-all duration-500 ease-out
                ${isOpen ? 'scale-105' : 'group-hover:scale-105'}
              `}
                        >
                            <MessageCircle className={`w-4 h-4 ${colors.text}`} />
                        </div>

                        <div>
                            <span
                                className={`
                  font-medium transition-colors duration-500
                  ${isOpen ? 'text-foreground' : 'text-foreground/90 group-hover:text-foreground'}
                `}
                            >
                                {faq.question}
                            </span>
                        </div>
                    </div>

                    {/* Chevron */}
                    <div
                        className={`
              mt-1 w-8 h-8 rounded-lg flex items-center justify-center shrink-0
              transition-all duration-500 ease-out
              ${isOpen
                                ? 'bg-primary/10 rotate-180'
                                : 'bg-secondary group-hover:bg-secondary/80'
                            }
            `}
                    >
                        <ChevronDown
                            className={`
                w-4 h-4 transition-colors duration-500
                ${isOpen ? 'text-primary' : 'text-muted-foreground'}
              `}
                        />
                    </div>
                </button>

                {/* Answer - animated expand */}
                <div
                    className={`grid transition-all duration-500 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                        }`}
                >
                    <div className="overflow-hidden">
                        <div className="px-6 pb-5">
                            <div className="pl-12 border-l border-primary/20 ml-4">
                                <p className="text-muted-foreground text-sm leading-relaxed pl-4">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
