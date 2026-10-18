import Loader from "./Loader";

const FullPageLoader = () => (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-[#0a0c1a] via-[#0a0c1c] to-[#03030d]">
        <Loader size="lg" />
    </div>
);

export default FullPageLoader;