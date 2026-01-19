
import React, { useState } from 'react';
import { Copy, Check, Folder } from 'lucide-react';
import { cn } from '@/utils/utils';

interface ConfigPathProps {
    os: string;
    path: string;
}

export function ConfigPath({ os, path }: ConfigPathProps) {
    const [copied, setCopied] = useState(false);

    const copyPath = async () => {
        await navigator.clipboard.writeText(path);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center justify-between p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 hover:border-blue-500/30 transition-all duration-300">
            <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0 mt-0.5">
                    <Folder className="w-4 h-4" />
                </div>
                <div>
                    <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1 block">{os}</span>
                    <code className="block text-sm font-mono text-foreground break-all">{path}</code>
                </div>
            </div>
            <button
                onClick={copyPath}
                className={cn(
                    "p-2 rounded-lg transition-all cursor-pointer shrink-0 ml-4",
                    copied
                        ? "bg-emerald-500/10 text-emerald-400 shadow-sm"
                        : "bg-background shadow-sm hover:shadow-md text-muted-foreground hover:text-foreground"
                )}
                title="Copy path"
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
