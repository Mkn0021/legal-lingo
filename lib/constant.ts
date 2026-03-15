export const RISK = {
    danger: {
        highlight: "rgba(239,68,68,0.25)",
        highlightActive: "rgba(239,68,68,0.5)",
        card: "bg-rose-50",
        cardActive: "ring-2 ring-rose-300 bg-rose-50",
        label: "High Risk",
    },
    warning: {
        highlight: "rgba(245,158,11,0.25)",
        highlightActive: "rgba(245,158,11,0.5)",
        card: "bg-amber-50",
        cardActive: "ring-2 ring-amber-300 bg-amber-50",
        label: "Caution",
    },
    safe: {
        highlight: "rgba(16,185,129,0.2)",
        highlightActive: "rgba(16,185,129,0.45)",
        card: "bg-emerald-50",
        cardActive: "ring-2 ring-emerald-300 bg-emerald-50",
        label: "Low Risk",
    },
} as const

export type RiskLevel = keyof typeof RISK