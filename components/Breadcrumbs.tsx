import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    to?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
    return (
        <nav className="flex items-center gap-1.5 text-xs text-zinc-500 mb-6 font-medium animate-in fade-in slide-in-from-left-4 duration-500">
            <Link to="/" className="hover:text-white transition-colors flex items-center gap-1">
                <Home className="w-3 h-3" />
                <span>Ana Sayfa</span>
            </Link>

            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-1.5 align-baseline">
                    <ChevronRight className="w-3 h-3 text-zinc-700" />
                    {item.to ? (
                        <Link to={item.to} className="hover:text-white transition-colors">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-zinc-300">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
};
