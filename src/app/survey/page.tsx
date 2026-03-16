"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Search, X, Upload } from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────
interface SurveyChoice {
  value: string;
  text?: string;
}

interface SurveyElement {
  name: string;
  type: string;
  title?: string;
  description?: string;
  isRequired?: boolean;
  inputType?: string;
  maxLength?: number;
  min?: number | string;
  max?: number | string;
  placeholder?: string;
  choices?: (string | SurveyChoice)[];
  visibleIf?: string;
  showNoneItem?: boolean;
  noneText?: string;
  showOtherItem?: boolean;
  otherText?: string;
  otherPlaceholder?: string;
}

interface SurveyPage {
  name?: string;
  title?: string;
  description?: string;
  visibleIf?: string;
  elements?: SurveyElement[];
}

interface SurveyData {
  title?: string | { de?: string; default?: string };
  pages?: SurveyPage[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function esc(s: string | undefined | null) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function stripMeta(str: string | undefined | null): string {
  if (str == null) return "";
  let s = String(str);
  let prev: string;
  do {
    prev = s;
    s = s.replace(/\$\{[^${}]*(?:\{[^{}]*\}[^${}]*)?\}/g, "");
  } while (s !== prev);
  return s.trim();
}

function surveyTitle(s: SurveyData | null): string {
  if (!s || !s.title) return "Untitled Survey";
  const t = s.title;
  return stripMeta(typeof t === "object" ? t.de || t.default || "" : t);
}

function getChoiceText(c: string | SurveyChoice): string {
  return typeof c === "string" ? c : c.text || String(c.value ?? "");
}

function getChoiceValue(c: string | SurveyChoice): string {
  return typeof c === "string" ? c : String(c.value ?? "");
}

// ── VisibleIf parser ─────────────────────────────────────────────────────────
interface ViClause {
  question: string;
  condition: string;
  values: string[];
  logicalOperator: string | null;
}

interface ViToken {
  t: string;
  v: string;
}

function _viTok(expr: string): ViToken[] {
  const toks: ViToken[] = [];
  let i = 0;
  while (i < expr.length) {
    while (i < expr.length && /\s/.test(expr[i])) i++;
    if (i >= expr.length) break;
    const ch = expr[i];
    if (ch === "{") {
      const j = expr.indexOf("}", i);
      toks.push({ t: "var", v: expr.slice(i + 1, j < 0 ? expr.length : j) });
      i = j < 0 ? expr.length : j + 1;
    } else if (ch === "'" || ch === '"') {
      let j = i + 1;
      while (j < expr.length && expr[j] !== ch) j++;
      toks.push({ t: "str", v: expr.slice(i + 1, j) });
      i = j + 1;
    } else if ("=!<>".includes(ch)) {
      const two = expr.slice(i, i + 2);
      if (["==", "!=", ">=", "<="].includes(two)) {
        toks.push({ t: "op", v: two });
        i += 2;
      } else {
        toks.push({ t: "op", v: ch });
        i++;
      }
    } else {
      let j = i;
      while (j < expr.length && !/[\s{'"=!<>]/.test(expr[j])) j++;
      const w = expr.slice(i, j);
      const wl = w.toLowerCase();
      toks.push({ t: wl === "and" || wl === "or" ? "logical" : "op", v: w });
      i = j;
    }
  }
  return toks;
}

function parseVisibleIf(expr: string): ViClause[] {
  if (!expr || !expr.trim()) return [];
  const toks = _viTok(expr);
  const out: ViClause[] = [];
  let i = 0;
  while (i < toks.length) {
    if (toks[i].t !== "var") { i++; continue; }
    const question = toks[i++].v;
    if (i >= toks.length) break;
    const condition = toks[i++].v.toLowerCase();
    let values: string[] = [];
    if (condition !== "notempty" && condition !== "empty") {
      if (i < toks.length && toks[i].t !== "logical" && toks[i].t !== "var") {
        values = [toks[i++].v];
      }
    }
    let logicalOperator: string | null = null;
    if (i < toks.length && toks[i].t === "logical") {
      logicalOperator = toks[i++].v.toLowerCase();
    }
    out.push({ question, condition, values, logicalOperator });
  }
  return out;
}

function evalVisibleIf(clauses: ViClause[], answers: Record<string, unknown>): boolean {
  let result = false;
  let lastOp: string | null = null;
  for (const c of clauses) {
    const raw = answers[c.question];
    if (raw === undefined || raw === null) continue;
    const aList = (Array.isArray(raw) ? raw : [raw]).map((a) => String(a).trim().toLowerCase());
    const vList = c.values.map((v) => String(v).trim().toLowerCase());
    let met = false;
    switch (c.condition) {
      case "=": case "==": case "anyof":
        met = aList.some((a) => vList.includes(a)); break;
      case "!=":
        met = !aList.some((a) => vList.includes(a)); break;
      case "notempty":
        met = aList.some((a) => a !== ""); break;
      case "empty":
        met = aList.every((a) => a === ""); break;
      case "contains":
        met = aList.some((a) => vList.some((v) => a === v)); break;
      case "notcontains":
        met = aList.every((a) => vList.every((v) => !a.includes(v))); break;
      default: met = true;
    }
    if (lastOp === "and") result = result && met;
    else if (lastOp === "or") result = result || met;
    else result = met;
    lastOp = c.logicalOperator;
  }
  return result;
}

function pageVisible(page: SurveyPage, answers: Record<string, unknown>): boolean {
  if (!page.visibleIf) return false;
  return evalVisibleIf(parseVisibleIf(page.visibleIf), answers);
}

function elementVisible(el: SurveyElement, answers: Record<string, unknown>): boolean {
  if (!el.visibleIf) return true;
  return evalVisibleIf(parseVisibleIf(el.visibleIf), answers);
}

// ── Share link helpers ───────────────────────────────────────────────────────
function _encodeContent(text: string) {
  try { return btoa(unescape(encodeURIComponent(text))); } catch { return btoa(text); }
}
function _decodeContent(b64: string) {
  try { return decodeURIComponent(escape(atob(b64))); } catch { return ""; }
}

// ── Highlight helper ─────────────────────────────────────────────────────────
function hlText(text: string, q: string): string {
  if (!q) return esc(text);
  const s = String(text || "");
  const lower = s.toLowerCase();
  let result = "", pos = 0, idx: number;
  while ((idx = lower.indexOf(q, pos)) !== -1) {
    result += esc(s.slice(pos, idx));
    result += '<mark class="bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-100 rounded px-0.5">' + esc(s.slice(idx, idx + q.length)) + "</mark>";
    pos = idx + q.length;
  }
  result += esc(s.slice(pos));
  return result;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════════════════════
export default function SurveyPage() {
  const [survey, setSurvey] = useState<SurveyData | null>(null);
  const [pageIdx, setPageIdx] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState("");
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [shareFeedback, setShareFeedback] = useState(false);

  // Preview state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [pvAnswers, setPvAnswers] = useState<Record<string, unknown>>({});
  const [pvPageIdx, setPvPageIdx] = useState(0);
  const [pvHistory, setPvHistory] = useState<number[]>([]);
  const [pvAnsweredPages, setPvAnsweredPages] = useState<Set<number>>(new Set());
  const [pvComplete, setPvComplete] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLTextAreaElement>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);

  // ── Toast ──────────────────────────────────────────────────────────────────
  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }, []);

  // ── Load survey ────────────────────────────────────────────────────────────
  const loadSurvey = useCallback(
    (data: SurveyData) => {
      setSurvey(data);
      setPageIdx(data.pages && data.pages.length > 0 ? 0 : null);
      showToast("Survey loaded — " + (data.pages || []).length + " pages");
    },
    [showToast]
  );

  // ── URL hash loading ───────────────────────────────────────────────────────
  const hashLoaded = useRef(false);
  useEffect(() => {
    if (hashLoaded.current) return;
    hashLoaded.current = true;
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const json = _decodeContent(hash);
    if (!json) return;
    try {
      const data = JSON.parse(json) as SurveyData;
      loadSurvey(data);
    } catch {
      // ignore
    }
  }, [loadSurvey]);

  // ── File handling ──────────────────────────────────────────────────────────
  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as SurveyData;
        loadSurvey(data);
      } catch (err) {
        alert("Invalid JSON: " + (err as Error).message);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  // ── Import modal ───────────────────────────────────────────────────────────
  const doImport = () => {
    const raw = importText.trim();
    if (!raw) return;
    try {
      loadSurvey(JSON.parse(raw) as SurveyData);
      setImportOpen(false);
    } catch (e) {
      alert("Invalid JSON: " + (e as Error).message);
    }
  };

  // ── Share link ─────────────────────────────────────────────────────────────
  const copyShareLink = () => {
    if (!survey) return;
    const json = JSON.stringify(survey);
    const url = window.location.origin + "/survey#" + _encodeContent(json);
    navigator.clipboard.writeText(url).then(() => {
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 2000);
    });
    window.history.replaceState(null, "", "/survey#" + _encodeContent(json));
  };

  // ── Sidebar search ────────────────────────────────────────────────────────
  const pages = (survey && survey.pages) || [];
  const q = searchQuery.toLowerCase();

  const pageSearchHits = (pg: SurveyPage): { icon: string; text: string }[] => {
    const hits: { icon: string; text: string }[] = [];
    for (const el of pg.elements || []) {
      const elTitle = el.title || el.name || "";
      if (elTitle.toLowerCase().includes(q)) {
        hits.push({ icon: "?", text: elTitle });
        continue;
      }
      for (const c of el.choices || []) {
        const cText = getChoiceText(c);
        if (cText.toLowerCase().includes(q)) {
          hits.push({ icon: "o", text: cText });
          break;
        }
      }
    }
    return hits;
  };

  const filteredPages = q
    ? pages
        .map((pg, i) => {
          const pageTitle = pg.title || pg.name || "Untitled page";
          const pageTitleMatches = pageTitle.toLowerCase().includes(q);
          const hits = pageSearchHits(pg);
          return { pg, i, pageTitle, pageTitleMatches, hits };
        })
        .filter((r) => r.pageTitleMatches || r.hits.length > 0)
    : null;

  // ── Preview logic ──────────────────────────────────────────────────────────
  const pvFindNext = (excludeIdx = -1, answers = pvAnswers, answered = pvAnsweredPages) => {
    for (let i = 0; i < pages.length; i++) {
      if (!pageVisible(pages[i], answers)) continue;
      if (answered.has(i)) continue;
      if (i === excludeIdx) continue;
      return i;
    }
    return -1;
  };

  const pvVisEls = (page: SurveyPage) => (page.elements || []).filter((el) => elementVisible(el, pvAnswers));

  const openPreview = () => {
    if (!survey || !pages.length) { showToast("No pages."); return; }
    setPvAnswers({});
    setPvPageIdx(0);
    setPvHistory([]);
    setPvAnsweredPages(new Set());
    setPvComplete(false);
    setPreviewOpen(true);
  };

  const pvNext = () => {
    const newAnswered = new Set(pvAnsweredPages);
    newAnswered.add(pvPageIdx);
    const newHistory = [...pvHistory, pvPageIdx];
    const next = pvFindNext(pvPageIdx, pvAnswers, newAnswered);
    if (next === -1) {
      setPvAnsweredPages(newAnswered);
      setPvHistory(newHistory);
      setPvComplete(true);
      return;
    }
    setPvAnsweredPages(newAnswered);
    setPvHistory(newHistory);
    setPvPageIdx(next);
  };

  const pvBack = () => {
    if (!pvHistory.length) return;
    // Remove answers for current page
    const leaving = pages[pvPageIdx];
    const newAnswers = { ...pvAnswers };
    (leaving?.elements || []).forEach((el) => {
      delete newAnswers[el.name];
      delete newAnswers[el.name + "-Comment"];
    });
    const newAnswered = new Set(pvAnsweredPages);
    newAnswered.delete(pvPageIdx);
    const newHistory = [...pvHistory];
    const prev = newHistory.pop()!;
    setPvAnswers(newAnswers);
    setPvAnsweredPages(newAnswered);
    setPvHistory(newHistory);
    setPvPageIdx(prev);
    setPvComplete(false);
  };

  const pvToggle = (name: string, type: string, val: string) => {
    const newAnswers = { ...pvAnswers };
    if (type === "radiogroup") {
      newAnswers[name] = val;
    } else {
      const prev = Array.isArray(newAnswers[name]) ? (newAnswers[name] as string[]) : [];
      if (prev.includes(val)) {
        newAnswers[name] = prev.filter((v) => v !== val);
      } else {
        newAnswers[name] = [...prev, val];
      }
    }
    setPvAnswers(newAnswers);
  };

  const pvSetText = (name: string, value: string) => {
    setPvAnswers((prev) => ({ ...prev, [name]: value }));
  };

  const isOtherSelected = (name: string, type: string) => {
    const a = pvAnswers[name];
    return type === "radiogroup" ? a === "__other__" : Array.isArray(a) && a.includes("__other__");
  };

  // ── Render question row (read-only sidebar view) ───────────────────────────
  const renderQuestionRow = (el: SurveyElement) => {
    const typeClass =
      el.type === "radiogroup"
        ? "bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400"
        : el.type === "checkbox"
        ? "bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400"
        : "bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400";

    const title = el.title || el.name || "";
    const choices = (el.choices || []).slice(0, 8);
    const moreCount = (el.choices || []).length - 8;

    const tags: string[] = [];
    if (el.inputType && el.inputType !== "text") tags.push(el.inputType);
    if (el.maxLength) tags.push(`max ${el.maxLength} chars`);
    if (el.showNoneItem) tags.push("none item");
    if (el.showOtherItem || el.otherText) tags.push("other item");

    return (
      <div key={el.name} className="bg-card border border-border rounded-lg p-3.5 sm:px-4">
        <div className="flex items-start gap-2.5 mb-1.5">
          <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5 ${typeClass}`}>
            {el.type}
          </span>
          <div className="flex-1 text-[13px] font-medium leading-snug">
            {title}
            {el.isRequired && <span className="text-red-500 ml-1">*</span>}
          </div>
          <span className="font-mono text-[10px] text-muted-foreground flex-shrink-0 mt-0.5">{el.name}</span>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {tags.map((t) => (
              <span key={t} className="font-mono text-[10px] bg-muted border border-border px-2 py-0.5 rounded text-muted-foreground">{t}</span>
            ))}
          </div>
        )}
        {(el.type === "radiogroup" || el.type === "checkbox") && el.choices && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {choices.map((c) => (
              <span key={getChoiceValue(c)} className="text-[11px] px-2.5 py-0.5 bg-muted border border-border rounded-full text-foreground">
                {getChoiceText(c)}
              </span>
            ))}
            {moreCount > 0 && <span className="text-[11px] text-muted-foreground px-2">+{moreCount} more</span>}
          </div>
        )}
        {el.visibleIf && (
          <div className="font-mono text-[10px] text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded mt-1.5 inline-block">
            &#x26A1; {el.visibleIf}
          </div>
        )}
      </div>
    );
  };

  // ── Current page for viewer ────────────────────────────────────────────────
  const currentPage = pageIdx !== null && pages[pageIdx] ? pages[pageIdx] : null;

  // ── Preview current page ───────────────────────────────────────────────────
  const pvPage = previewOpen && !pvComplete ? pages[pvPageIdx] : null;
  const pvVisibleEls = pvPage ? pvVisEls(pvPage) : [];
  const pvIsLast = previewOpen ? pvFindNext(pvPageIdx) === -1 : false;
  const pvDone = pvAnsweredPages.size;
  const pvPct = pages.length > 1 ? Math.round((pvDone / (pages.length - 1)) * 100) : 0;

  return (
    <>
      <main className="flex flex-col" style={{ height: "calc(100vh - 73px)" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-border bg-card flex-shrink-0 gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <p className="font-mono text-[11px] text-blue-600 dark:text-blue-400 flex items-center gap-2 flex-shrink-0">
              <span className="inline-block w-4 h-px bg-blue-600 dark:bg-blue-400" />
              survey viewer
            </p>
            <h1 className="text-lg font-semibold tracking-tight flex-shrink-0">Survey</h1>
            <span className="font-mono text-[11px] bg-muted border border-border px-2.5 py-0.5 rounded text-muted-foreground truncate max-w-[280px]">
              {survey ? surveyTitle(survey) : "no file loaded"}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {shareFeedback && <span className="font-mono text-[11px] text-green-600">Link copied!</span>}
            <button
              className="font-mono text-xs px-3 py-1.5 border border-border rounded-[7px] bg-card text-muted-foreground hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all disabled:opacity-40 disabled:pointer-events-none inline-flex items-center gap-1.5"
              disabled={!survey}
              onClick={copyShareLink}
            >
              Copy Link
            </button>
            <button
              className="font-mono text-xs px-3 py-1.5 border border-border rounded-[7px] bg-card text-muted-foreground hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all inline-flex items-center gap-1.5"
              onClick={() => { setImportOpen(true); setImportText(""); setTimeout(() => importInputRef.current?.focus(), 80); }}
            >
              <Upload className="w-3.5 h-3.5" /> Upload JSON
            </button>
            <button
              className="font-mono text-xs px-3 py-1.5 rounded-[7px] bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 transition-all disabled:opacity-40 disabled:pointer-events-none"
              disabled={!survey}
              onClick={openPreview}
            >
              &#x25B6; Preview
            </button>
          </div>
        </div>

        {/* Main layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-60 flex-shrink-0 border-r border-border bg-card flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex-shrink-0">
              <div className="font-mono text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Pages</div>
              <div className="font-mono text-[10px] text-muted-foreground mt-0.5">
                {q && filteredPages
                  ? `${filteredPages.length} page${filteredPages.length !== 1 ? "s" : ""}, ${filteredPages.reduce((n, r) => n + (r.pageTitleMatches ? 1 : 0) + r.hits.length, 0)} matches`
                  : pages.length > 0
                  ? `${pages.length} page${pages.length !== 1 ? "s" : ""}`
                  : "—"}
              </div>
            </div>
            <div className="px-2.5 py-2 border-b border-border flex-shrink-0">
              <div className="relative flex items-center">
                <Search className="absolute left-2 w-3 h-3 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  className="w-full font-mono text-[11px] py-1 pl-6 pr-7 border border-border rounded-md bg-muted text-foreground outline-none focus:border-blue-500 placeholder:text-muted-foreground"
                  placeholder="search pages & questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Escape") setSearchQuery(""); }}
                />
                {searchQuery && (
                  <button className="absolute right-1.5 text-muted-foreground hover:text-foreground text-sm leading-none p-0.5" onClick={() => setSearchQuery("")}>
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto py-1.5">
              {q && filteredPages ? (
                filteredPages.length === 0 ? (
                  <div className="py-6 text-center text-[11px] text-muted-foreground font-mono">
                    no results for<br />&quot;{q}&quot;
                  </div>
                ) : (
                  filteredPages.map(({ pg, i, pageTitle, hits }) => (
                    <div
                      key={i}
                      className={`flex items-start px-3.5 py-2 cursor-pointer border-l-2 transition-all gap-2 ${
                        i === pageIdx ? "bg-blue-50 dark:bg-blue-950/30 border-l-blue-500" : "border-l-transparent hover:bg-muted"
                      } ${pg.visibleIf ? "opacity-45" : ""}`}
                      onClick={() => { setPageIdx(i); contentAreaRef.current?.scrollTo(0, 0); }}
                    >
                      <span className="font-mono text-[10px] text-muted-foreground min-w-[20px] pt-px">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-foreground truncate" dangerouslySetInnerHTML={{ __html: hlText(pageTitle, q) }} />
                        <div className="font-mono text-[10px] text-muted-foreground mt-0.5">
                          {(pg.elements || []).length} question{(pg.elements || []).length !== 1 ? "s" : ""}
                          {pg.visibleIf ? " · conditional" : ""}
                        </div>
                        {hits.length > 0 && (
                          <div className="flex flex-col gap-0.5 mt-1">
                            {hits.slice(0, 4).map((h, hi) => (
                              <span key={hi} className="font-mono text-[10px] text-muted-foreground truncate flex items-baseline gap-1">
                                <span className="flex-shrink-0 opacity-60">{h.icon}</span>
                                <span className="truncate" dangerouslySetInnerHTML={{ __html: hlText(h.text, q) }} />
                              </span>
                            ))}
                            {hits.length > 4 && (
                              <span className="text-[9px] text-blue-600 dark:text-blue-400 font-mono">+{hits.length - 4} more</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )
              ) : pages.length === 0 ? (
                <div className="py-4 text-center text-xs text-muted-foreground">No pages</div>
              ) : (
                pages.map((pg, i) => (
                  <div
                    key={i}
                    className={`flex items-start px-3.5 py-2 cursor-pointer border-l-2 transition-all gap-2 ${
                      i === pageIdx ? "bg-blue-50 dark:bg-blue-950/30 border-l-blue-500" : "border-l-transparent hover:bg-muted"
                    } ${pg.visibleIf ? "opacity-45" : ""}`}
                    onClick={() => { setPageIdx(i); contentAreaRef.current?.scrollTo(0, 0); }}
                  >
                    <span className="font-mono text-[10px] text-muted-foreground min-w-[20px] pt-px">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs truncate ${i === pageIdx ? "text-blue-600 dark:text-blue-400 font-medium" : "text-foreground"}`}>
                        {pg.title || pg.name || "Untitled page"}
                      </div>
                      <div className="font-mono text-[10px] text-muted-foreground mt-0.5">
                        {(pg.elements || []).length} question{(pg.elements || []).length !== 1 ? "s" : ""}
                        {pg.visibleIf ? " · conditional" : ""}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Content area */}
          <div ref={contentAreaRef} className="flex-1 overflow-y-auto p-6 sm:p-9 bg-background">
            {!survey ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-6 text-muted-foreground">
                <div className="text-[40px] mb-4">&#x1F4CB;</div>
                <h2 className="text-base font-medium text-foreground mb-2">No survey loaded</h2>
                <p className="text-[13px] mb-5">Upload a SurveyJS-compatible JSON file to browse pages and preview the survey.</p>
                <div
                  className="border-2 border-dashed border-border rounded-[10px] p-8 mb-4 cursor-pointer max-w-[400px] w-full hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  <input ref={fileInputRef} type="file" accept=".json,application/json" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
                  <div className="text-2xl mb-2">&#x2B06;</div>
                  <div className="text-[13px] text-muted-foreground">
                    Click to choose a .json file<br />or drag and drop here
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  or{" "}
                  <button className="text-blue-600 dark:text-blue-400 hover:underline" onClick={() => { setImportOpen(true); setImportText(""); }}>
                    paste JSON directly
                  </button>
                </div>
              </div>
            ) : currentPage ? (
              <div>
                <div className="mb-6">
                  <p className="font-mono text-[11px] text-blue-600 dark:text-blue-400 flex items-center gap-2 mb-2.5">
                    <span className="inline-block w-4 h-px bg-blue-600 dark:bg-blue-400" />
                    page {pageIdx! + 1} of {pages.length}
                  </p>
                  {currentPage.title && (
                    <h2 className="text-xl font-semibold tracking-tight mb-1">{currentPage.title}</h2>
                  )}
                  <div className="font-mono text-[11px] text-muted-foreground flex flex-wrap gap-4 mt-2">
                    <span>&#x1F3F7; {currentPage.name || ""}</span>
                    <span>&#x2753; {(currentPage.elements || []).length} question{(currentPage.elements || []).length !== 1 ? "s" : ""}</span>
                  </div>
                  {currentPage.description && (
                    <p className="text-[13px] text-muted-foreground mt-2 leading-relaxed">{currentPage.description}</p>
                  )}
                  {currentPage.visibleIf && (
                    <div className="font-mono text-[11px] text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-2.5 py-1 rounded mt-2.5 inline-flex items-center gap-1.5">
                      &#x26A1; visible if: {currentPage.visibleIf}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-3.5 mt-5">
                  {(currentPage.elements || []).length === 0 ? (
                    <p className="text-muted-foreground text-[13px] italic py-3">No questions on this page.</p>
                  ) : (
                    (currentPage.elements || []).map((el) => renderQuestionRow(el))
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </main>

      {/* ── Import modal ──────────────────────────────────────────────────── */}
      {importOpen && (
        <div
          className="fixed inset-0 bg-black/35 flex items-center justify-center z-[1000]"
          onClick={(e) => { if (e.target === e.currentTarget) setImportOpen(false); }}
        >
          <div className="bg-card rounded-[10px] w-[min(600px,95vw)] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-semibold">Paste Survey JSON</h3>
              <button className="text-muted-foreground hover:text-foreground text-xl leading-none p-1" onClick={() => setImportOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
              SurveyJS-compatible JSON
            </label>
            <textarea
              ref={importInputRef}
              className="w-full h-[260px] font-mono text-[11px] p-2.5 border border-border rounded-md bg-muted resize-y outline-none focus:border-blue-500 text-foreground"
              placeholder='{"title": "My Survey", "pages": [...]}'
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-3.5">
              <button className="font-mono text-xs px-3 py-1.5 border border-border rounded-[7px] bg-card text-muted-foreground hover:border-blue-500 hover:text-blue-600 transition-all" onClick={() => setImportOpen(false)}>Cancel</button>
              <button className="font-mono text-xs px-3 py-1.5 rounded-[7px] bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 transition-all" onClick={doImport}>Load</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Preview overlay ───────────────────────────────────────────────── */}
      {previewOpen && (
        <div className="fixed inset-0 bg-background z-[2000] flex flex-col">
          {/* Top bar */}
          <div className="flex-shrink-0 flex items-center gap-4 px-4 sm:px-8 h-14 border-b border-border bg-card">
            <div className="text-sm font-semibold flex-1 truncate">{surveyTitle(survey)}</div>
            <div className="font-mono text-[11px] text-muted-foreground flex-shrink-0">
              {pvComplete ? "Done" : `${pvDone + 1} / ~${pages.length}`}
            </div>
            <button
              className="text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 text-xl leading-none p-1 rounded-md transition-colors flex-shrink-0"
              onClick={() => setPreviewOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* Progress bar */}
          <div className="flex-shrink-0 h-[3px] bg-border">
            <div className="h-full bg-blue-600 transition-[width] duration-300" style={{ width: pvComplete ? "100%" : Math.min(pvPct, 99) + "%" }} />
          </div>
          {/* Body */}
          <div className="flex-1 overflow-y-auto flex justify-center px-6 py-10 pb-32">
            <div className="w-full max-w-[640px]">
              {pvComplete ? (
                <div className="text-center py-16">
                  <div className="text-5xl mb-4">&#x2705;</div>
                  <h2 className="text-[22px] font-semibold mb-2">Survey Complete</h2>
                  <p className="text-muted-foreground text-sm">
                    You have reached the end of the survey.<br />Close to return to the viewer.
                  </p>
                </div>
              ) : pvPage ? (
                <>
                  <p className="font-mono text-[11px] text-blue-600 dark:text-blue-400 flex items-center gap-2 mb-3">
                    <span className="inline-block w-4 h-px bg-blue-600 dark:bg-blue-400" />
                    {stripMeta(pvPage.name || "")}
                  </p>
                  {pvPage.title && (
                    <h2 className="text-[22px] font-semibold tracking-tight mb-1.5">{stripMeta(pvPage.title)}</h2>
                  )}
                  {pvPage.description && (
                    <p className="text-muted-foreground text-sm mb-8 leading-relaxed">{stripMeta(pvPage.description)}</p>
                  )}
                  <div className="flex flex-col gap-7">
                    {pvVisibleEls.map((el) => {
                      const title = stripMeta(el.title || el.name || "");
                      const desc = el.description ? stripMeta(el.description) : "";
                      return (
                        <div key={el.name}>
                          <div className="text-[15px] font-medium leading-snug mb-1">
                            {title}
                            {el.isRequired && <span className="text-red-500 ml-1">*</span>}
                          </div>
                          {desc && <div className="text-[13px] text-muted-foreground mb-3">{desc}</div>}

                          {(el.type === "radiogroup" || el.type === "checkbox") && (
                            <div className="flex flex-col gap-2">
                              {(el.choices || []).map((c) => {
                                const cv = getChoiceValue(c);
                                const ct = stripMeta(getChoiceText(c));
                                const itype = el.type === "radiogroup" ? "radio" : "checkbox";
                                const selected =
                                  el.type === "radiogroup"
                                    ? pvAnswers[el.name] === cv
                                    : Array.isArray(pvAnswers[el.name]) && (pvAnswers[el.name] as string[]).includes(cv);
                                return (
                                  <label
                                    key={cv}
                                    className={`flex items-start gap-3 px-3.5 py-2.5 border rounded-lg cursor-pointer transition-all select-none ${
                                      selected ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30" : "border-border hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20"
                                    }`}
                                    onClick={() => pvToggle(el.name, el.type, cv)}
                                  >
                                    <input type={itype} name={`pv_${el.name}`} checked={selected} readOnly className="w-4 h-4 flex-shrink-0 mt-0.5 accent-blue-600 pointer-events-none" />
                                    <span className="text-sm leading-snug">{ct}</span>
                                  </label>
                                );
                              })}
                              {el.showNoneItem && (
                                <label
                                  className={`flex items-start gap-3 px-3.5 py-2.5 border rounded-lg cursor-pointer transition-all select-none ${
                                    (el.type === "radiogroup" ? pvAnswers[el.name] === "__none__" : Array.isArray(pvAnswers[el.name]) && (pvAnswers[el.name] as string[]).includes("__none__"))
                                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                                      : "border-border hover:border-blue-500"
                                  }`}
                                  onClick={() => pvToggle(el.name, el.type, "__none__")}
                                >
                                  <input type={el.type === "radiogroup" ? "radio" : "checkbox"} name={`pv_${el.name}`} checked={el.type === "radiogroup" ? pvAnswers[el.name] === "__none__" : Array.isArray(pvAnswers[el.name]) && (pvAnswers[el.name] as string[]).includes("__none__")} readOnly className="w-4 h-4 flex-shrink-0 mt-0.5 accent-blue-600 pointer-events-none" />
                                  <span className="text-sm leading-snug">{stripMeta(el.noneText || "None")}</span>
                                </label>
                              )}
                              {el.showOtherItem && (
                                <>
                                  <label
                                    className={`flex items-start gap-3 px-3.5 py-2.5 border rounded-lg cursor-pointer transition-all select-none ${
                                      isOtherSelected(el.name, el.type)
                                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                                        : "border-border hover:border-blue-500"
                                    }`}
                                    onClick={() => pvToggle(el.name, el.type, "__other__")}
                                  >
                                    <input type={el.type === "radiogroup" ? "radio" : "checkbox"} name={`pv_${el.name}`} checked={isOtherSelected(el.name, el.type)} readOnly className="w-4 h-4 flex-shrink-0 mt-0.5 accent-blue-600 pointer-events-none" />
                                    <span className="text-sm leading-snug">{stripMeta(el.otherText || "Other")}</span>
                                  </label>
                                  {isOtherSelected(el.name, el.type) && (
                                    <input
                                      type="text"
                                      className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-blue-500 bg-card text-foreground"
                                      placeholder={stripMeta(el.otherPlaceholder || "")}
                                      value={String(pvAnswers[el.name + "-Comment"] || "")}
                                      onChange={(e) => pvSetText(el.name + "-Comment", e.target.value)}
                                    />
                                  )}
                                </>
                              )}
                            </div>
                          )}

                          {el.type === "text" && el.inputType === "range" && (
                            <div className="flex flex-col gap-2">
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{el.min ?? 0}</span>
                                <span>{el.max ?? 100}</span>
                              </div>
                              <input
                                type="range"
                                min={Number(el.min ?? 0)}
                                max={Number(el.max ?? 100)}
                                value={Number(pvAnswers[el.name] ?? el.min ?? 0)}
                                onChange={(e) => pvSetText(el.name, e.target.value)}
                                className="w-full accent-blue-600 cursor-pointer"
                              />
                              <div className="text-center font-mono text-[13px] text-blue-600 dark:text-blue-400 font-medium">
                                {String(pvAnswers[el.name] ?? el.min ?? 0)}
                              </div>
                            </div>
                          )}

                          {el.type === "text" && el.inputType !== "range" && (
                            <input
                              type={el.inputType || "text"}
                              className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-blue-500 bg-card text-foreground"
                              placeholder={stripMeta(el.placeholder || "")}
                              maxLength={el.maxLength}
                              min={el.min != null ? String(el.min) : undefined}
                              max={el.max != null ? String(el.max) : undefined}
                              value={String(pvAnswers[el.name] || "")}
                              onChange={(e) => pvSetText(el.name, e.target.value)}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : null}
            </div>
          </div>
          {/* Footer */}
          <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 sm:px-8 py-4 flex items-center justify-between z-[2001]">
            <button
              className="font-mono text-xs px-3 py-1.5 border border-border rounded-[7px] bg-card text-muted-foreground hover:border-blue-500 hover:text-blue-600 transition-all disabled:opacity-40 disabled:pointer-events-none"
              disabled={pvHistory.length === 0}
              onClick={pvBack}
            >
              &#x2190; Back
            </button>
            <div className="font-mono text-[11px] text-muted-foreground">
              {pvComplete ? "" : `${pvVisibleEls.length} question${pvVisibleEls.length !== 1 ? "s" : ""} on this page`}
            </div>
            {!pvComplete && (
              <button
                className="font-mono text-xs px-3 py-1.5 rounded-[7px] bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 transition-all"
                onClick={pvNext}
              >
                {pvIsLast ? "Submit \u2713" : "Next \u2192"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      <div className={`fixed bottom-6 right-6 bg-foreground text-background px-4 py-2.5 rounded-lg text-[13px] z-[9999] transition-all pointer-events-none ${toast ? "translate-y-0 opacity-100" : "translate-y-[60px] opacity-0"}`}>
        {toast}
      </div>
    </>
  );
}
