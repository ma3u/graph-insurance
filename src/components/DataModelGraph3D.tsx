import { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import ForceGraph3D, { type ForceGraphMethods } from 'react-force-graph-3d'
import SpriteText from 'three-spritetext'
import * as THREE from 'three'
import { RotateCcw, Maximize2, Minimize2 } from 'lucide-react'

// ────────────────────────────────────────────
// Types
// ────────────────────────────────────────────
type SchemaNodeType =
  | 'law'
  | 'section'
  | 'core_component'
  | 'business_rule'
  | 'process'
  | 'goal'
  | 'task'
  | 'entity'
  | 'gra_instruction'
  | 'standard'
  | 'chatapi'

interface SchemaNode {
  id: string
  label: string
  type: SchemaNodeType
  description: string
  count?: string
  x?: number
  y?: number
  z?: number
}

interface SchemaLink {
  source: string
  target: string
  type: string
  description?: string
}

interface SchemaData {
  nodes: SchemaNode[]
  links: SchemaLink[]
}

// ────────────────────────────────────────────
// Color palette
// ────────────────────────────────────────────
const NODE_COLORS: Record<SchemaNodeType, string> = {
  law: '#3b82f6',
  section: '#6366f1',
  core_component: '#8b5cf6',
  business_rule: '#f59e0b',
  process: '#10b981',
  goal: '#ec4899',
  task: '#14b8a6',
  entity: '#f472b6',
  gra_instruction: '#f97316',
  standard: '#06b6d4',
  chatapi: '#22c55e',
}

const NODE_LABELS: Record<SchemaNodeType, string> = {
  law: '📘 CT_LAW',
  section: '📄 S_SECTION',
  core_component: '🧩 S_CORE_COMPONENT',
  business_rule: '📏 S_BUSINESS_RULE',
  process: '🔄 S_PROCESS',
  goal: '🎯 S_GOAL',
  task: '✅ S_TASK',
  entity: '👤 S_ENT_*',
  gra_instruction: '📋 GRA_INSTRUCTION',
  standard: '🛡️ STANDARD',
  chatapi: '💬 CHAT_API',
}

// ────────────────────────────────────────────
// Schema data — the meta-model / ontology
// ────────────────────────────────────────────
function buildSchemaData(): SchemaData {
  const nodes: SchemaNode[] = [
    { id: 'ct_law', label: 'CT_LAW', type: 'law', description: 'Gesetzestyp-Knoten: Repräsentiert ein Gesetz (SGB VI, SGB X, etc.)', count: '5–9 Gesetze' },
    { id: 's_section', label: 'S_SECTION', type: 'section', description: 'Paragraphen-Knoten: Einzelne Rechtsvorschrift (§43, §56, etc.)', count: '~1.000 Paragraphen' },
    { id: 's_core_comp', label: 'S_CORE_COMPONENT', type: 'core_component', description: 'Kernkomponente: Fachliche Einheit innerhalb eines Paragraphen', count: '~2.500 Komponenten' },
    { id: 's_biz_rule', label: 'S_BUSINESS_RULE', type: 'business_rule', description: 'Geschäftsregel: Prüfbare Bedingung abgeleitet aus Kernkomponenten', count: '~800 Regeln' },
    { id: 's_process', label: 'S_PROCESS', type: 'process', description: 'Prozess: DRV-Geschäftsprozess (Rentenantrag, Reha, Widerspruch)', count: '~200 Prozesse' },
    { id: 's_goal', label: 'S_GOAL', type: 'goal', description: 'Ziel: Fachliches Ziel eines Prozesses', count: '~150 Ziele' },
    { id: 's_task', label: 'S_TASK', type: 'task', description: 'Aufgabe: Einzelschritt in einem Prozess', count: '~500 Aufgaben' },
    { id: 's_ent_person', label: 'S_ENT_PERSON', type: 'entity', description: 'Entität Person: Versicherter, Hinterbliebener, Sachbearbeiter', count: 'Subtyp' },
    { id: 's_ent_biz_obj', label: 'S_ENT_BUSINESS_OBJ', type: 'entity', description: 'Entität Geschäftsobjekt: Rentenanspruch, Beitragskonto, Bescheid', count: 'Subtyp' },
    { id: 's_ent_deadline', label: 'S_ENT_DEADLINE', type: 'entity', description: 'Entität Frist: Widerspruchsfrist, Antragsfrist, Verjährung', count: 'Subtyp' },
    { id: 's_ent_money', label: 'S_ENT_MONEY_AMOUNT', type: 'entity', description: 'Entität Geldbetrag: Rentenhöhe, Beitragsbemessungsgrenze, Hinzuverdienstgrenze', count: 'Subtyp' },
    { id: 'gra_instr', label: 'GRA_INSTRUCTION', type: 'gra_instruction', description: 'GRA-Anweisung: Gemeinsame Rechtliche Anweisung der DRV-Träger', count: '~300 Anweisungen' },
    { id: 'standard', label: 'STANDARD', type: 'standard', description: 'Standard: ISO, BSI, DSGVO, NIS2 — Compliance-Rahmenwerk', count: '~15 Standards' },
    { id: 'chatapi', label: 'CHAT_API', type: 'chatapi', description: 'Chat-API: OpenAI, Anthropic, GraphRAG Chat-Schnittstelle', count: '3 APIs' },
  ]

  const links: SchemaLink[] = [
    // Main hierarchy
    { source: 'ct_law', target: 's_section', type: 'SR_CONTAINS', description: 'enthält ~1.000 Paragraphen' },
    { source: 's_section', target: 's_core_comp', type: 'SR_CONTAINS', description: 'enthält ~2.500 Kernkomponenten' },
    { source: 's_core_comp', target: 's_biz_rule', type: 'SR_DEFINES', description: 'definiert ~800 Geschäftsregeln' },
    { source: 's_biz_rule', target: 's_process', type: 'SR_REALIZED_BY', description: 'realisiert durch ~200 Prozesse' },
    { source: 's_process', target: 's_goal', type: 'SR_SUPPORTS', description: 'unterstützt Ziele' },
    { source: 's_process', target: 's_task', type: 'SR_COMPOSED_OF', description: 'besteht aus Aufgaben' },

    // Entity associations
    { source: 's_core_comp', target: 's_ent_person', type: 'SR_ASSOCIATES', description: 'assoziiert' },
    { source: 's_core_comp', target: 's_ent_biz_obj', type: 'SR_ASSOCIATES', description: 'assoziiert' },
    { source: 's_core_comp', target: 's_ent_deadline', type: 'SR_ASSOCIATES', description: 'assoziiert' },
    { source: 's_core_comp', target: 's_ent_money', type: 'SR_ASSOCIATES', description: 'assoziiert' },

    // Cross-references
    { source: 'gra_instr', target: 's_section', type: 'SR_INSTRUCTS', description: 'konkretisiert Paragraphen' },
    { source: 'standard', target: 's_process', type: 'SR_APPLIES_TO', description: 'gilt für Prozesse' },
    { source: 'chatapi', target: 'chatapi', type: 'SR_COMPATIBLE', description: 'gegenseitig kompatibel' },

    // Additional cross-links
    { source: 's_section', target: 's_section', type: 'SR_REFERENCES', description: 'Querverweise zwischen §§' },
    { source: 's_biz_rule', target: 's_biz_rule', type: 'SR_DEPENDS_ON', description: 'Regel-Abhängigkeiten' },
    { source: 'gra_instr', target: 's_biz_rule', type: 'SR_DEFINES', description: 'präzisiert Regelauslegung' },
    { source: 'standard', target: 's_ent_person', type: 'SR_APPLIES_TO', description: 'DSGVO → Personendaten' },
  ]

  return { nodes, links }
}

// ────────────────────────────────────────────
// Component
// ────────────────────────────────────────────
export function DataModelGraph3D() {
  const graphRef = useRef<ForceGraphMethods | undefined>(undefined)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const [selectedNode, setSelectedNode] = useState<SchemaNode | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const graphData = useMemo(() => buildSchemaData(), [])

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setDimensions({ width: rect.width, height: rect.height })
      }
    }
    updateSize()
    const obs = new ResizeObserver(updateSize)
    if (containerRef.current) obs.observe(containerRef.current)
    return () => obs.disconnect()
  }, [isFullscreen])

  useEffect(() => {
    if (graphRef.current) {
      const fg = graphRef.current
      fg.d3Force('charge')?.strength(-200)
      fg.d3Force('link')?.distance((link: SchemaLink) => {
        if (link.type === 'SR_CONTAINS') return 80
        if (link.type === 'SR_DEFINES' || link.type === 'SR_REALIZED_BY') return 70
        if (link.type === 'SR_ASSOCIATES') return 60
        return 90
      })
    }
  }, [graphData])

  const handleNodeClick = useCallback((node: SchemaNode) => {
    setSelectedNode(node)
    if (graphRef.current) {
      const distance = 180
      const distRatio = 1 + distance / Math.hypot(node.x || 0, node.y || 0, node.z || 0)
      graphRef.current.cameraPosition(
        { x: (node.x || 0) * distRatio, y: (node.y || 0) * distRatio, z: (node.z || 0) * distRatio },
        { x: node.x || 0, y: node.y || 0, z: node.z || 0 },
        1200
      )
    }
  }, [])

  const resetCamera = useCallback(() => {
    if (graphRef.current) {
      graphRef.current.cameraPosition({ x: 0, y: 0, z: 500 }, { x: 0, y: 0, z: 0 }, 1500)
    }
    setSelectedNode(null)
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true)
      }).catch(() => {
        setIsFullscreen(true)
      })
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false)
      }).catch(() => {
        setIsFullscreen(false)
      })
    }
  }, [])

  useEffect(() => {
    const handler = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false)
      }
    }
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  const nodeThreeObject = useCallback((node: SchemaNode) => {
    const group = new THREE.Group()
    const color = NODE_COLORS[node.type] || '#999'
    // Schema nodes are larger to show hierarchy
    const size = node.type === 'law' ? 14 : ['section', 'core_component'].includes(node.type) ? 11 : node.type === 'entity' ? 8 : 10

    const geometry = new THREE.SphereGeometry(size, 24, 24)
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.9,
      shininess: 60,
    })
    const sphere = new THREE.Mesh(geometry, material)
    group.add(sphere)

    // Glow for main hierarchy nodes
    if (['law', 'section', 'core_component'].includes(node.type)) {
      const glowGeo = new THREE.SphereGeometry(size * 1.4, 16, 16)
      const glowMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity: 0.15,
      })
      group.add(new THREE.Mesh(glowGeo, glowMat))
    }

    // Label
    const label = new SpriteText(node.label) as any
    label.color = '#e2e8f0'
    label.textHeight = node.type === 'law' ? 6 : ['section', 'core_component'].includes(node.type) ? 5 : 4
    label.position.y = size + 8
    label.backgroundColor = 'rgba(15, 23, 42, 0.85)'
    label.padding = 3
    label.borderRadius = 3
    group.add(label)

    // Count badge
    if (node.count) {
      const badge = new SpriteText(node.count) as any
      badge.color = '#94a3b8'
      badge.textHeight = 3
      badge.position.y = size + 15
      badge.backgroundColor = 'rgba(15, 23, 42, 0.7)'
      badge.padding = 2
      badge.borderRadius = 2
      group.add(badge)
    }

    return group
  }, [])

  const linkColor = useCallback((link: SchemaLink) => {
    switch (link.type) {
      case 'SR_CONTAINS': return 'rgba(59, 130, 246, 0.6)'
      case 'SR_DEFINES': return 'rgba(245, 158, 11, 0.6)'
      case 'SR_REALIZED_BY': return 'rgba(16, 185, 129, 0.6)'
      case 'SR_SUPPORTS': return 'rgba(236, 72, 153, 0.5)'
      case 'SR_COMPOSED_OF': return 'rgba(20, 184, 166, 0.5)'
      case 'SR_ASSOCIATES': return 'rgba(244, 114, 182, 0.4)'
      case 'SR_INSTRUCTS': return 'rgba(249, 115, 22, 0.5)'
      case 'SR_APPLIES_TO': return 'rgba(6, 182, 212, 0.5)'
      case 'SR_COMPATIBLE': return 'rgba(34, 197, 94, 0.5)'
      case 'SR_REFERENCES': return 'rgba(139, 92, 246, 0.4)'
      case 'SR_DEPENDS_ON': return 'rgba(239, 68, 68, 0.5)'
      default: return 'rgba(148, 163, 184, 0.3)'
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative rounded-xl overflow-hidden border-2 border-border bg-[#0f172a] ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full h-full'
      }`}
    >
      {/* Controls */}
      <div className="absolute top-3 right-3 z-20 flex gap-2">
        <button
          onClick={resetCamera}
          className="p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white transition-colors backdrop-blur-sm"
          title="Kamera zurücksetzen"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white transition-colors backdrop-blur-sm"
          title={isFullscreen ? 'Vollbild beenden' : 'Vollbild'}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-20 bg-slate-900/90 backdrop-blur-sm rounded-lg p-3 border border-slate-700">
        <div className="text-xs text-slate-400 font-semibold mb-2">Datenmodell-Typen</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {(Object.keys(NODE_LABELS) as SchemaNodeType[]).map(type => (
            <div key={type} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: NODE_COLORS[type] }}
              />
              <span className="text-xs text-slate-300 truncate">{NODE_LABELS[type]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="absolute top-3 left-3 z-20 bg-slate-900/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-slate-700">
        <div className="text-xs text-slate-400">
          <span className="font-semibold text-slate-200">{graphData.nodes.length}</span> Knotentypen &middot;{' '}
          <span className="font-semibold text-slate-200">{graphData.links.length}</span> Beziehungstypen
        </div>
      </div>

      {/* Graph */}
      <ForceGraph3D
        ref={graphRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="#0f172a"
        nodeThreeObject={nodeThreeObject}
        nodeThreeObjectExtend={false}
        linkColor={linkColor}
        linkWidth={2}
        linkOpacity={0.7}
        linkDirectionalArrowLength={6}
        linkDirectionalArrowRelPos={0.85}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={2}
        linkDirectionalParticleSpeed={0.003}
        linkCurvature={0.15}
        onNodeClick={handleNodeClick as (node: object) => void}
        enableNodeDrag={true}
        enableNavigationControls={true}
        showNavInfo={false}
      />

      {/* Detail Panel */}
      {selectedNode && (
        <div className="absolute top-14 right-3 z-20 w-72 bg-slate-900/95 backdrop-blur-sm rounded-lg border border-slate-700 shadow-xl overflow-hidden">
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div
                  className="text-xs font-semibold px-2 py-0.5 rounded-full inline-block mb-2"
                  style={{ backgroundColor: `${NODE_COLORS[selectedNode.type]}30`, color: NODE_COLORS[selectedNode.type] }}
                >
                  {NODE_LABELS[selectedNode.type]}
                </div>
                <h3 className="font-bold text-slate-100 text-lg leading-tight">{selectedNode.label}</h3>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-3">{selectedNode.description}</p>
            {selectedNode.count && (
              <div className="bg-slate-800/60 rounded-lg p-2 text-center">
                <span className="text-xs text-slate-400">Erwartete Anzahl: </span>
                <span className="text-sm font-semibold text-slate-200">{selectedNode.count}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
