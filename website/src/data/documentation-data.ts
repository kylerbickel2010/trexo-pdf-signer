
import {
    BookOpen,
    Key,
    FileSignature,
    Shield,
    Clock,
    Lock,
    HardDrive,
    Settings,
} from 'lucide-react';
import type { NavigationSection } from '@/components/common/Sidebar';

export const documentationSections: NavigationSection[] = [
    { id: 'overview', label: 'Overview', icon: BookOpen, time: '2 min' },
    { id: 'certificates', label: 'Certificate Types', icon: Key, time: '4 min' },
    { id: 'signing', label: 'Digital Signing', icon: FileSignature, time: '3 min' },
    { id: 'security', label: 'Security & Standards', icon: Shield, time: '4 min' },
    { id: 'timestamping', label: 'Timestamping', icon: Clock, time: '2 min' },
    { id: 'privacy', label: 'Privacy', icon: Lock, time: '2 min' },
    { id: 'usb-tokens', label: 'USB Tokens', icon: HardDrive, time: '3 min' },
    { id: 'configuration', label: 'Configuration', icon: Settings, time: '3 min' },
];
