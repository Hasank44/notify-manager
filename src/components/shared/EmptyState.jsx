import { Inbox } from "lucide-react";

const EmptyState = ({ icon: Icon = Inbox, title = "Nothing here yet", description = "There is nothing to display right now.", action = null, className = "" }) => (
    <div
        className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-12 text-center ${className}`}
    >
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400">
            <Icon size={24} />
        </div>
        <h3 className="text-base font-semibold text-gray-100">{title}</h3>
        <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>
        {action && <div className="mt-4">{action}</div>}
    </div>
);

export default EmptyState;