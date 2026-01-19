
import React from 'react';
import { Usb } from 'lucide-react';

interface TokenCardProps {
    name: string;
    vendor: string;
}

export function TokenCard({ name, vendor }: TokenCardProps) {
    return (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:bg-card/80 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <Usb className="w-5 h-5" />
            </div>
            <div>
                <span className="font-semibold text-sm text-foreground block mb-0.5">{name}</span>
                <p className="text-xs text-muted-foreground">{vendor}</p>
            </div>
        </div>
    );
}
