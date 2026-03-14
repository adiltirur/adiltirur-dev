"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// ── JSON syntax highlight ────────────────────────────────────────────────────
function syntaxHighlightJSON(json: string) {
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let cls = "text-amber-700 dark:text-amber-400"; // number
      if (/^"/.test(match)) {
        cls = /:$/.test(match)
          ? "text-blue-700 dark:text-blue-400" // key
          : "text-green-700 dark:text-green-400"; // string
      } else if (/true|false/.test(match)) {
        cls = "text-purple-700 dark:text-purple-400 font-medium"; // bool
      } else if (/null/.test(match)) {
        cls = "text-red-700 dark:text-red-400 font-medium"; // null
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

// ── Share link helpers ───────────────────────────────────────────────────────
function encodeContent(text: string) {
  try {
    return btoa(unescape(encodeURIComponent(text)));
  } catch {
    return btoa(text);
  }
}
function decodeContent(b64: string) {
  try {
    return decodeURIComponent(escape(atob(b64)));
  } catch {
    return "";
  }
}

// ── Mermaid (client-side only) ───────────────────────────────────────────────
let mermaidModule: typeof import("mermaid") | null = null;
async function getMermaid() {
  if (!mermaidModule) {
    mermaidModule = await import("mermaid");
    mermaidModule.default.initialize({
      startOnLoad: false,
      theme: document.documentElement.classList.contains("dark") ? "dark" : "default",
      securityLevel: "loose",
    });
  }
  return mermaidModule.default;
}

type ViewMode = "split" | "input" | "output";

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState("md");
  const [viewMode, setViewMode] = useState<ViewMode>("split");

  // Markdown state
  const [mdInput, setMdInput] = useState("");
  const [mdCopyFeedback, setMdCopyFeedback] = useState(false);
  const [mdShareFeedback, setMdShareFeedback] = useState(false);

  // JSON state
  const [jsonInput, setJsonInput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [jsonStat, setJsonStat] = useState("");
  const [jsonCopyFeedback, setJsonCopyFeedback] = useState(false);
  const [jsonShareFeedback, setJsonShareFeedback] = useState(false);

  // Mermaid state
  const [mermaidInput, setMermaidInput] = useState("");
  const [mermaidSvg, setMermaidSvg] = useState("");
  const [mermaidError, setMermaidError] = useState("");
  const [mermaidShareFeedback, setMermaidShareFeedback] = useState(false);
  const mermaidTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Drag state
  const [leftWidth, setLeftWidth] = useState<number | null>(null);
  const splitRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const dragStart = useRef({ x: 0, w: 0 });

  // ── URL hash loading ─────────────────────────────────────────────────────
  const hashLoaded = useRef(false);
  useEffect(() => {
    if (hashLoaded.current) return;
    hashLoaded.current = true;
    const hash = window.location.hash.slice(1);
    const colon = hash.indexOf(":");
    if (colon !== -1) {
      const tab = hash.slice(0, colon);
      const encoded = hash.slice(colon + 1);
      if (["md", "json", "mermaid"].includes(tab) && encoded) {
        const content = decodeContent(encoded);
        setActiveTab(tab);
        setViewMode("output");
        if (tab === "md") setMdInput(content);
        else if (tab === "json") {
          setJsonInput(content);
          renderJSON(content);
        } else if (tab === "mermaid") {
          setMermaidInput(content);
          doRenderMermaid(content);
        }
      }
    } else if (["md", "json", "mermaid"].includes(hash)) {
      setActiveTab(hash);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── JSON rendering ───────────────────────────────────────────────────────
  const renderJSON = useCallback((src: string) => {
    const trimmed = src.trim();
    if (!trimmed) {
      setJsonOutput("");
      setJsonError("");
      setJsonStat("");
      return;
    }
    try {
      const parsed = JSON.parse(trimmed);
      const pretty = JSON.stringify(parsed, null, 2);
      setJsonOutput(syntaxHighlightJSON(pretty));
      setJsonError("");
      const keys = (pretty.match(/"[^"]+"\s*:/g) || []).length;
      setJsonStat(`${pretty.split("\n").length} lines · ${keys} keys`);
    } catch (e: unknown) {
      setJsonOutput("");
      setJsonError((e as Error).message);
      setJsonStat("");
    }
  }, []);

  // ── Mermaid rendering ────────────────────────────────────────────────────
  const doRenderMermaid = useCallback(async (src: string) => {
    const trimmed = src.trim();
    if (!trimmed) {
      setMermaidSvg("");
      setMermaidError("");
      return;
    }
    try {
      const m = await getMermaid();
      const { svg } = await m.render("mermaid-svg-" + Date.now(), trimmed);
      setMermaidSvg(svg);
      setMermaidError("");
    } catch (e: unknown) {
      setMermaidSvg("");
      setMermaidError((e as Error).message || "Syntax error — check your diagram code.");
    }
  }, []);

  const scheduleMermaid = useCallback(
    (src: string) => {
      if (mermaidTimer.current) clearTimeout(mermaidTimer.current);
      mermaidTimer.current = setTimeout(() => doRenderMermaid(src), 600);
    },
    [doRenderMermaid]
  );

  // ── Minify JSON ──────────────────────────────────────────────────────────
  const minifyJSON = () => {
    try {
      const minified = JSON.stringify(JSON.parse(jsonInput));
      setJsonInput(minified);
      renderJSON(minified);
    } catch {
      // ignore
    }
  };

  // ── Copy helpers ─────────────────────────────────────────────────────────
  const flashFeedback = (setter: (v: boolean) => void) => {
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const copyShareLink = (tab: string, input: string, setter: (v: boolean) => void) => {
    if (!input.trim()) return;
    const url = `https://adiltirur.dev/tools#${tab}:${encodeContent(input)}`;
    navigator.clipboard.writeText(url).then(() => flashFeedback(setter));
    window.history.replaceState(null, "", `#${tab}:${encodeContent(input)}`);
  };

  // ── Mermaid example ──────────────────────────────────────────────────────
  const loadMermaidExample = () => {
    const example = `sequenceDiagram
    participant U as User
    participant A as App
    participant S as Server
    U->>A: Opens app
    A->>S: Auth request
    S-->>A: Token
    A-->>U: Dashboard`;
    setMermaidInput(example);
    doRenderMermaid(example);
  };

  // ── Drag handle ──────────────────────────────────────────────────────────
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    dragStart.current = { x: e.clientX, w: leftWidth ?? (splitRef.current?.offsetWidth ?? 800) / 2 };
    const onMove = (ev: MouseEvent) => {
      if (!dragging.current || !splitRef.current) return;
      const totalW = splitRef.current.offsetWidth;
      const delta = ev.clientX - dragStart.current.x;
      const newW = Math.min(Math.max(dragStart.current.w + delta, 120), totalW - 120);
      setLeftWidth(newW);
    };
    const onUp = () => {
      dragging.current = false;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  // ── Stat helpers ─────────────────────────────────────────────────────────
  const mdLines = mdInput ? mdInput.split("\n").length : 0;
  const mdWords = mdInput.trim() ? mdInput.trim().split(/\s+/).length : 0;

  // ── Shared pane layout ───────────────────────────────────────────────────
  const showInput = viewMode !== "output";
  const showOutput = viewMode !== "input";
  const showDrag = viewMode === "split";

  return (
    <main className="flex flex-col" style={{ height: "calc(100vh - 73px)" }}>
      {/* Page header */}
      <div className="px-4 sm:px-8 py-8 sm:py-12 border-b border-border">
        <p className="font-mono text-xs text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-3 flex items-center gap-2">
          <span className="inline-block w-5 h-px bg-blue-600 dark:bg-blue-400" />
          tools
        </p>
        <h1 className="text-[clamp(24px,3.5vw,34px)] font-semibold tracking-tight leading-[1.2] mb-2">
          Quick Viewers
        </h1>
        <p className="text-sm text-muted-foreground">
          Paste Markdown, JSON, or Mermaid diagrams and preview them instantly — nothing is uploaded.
        </p>
      </div>

      {/* Tab bar */}
      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); window.history.replaceState(null, "", "#" + v); }} className="flex flex-col flex-1 min-h-0 gap-0">
        <div className="flex items-center justify-between px-4 sm:px-8 border-b border-border sticky top-[73px] z-50 bg-background">
          <TabsList variant="line" className="h-auto p-0">
            <TabsTrigger value="md" className="font-mono text-xs px-4 py-3">
              Markdown
            </TabsTrigger>
            <TabsTrigger value="json" className="font-mono text-xs px-4 py-3">
              {`{ } JSON`}
            </TabsTrigger>
            <TabsTrigger value="mermaid" className="font-mono text-xs px-4 py-3">
              Mermaid
            </TabsTrigger>
          </TabsList>

          <div className="hidden sm:flex gap-1 items-center">
            {(["split", "input", "output"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setViewMode(v)}
                className={`font-mono text-[11px] px-2.5 py-1 border rounded-md transition-all ${
                  viewMode === v
                    ? "bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-border bg-card text-muted-foreground hover:border-blue-500 hover:text-blue-600"
                }`}
              >
                {v === "split" ? "Split" : v === "input" ? "Input" : "Preview"}
              </button>
            ))}
          </div>
        </div>

        {/* ════════ Markdown Tab ════════ */}
        <TabsContent value="md" className="flex-1 min-h-0 !mt-0">
          <div ref={splitRef} className="flex h-full">
            {showInput && (
              <div className="flex flex-col overflow-hidden min-w-0" style={{ flex: leftWidth && viewMode === "split" ? `0 0 ${leftWidth}px` : viewMode === "split" ? "0 0 50%" : "1" }}>
                <div className="flex items-center justify-between px-3.5 py-2 border-b border-border bg-muted flex-shrink-0">
                  <span className="font-mono text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Input</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-muted-foreground">{mdLines} lines · {mdWords} words</span>
                    {mdShareFeedback && <span className="font-mono text-[10px] text-green-600">Link copied!</span>}
                    <button className="font-mono text-[11px] px-2.5 py-0.5 border border-border rounded bg-card text-muted-foreground hover:border-blue-500 hover:text-blue-600 transition-all" onClick={() => copyShareLink("md", mdInput, setMdShareFeedback)}>Copy Link</button>
                    <button className="font-mono text-[11px] px-2.5 py-0.5 border border-border rounded bg-card text-muted-foreground hover:border-blue-500 hover:text-blue-600 transition-all" onClick={() => setMdInput("")}>Clear</button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto min-h-0">
                  <textarea
                    className="w-full h-full font-mono text-[13px] leading-relaxed p-4 border-none outline-none bg-card text-foreground resize-none placeholder:text-muted-foreground/60"
                    placeholder={"# Hello World\n\nPaste your **Markdown** here...\n\n- Supports GFM tables, code blocks, blockquotes\n- Live preview as you type"}
                    value={mdInput}
                    onChange={(e) => setMdInput(e.target.value)}
                  />
                </div>
              </div>
            )}
            {showDrag && (
              <div className="w-[5px] flex-shrink-0 bg-border cursor-col-resize hover:bg-blue-500 transition-colors flex items-center justify-center" onMouseDown={onMouseDown}>
                <span className="text-white text-sm opacity-0 hover:opacity-100 pointer-events-none select-none">&#x22EE;</span>
              </div>
            )}
            {showOutput && (
              <div className="flex flex-col flex-1 overflow-hidden min-w-0">
                <div className="flex items-center justify-between px-3.5 py-2 border-b border-border bg-muted flex-shrink-0">
                  <span className="font-mono text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Preview</span>
                  <div className="flex items-center gap-1.5">
                    {mdCopyFeedback && <span className="font-mono text-[10px] text-green-600">Copied!</span>}
                    <button className="font-mono text-[11px] px-2.5 py-0.5 border border-border rounded bg-card text-muted-foreground hover:border-blue-500 hover:text-blue-600 transition-all" onClick={() => { const el = document.getElementById("md-output"); if (el) navigator.clipboard.writeText(el.innerHTML).then(() => flashFeedback(setMdCopyFeedback)); }}>Copy HTML</button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto min-h-0 p-6 sm:p-7">
                  <div id="md-output" className="prose prose-sm dark:prose-invert max-w-none prose-headings:tracking-tight prose-code:font-mono prose-code:text-[0.875em] prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-blockquote:border-blue-600">
                    {mdInput.trim() ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{mdInput}</ReactMarkdown>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-muted-foreground/50">
                        <p className="text-[32px] mb-2.5 opacity-45">&#x1F4DD;</p>
                        <p className="text-[13px] font-mono">preview appears here</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ════════ JSON Tab ════════ */}
        <TabsContent value="json" className="flex-1 min-h-0 !mt-0">
          <div className="flex h-full">
            {showInput && (
              <div className="flex flex-col overflow-hidden min-w-0" style={{ flex: leftWidth && viewMode === "split" ? `0 0 ${leftWidth}px` : viewMode === "split" ? "0 0 50%" : "1" }}>
                <div className="flex items-center justify-between px-3.5 py-2 border-b border-border bg-muted flex-shrink-0">
                  <span className="font-mono text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Input</span>
                  <div className="flex items-center gap-1.5">
                    {jsonStat && <span className="font-mono text-[10px] text-muted-foreground">{jsonStat}</span>}
                    {jsonShareFeedback && <span className="font-mono text-[10px] text-green-600">Link copied!</span>}
                    <button className="font-mono text-[11px] px-2.5 py-0.5 border border-border rounded bg-card text-muted-foreground hover:border-blue-500 hover:text-blue-600 transition-all" onClick={() => copyShareLink("json", jsonInput, setJsonShareFeedback)}>Copy Link</button>
                    <button className="font-mono text-[11px] px-2.5 py-0.5 border border-border rounded bg-card text-muted-foreground hover:border-blue-500 hover:text-blue-600 transition-all" onClick={() => { setJsonInput(""); renderJSON(""); }}>Clear</button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto min-h-0">
                  <textarea
                    className="w-full h-full font-mono text-[13px] leading-relaxed p-4 border-none outline-none bg-card text-foreground resize-none placeholder:text-muted-foreground/60"
                    placeholder={'{\n  "name": "Adil",\n  "role": "Technical Lead",\n  "stack": ["Flutter","Dart","Go"],\n  "active": true\n}'}
                    value={jsonInput}
                    onChange={(e) => { setJsonInput(e.target.value); renderJSON(e.target.value); }}
                  />
                </div>
              </div>
            )}
            {showDrag && (
              <div className="w-[5px] flex-shrink-0 bg-border cursor-col-resize hover:bg-blue-500 transition-colors" onMouseDown={onMouseDown} />
            )}
            {showOutput && (
              <div className="flex flex-col flex-1 overflow-hidden min-w-0">
                <div className="flex items-center justify-between px-3.5 py-2 border-b border-border bg-muted flex-shrink-0">
                  <span className="font-mono text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Formatted</span>
                  <div className="flex items-center gap-1.5">
                    {jsonCopyFeedback && <span className="font-mono text-[10px] text-green-600">Copied!</span>}
                    <button className="font-mono text-[11px] px-2.5 py-0.5 border border-border rounded bg-card text-muted-foreground hover:border-blue-500 hover:text-blue-600 transition-all" onClick={() => { try { navigator.clipboard.writeText(JSON.stringify(JSON.parse(jsonInput), null, 2)).then(() => flashFeedback(setJsonCopyFeedback)); } catch {} }}>Copy</button>
                    <button className="font-mono text-[11px] px-2.5 py-0.5 border border-border rounded bg-card text-muted-foreground hover:border-blue-500 hover:text-blue-600 transition-all" onClick={minifyJSON}>Minify</button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto min-h-0 p-6 sm:p-7">
                  {jsonError ? (
                    <div className="font-mono text-[13px] text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3.5">
                      &#x26A0; {jsonError}
                    </div>
                  ) : jsonOutput ? (
                    <pre className="font-mono text-[13px] leading-[1.7] whitespace-pre-wrap break-words" dangerouslySetInnerHTML={{ __html: jsonOutput }} />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-muted-foreground/50">
                      <p className="text-[32px] mb-2.5 opacity-45">{`{ }`}</p>
                      <p className="text-[13px] font-mono">formatted output appears here</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ════════ Mermaid Tab ════════ */}
        <TabsContent value="mermaid" className="flex-1 min-h-0 !mt-0">
          <div className="flex h-full">
            {showInput && (
              <div className="flex flex-col overflow-hidden min-w-0" style={{ flex: leftWidth && viewMode === "split" ? `0 0 ${leftWidth}px` : viewMode === "split" ? "0 0 50%" : "1" }}>
                <div className="flex items-center justify-between px-3.5 py-2 border-b border-border bg-muted flex-shrink-0">
                  <span className="font-mono text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Diagram Source</span>
                  <div className="flex items-center gap-1.5">
                    {mermaidShareFeedback && <span className="font-mono text-[10px] text-green-600">Link copied!</span>}
                    <button className="font-mono text-[11px] px-2.5 py-0.5 border border-border rounded bg-card text-muted-foreground hover:border-blue-500 hover:text-blue-600 transition-all" onClick={() => copyShareLink("mermaid", mermaidInput, setMermaidShareFeedback)}>Copy Link</button>
                    <button className="font-mono text-[11px] px-2.5 py-0.5 border border-border rounded bg-card text-muted-foreground hover:border-blue-500 hover:text-blue-600 transition-all" onClick={loadMermaidExample}>Example</button>
                    <button className="font-mono text-[11px] px-2.5 py-0.5 border border-border rounded bg-card text-muted-foreground hover:border-blue-500 hover:text-blue-600 transition-all" onClick={() => { setMermaidInput(""); setMermaidSvg(""); setMermaidError(""); }}>Clear</button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto min-h-0">
                  <textarea
                    className="w-full h-full font-mono text-[13px] leading-relaxed p-4 border-none outline-none bg-card text-foreground resize-none placeholder:text-muted-foreground/60"
                    placeholder={"graph TD\n    A[Start] --> B{Decision}\n    B -->|Yes| C[Do it]\n    B -->|No|  D[Skip it]\n    C --> E[End]\n    D --> E"}
                    value={mermaidInput}
                    onChange={(e) => { setMermaidInput(e.target.value); scheduleMermaid(e.target.value); }}
                  />
                </div>
              </div>
            )}
            {showDrag && (
              <div className="w-[5px] flex-shrink-0 bg-border cursor-col-resize hover:bg-blue-500 transition-colors" onMouseDown={onMouseDown} />
            )}
            {showOutput && (
              <div className="flex flex-col flex-1 overflow-hidden min-w-0">
                <div className="flex items-center justify-between px-3.5 py-2 border-b border-border bg-muted flex-shrink-0">
                  <span className="font-mono text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Diagram</span>
                  <div className="flex items-center gap-1.5">
                    <button className="font-mono text-[11px] px-2.5 py-0.5 bg-blue-600 text-white border border-blue-600 rounded hover:bg-blue-700 transition-all" onClick={() => doRenderMermaid(mermaidInput)}>Render</button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto min-h-0 p-6 sm:p-7">
                  {mermaidError ? (
                    <div className="font-mono text-[13px] text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3.5">
                      &#x26A0; {mermaidError}
                    </div>
                  ) : mermaidSvg ? (
                    <div className="text-center [&_svg]:max-w-full [&_svg]:h-auto" dangerouslySetInnerHTML={{ __html: mermaidSvg }} />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-muted-foreground/50">
                      <p className="text-[32px] mb-2.5 opacity-45">&#x2B21;</p>
                      <p className="text-[13px] font-mono">diagram appears here</p>
                    </div>
                  )}
                </div>
                {/* Cheatsheet */}
                <details className="border-t border-border bg-card flex-shrink-0">
                  <summary className="px-3.5 py-2.5 cursor-pointer text-xs font-mono text-muted-foreground bg-muted select-none">
                    Quick reference — diagram types
                  </summary>
                  <div className="p-3.5 grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2.5 text-xs font-mono">
                    {[
                      { name: "Flowchart", code: "graph TD / LR" },
                      { name: "Sequence", code: "sequenceDiagram" },
                      { name: "Class", code: "classDiagram" },
                      { name: "State", code: "stateDiagram-v2" },
                      { name: "ER", code: "erDiagram" },
                      { name: "Gantt", code: "gantt" },
                      { name: "Pie", code: "pie title ..." },
                      { name: "Git graph", code: "gitGraph" },
                    ].map((d) => (
                      <div key={d.name}>
                        <strong className="text-blue-600 dark:text-blue-400">{d.name}</strong>
                        <br />
                        <code className="text-muted-foreground">{d.code}</code>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
