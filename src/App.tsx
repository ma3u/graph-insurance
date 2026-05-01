import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { 
  ArrowRight, 
  Shield, 
  Database, 
  Network, 
  Clock, 
  ChartBar,
  AlertTriangle,
  Users,
  FileText,
  BrainCircuit,
  CheckCircle2,
  TrendingUp,
  Zap,
  Eye,
  ArrowDown,
  Scale,
  Globe,
  BookOpen,
  ShieldCheck,
  Landmark,
  ScrollText,
  Workflow,
  MessageSquare,
  Search,
  GitCompare,
  XCircle,
  CircleCheck,
  Bot,
  Layers,
  Link2,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react"
import { useState, useEffect, useRef, useCallback } from "react"
import { DRVKnowledgeGraph3D } from "@/components/DRVKnowledgeGraph3D"
import { DataModelGraph3D } from "@/components/DataModelGraph3D"

function App() {
  const [selectedLayer, setSelectedLayer] = useState<number | null>(null)
  const [activeScenario, setActiveScenario] = useState<number>(0)
  const [showIntroGuide, setShowIntroGuide] = useState<boolean>(true)
  const [isPlayingNarration, setIsPlayingNarration] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const architectureRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0.3])

  useEffect(() => {
    const timer = setTimeout(() => setShowIntroGuide(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  // ── Audio narration ──
  useEffect(() => {
    const audio = new Audio(`${import.meta.env.BASE_URL}audio/drv_fall_mueller.mp3`)
    audio.volume = 0.8
    audio.addEventListener('ended', () => setIsPlayingNarration(false))
    audioRef.current = audio
    return () => {
      audio.pause()
      audio.removeEventListener('ended', () => setIsPlayingNarration(false))
    }
  }, [])

  const toggleNarration = useCallback(() => {
    if (!audioRef.current) return
    if (isPlayingNarration) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlayingNarration(!isPlayingNarration)
  }, [isPlayingNarration])

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return
    audioRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }, [isMuted])

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  // ────────────────────────────────────────────
  // Data: Personas & Pain Points (Service Design)
  // Person-zentrierte Sicht auf die Herausforderungen
  // der gesetzlichen Rentenversicherung. Quellen siehe `painPointSources`.
  // ────────────────────────────────────────────
  const personas = [
    {
      icon: Workflow,
      role: "Sachbearbeiter:in Rente",
      context: "Tägliche Antragsprüfung, Wartezeitberechnung, Bescheiderstellung",
      stat: "870+",
      statLabel: "Paragraphen in 5 Sozialgesetzbüchern",
      color: "oklch(0.45 0.15 245)",
      painPoints: [
        { text: "Querverweise zwischen SGB I, IV, VI, IX, X manuell auflösen.", refs: [1] },
        { text: "GRA-Anweisungen verteilen sich auf interne Portale ohne durchgängige Suche.", refs: [1, 2] },
        { text: "Übergangsregelungen (z. B. §235 SGB VI) erfordern jahrelange Erfahrung.", refs: [2] },
      ],
    },
    {
      icon: Users,
      role: "Versicherte:r und Antragsteller:in",
      context: "Renteneintritt vorbereiten, Auskunft erhalten, Bescheid verstehen",
      stat: "3 bis 6",
      statLabel: "Monate Bearbeitungszeit (Erstantrag)",
      color: "oklch(0.55 0.20 55)",
      painPoints: [
        { text: "Lange Verfahren bei Erwerbsminderungsrenten und Widersprüchen.", refs: [3, 4] },
        { text: "Bescheide und Rentenformeln gelten als schwer verständlich.", refs: [3] },
        { text: "Hohe Quote stattgegebener Widersprüche bei EM-Renten.", refs: [4, 5] },
      ],
    },
    {
      icon: BookOpen,
      role: "Trainee und neue Mitarbeitende",
      context: "Einarbeitung in das Sozialrecht der Rentenversicherung",
      stat: "12 bis 24",
      statLabel: "Monate Einarbeitungszeit",
      color: "oklch(0.50 0.18 25)",
      painPoints: [
        { text: "Demografische Pensionierungswelle bei erfahrenen Sachbearbeiter:innen.", refs: [2, 6] },
        { text: "Implizites Wissen zu Sonderfällen lässt sich kaum dokumentieren.", refs: [6] },
        { text: "Fachkräftegewinnung im öffentlichen Dienst bleibt angespannt.", refs: [6] },
      ],
    },
    {
      icon: MessageSquare,
      role: "Auskunft im Servicecenter",
      context: "Telefonische und schriftliche Auskunft an Versicherte",
      stat: "Millionen",
      statLabel: "Auskünfte pro Jahr",
      color: "oklch(0.45 0.12 200)",
      painPoints: [
        { text: "Komplexe Rückfragen erfordern parallele Recherche in mehreren Systemen.", refs: [1, 2] },
        { text: "Aktualität nach Gesetzesänderungen und Rentenanpassungen sicherstellen.", refs: [2] },
        { text: "Hoher Anrufdruck steht im Konflikt mit fundierter Auskunftsqualität.", refs: [1] },
      ],
    },
  ]

  // Quellen / öffentliche Belege für die Pain Points oben.
  // Verlinkt sind Übersichtsseiten der jeweiligen Institutionen,
  // damit die Belege langfristig erreichbar bleiben.
  const painPointSources = [
    { id: 1, label: "DRV Bund: Rentenversicherung in Zahlen (jährlich)", url: "https://www.deutsche-rentenversicherung.de/DRV/DE/Experten/Zahlen-und-Fakten/Statistiken-und-Berichte/statistiken_und_berichte_node.html" },
    { id: 2, label: "BMAS: Rentenversicherungsbericht (jährlich)", url: "https://www.bmas.de/DE/Soziales/Rente-und-Altersvorsorge/rente-und-altersvorsorge.html" },
    { id: 3, label: "Sozialverband VdK: Berichte und Studien zur Rente", url: "https://www.vdk.de/deutschland/pages/themen/rente" },
    { id: 4, label: "Bundesrechnungshof: Bemerkungen zu Sozialversicherungen", url: "https://www.bundesrechnungshof.de/de/veroeffentlichungen/produkte/bemerkungen-jahresberichte" },
    { id: 5, label: "Bundessozialgericht: Statistik zu Rentenstreitsachen", url: "https://www.bsg.bund.de/DE/Service/Statistik/statistik_node.html" },
    { id: 6, label: "Sozialbeirat: Gutachten zum Rentenversicherungsbericht", url: "https://www.bmas.de/DE/Soziales/Rente-und-Altersvorsorge/Sozialbeirat/sozialbeirat-art.html" },
  ]

  // ────────────────────────────────────────────
  // Data: Persona-spezifische Lösungen
  // Jede Lösung leitet sich aus den Pain Points oben ab und verweist
  // auf konkrete Funktionen der Multi-Layered Ontologie und GraphRAG-Pipeline.
  // ────────────────────────────────────────────
  const personaSolutions: {
    pain: string
    solution: string
    tags: string[]
  }[][] = [
    // Sachbearbeiter:in Rente
    [
      {
        pain: "Querverweise zwischen mehreren SGBs manuell auflösen.",
        solution: "Multi-Hop-Traversierung im Knowledge Graph beantwortet gesetzesübergreifende Fragen in einem Schritt und zitiert jeden zugrundeliegenden Paragraphen.",
        tags: ["Normative Schicht", "GraphRAG"],
      },
      {
        pain: "GRA-Anweisungen verteilen sich auf mehrere Portale.",
        solution: "GRA-Anweisungen sind im Graph als typisierte Knoten mit Relation zu jedem Paragraphen modelliert und in Antworten direkt verlinkt.",
        tags: ["GRA-Verknüpfung", "Quellennachweis"],
      },
      {
        pain: "Übergangsregelungen erfordern jahrelange Erfahrung.",
        solution: "Die zeitliche Dimension speichert Gültigkeit pro Stichtag (z. B. §235 SGB VI), das System wählt automatisch die korrekte Fassung.",
        tags: ["Zeitliche Dimension"],
      },
    ],
    // Versicherte:r und Antragsteller:in
    [
      {
        pain: "Lange Verfahren bei EM-Renten und Widersprüchen.",
        solution: "Prozedurale Schicht modelliert Antrags- und Widerspruchsworkflow, prüft Vollständigkeit der Unterlagen und macht Fristen sichtbar.",
        tags: ["Prozedurale Schicht", "Fristenmonitoring"],
      },
      {
        pain: "Bescheide und Rentenformeln sind schwer verständlich.",
        solution: "Erklär-Modus generiert versichertenfreundliche Antworten in einfacher Sprache, jede Aussage bleibt durch Paragraphen-Zitate belegbar.",
        tags: ["Chat API", "Citations"],
      },
      {
        pain: "Hohe Quote stattgegebener Widersprüche.",
        solution: "Vier-Augen-Prüfung gegen den Graph deckt fehlende Querverweise vor Bescheiderlass auf und reduziert vermeidbare Widersprüche.",
        tags: ["Compliance-Check", "Qualität"],
      },
    ],
    // Trainee und neue Mitarbeitende
    [
      {
        pain: "Demografische Pensionierungswelle bei erfahrenen Sachbearbeiter:innen.",
        solution: "Implizites Wissen wird als typisierte Knoten und Relationen kodifiziert und ist auch nach Personalwechseln dauerhaft abrufbar.",
        tags: ["Wissensbewahrung"],
      },
      {
        pain: "Implizites Wissen zu Sonderfällen lässt sich kaum dokumentieren.",
        solution: "Fallbezogener Overlay verknüpft Sonderfälle mit Norm- und Prozessknoten, neue Mitarbeitende sehen ähnliche Fälle inklusive der angewendeten Regeln.",
        tags: ["Fallbezogener Overlay"],
      },
      {
        pain: "Fachkräftegewinnung im öffentlichen Dienst bleibt angespannt.",
        solution: "Geführte Q&A mit Erklärungen und Quellen verkürzt die Einarbeitung und macht erste produktive Bearbeitungen früher möglich.",
        tags: ["Onboarding"],
      },
    ],
    // Auskunft im Servicecenter
    [
      {
        pain: "Komplexe Rückfragen erfordern parallele Recherche in mehreren Systemen.",
        solution: "OpenAI-kompatible Chat API liefert Antwort, Quellen und Folgeschritte gebündelt, integrierbar in bestehende CRM- und Portal-Frontends.",
        tags: ["Chat API", "Integration"],
      },
      {
        pain: "Aktualität nach Gesetzesänderungen sicherstellen.",
        solution: "Versionierte Norm- und GRA-Knoten plus Pipeline-Re-Ingestion garantieren, dass jede Antwort auf der aktuellen Rechtsfassung basiert.",
        tags: ["Versionierung", "Pipeline"],
      },
      {
        pain: "Hoher Anrufdruck steht im Konflikt mit fundierter Auskunftsqualität.",
        solution: "Self-Service-Chat für Standardfragen entlastet das Team, komplexe Fälle landen mit vorbereitetem Kontext bei den Mitarbeitenden.",
        tags: ["Self-Service", "Triage"],
      },
    ],
  ]

  // ────────────────────────────────────────────
  // Data: 4-Layer Ontology (DRV)
  // ────────────────────────────────────────────
  const layers = [
    {
      number: 1,
      title: "Normative Schicht",
      subtitle: "Gesetzeshierarchie",
      description: "Hierarchie der Rechtsquellen: EU-Recht → Grundgesetz → Sozialgesetzbücher → Rechtsverordnungen → GRA-Anweisungen. Das System versteht die Normenhierarchie und traversiert sie konsistent.",
      icon: Shield,
      color: "oklch(0.35 0.12 245)",
      examples: ["SGB I–XII", "GRA-Anweisungen", "EU-DSGVO", "Rechtsverordnungen"]
    },
    {
      number: 2,
      title: "Zeitliche Dimension",
      subtitle: "Validität & Übergangsregelungen",
      description: "Zeitliche Gültigkeit jeder Rechtsgrundlage: Übergangsregelungen (§235 SGB VI), stufenweise Anhebung der Altersgrenze, Rentenanpassungen zum 1. Juli. Das System kennt die korrekte Fassung zu jedem Stichtag.",
      icon: Clock,
      color: "oklch(0.45 0.15 200)",
      examples: ["Regelaltersgrenze 65→67", "Mütterrente Erweiterung", "Rentenanpassung 2025", "Beitragssätze"]
    },
    {
      number: 3,
      title: "Prozedurale Schicht",
      subtitle: "Geschäftsprozesse & Workflows",
      description: "DRV-Geschäftsprozesse als formale Abläufe: Rentenantrag, Kontenklärung, EM-Prüfung, Reha-Bewilligung. Proaktive Vorschläge für nächste Schritte und Fristüberwachung.",
      icon: ChartBar,
      color: "oklch(0.50 0.18 160)",
      examples: ["Rentenantrag", "EM-Prüfung", "Reha vor Rente", "Widerspruchsverfahren"]
    },
    {
      number: 4,
      title: "Fallbezogener Overlay",
      subtitle: "Versichertenkontext",
      description: "Konkreter Versicherungsfall: Beitragszeiten, Entgeltpunkte, Kindererziehungszeiten, medizinische Gutachten. Alle Daten im Kontext der Normenhierarchie und Geschäftsregeln.",
      icon: Database,
      color: "oklch(0.55 0.20 55)",
      examples: ["Entgeltpunkte", "Wartezeiten", "Kindererziehung", "Gutachten"]
    }
  ]

  // ────────────────────────────────────────────
  // Data: Scenarios (from DRV_DEMO_PLAN §4)
  // ────────────────────────────────────────────
  const scenarios = [
    {
      title: "Compliance-Analyse",
      description: "Schnell die bindende Geschäftsregel für einen Leistungstyp finden und gegen den Quell-Paragraphen verifizieren, zum Beispiel die Regelaltersrente (§35 SGB VI) mit allen Querverweisen.",
      benefits: [
        "Automatische Auflösung aller Querverweise: §35 → §50 (Wartezeit) → §235 (Altersgrenze) → §56 (Kindererziehung)",
        "Chatbot mit Graph-Kontext: Frage stellen und Antwort mit §-Zitaten erhalten",
        "GRA-Anweisungen direkt verlinkt: Von der Geschäftsregel zur Handlungsanweisung in einem Klick",
        "Automatische Prüfung gegen aktuelle Gesetzeslage. Kein Risiko veralteter Informationen."
      ],
      icon: FileText,
      color: "oklch(0.45 0.15 245)",
      impact: "Sachbearbeiter Recht: Recherche von Stunden auf Sekunden"
    },
    {
      title: "Prozess-Engineering",
      description: "Geschäftsregeln auf DRV-Prozesse abbilden, zum Beispiel den Rentenantragsprozess von der Antragstellung bis zum Bescheid mit allen Abhängigkeiten visualisieren.",
      benefits: [
        "Prozessgraph: Aufgaben, Sequenzfluss und Entscheidungspunkte als verknüpfte Knoten",
        "Fristen automatisch verknüpft: §17 SGB I (rechtzeitige Erbringung), §84 SGB X (Widerspruchsfrist)",
        "Chatbot: 'Welche Fristen gelten für die Bearbeitung eines Rentenantrags?' Antwort zitiert §99, §17, §26.",
        "Export als strukturierte Daten für BPMN-Modellierung (zukünftige Funktion)"
      ],
      icon: Workflow,
      color: "oklch(0.50 0.18 160)",
      impact: "Prozessoptimierung mit vollständiger Regelabdeckung"
    },
    {
      title: "Gesetzesfolgen-Analyse",
      description: "Impact-Analyse bei Gesetzesänderungen, zum Beispiel: 'Was ändert sich durch den neuen §33 für die Erwerbsminderungsrente?' Alle betroffenen Regeln und Prozesse identifizieren.",
      benefits: [
        "Semantische Ähnlichkeitssuche über alle verknüpften Geschäftsregeln",
        "Automatische Identifikation aller betroffenen Prozesse und Aufgaben",
        "Ranking der Auswirkungen nach Abhängigkeitsgrad im Graphen",
        "Chatbot-gestützte Q&A: Gezielte Fragen zur Auswirkung der Änderung"
      ],
      icon: GitCompare,
      color: "oklch(0.55 0.20 55)",
      impact: "Gesetzesänderungsfolgen in Minuten statt Wochen analysieren"
    },
    {
      title: "Onboarding & Wissenstransfer",
      description: "Neue Mitarbeitende verstehen DRV-Zuständigkeiten und Gesetzesgrundlagen, ohne 300+ Seiten Gesetzestext lesen zu müssen.",
      benefits: [
        "Chatbot erklärt komplexe Sachverhalte in einfacher Sprache mit §-Verweisen",
        "Navigierbarer Wissensgraph: Von der Übersicht ins Detail durch interaktive Exploration",
        "GRA-Anweisungen als Handlungsleitfaden direkt verknüpft mit Paragraphen",
        "Häufige Fragen mit Standardantworten und Quellennachweis. Kein Halluzinationsrisiko."
      ],
      icon: Users,
      color: "oklch(0.45 0.12 200)",
      impact: "Einarbeitungszeit von Monaten auf Wochen reduzieren"
    }
  ]

  // ────────────────────────────────────────────
  // Data: Graph RAG vs Vector RAG comparison
  // ────────────────────────────────────────────
  const ragComparisons = [
    {
      title: "Multi-Hop-Reasoning: Rentenanspruch",
      question: "Hat Frau Müller (62 Jahre, 38 Beitragsjahre, 3 Kinder geb. 1993, 1996, 1999) Anspruch auf Regelaltersrente?",
      graphAnswer: {
        result: "Korrekte Antwort mit vollständiger Begründung",
        explanation: "Graph RAG traversiert: §35 SGB VI → §50 (Wartezeit ✓: 38 Jahre > 5 Jahre) → §235 (Regelaltersgrenze für Jg. 1964: 67 Jahre, mit 62 noch nicht erreicht) → §56 (Kindererziehungszeiten: 3×36 = 108 Monate zusätzlich). Ergebnis: Noch kein Anspruch, da Altersgrenze nicht erreicht. Wartezeit für Altersrente für besonders langjährig Versicherte (45 Jahre) wäre mit KEZ potenziell erfüllt."
      },
      vectorAnswer: {
        result: "Unvollständige oder falsche Antwort",
        explanation: "Vector RAG findet §35 (Regelaltersrente) per Ähnlichkeitssuche, aber verknüpft nicht automatisch §50 (Wartezeit), §235 (Übergangsregelungen für ihr Geburtsjahr) und §56 (Kindererziehungszeiten). Ohne Graph-Traversierung fehlt die systematische Prüfung aller Voraussetzungen."
      }
    },
    {
      title: "Gesetzesübergreifende Abhängigkeit",
      question: "Welche Fristen gelten bei einem abgelehnten Reha-Antrag?",
      graphAnswer: {
        result: "Vollständige Fristenkette über 3 Gesetze",
        explanation: "Graph RAG traversiert: SGB IX §49 (Reha-Leistung) → SGB VI §9 (DRV als Reha-Träger) → SGB X §31 (Bescheid als Verwaltungsakt) → SGB X §84 (Widerspruchsfrist: 1 Monat) → SGG §87 (Klagefrist: 1 Monat nach Widerspruchsbescheid). Liefert die komplette Rechtsmittelkette."
      },
      vectorAnswer: {
        result: "Nur Teilantwort, fehlende Verknüpfung",
        explanation: "Vector RAG findet Texte zu Rehabilitation, kennt aber nicht den systematischen Pfad über SGB X (Verwaltungsverfahren) zum SGG (Sozialgerichtsgesetz). Widerspruchsfristen stehen in einem anderen Gesetz und werden per Vektorähnlichkeit nicht zuverlässig gefunden."
      }
    },
    {
      title: "Ausnahmeregel: Vorzeitige Wartezeit",
      question: "Welche Wartezeit gilt für Erwerbsminderungsrente bei einem Arbeitsunfall?",
      graphAnswer: {
        result: "Erkennt die Ausnahme sofort",
        explanation: "Graph RAG traversiert: §43 SGB VI (EM-Rente, Normalfall: 5 Jahre Wartezeit + 3/5 Pflichtbeiträge) → erkennt verknüpfte Ausnahmeregel §53 SGB VI (vorzeitige Wartezeiterfüllung bei Arbeitsunfall) → Wartezeit gilt als sofort erfüllt. Die Graph-Kante SR_REFERENCES verbindet §43 direkt mit §53."
      },
      vectorAnswer: {
        result: "Gibt nur die Standardregel zurück",
        explanation: "Vector RAG ruft §43 per Vektorsuche ab (hohe Ähnlichkeit zu 'Erwerbsminderungsrente') und antwortet mit der 5-Jahres-Wartezeit. §53 (vorzeitige Wartezeit bei Arbeitsunfall) hat geringere Vektorähnlichkeit zum Query und wird nicht in den Top-K-Ergebnissen gefunden. Die Ausnahme wird übersehen."
      }
    },
    {
      title: "Temporale Validität: Regelaltersgrenze",
      question: "Gilt für einen 1960 Geborenen noch die Altersgrenze 65?",
      graphAnswer: {
        result: "Exakte Antwort mit Übergangsregelung",
        explanation: "Graph RAG traversiert: §35 → §235 SGB VI (Übergangsregelungen) mit temporalen Metadaten → Jahrgang 1960 = 66 Jahre + 4 Monate. Der Graph speichert die stufenweise Anhebung als strukturierte Daten pro Jahrgang und kann die exakte Altersgrenze berechnen."
      },
      vectorAnswer: {
        result: "Gibt generische 67 Jahre an",
        explanation: "Vector RAG findet allgemeine Texte zur Regelaltersgrenze (67 Jahre), hat aber keine strukturierten temporalen Daten. Die Übergangsregelungen in §235 mit der differenzierten Tabelle pro Geburtsjahrgang werden nicht als zusammenhängende Struktur erfasst. Ergebnis: Falsche Altersgrenze."
      }
    }
  ]

  // ────────────────────────────────────────────
  // Data: Chat API Standards
  // ────────────────────────────────────────────
  const chatApiStandards = [
    {
      name: "OpenAI Chat Completions",
      endpoint: "POST /v1/chat/completions",
      description: "De-facto-Industriestandard für Chat-KI. messages[]-Array mit Rollen (system, user, assistant). Streaming via SSE.",
      adoptedBy: "OpenAI, Azure OpenAI, LiteLLM, vLLM, Ollama, Groq, Together AI",
      color: "#10b981"
    },
    {
      name: "Anthropic Messages API",
      endpoint: "POST /v1/messages",
      description: "System-Prompt als separater Top-Level-Parameter. Content-Blocks für multimodales Messaging. Streaming via delta-Events.",
      adoptedBy: "Anthropic Claude, AWS Bedrock (Claude)",
      color: "#8b5cf6"
    },
    {
      name: "LangChain / LangServe",
      endpoint: "POST /invoke, /stream, /batch",
      description: "Framework-Standard für RAG-Pipelines. Retriever → LLM → Output Parser. Deployment als FastAPI-Service.",
      adoptedBy: "LangChain, LangGraph, LangSmith",
      color: "#f59e0b"
    },
    {
      name: "OpenAPI 3.1 / Swagger",
      endpoint: "GET /openapi.json",
      description: "API-Beschreibungsstandard. Automatische Swagger-UI und ReDoc-Dokumentation. Client-SDK-Generierung.",
      adoptedBy: "Universeller Standard: FastAPI, Spring, Express, etc.",
      color: "#3b82f6"
    }
  ]

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatePresence>
        {showIntroGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <Card className="shadow-2xl border-2 border-accent">
              <CardContent className="p-6 flex items-center gap-4">
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowDown className="h-6 w-6 text-accent" />
                </motion.div>
                <div>
                  <p className="font-semibold text-foreground">Scrollen Sie, um mehr zu erfahren</p>
                  <p className="text-sm text-muted-foreground">Interaktive Elemente erwarten Sie</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HEADER ── */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold tracking-tight">GraphRAG Demo</span>
            <Separator orientation="vertical" className="h-8 hidden md:block" />
            <span className="text-sm font-medium text-muted-foreground hidden md:block">DRV Use Case</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => scrollToSection('challenges')} className="hidden md:flex">
              Herausforderungen
            </Button>
            <Button variant="ghost" size="sm" onClick={() => scrollToSection('solution')} className="hidden md:flex">
              Lösung
            </Button>
            <Button variant="ghost" size="sm" onClick={() => scrollToSection('architecture')} className="hidden md:flex">
              Architektur
            </Button>
            <Button variant="ghost" size="sm" onClick={() => scrollToSection('fall-mueller')} className="hidden md:flex">
              Fall Müller
            </Button>
            <Button variant="ghost" size="sm" onClick={() => scrollToSection('graph-rag')} className="hidden md:flex">
              Graph vs Vector RAG
            </Button>
            <Button variant="ghost" size="sm" onClick={() => scrollToSection('chat-api')} className="hidden md:flex">
              Chat API
            </Button>
            <Button variant="ghost" size="sm" onClick={() => scrollToSection('scenarios')} className="hidden md:flex">
              Szenarien
            </Button>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <motion.section style={{ opacity: heroOpacity }} className="hero-pattern py-32 md:py-40 relative overflow-hidden">
        <AnimatedBackground />
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
              <Badge className="mb-6 bg-accent text-accent-foreground text-base px-4 py-2">
                <Zap className="h-4 w-4 mr-2" />
                Compliance Knowledge Graph + GraphRAG
              </Badge>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-foreground leading-tight">
              Digitaler Wissens&shy;assistent für die Renten&shy;versicherung
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed">
              Wie ein Knowledge Graph mit GraphRAG die Komplexität des Sozialrechts beherrschbar macht. Und warum Vector RAG bei gesetzesübergreifenden Fragen versagt.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-10 h-14 shadow-lg hover:shadow-xl transition-shadow"
                onClick={() => scrollToSection('architecture')}
              >
                <BrainCircuit className="mr-2 h-5 w-5" />
                Demo entdecken
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-10 h-14 border-2"
                onClick={() => scrollToSection('challenges')}
              >
                Herausforderungen verstehen
                <ArrowDown className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ── SECTION: Herausforderungen (Service Design / Personas) ── */}
      <section id="challenges" className="py-24 bg-muted/30 relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 text-base px-4 py-2">
              <Eye className="h-4 w-4 mr-2" />
              Schritt 1: Das Problem verstehen
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Personenzentrierte Sicht auf die Herausforderungen
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Rund 56.000 DRV-Beschäftigte begleiten Millionen Versicherte durch ein
              Sozialrecht mit über 870 Paragraphen in fünf Sozialgesetzbüchern.
              Die Pain Points werden hier aus Sicht zentraler Personas beschrieben,
              belegt durch öffentliche Quellen.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {personas.map((persona, index) => {
              const Icon = persona.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border-2 hover:border-primary/50">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <motion.div
                          className="p-4 rounded-xl"
                          style={{ backgroundColor: `${persona.color}15` }}
                          whileHover={{ scale: 1.05, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Icon className="h-8 w-8" style={{ color: persona.color }} />
                        </motion.div>
                        <div className="flex-1">
                          <Badge variant="outline" className="mb-2 text-xs uppercase tracking-wide">
                            Persona
                          </Badge>
                          <CardTitle className="text-2xl mb-2 group-hover:text-primary transition-colors">
                            {persona.role}
                          </CardTitle>
                          <CardDescription className="text-sm leading-relaxed mb-3">
                            {persona.context}
                          </CardDescription>
                          <div className="flex items-baseline gap-2">
                            <div className="text-2xl font-bold" style={{ color: persona.color }}>
                              {persona.stat}
                            </div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wide">
                              {persona.statLabel}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3 font-semibold">
                        Pain Points
                      </div>
                      <ul className="space-y-2">
                        {persona.painPoints.map((pp, i) => (
                          <li key={i} className="flex gap-3 text-sm leading-relaxed">
                            <AlertTriangle
                              className="h-4 w-4 mt-0.5 flex-shrink-0"
                              style={{ color: persona.color }}
                            />
                            <span className="text-muted-foreground">
                              {pp.text}
                              {pp.refs.length > 0 && (
                                <sup className="ml-1 text-foreground font-semibold">
                                  {pp.refs.map((r, ri) => (
                                    <span key={r}>
                                      <a
                                        href={`#quelle-${r}`}
                                        className="hover:text-primary transition-colors"
                                      >
                                        [{r}]
                                      </a>
                                      {ri < pp.refs.length - 1 ? "," : ""}
                                    </span>
                                  ))}
                                </sup>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Quellen / Sources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="mt-12"
          >
            <Card className="bg-card/60 border-dashed">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Quellen und weiterführende Belege
                </CardTitle>
                <CardDescription className="text-xs">
                  Öffentliche Veröffentlichungen, die die oben genannten Pain Points dokumentieren.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="text-sm space-y-2 text-muted-foreground">
                  {painPointSources.map((src) => (
                    <li
                      key={src.id}
                      id={`quelle-${src.id}`}
                      className="flex gap-3 leading-relaxed"
                    >
                      <span className="font-semibold text-foreground min-w-[1.75rem]">
                        [{src.id}]
                      </span>
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors underline underline-offset-4 decoration-dotted"
                      >
                        {src.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION: Lösung (Pain Point → GraphRAG-Funktion) ── */}
      <section id="solution" className="py-24 bg-background relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 text-base px-4 py-2 bg-accent/15 text-accent border-accent/30">
              <Zap className="h-4 w-4 mr-2" />
              Schritt 2: Die Lösung ableiten
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Vom Pain Point zur GraphRAG-Funktion
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Jeder Pain Point der Personas wird auf eine konkrete Funktion der
              Multi-Layered Ontologie und der GraphRAG-Pipeline abgebildet.
              Die folgende Tabelle macht die Ableitung explizit.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {personas.map((persona, idx) => {
              const Icon = persona.icon
              const solutions = personaSolutions[idx]
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Card className="h-full border-2 hover:border-primary/40 transition-all hover:shadow-xl">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className="p-3 rounded-xl"
                          style={{ backgroundColor: `${persona.color}15` }}
                        >
                          <Icon className="h-6 w-6" style={{ color: persona.color }} />
                        </div>
                        <div>
                          <Badge variant="outline" className="text-xs uppercase tracking-wide mb-1">
                            Persona
                          </Badge>
                          <CardTitle className="text-xl">{persona.role}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {solutions.map((sol, i) => (
                          <div
                            key={i}
                            className="grid grid-cols-[auto_1fr] gap-3 text-sm"
                          >
                            <div className="flex items-start gap-2 pt-0.5">
                              <AlertTriangle
                                className="h-4 w-4 flex-shrink-0"
                                style={{ color: persona.color }}
                              />
                            </div>
                            <div>
                              <div className="text-muted-foreground leading-relaxed mb-1">
                                <span className="font-semibold text-foreground">
                                  Pain Point:{" "}
                                </span>
                                {sol.pain}
                              </div>
                              <div className="flex items-start gap-2 leading-relaxed">
                                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-600" />
                                <div>
                                  <span className="font-semibold text-foreground">
                                    Lösung:{" "}
                                  </span>
                                  <span className="text-muted-foreground">{sol.solution}</span>
                                </div>
                              </div>
                              <div className="mt-1 ml-6 flex flex-wrap gap-1">
                                {sol.tags.map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="text-[10px] uppercase tracking-wide"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Bridge to next section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="mt-12 text-center"
          >
            <p className="text-muted-foreground italic">
              Wie diese Funktionen technisch umgesetzt sind, zeigt die folgende
              4-Schichten-Ontologie und der konkrete Fall Müller.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION: Warum reine LLMs nicht genügen ── */}
      <section className="py-24 bg-card relative">
        <div className="absolute inset-0 bg-destructive/5"></div>
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-destructive/10 text-destructive border-destructive/20 text-base px-4 py-2">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Schritt 3: Warum reine LLMs nicht genügen
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ChatGPT & Co. für das Sozialrecht ungeeignet
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Large Language Models sind probabilistisch, Rentenberechnung ist deterministisch. 
              Halluzinierte Paragraphen, fehlende Querverweise und temporale Blindheit machen reine LLMs für die DRV unbrauchbar.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: "Halluzinierte Paragraphen",
                description: "Ein LLM erfindet plausibel klingende §-Angaben: '§37a SGB VI' existiert nicht, aber ein LLM kann diesen selbstbewusst zitieren. Falsche Rechtsauskunft kann zu fehlerhaften Bescheiden führen.",
                icon: AlertTriangle
              },
              {
                title: "Temporale Blindheit",
                description: "Kein Verständnis für Übergangsregelungen: Welche Altersgrenze gilt für Jahrgang 1960? LLMs kennen nicht die stufenweise Anhebung und antworten generisch mit '67 Jahre', was falsch ist.",
                icon: Clock
              },
              {
                title: "Fehlende Querverweise",
                description: "§43 EM-Rente verweist auf §53 (Ausnahme bei Arbeitsunfall). LLMs erkennen diese Spezialregel nicht, weil sie Beziehungen zwischen Normen nicht systematisch traversieren können.",
                icon: Database
              }
            ].map((problem, index) => {
              const Icon = problem.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="h-full bg-destructive/5 border-2 border-destructive/20 hover:border-destructive/40 transition-colors">
                    <CardHeader>
                      <div className="mb-4">
                        <Icon className="h-10 w-10 text-destructive" />
                      </div>
                      <CardTitle className="text-xl leading-tight">{problem.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm leading-relaxed">{problem.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION: Architektur (4-Layer Ontologie) ── */}
      <section id="architecture" ref={architectureRef} className="py-32 bg-primary/5 network-pattern relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <Badge className="mb-4 bg-primary text-primary-foreground text-base px-4 py-2">
              <BrainCircuit className="h-4 w-4 mr-2" />
              Schritt 4: Die GraphRAG-Lösung
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Multi-Layered Ontologie-Architektur
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              Structure-Aware Temporal Graph RAG (SAT-Graph RAG) in Neo4j-Graphdatenbank. 
              alle Sozialgesetzbücher, Geschäftsregeln und Prozesse als navigierbarer Knowledge Graph.
            </p>
            <p className="text-base text-primary font-semibold">
              👆 Klicken Sie auf die Schichten, um mehr zu erfahren
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
            <div className="space-y-4">
              {layers.map((layer, index) => {
                const Icon = layer.icon
                const isSelected = selectedLayer === index
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-300 ${
                        isSelected 
                          ? 'ring-4 ring-primary shadow-2xl scale-105' 
                          : 'hover:shadow-lg hover:scale-102'
                      }`}
                      onClick={() => setSelectedLayer(isSelected ? null : index)}
                    >
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <motion.div 
                            className="p-4 rounded-xl"
                            style={{ backgroundColor: `${layer.color}15` }}
                            animate={{ scale: isSelected ? [1, 1.1, 1] : 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            <Icon className="h-8 w-8" style={{ color: layer.color }} />
                          </motion.div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge 
                                variant="outline"
                                className="text-sm"
                                style={{ borderColor: layer.color, color: layer.color }}
                              >
                                Schicht {layer.number}
                              </Badge>
                              <CardTitle className="text-xl">{layer.title}</CardTitle>
                            </div>
                            <p className="text-sm text-muted-foreground font-medium">{layer.subtitle}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <CardContent className="pt-0">
                              <Separator className="mb-4" />
                              <p className="text-muted-foreground leading-relaxed mb-4">{layer.description}</p>
                              <div className="flex flex-wrap gap-2">
                                {layer.examples.map((example, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">{example}</Badge>
                                ))}
                              </div>
                            </CardContent>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                )
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="sticky top-24 h-[700px] relative"
            >
              <DRVKnowledgeGraph3D />
              {/* Narration Play Button — overlaying the 3D graph */}
              <div className="absolute bottom-5 right-5 z-30 flex items-center gap-3">
                <button
                  onClick={toggleNarration}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-105 backdrop-blur-sm"
                >
                  {isPlayingNarration ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                  <span className="text-sm font-medium">{isPlayingNarration ? 'Pause' : 'Fall Müller anhören'}</span>
                </button>
                {isPlayingNarration && (
                  <button
                    onClick={toggleMute}
                    className="p-2 rounded-full bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white transition-colors backdrop-blur-sm"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SECTION: Fall Müller — Sachbearbeiterfall ── */}
      <section id="fall-mueller" className="py-32 bg-background relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-red-600 text-white text-base px-4 py-2">
              <FileText className="h-4 w-4 mr-2" />
              Praxisbeispiel: Komplexer Sachbearbeiterfall
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Fall Sabine Müller, Az. R 920/25-EM
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Ein realer Erwerbsminderungsrentenantrag mit Kindererziehungszeiten, Arbeitsunfall, 
              Beitragslücken und Widerspruchsverfahren: 6 Paragraphen, 3 Sozialgesetzbücher, 1 Fall.
            </p>
          </motion.div>

          {/* Audio Player Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-3xl mx-auto mb-16"
          >
            <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-primary/20">
              <CardContent className="py-5 px-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={toggleNarration}
                    className="flex-shrink-0 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors shadow-lg"
                  >
                    {isPlayingNarration ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">Fall Müller: Narration</p>
                    <p className="text-sm text-muted-foreground">
                      {isPlayingNarration ? 'Spielt...' : 'Hören Sie die Fallanalyse (ca. 6 Min.)'}
                    </p>
                  </div>
                  <button
                    onClick={toggleMute}
                    className="flex-shrink-0 p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Case Timeline */}
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Left: Person & Case Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-pink-500/10">
                        <Users className="h-6 w-6 text-pink-500" />
                      </div>
                      <div>
                        <CardTitle>Sabine Müller</CardTitle>
                        <CardDescription>geb. 15.03.1968, Industriekauffrau, Essen</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-muted/50 rounded-lg p-3">
                        <div className="text-muted-foreground text-xs">Versicherungsnr.</div>
                        <div className="font-mono font-medium">12 150368 M 025</div>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3">
                        <div className="text-muted-foreground text-xs">Aktenzeichen</div>
                        <div className="font-mono font-medium">R 920/25-EM</div>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3">
                        <div className="text-muted-foreground text-xs">Rentenart</div>
                        <div className="font-medium">Volle EM-Rente</div>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3">
                        <div className="text-muted-foreground text-xs">Arbeitsfähigkeit</div>
                        <div className="font-medium text-red-500">&lt;3 Std./Tag</div>
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 text-sm">
                      <div className="text-muted-foreground text-xs mb-1">Entgeltpunkte (geschätzt)</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-primary/20 rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '57%' }} />
                        </div>
                        <span className="font-mono font-medium">~28,5 EP</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Geschätzte Bruttorente: ca. 1.120 EUR/Monat</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Right: Complexity Indicators */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-red-500/20 bg-red-500/5">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-red-500/10">
                        <AlertTriangle className="h-6 w-6 text-red-500" />
                      </div>
                      <div>
                        <CardTitle>Warum ist dieser Fall so komplex?</CardTitle>
                        <CardDescription>6 Paragraphen, 3 SGBs, 8 Versicherungsperioden</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { label: '27 Monate Beitragslücke (2000-2002)', desc: 'Gefährdet 3-von-5-Jahre-Regel für §43', color: 'text-red-500' },
                      { label: 'Arbeitsunfall löst §53 aus', desc: 'Vorzeitige Wartezeiterfüllung. Spezialregel.', color: 'text-purple-500' },
                      { label: 'KEZ nach §56 rettet Wartezeit', desc: 'Kindererziehungszeiten = Pflichtbeiträge', color: 'text-blue-500' },
                      { label: 'Reha vor Rente bereits erfüllt', desc: '§9 SGB VI + §49 SGB IX. Grundsatz beachtet.', color: 'text-green-500' },
                      { label: 'Widerspruch nach §84 SGB X', desc: 'Erstantrag abgelehnt, fristgerechter Widerspruch', color: 'text-amber-500' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm">
                        <span className={`${item.color} font-bold text-lg leading-none mt-0.5`}>!</span>
                        <div>
                          <div className="font-medium">{item.label}</div>
                          <div className="text-muted-foreground text-xs">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Timeline Strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Versicherungsverlauf: 40 Jahre im Überblick
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { period: '1984–87', label: 'Ausbildung', color: 'bg-blue-500', type: 'Pflichtbeiträge' },
                      { period: '1987–93', label: 'Vollzeit I', color: 'bg-blue-500', type: 'Pflichtbeiträge' },
                      { period: '1993–96', label: 'KEZ', color: 'bg-pink-500', type: '§56 Kindererziehung' },
                      { period: '1996–00', label: 'Teilzeit I', color: 'bg-sky-400', type: 'Pflichtbeiträge (red.)' },
                      { period: '2000–02', label: 'LÜCKE', color: 'bg-red-500', type: 'Keine Pflichtversicherung!' },
                      { period: '2002–19', label: 'Vollzeit II', color: 'bg-blue-500', type: 'Pflichtbeiträge' },
                      { period: '09/2019', label: 'Unfall', color: 'bg-purple-500', type: 'Arbeitsunfall BWK 11/12' },
                      { period: '2019–20', label: 'Reha', color: 'bg-green-500', type: 'Med. Rehabilitation' },
                      { period: '2020–24', label: 'Teilzeit II', color: 'bg-sky-400', type: 'Nach Unfall (15h/Wo)' },
                      { period: '11/2024', label: '<3h', color: 'bg-red-600', type: 'Volle Erwerbsminderung' },
                    ].map((item, i) => (
                      <TooltipProvider key={i}>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className={`${item.color} text-white rounded-lg px-3 py-2 text-xs font-medium cursor-help transition-transform hover:scale-105`}>
                              <div className="font-bold">{item.period}</div>
                              <div className="opacity-80">{item.label}</div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-medium">{item.label}</p>
                            <p className="text-xs text-muted-foreground">{item.type}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Graph traversal explanation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8"
            >
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="h-5 w-5 text-primary" />
                    Graph-Traversierung: Die Prüfkette im Knowledge Graph
                  </CardTitle>
                  <CardDescription>
                    So navigiert der Wissensassistent durch 6 Paragraphen in 3 Sozialgesetzbüchern. Automatisch und nachvollziehbar.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    {[
                      { text: 'Fall Müller', color: 'bg-red-500' },
                      { text: '§43 EM-Rente', color: 'bg-indigo-500' },
                      { text: '§50 Wartezeit', color: 'bg-indigo-500' },
                      { text: '§53 Vorzeitig (Unfall)', color: 'bg-purple-500' },
                      { text: '§56 KEZ = Pflichtbeiträge', color: 'bg-pink-500' },
                      { text: '§9 Reha vor Rente', color: 'bg-green-500' },
                      { text: '§63 Rentenformel', color: 'bg-amber-500' },
                      { text: '§84 SGB X Widerspruch', color: 'bg-cyan-500' },
                    ].map((node, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Badge className={`${node.color} text-white border-0`}>
                          {node.text}
                        </Badge>
                        {i < 7 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                    Ein Vector RAG findet vielleicht §43. Aber nur der Knowledge Graph traversiert die vollständige Kette: 
                    von der EM-Prüfung über die Wartezeit-Ausnahme bei Arbeitsunfall bis zur Anrechnung der 
                    Kindererziehungszeiten als Pflichtbeiträge. Validiert dabei automatisch den Reha-vor-Rente-Grundsatz.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SECTION: Graph RAG vs Vector RAG ── */}
      <section id="graph-rag" className="py-32 bg-background">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 text-base px-4 py-2">
              <GitCompare className="h-4 w-4 mr-2" />
              Schritt 5: Warum Graph RAG?
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Graph RAG vs. Vector RAG
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Vector RAG findet ähnliche Textpassagen. Graph RAG versteht <strong>Beziehungen</strong> zwischen Normen.
              Bei gesetzesübergreifenden Fragen versagt Vector RAG systematisch. Hier sind konkrete Beispiele.
            </p>
          </motion.div>

          {/* Summary comparison */}
          <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-5xl mx-auto">
            <Card className="border-2 border-destructive/30 bg-destructive/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <XCircle className="h-5 w-5 text-destructive" />
                  Vector RAG: Limitierungen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Findet nur textlich ähnliche Passages, keine strukturellen Verbindungen",
                  "Übersieht Ausnahmeregeln in anderen Paragraphen (§53 bei §43-Suche)",
                  "Keine temporalen Metadaten, kann Übergangsregelungen nicht auswerten",
                  "Kein Multi-Hop: Kann nicht über 3+ Gesetze hinweg Schlüsse ziehen",
                  "Kein Verständnis für Normenhierarchie oder Vorrang-/Spezialitätsregeln"
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <XCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground leading-relaxed">{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500/30 bg-green-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CircleCheck className="h-5 w-5 text-green-600" />
                  Graph RAG: Vorteile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Traversiert Gesetz → Paragraph → Regel → Prozess über explizite Kanten",
                  "Folgt Querverweisen (SR_REFERENCES) und Ausnahmen (SR_DEPENDS_ON)",
                  "Temporale Metadaten an jedem Knoten: exakte Gültigkeit pro Stichtag",
                  "Multi-Hop über beliebig viele verknüpfte Gesetze, Regeln und Entitäten",
                  "Normenhierarchie als Graph-Struktur: automatische Vorrangprüfung"
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <CircleCheck className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground leading-relaxed">{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Concrete failure examples */}
          <h3 className="text-2xl font-bold text-center mb-8">Konkrete Beispiele: Wo Vector RAG versagt</h3>
          <div className="space-y-8 max-w-5xl mx-auto">
            {ragComparisons.map((comp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="border-2 hover:shadow-xl transition-shadow overflow-hidden">
                  <CardHeader className="bg-primary/5">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="text-sm font-bold flex-shrink-0">
                        Beispiel {index + 1}
                      </Badge>
                      <div>
                        <CardTitle className="text-lg mb-2">{comp.title}</CardTitle>
                        <CardDescription className="text-base">
                          <span className="font-semibold text-foreground">Frage:</span> '{comp.question}"
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                      {/* Graph RAG */}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <CircleCheck className="h-5 w-5 text-green-600" />
                          <span className="font-bold text-green-700">Graph RAG</span>
                          <Badge className="bg-green-100 text-green-800 text-xs">{comp.graphAnswer.result}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{comp.graphAnswer.explanation}</p>
                      </div>
                      {/* Vector RAG */}
                      <div className="p-6 bg-destructive/3">
                        <div className="flex items-center gap-2 mb-3">
                          <XCircle className="h-5 w-5 text-destructive" />
                          <span className="font-bold text-destructive">Vector RAG</span>
                          <Badge className="bg-red-100 text-red-800 text-xs">{comp.vectorAnswer.result}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{comp.vectorAnswer.explanation}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION: Chat API Standards ── */}
      <section id="chat-api" className="py-32 bg-muted/30 relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 text-base px-4 py-2">
              <MessageSquare className="h-4 w-4 mr-2" />
              Schritt 6: Chat API Standards
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Chatbot API nach Industriestandards
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Die Demo implementiert die gängigen Chat-API-Standards. Jedes Frontend, jeder Chatbot-Client 
              kann sich direkt integrieren: OpenAI-kompatibel mit GraphRAG-Erweiterungen.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {chatApiStandards.map((api, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: api.color }} />
                      <CardTitle className="text-base">{api.name}</CardTitle>
                    </div>
                    <code className="text-xs bg-muted px-2 py-1 rounded font-mono text-primary">{api.endpoint}</code>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">{api.description}</p>
                    <div className="text-xs text-muted-foreground">
                      <span className="font-semibold">Genutzt von:</span> {api.adoptedBy}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Chat API Detail */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2 border-primary/30 bg-primary/5 max-w-5xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Bot className="h-6 w-6 text-primary" />
                  Chat API: OpenAI-kompatibel + GraphRAG
                </CardTitle>
                <CardDescription>
                  Die Chat-API folgt dem OpenAI messages[]-Format und erweitert es um Zitationen und Sitzungsverwaltung.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      POST /api/v1/chat
                    </h4>
                    <div className="bg-slate-900 rounded-lg p-4 text-sm font-mono text-slate-300 overflow-x-auto">
                      <pre>{`{
  "message": "Welche Voraussetzungen
    gelten für Altersrente?",
  "session_id": null,
  "context": {
    "gesetz": "SGB VI",
    "paragraph": "§ 35"
  },
  "top_k": 10
}`}</pre>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Response mit Zitationen
                    </h4>
                    <div className="bg-slate-900 rounded-lg p-4 text-sm font-mono text-slate-300 overflow-x-auto">
                      <pre>{`{
  "session_id": "a3f1b2c4...",
  "answer": "Nach § 35 SGB VI haben
    Versicherte Anspruch auf...",
  "citations": [{
    "source": "SGB VI",
    "core_component": "Regelaltersrente",
    "br_name": "BR_SGB6_35_01",
    "score": 0.93
  }]
}`}</pre>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { label: "POST /api/v1/chat", desc: "Multi-Turn Chat mit Session (Redis, 8h TTL)" },
                    { label: "POST /api/v1/search", desc: "Single-Turn Search: stateless, keine Session" },
                    { label: "DELETE /api/v1/chat/{id}", desc: "Session löschen" },
                    { label: "GET /…/history", desc: "Konversationsverlauf abrufen" },
                    { label: "GET /docs", desc: "Swagger UI: interaktive API-Dokumentation" },
                    { label: "GET /health", desc: "Health Check Endpoint" },
                  ].map((ep, i) => (
                    <div key={i} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <code className="text-xs font-mono font-semibold text-primary">{ep.label}</code>
                      <p className="text-xs text-muted-foreground mt-1">{ep.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION: Praxisszenarien ── */}
      <section id="scenarios" className="py-32 bg-card">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 text-base px-4 py-2">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Schritt 7: Praxis erleben
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Praxisszenarien für die DRV
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Konkrete Anwendungsfälle zeigen, wie ein Knowledge Graph die tägliche Arbeit in der Rentenversicherung unterstützt.
            </p>
          </motion.div>

          <Tabs value={String(activeScenario)} onValueChange={(v) => setActiveScenario(Number(v))} className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-auto p-2 mb-12 max-w-5xl mx-auto">
              {scenarios.map((scenario, index) => {
                const Icon = scenario.icon
                return (
                  <TabsTrigger 
                    key={index} 
                    value={String(index)}
                    className="flex flex-col items-center gap-2 py-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-xs md:text-sm font-medium text-center leading-tight">{scenario.title}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {scenarios.map((scenario, index) => {
              const Icon = scenario.icon
              return (
                <TabsContent key={index} value={String(index)}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="border-2 hover:shadow-2xl transition-shadow">
                      <CardHeader className="pb-8">
                        <div className="flex items-start gap-6">
                          <motion.div 
                            className="p-6 rounded-2xl"
                            style={{ backgroundColor: `${scenario.color}15` }}
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                          >
                            <Icon className="h-12 w-12" style={{ color: scenario.color }} />
                          </motion.div>
                          <div className="flex-1">
                            <CardTitle className="text-3xl mb-4">{scenario.title}</CardTitle>
                            <CardDescription className="text-base leading-relaxed">{scenario.description}</CardDescription>
                            <Badge variant="secondary" className="mt-4">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              {scenario.impact}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Separator className="mb-6" />
                        <h4 className="font-semibold text-lg mb-4">GraphRAG-Funktionen für diesen Fall:</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          {scenario.benefits.map((benefit, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: i * 0.1 }}
                              className="flex gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                            >
                              <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-foreground leading-relaxed">{benefit}</span>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              )
            })}
          </Tabs>
        </div>
      </section>

      {/* ── SECTION: Standards & Compliance ── */}
      <section id="standards" className="py-32 bg-muted/30 relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 text-base px-4 py-2">
              <Scale className="h-4 w-4 mr-2" />
              Schritt 8: Rechtsgrundlagen
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Gesetzliche Grundlagen im Knowledge Graph
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Die DRV arbeitet auf Basis eines komplexen Geflechts aus Sozialgesetzbüchern, 
              EU-Verordnungen und internen Handlungsanweisungen. Der Wissensassistent bildet sie alle als Graph ab.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: BookOpen,
                title: "Sozialgesetzbücher",
                color: "oklch(0.45 0.15 245)",
                standards: [
                  { name: "SGB VI: Rentenversicherung", desc: "Primärgesetz mit ca. 323 §§. Beiträge, Leistungen, Alters- und Erwerbsminderungsrente, Rehabilitation." },
                  { name: "SGB IV: Gemeinsame Vorschriften", desc: "Versicherungspflicht, Beitragsbemessung, Meldeverfahren. Grundlage aller Sozialversicherungen." },
                  { name: "SGB I: Allgemeiner Teil", desc: "Framework: Leistungsansprüche, Fristen, Zuständigkeiten. Gilt übergreifend für alle SGBs." },
                  { name: "SGB IX: Rehabilitation", desc: "DRV als Reha-Träger: medizinische Rehabilitation und Teilhabe am Arbeitsleben." },
                  { name: "SGB X: Verwaltungsverfahren", desc: "Verwaltungsakte, Widerspruchsverfahren, Sozialdatenschutz. Verfahrensrecht." },
                ]
              },
              {
                icon: Landmark,
                title: "EU-Recht & Datenschutz",
                color: "oklch(0.50 0.18 200)",
                standards: [
                  { name: "DSGVO (EU 2016/679)", desc: "Datenschutz-Grundverordnung. Rechtsrahmen für die Verarbeitung personenbezogener Sozialdaten." },
                  { name: "EU-VO 883/2004", desc: "Koordinierung der Systeme der sozialen Sicherheit. Grenzüberschreitende Rentenansprüche." },
                  { name: "BSI IT-Grundschutz", desc: "IT-Sicherheitsstandard. Pflicht für DRV als Behörde mit kritischer Infrastruktur." },
                  { name: "AAÜG: Anwartschaftsüberführung", desc: "Post-Vereinigungspension: Überführung von DDR-Rentenanwartschaften" },
                  { name: "VersAusglG: Versorgungsausgleich", desc: "Scheidungsbedingter Rentenausgleich zwischen Ehepartnern" },
                ]
              },
              {
                icon: ScrollText,
                title: "DRV-Anweisungen (GRA)",
                color: "oklch(0.55 0.20 55)",
                standards: [
                  { name: "GRA SGB VI", desc: "Gemeinsame Rechtliche Anweisungen zur Rentenversicherung. Auslegungshinweise zu allen §§." },
                  { name: "GRA SGB IV", desc: "Anweisungen zu Versicherungspflicht, Beiträgen und Meldeverfahren" },
                  { name: "GRA SGB IX", desc: "Anweisungen zur Rehabilitation. DRV als zuständiger Leistungsträger." },
                  { name: "GRA Fremdrentenrecht", desc: "Spezialanweisungen für ausländische Versicherungszeiten und Spätaussiedler" },
                  { name: "rvRecht® Portal", desc: "Öffentlich zugängliches DRV-Rechtsportal mit allen GRA. Quelle für Graph-Import." },
                ]
              }
            ].map((category, catIndex) => {
              const CatIcon = category.icon
              return (
                <motion.div
                  key={catIndex}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: catIndex * 0.15 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl" style={{ backgroundColor: `${category.color}15` }}>
                          <CatIcon className="h-7 w-7" style={{ color: category.color }} />
                        </div>
                        <CardTitle className="text-xl">{category.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {category.standards.map((std, i) => (
                        <div key={i} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                          <div className="font-semibold text-sm text-foreground mb-1">{std.name}</div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{std.desc}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2 border-primary/30 bg-primary/5">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <ShieldCheck className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Graph-Integration</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Alle genannten Gesetze und Anweisungen sind direkt im Knowledge Graph verankert. 
                      Jeder Paragraph enthält seine Geschäftsregeln, jede Regel verweist auf die relevanten Prozesse und Entitäten.
                      Die zeitliche Dimension speichert die Gültigkeit jeder Fassung. Von der Übergangsregelung bis zur aktuellen Rentenanpassung.
                      GRA-Anweisungen des rvRecht®-Portals sind als eigene Knotentypen verknüpft und liefern praxisnahe Auslegungshinweise.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION: Graph-Architektur im Detail ── */}
      <section id="graph-detail" className="py-32 bg-card relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 text-base px-4 py-2">
              <Layers className="h-4 w-4 mr-2" />
              Schritt 9: Graph-Architektur
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Knowledge Graph: Datenmodell
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Die vollständige DRV-Graphstruktur: von Gesetzen über Geschäftsregeln bis zu Prozessen und Entitäten.
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <div className="h-[700px] rounded-xl overflow-hidden">
              <DataModelGraph3D />
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-8">
              {[
                { label: "~4.500+", desc: "Knoten im vollständigen Graph", icon: Database },
                { label: "~8.000+", desc: "Beziehungen zwischen Knoten", icon: Network },
                { label: "5+ SGBs", desc: "Verknüpfte Gesetze mit Querverweisen", icon: Link2 },
              ].map((stat, i) => {
                const StatIcon = stat.icon
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  >
                    <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                      <StatIcon className="h-8 w-8 text-primary mx-auto mb-3" />
                      <div className="text-3xl font-bold text-primary mb-1">{stat.label}</div>
                      <div className="text-sm text-muted-foreground">{stat.desc}</div>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 border-t border-border bg-muted/30">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold tracking-tight">GraphRAG Demo</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Demo-Anwendung für Knowledge Graph &amp; GraphRAG. Keine Produktivnutzung.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// ── Helper Components ──


function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary/10 rounded-full"
          initial={{ 
            x: Math.random() * 100 + '%',
            y: Math.random() * 100 + '%',
            scale: 0
          }}
          animate={{ 
            y: [null, Math.random() * 100 + '%'],
            scale: [0, 1, 0],
            opacity: [0, 0.5, 0]
          }}
          transition={{ 
            duration: Math.random() * 10 + 5,
            repeat: Infinity,
            delay: Math.random() * 5
          }}
        />
      ))}
    </div>
  )
}

export default App
