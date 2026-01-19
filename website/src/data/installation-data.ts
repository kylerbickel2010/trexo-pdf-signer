
import {
    Monitor,
    Terminal,
    Apple,
    Settings,
    Shield,
    CheckCircle,
    Trash2,
    HelpCircle,
    Info,
} from 'lucide-react';
import type { NavigationSection } from '@/components/common/Sidebar';

export const installationSections: NavigationSection[] = [
    { id: 'prerequisites', label: 'Prerequisites', icon: Info, time: '2 min' },
    { id: 'windows', label: 'Windows', icon: Monitor, time: '5 min' },
    { id: 'linux', label: 'Linux', icon: Terminal, time: '5 min' },
    { id: 'macos', label: 'macOS', icon: Apple, time: '5 min' },
    { id: 'java-setup', label: 'Java Setup', icon: Settings, time: '3 min' },
    { id: 'certificate-setup', label: 'Certificate Setup', icon: Shield, time: '3 min' },
    { id: 'first-run', label: 'First Run', icon: CheckCircle, time: '2 min' },
    { id: 'uninstall', label: 'Uninstall', icon: Trash2, time: '2 min' },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: HelpCircle, time: '—' },
];
