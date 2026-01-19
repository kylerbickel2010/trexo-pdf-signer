
import React from 'react';
import { X, ShieldX } from 'lucide-react';

interface PrivacyItemProps {
    text: string;
}

export function PrivacyItem({ text }: PrivacyItemProps) {
    return (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition-colors group">
            <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 group-hover:bg-red-500/20 transition-colors">
                <X className="w-3.5 h-3.5 text-red-400" />
            </div>
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{text}</span>
        </div>
    );
}
