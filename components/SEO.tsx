import { useEffect } from 'react';

interface SEOProps {
    title: string;
    description: string;
    image?: string;
    url?: string;
    keywords?: string;
}

const SEO = ({ title, description, image, url, keywords }: SEOProps) => {
    useEffect(() => {
        // Update Title
        document.title = title;

        // Helper to update meta tags
        const updateMeta = (name: string, content: string, attribute = 'name') => {
            let meta = document.querySelector(`meta[${attribute}="${name}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute(attribute, name);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        };

        // Standard Meta
        updateMeta('description', description);
        if (keywords) updateMeta('keywords', keywords);

        // Open Graph
        updateMeta('og:title', title, 'property');
        updateMeta('og:description', description, 'property');
        if (image) updateMeta('og:image', image, 'property');
        if (url) updateMeta('og:url', url, 'property');
        updateMeta('og:type', 'website', 'property');

        // Twitter
        updateMeta('twitter:card', 'summary_large_image');
        updateMeta('twitter:title', title);
        updateMeta('twitter:description', description);
        if (image) updateMeta('twitter:image', image);

    }, [title, description, image, url, keywords]);

    return null;
};

export default SEO;
