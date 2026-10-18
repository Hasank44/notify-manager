const Loader = ({ size = "md", full = false }) => {
    const sizeMap = {
        sm: "h-5 w-5 border-2",
        md: "h-8 w-8 border-2",
        lg: "h-12 w-12 border-[3px]",
    };
    const spinner = (
        <div
            className={`${sizeMap[size]} animate-spin rounded-full border-white/20 border-t-indigo-400`}
            role="status"
            aria-label="Loading"
        />
    );
    if (full) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                {spinner}
            </div>
        );
    }
    return (
        <div className="flex items-center justify-center p-4">{spinner}</div>
    );
};

export default Loader;