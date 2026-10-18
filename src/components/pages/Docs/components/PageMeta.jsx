import { usePageMeta } from "@/hooks/usePageMeta";

const PageMeta = ({ title, description, keywords, path, structuredData, children }) => {
    usePageMeta({ title, description, keywords, path, structuredData });
    return children;
};

export default PageMeta;