import { useEffect } from "react";

const DEFAULT_TITLE = "Notify Manager";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const setMetaTag = (attr, key, content) => {
    if (!content) return;
    let tag = document.querySelector(`meta[${attr}="${key}"]`);
    if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
    }
    tag.setAttribute("content", content);
};

const setLinkTag = (rel, href) => {
    if (!href) return;
    let tag = document.querySelector(`link[rel="${rel}"]`);
    if (!tag) {
        tag = document.createElement("link");
        tag.setAttribute("rel", rel);
        document.head.appendChild(tag);
    }
    tag.setAttribute("href", href);
};

const setStructuredData = (data) => {
    let tag = document.querySelector('script[data-jsonld="docs"]');
    if (!tag) {
        tag = document.createElement("script");
        tag.type = "application/ld+json";
        tag.setAttribute("data-jsonld", "docs");
        document.head.appendChild(tag);
    }
    tag.textContent = JSON.stringify(data);
};

export const usePageMeta = ({
    title,
    description,
    keywords,
    path = "",
    structuredData = null,
}) => {
    useEffect(() => {
        const fullTitle = title ? `${title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE;
        document.title = fullTitle;
        const canonical = `${BASE_URL}/docs${path}`;
        const fullDescription = description || "Complete API documentation for Notify Manager — Telegram notification infrastructure for developers.";
        setMetaTag("name", "description", fullDescription);
        if (keywords) setMetaTag("name", "keywords", keywords);
        setMetaTag("name", "robots", "index, follow");
        setMetaTag("name", "author", "Notify Manager");
        setMetaTag("property", "og:title", fullTitle);
        setMetaTag("property", "og:description", fullDescription);
        setMetaTag("property", "og:type", "article");
        setMetaTag("property", "og:url", canonical);
        setMetaTag("property", "og:site_name", "Notify Manager");
        setMetaTag("name", "twitter:card", "summary_large_image");
        setMetaTag("name", "twitter:title", fullTitle);
        setMetaTag("name", "twitter:description", fullDescription);

        // Canonical
        setLinkTag("canonical", canonical);

        // Structured data
        if (structuredData) {
            setStructuredData(structuredData);
        } else {
            setStructuredData({
                "@context": "https://schema.org",
                "@type": "TechArticle",
                headline: fullTitle,
                description: fullDescription,
                url: canonical,
                author: { "@type": "Organization", name: "Notify Manager" },
                publisher: {
                    "@type": "Organization",
                    name: "Notify Manager",
                    url: "https://iftyhasan.com",
                },
            });
        }
        return () => {
            document.title = DEFAULT_TITLE;
        };
    }, [title, description, keywords, path, structuredData]);
};