const pad = (n) => String(n).padStart(2, "0");

export const formatDate = (input) => {
    if (!input) return "—";
    const date = input instanceof Date ? input : new Date(input);
    if (Number.isNaN(date.getTime())) return "—";
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export const formatDateTime = (input) => {
    if (!input) return "—";
    const date = input instanceof Date ? input : new Date(input);
    if (Number.isNaN(date.getTime())) return "—";
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
        date.getHours()
    )}:${pad(date.getMinutes())}`;
};

export const formatTime = (input) => {
    if (!input) return "—";
    const date = input instanceof Date ? input : new Date(input);
    if (Number.isNaN(date.getTime())) return "—";
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

export const formatRelative = (input) => {
    if (!input) return "—";
    const date = input instanceof Date ? input : new Date(input);
    if (Number.isNaN(date.getTime())) return "—";

    const diff = Date.now() - date.getTime();
    const sec = Math.floor(diff / 1000);
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);
    const day = Math.floor(hr / 24);
    const week = Math.floor(day / 7);
    const month = Math.floor(day / 30);
    const year = Math.floor(day / 365);

    if (sec < 30) return "just now";
    if (sec < 60) return `${sec}s ago`;
    if (min < 60) return `${min}m ago`;
    if (hr < 24) return `${hr}h ago`;
    if (day < 7) return `${day}d ago`;
    if (week < 5) return `${week}w ago`;
    if (month < 12) return `${month}mo ago`;
    return `${year}y ago`;
};