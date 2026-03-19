"use client";

const SIZES = {
    sm: { icon: 36, radius: 10, font: "1.5rem", dot: 6, dotShift: 3 },
    md: { icon: 44, radius: 13, font: "1.85rem", dot: 8, dotShift: 5 },
    lg: { icon: 56, radius: 16, font: "2.2rem", dot: 9, dotShift: 6 },
};

interface BolchatLogoProps {
    size?: keyof typeof SIZES;
    textClassName?: string;
}

export function BolchatLogo({ size = "md", textClassName = "" }: BolchatLogoProps) {
    const s = SIZES[size];

    return (
        <div style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>

            {/* ── B Icon — padding-free PNG, fills the box perfectly ── */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src="/chat-logo.png"
                alt="BolChat logo"
                style={{
                    width: s.icon,
                    height: s.icon,
                    borderRadius: s.radius,
                    flexShrink: 0,
                    display: "block",
                    filter: "drop-shadow(0 5px 16px rgba(255,61,143,0.45))",
                }}
            />

            {/* ── "olChat" wordmark — icon is the B ── */}
            <span
                className={textClassName}
                style={{
                    display: "flex",
                    alignItems: "baseline",
                    fontFamily: "var(--font-plus-jakarta), 'Inter', system-ui, sans-serif",
                    lineHeight: 1,
                    userSelect: "none",
                }}
            >
                <span
                    className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-rose-700 dark:from-white dark:to-rose-400 font-bold tracking-tight"
                    style={{
                        fontSize: s.font,
                    }}
                >
                    olChat
                </span>

                {/* Pink dot — bottom-aligned with text */}
                <span
                    style={{
                        display: "inline-block",
                        width: s.dot,
                        height: s.dot,
                        borderRadius: "50%",
                        background: "#F43F88",
                        marginLeft: 3,
                        flexShrink: 0,
                        alignSelf: "flex-end",
                        marginBottom: 2,
                    }}
                />
            </span>
        </div>
    );
}
