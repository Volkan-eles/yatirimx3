import { useEffect } from 'react';

interface SEOProps {
    title: string;
    description: string;
    image?: string;
    url?: string;
    keywords?: string;
}

const SEO = ({ title, description, image, url, keywords, canonicalUrl, schema }: SEOProps & { canonicalUrl?: string; schema?: object }) => {
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

        // Canonical URL
        const finalCanonical = canonicalUrl || url;
        if (finalCanonical) {
            let link = document.querySelector('link[rel="canonical"]');
            if (!link) {
                link = document.createElement('link');
                link.setAttribute('rel', 'canonical');
                document.head.appendChild(link);
            }
            link.setAttribute('href', finalCanonical);
        }

        // Schema.org JSON-LD
        if (schema) {
            let script = document.querySelector('script[type="application/ld+json"]');
            if (!script) {
                script = document.createElement('script');
                script.setAttribute('type', 'application/ld+json');
                document.head.appendChild(script);
            }
            script.textContent = JSON.stringify(schema);
        }

    }, [title, description, image, url, keywords, canonicalUrl, schema]);

    return null;
};

export default SEO;
