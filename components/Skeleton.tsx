import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'rectangular' | 'circular' | 'text';
    width?: string | number;
    height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    variant = 'rectangular',
    width,
    height
}) => {
    const baseStyles = "animate-pulse bg-white/5 rounded-lg";
    const variantStyles = {
        rectangular: "rounded-lg",
        circular: "rounded-full",
        text: "rounded h-4 w-3/4"
    };

    const style = {
        width: width,
        height: height
    };

    return (
        <div
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            style={style}
        />
    );
};
