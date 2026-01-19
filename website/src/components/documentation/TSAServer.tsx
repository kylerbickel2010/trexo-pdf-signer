
import React, { useState } from 'react';
import { Check, Copy, Globe, ExternalLink } from 'lucide-react';
import { cn } from '@/utils/utils';

interface TSAServerProps {
    name: string;
    url: string;
}

export function TSAServer({ name, url }: TSAServerProps) {
    const [copied, setCopied] = useState(false);

    const copyUrl = async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border group hover:border-primary/20 transition-all duration-300">
            <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
                    <Globe className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-foreground">{name}</span>
                        <a href={url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                    <code className="block text-xs text-muted-foreground mt-1 font-mono break-all">{url}</code>
                </div>
            </div>
            <button
                onClick={copyUrl}
                className={cn(
                    "p-2 rounded-lg transition-all cursor-pointer shrink-0 ml-4",
                    copied
                        ? "bg-emerald-500/10 text-emerald-400 shadow-sm"
                        : "bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary"
                )}
                title="Copy URL"
            >
                {copied ? (
                    <Check className="w-4 h-4" />
                ) : (
                    <Copy className="w-4 h-4" />
                )}
            </button>
        </div>
    );
}
