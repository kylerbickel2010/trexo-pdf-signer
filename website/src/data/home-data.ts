
import { FileUp, MousePointerClick, PenTool, Download } from 'lucide-react';

export const howItWorksSteps = [
    {
        icon: FileUp,
        step: '01',
        title: 'Open PDF Document',
        description: 'Launch Trexo PDF Signer and open the PDF file you want to sign. Drag and drop or use the file menu.',
        color: 'from-blue-500 to-cyan-500',
        bgColor: 'bg-blue-500/10',
        iconColor: 'text-blue-400',
    },
    {
        icon: PenTool,
        step: '02',
        title: 'Place Signature',
        description: 'Draw a signature box on the document or use an existing signature field. Customize appearance.',
        color: 'from-emerald-500 to-teal-500',
        bgColor: 'bg-emerald-500/10',
        iconColor: 'text-emerald-400',
    },
    {
        icon: MousePointerClick,
        step: '03',
        title: 'Select Certificate',
        description: 'Choose your digital certificate from a file (PKCS#12/PFX), USB token, or Windows store.',
        color: 'from-violet-500 to-purple-500',
        bgColor: 'bg-violet-500/10',
        iconColor: 'text-violet-400',
    },
    {
        icon: Download,
        step: '04',
        title: 'Save Signed PDF',
        description: 'Save the signed document. Your digital signature is now embedded and verifiable.',
        color: 'from-amber-500 to-orange-500',
        bgColor: 'bg-amber-500/10',
        iconColor: 'text-amber-400',
    },
];
