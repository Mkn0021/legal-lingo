"use client"

import {
    ReactFlow,
    Node,
    Edge,
    Handle,
    Position,
    NodeProps,
    Background,
    useNodesState,
    useEdgesState,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import {
    Upload,
    ScanText,
    Database,
    Languages,
    TriangleAlert,
    MessageCircle,
    FileCheck,
} from "lucide-react"


function StepNode({ data, selected }: NodeProps) {
    const d = data as {
        icon: React.ReactNode
        title: string
        description: string
        badge?: string
        badgeColor?: string
        isSource?: boolean
        isTarget?: boolean
    }

    return (
        <div className={`relative bg-white border rounded-xl p-4 w-52 shadow-sm hover:shadow-md transition-all duration-200 ${selected ? 'border-[#b060ff] shadow-lg ring-2 ring-[#b060ff]/40' : 'border-gray-200/60 hover:border-gray-300/80'}`}>
            <Handle
                type="target"
                position={Position.Left}
                className="bg-[#b060ff]! border-[#b060ff]! w-2! h-2!"
            />

            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <div className="size-8 rounded-lg bg-gray-950 text-white flex items-center justify-center shrink-0">
                        {d.icon}
                    </div>
                    {d.badge && (
                        <span
                            className="text-xs font-medium px-2 py-0.5 rounded-full transition-colors"
                            style={{ backgroundColor: d.badgeColor + "15", color: d.badgeColor }}
                        >
                            {d.badge}
                        </span>
                    )}
                </div>
                <div>
                    <p className="text-lg font-semibold text-gray-950 leading-tight">{d.title}</p>
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">{d.description}</p>
                </div>
            </div>

            <Handle
                type="source"
                position={Position.Right}
                className="bg-[#b060ff]! border-[#b060ff]! w-2! h-2!"
            />
        </div>
    )
}

function DatabaseNode({ data, selected }: NodeProps) {
    const d = data as {
        icon: React.ReactNode
        title: string
        description: string
        badge: string
    }

    return (
        <div className={`relative bg-gray-950 text-white border rounded-xl p-4 w-48 shadow-sm hover:shadow-md transition-all duration-200 ${selected ? 'border-[#ee87cb] shadow-lg ring-2 ring-[#ee87cb]/40' : 'border-white/15 hover:border-white/25'}`}>
            <Handle
                type="target"
                position={Position.Top}
                className="bg-[#ee87cb]! border-[#ee87cb]! w-2! h-2!"
            />
            <div className="flex flex-col gap-3">
                <div className="size-8 rounded-lg bg-white/10 flex items-center justify-center">
                    {d.icon}
                </div>
                <div>
                    <p className="text-lg font-semibold text-white leading-tight">{d.title}</p>
                    <p className="text-sm text-gray-400 mt-2 leading-relaxed">{d.description}</p>
                </div>
                <span className="text-xs text-gray-300 border border-white/15 rounded-full px-2 py-0.5 w-fit hover:border-white/25 transition-colors">
                    {d.badge}
                </span>
            </div>
            <Handle
                type="source"
                position={Position.Bottom}
                className="bg-[#ee87cb]! border-[#ee87cb]! w-2! h-2!"
            />
        </div>
    )
}


const initialNodes: Node[] = [
    {
        id: "upload",
        type: "step",
        position: { x: 0, y: 160 },
        data: {
            icon: <Upload size={14} />,
            title: "Upload Document",
            description: "PDF or DOCX — lease, employment contract, or visa letter",
            badge: "Step 1",
            badgeColor: "#b060ff",
        },
    },
    {
        id: "extract",
        type: "step",
        position: { x: 280, y: 160 },
        data: {
            icon: <ScanText size={14} />,
            title: "Text Extraction",
            description: "PDF.js extracts text with exact bounding box positions per word",
            badge: "Step 2",
            badgeColor: "#b060ff",
        },
    },
    {
        id: "match",
        type: "step",
        position: { x: 560, y: 160 },
        data: {
            icon: <Database size={14} />,
            title: "Term Matching",
            description: "5,200 legal terms scanned against document text",
            badge: "Step 3",
            badgeColor: "#b060ff",
        },
    },
    {
        id: "translate",
        type: "step",
        position: { x: 840, y: 160 },
        data: {
            icon: <Languages size={14} />,
            title: "Lingo Translation",
            description: "Full document translated via Lingo.dev with legal glossary attached",
            badge: "Step 4",
            badgeColor: "#b060ff",
        },
    },
    {
        id: "flag",
        type: "step",
        position: { x: 1120, y: 60 },
        data: {
            icon: <TriangleAlert size={14} />,
            title: "Gap Detection",
            description: "RED — concept doesn't exist. AMBER — exists but differs significantly.",
            badge: "Output",
            badgeColor: "#ee87cb",
        },
    },
    {
        id: "chat",
        type: "step",
        position: { x: 1120, y: 260 },
        data: {
            icon: <MessageCircle size={14} />,
            title: "Document Chat",
            description: "Ask questions in your language. Answers grounded in your specific document.",
            badge: "Output",
            badgeColor: "#ee87cb",
        },
    },
    // Data sources — top row
    {
        id: "db-wicourts",
        type: "database",
        position: { x: 420, y: -100 },
        data: {
            icon: <Database size={14} />,
            title: "wicourts.gov",
            description: "Official US court interpreter glossaries",
            badge: "EN → ES + DE",
        },
    },
    {
        id: "db-iate",
        type: "database",
        position: { x: 630, y: -100 },
        data: {
            icon: <Database size={14} />,
            title: "IATE API",
            description: "EU legal terminology database",
            badge: "1.4M terms",
        },
    },
    {
        id: "db-uscourts",
        type: "database",
        position: { x: 840, y: -100 },
        data: {
            icon: <FileCheck size={14} />,
            title: "uscourts.gov",
            description: "US Federal Courts glossary",
            badge: "EN definitions",
        },
    },
]


const initialEdges: Edge[] = [
    {
        id: "upload-extract",
        source: "upload",
        target: "extract",
        animated: true,
        style: { stroke: "#b060ff", strokeWidth: 1.5 },
    },
    {
        id: "extract-match",
        source: "extract",
        target: "match",
        animated: true,
        style: { stroke: "#b060ff", strokeWidth: 1.5 },
    },
    {
        id: "match-translate",
        source: "match",
        target: "translate",
        animated: true,
        style: { stroke: "#b060ff", strokeWidth: 1.5 },
    },
    {
        id: "translate-flag",
        source: "translate",
        target: "flag",
        animated: true,
        style: { stroke: "#ee87cb", strokeWidth: 1.5 },
    },
    {
        id: "translate-chat",
        source: "translate",
        target: "chat",
        animated: true,
        style: { stroke: "#ee87cb", strokeWidth: 1.5 },
    },
    // Data sources feeding into match
    {
        id: "wicourts-match",
        source: "db-wicourts",
        target: "match",
        style: { stroke: "#6b7280", strokeWidth: 1, strokeDasharray: "4 4" },
        label: "glossary",
        labelStyle: { fontSize: 10, fill: "#9ca3af" },
        labelBgStyle: { fill: "transparent" },
    },
    {
        id: "iate-match",
        source: "db-iate",
        target: "match",
        style: { stroke: "#6b7280", strokeWidth: 1, strokeDasharray: "4 4" },
    },
    {
        id: "uscourts-translate",
        source: "db-uscourts",
        target: "translate",
        style: { stroke: "#6b7280", strokeWidth: 1, strokeDasharray: "4 4" },
        label: "definitions",
        labelStyle: { fontSize: 10, fill: "#9ca3af" },
        labelBgStyle: { fill: "transparent" },
    },
]

const nodeTypes = {
    step: StepNode,
    database: DatabaseNode,
}

// ── Flow Component ────────────────────────────────────────

export function ProjectOverview() {
    const [nodes, , onNodesChange] = useNodesState(initialNodes)
    const [edges, , onEdgesChange] = useEdgesState(initialEdges)

    return (
        <div className="w-full h-full rounded-2xl overflow-hidden bg-linear-to-br from-white via-gray-50/50 to-white">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                panOnDrag={true}
                zoomOnScroll={false}
                zoomOnPinch={true}
                nodesDraggable={true}
                nodesConnectable={true}
                elementsSelectable={true}
                proOptions={{ hideAttribution: true }}
            >
                <Background color="#d1d5db" gap={20} size={2} className="mask-t-from-70% mask-b-from-90% mask-r-from-90% mask-l-from-90%" />
            </ReactFlow>
        </div>
    )
}