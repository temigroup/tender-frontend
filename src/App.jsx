import { useState, useEffect, useCallback } from "react";

const API = "http://localhost:8000/api";

async function api(path, options = {}) {
  const token = localStorage.getItem("tcc_token");
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, { ...options, headers });
  if (res.status === 401) { localStorage.removeItem("tcc_token"); window.location.reload(); return null; }
  if (!res.ok) { const err = await res.json().catch(() => ({ detail: "Request failed" })); throw new Error(err.detail || `Error ${res.status}`); }
  return res.json();
}

const Icon = ({ name, size = 20 }) => {
  const i = {
    dashboard: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
    rfp: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    alert: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    zap: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    globe: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
    star: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    ai: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><path d="M16 14H8a4 4 0 0 0-4 4v2h16v-2a4 4 0 0 0-4-4z"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    logout: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    user: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    download: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    phone: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
    mail: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    filter: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
    target: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  };
  return i[name] || null;
};

const P = { bg: "#060a10", bgCard: "#0c1220", bgHover: "#131d2e", bgInput: "#080e18", border: "#172033", borderFocus: "#f59e0b", text: "#e2e8f0", textMuted: "#64748b", textDim: "#3e4c63", accent: "#f59e0b", accentDark: "#b45309", green: "#10b981", greenDim: "#065f46", red: "#ef4444", redDim: "#7f1d1d", blue: "#3b82f6", blueDim: "#1e3a5f", purple: "#8b5cf6" };
const font = "'IBM Plex Mono', 'JetBrains Mono', monospace";
const fontBody = "'DM Sans', 'Segoe UI', system-ui, sans-serif";
const inputStyle = { width: "100%", padding: "10px 12px", background: P.bgInput, border: `1px solid ${P.border}`, borderRadius: 8, color: P.text, fontSize: 13, fontFamily: fontBody, outline: "none", boxSizing: "border-box" };

const VELANI_PROVINCES = ["Gauteng", "National", "Limpopo", "Mpumalanga", "North West", "Free State"];
const VELANI_CATEGORIES = ["cleaning", "maintenance", "water", "sanitation", "grass", "landscap", "PPE", "protective", "toilet", "hygiene", "supply and delivery", "janitorial"];

const statusColor = (s) => s === "open" ? P.green : s === "closing_soon" ? P.accent : P.textMuted;
const statusLabel = (s) => ({ open: "OPEN", closing_soon: "CLOSING SOON", awaiting_quotes: "AWAITING", sourcing: "SOURCING", quoted: "QUOTED", awarded: "AWARDED", closed: "CLOSED" }[s] || s?.toUpperCase() || "—");
const daysUntil = (d) => { if (!d) return null; const diff = Math.ceil((new Date(d) - new Date()) / 86400000); return diff; };
const daysLabel = (d) => { const n = daysUntil(d); if (n === null) return "—"; if (n < 0) return "Closed"; if (n === 0) return "Today!"; if (n === 1) return "Tomorrow"; return `${n} days`; };
const urgencyColor = (d) => { const n = daysUntil(d); if (n === null || n < 0) return P.textMuted; if (n <= 2) return P.red; if (n <= 7) return P.accent; return P.green; };

const matchColor = (s) => s >= 50 ? P.green : s >= 40 ? P.blue : s >= 35 ? P.accent : P.textMuted;
const matchBg = (s) => s >= 50 ? P.greenDim : s >= 40 ? P.blueDim : s >= 35 ? `${P.accent}20` : `${P.textDim}33`;
const matchLabel = (s) => s >= 50 ? "STRONG" : s >= 40 ? "GOOD" : s >= 35 ? "POSSIBLE" : "LOW";

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login"); const [fullName, setFullName] = useState(""); const [company, setCompany] = useState("Velani Goods and Services");
  const handleSubmit = async () => {
    setError(""); setLoading(true);
    try {
      if (mode === "register") { await api("/auth/register", { method: "POST", body: JSON.stringify({ email, password, full_name: fullName, company }) }); setMode("login"); alert("Account created!"); setLoading(false); return; }
      const data = await api("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      localStorage.setItem("tcc_token", data.access_token); onLogin();
    } catch (e) { setError(e.message); }
    setLoading(false);
  };
  return (
    <div style={{ fontFamily: fontBody, background: P.bg, color: P.text, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 420, background: P.bgCard, borderRadius: 16, border: `1px solid ${P.border}`, padding: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: `linear-gradient(135deg, ${P.accent}, ${P.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="target" size={20} /></div>
          <div><div style={{ fontFamily: font, fontWeight: 700, fontSize: 11, color: P.accent, letterSpacing: 3, textTransform: "uppercase" }}>Velani</div>
          <div style={{ fontFamily: font, fontWeight: 700, fontSize: 16 }}>Tender Command Centre</div></div>
        </div>
        <div style={{ fontSize: 13, color: P.textMuted, margin: "16px 0 28px" }}>{mode === "login" ? "Sign in to your account" : "Create a new account"}</div>
        {error && <div style={{ background: P.redDim, color: P.red, padding: "8px 12px", borderRadius: 8, fontSize: 12, marginBottom: 16 }}>{error}</div>}
        {mode === "register" && (<>
          <label style={{ fontSize: 11, color: P.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, display: "block" }}>Full Name</label>
          <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" style={{ ...inputStyle, marginBottom: 14 }} />
          <label style={{ fontSize: 11, color: P.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, display: "block" }}>Company</label>
          <input value={company} onChange={e => setCompany(e.target.value)} style={{ ...inputStyle, marginBottom: 14 }} />
        </>)}
        <label style={{ fontSize: 11, color: P.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, display: "block" }}>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@velani.co.za" type="email" style={{ ...inputStyle, marginBottom: 14 }} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
        <label style={{ fontSize: 11, color: P.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, display: "block" }}>Password</label>
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Min 8 characters" style={{ ...inputStyle, marginBottom: 24 }} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
        <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", padding: "12px 24px", background: `linear-gradient(135deg, ${P.accent}, ${P.accentDark})`, color: "#000", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: loading ? "wait" : "pointer", fontFamily: fontBody }}>{loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}</button>
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: P.textMuted }}>{mode === "login" ? "No account? " : "Have an account? "}<span onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }} style={{ color: P.accent, cursor: "pointer" }}>{mode === "login" ? "Register" : "Sign In"}</span></div>
      </div>
    </div>
  );
}

export default function App() {
  const [authed, setAuthed] = useState(!!localStorage.getItem("tcc_token"));
  const [tab, setTab] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [tenders, setTenders] = useState([]);
  const [rfps, setRfps] = useState([]);
  const [sources, setSources] = useState([]);
  const [closingSoon, setClosingSoon] = useState([]);
  const [showNewRfp, setShowNewRfp] = useState(false);
  const [tenderFilter, setTenderFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("");
  const [velaniOnly, setVelaniOnly] = useState(false);
  const [selectedTender, setSelectedTender] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [newRfp, setNewRfp] = useState({ client_name: "", product: "", quantity: "", deadline: "" });
  const [savedTenders, setSavedTenders] = useState(new Set());
  const [loadingData, setLoadingData] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => { const l = document.createElement("link"); l.href = "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&display=swap"; l.rel = "stylesheet"; document.head.appendChild(l); }, []);
  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const loadData = useCallback(async () => {
    if (!authed) return; setLoadingData(true);
    try {
      const [me, st, src] = await Promise.all([api("/auth/me"), api("/dashboard/stats"), api("/sources/")]);
      setUser(me); setStats(st); setSources(src);
      let tenderUrl = `/tenders/?per_page=50`;
      if (tenderFilter !== "all") tenderUrl += `&status=${tenderFilter}`;
      if (searchQuery) tenderUrl += `&search=${searchQuery}`;
      if (provinceFilter) tenderUrl += `&province=${provinceFilter}`;
      const [t, r, cs] = await Promise.all([api(tenderUrl), api("/rfp/"), api("/tenders/closing-soon?days=7")]);
      setTenders(t); setRfps(r); setClosingSoon(cs);
    } catch (e) { console.error("Load error:", e); }
    setLoadingData(false);
  }, [authed, tenderFilter, searchQuery, provinceFilter]);

  useEffect(() => { loadData(); }, [loadData]);

  const filteredTenders = velaniOnly ? tenders.filter(t => t.ai_match_score >= 38) : tenders;

  const handleAddRfp = async () => {
    if (!newRfp.client_name || !newRfp.product || !newRfp.quantity) return;
    try { const body = { ...newRfp }; if (body.deadline) body.deadline = new Date(body.deadline).toISOString(); else delete body.deadline; await api("/rfp/", { method: "POST", body: JSON.stringify(body) }); setNewRfp({ client_name: "", product: "", quantity: "", deadline: "" }); setShowNewRfp(false); showToast("RFP created"); loadData(); } catch (e) { showToast(e.message, "error"); }
  };
  const handleAiAnalyse = async (tender) => { setAiLoading(true); setAiResult(null); try { const d = await api(`/tenders/${tender.id}/analyse`, { method: "POST" }); setAiResult(d.analysis); } catch (e) { setAiResult("AI analysis failed: " + e.message); } setAiLoading(false); };
  const handleAiPricing = async (rfp) => { setAiLoading(true); setAiResult(null); try { const d = await api(`/rfp/${rfp.id}/ai-pricing`, { method: "POST" }); setAiResult(d.pricing_report); loadData(); } catch (e) { setAiResult("Pricing failed: " + e.message); } setAiLoading(false); };
  const toggleSaved = async (tender) => { try { if (savedTenders.has(tender.id)) { await api(`/tenders/${tender.id}/save`, { method: "DELETE" }); setSavedTenders(prev => { const n = new Set(prev); n.delete(tender.id); return n; }); showToast("Removed"); } else { await api(`/tenders/${tender.id}/save`, { method: "POST" }); setSavedTenders(prev => new Set(prev).add(tender.id)); showToast("Saved"); } } catch (e) { showToast(e.message, "error"); } };
  const handleTriggerScrape = async (sourceId) => { try { const d = await api(`/sources/${sourceId}/trigger`, { method: "POST" }); showToast(`${d.tenders_found} tenders found`); loadData(); } catch (e) { showToast("Scrape failed: " + e.message, "error"); } };

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  const parseContact = (c) => {
    if (!c) return {};
    const parts = c.split(" - ");
    return { name: parts[0] || "", email: parts[1] || "", phone: parts[2] || "" };
  };

  return (
    <div style={{ fontFamily: fontBody, background: P.bg, color: P.text, minHeight: "100vh", display: "flex" }}>
      {toast && <div style={{ position: "fixed", top: 20, right: 20, zIndex: 999, padding: "10px 20px", borderRadius: 8, background: toast.type === "error" ? P.redDim : P.greenDim, color: toast.type === "error" ? P.red : P.green, fontSize: 13, fontWeight: 600, border: `1px solid ${toast.type === "error" ? P.red : P.green}30` }}>{toast.msg}</div>}

      {/* SIDEBAR */}
      <aside style={{ width: 240, background: P.bgCard, borderRight: `1px solid ${P.border}`, display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ padding: "20px 16px 16px", borderBottom: `1px solid ${P.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${P.accent}, ${P.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="target" size={16} /></div>
            <div><div style={{ fontFamily: font, fontWeight: 700, fontSize: 10, color: P.accent, letterSpacing: 3, textTransform: "uppercase" }}>Velani</div>
            <div style={{ fontFamily: font, fontWeight: 700, fontSize: 14 }}>TCC</div></div>
          </div>
          <div style={{ fontSize: 11, color: P.textMuted, display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: P.green, display: "inline-block", boxShadow: `0 0 8px ${P.green}` }} />System Online | B-BBEE L1</div>
        </div>
        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {[{ id: "dashboard", icon: "dashboard", label: "Dashboard" }, { id: "discovery", icon: "globe", label: "Tender Discovery" }, { id: "rfp", icon: "rfp", label: "RFP Pricing" }, { id: "sources", icon: "zap", label: "Harvest Sources" }].map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setSelectedTender(null); setAiResult(null); }} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 14px", border: "none", borderRadius: 8, cursor: "pointer", marginBottom: 4, background: tab === t.id ? `${P.accent}18` : "transparent", color: tab === t.id ? P.accent : P.textMuted, fontFamily: fontBody, fontSize: 14, fontWeight: tab === t.id ? 600 : 400, borderLeft: tab === t.id ? `3px solid ${P.accent}` : "3px solid transparent" }}>
              <Icon name={t.icon} size={18} />{t.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: "16px 14px", borderTop: `1px solid ${P.border}` }}>
          {user && <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}><Icon name="user" size={14} /><span style={{ fontSize: 12, fontWeight: 500 }}>{user.full_name}</span></div>}
          <button onClick={() => { localStorage.removeItem("tcc_token"); setAuthed(false); }} style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: P.textMuted, fontSize: 12, cursor: "pointer", fontFamily: fontBody, padding: 0 }}><Icon name="logout" size={14} /> Sign Out</button>
        </div>
      </aside>

      <main style={{ flex: 1, overflow: "auto", maxHeight: "100vh" }}>

        {/* DASHBOARD */}
        {tab === "dashboard" && (
          <div style={{ padding: 28 }}>
            <h1 style={{ fontFamily: font, fontSize: 22, fontWeight: 700, margin: "0 0 6px" }}>Dashboard</h1>
            <p style={{ color: P.textMuted, fontSize: 13, margin: "0 0 28px" }}>Velani Goods & Services — Tender Operations</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
              {[{ label: "Active Tenders", value: stats?.total_active_tenders ?? "—", icon: "globe", color: P.blue, sub: `24h: +${stats?.tenders_found_24h ?? 0}` },
                { label: "Open RFPs", value: stats?.open_rfps ?? "—", icon: "rfp", color: P.accent, sub: `${stats?.quotes_received ?? 0} quotes` },
                { label: "Closing This Week", value: stats?.closing_this_week ?? "—", icon: "alert", color: P.red, sub: "Action required" },
                { label: "Sources Active", value: `${stats?.active_sources ?? 0}/${stats?.total_sources ?? 0}`, icon: "zap", color: P.green, sub: "Auto-scanning" }
              ].map((k, i) => (
                <div key={i} style={{ background: P.bgCard, borderRadius: 12, padding: 20, border: `1px solid ${P.border}`, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 14, right: 14, opacity: 0.12, color: k.color }}><Icon name={k.icon} size={40} /></div>
                  <div style={{ fontSize: 11, color: P.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{k.label}</div>
                  <div style={{ fontFamily: font, fontSize: 32, fontWeight: 700, color: k.color, margin: "8px 0 4px" }}>{String(k.value)}</div>
                  <div style={{ fontSize: 12, color: P.textDim }}>{k.sub}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={{ background: P.bgCard, borderRadius: 12, border: `1px solid ${P.border}`, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}><Icon name="alert" size={16} /><span style={{ fontFamily: font, fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Closing Soon</span>{closingSoon.length > 0 && <span style={{ marginLeft: "auto", fontSize: 10, color: P.red, fontWeight: 700, background: P.redDim, padding: "2px 8px", borderRadius: 10 }}>{closingSoon.length} URGENT</span>}</div>
                {closingSoon.length === 0 && <div style={{ fontSize: 13, color: P.textMuted, padding: "20px 0", textAlign: "center" }}>No tenders closing this week</div>}
                {closingSoon.slice(0, 6).map(t => (
                  <div key={t.id} style={{ padding: "10px 0", borderBottom: `1px solid ${P.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onClick={() => { setTab("discovery"); setSelectedTender(t); }}>
                    <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 12, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.title}</div><div style={{ fontSize: 11, color: P.textMuted }}>{t.province} | {t.category}</div></div>
                    <div style={{ fontFamily: font, fontSize: 12, color: urgencyColor(t.closing_date), fontWeight: 700, marginLeft: 12, whiteSpace: "nowrap" }}>{daysLabel(t.closing_date)}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: P.bgCard, borderRadius: 12, border: `1px solid ${P.border}`, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}><Icon name="rfp" size={16} /><span style={{ fontFamily: font, fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Active RFPs</span>
                  <button onClick={() => { setTab("rfp"); setShowNewRfp(true); }} style={{ marginLeft: "auto", background: P.accent, color: "#000", border: "none", borderRadius: 6, padding: "4px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}><Icon name="plus" size={14} /> New</button></div>
                {rfps.length === 0 && <div style={{ fontSize: 13, color: P.textMuted, padding: "20px 0", textAlign: "center" }}>No RFPs yet</div>}
                {rfps.slice(0, 5).map(r => (
                  <div key={r.id} style={{ padding: "10px 0", borderBottom: `1px solid ${P.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div><div style={{ fontSize: 12, fontWeight: 500 }}>{r.product}</div><div style={{ fontSize: 11, color: P.textMuted }}>{r.client_name} — {r.quantity}</div></div>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 10, color: statusColor(r.status), background: `${statusColor(r.status)}18` }}>{statusLabel(r.status)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TENDER DISCOVERY */}
        {tab === "discovery" && !selectedTender && (
          <div style={{ padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div><h1 style={{ fontFamily: font, fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>Tender Discovery</h1>
                <p style={{ color: P.textMuted, fontSize: 13, margin: 0 }}>{filteredTenders.length} tenders{velaniOnly ? " matching Velani services" : ""} from {sources.length} sources</p></div>
              <button onClick={() => setVelaniOnly(!velaniOnly)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", border: `1px solid ${velaniOnly ? P.accent : P.border}`, borderRadius: 8, background: velaniOnly ? `${P.accent}20` : "transparent", color: velaniOnly ? P.accent : P.textMuted, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: fontBody }}>
                <Icon name="target" size={16} />{velaniOnly ? "Velani Matches ON" : "Show Velani Matches"}
              </button>
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200, position: "relative" }}><div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: P.textMuted }}><Icon name="search" size={16} /></div>
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by keyword..." style={{ ...inputStyle, paddingLeft: 38 }} /></div>
              <select value={provinceFilter} onChange={e => setProvinceFilter(e.target.value)} style={{ ...inputStyle, width: 160, cursor: "pointer", appearance: "auto" }}>
                <option value="">All Provinces</option>
                {VELANI_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                <option value="Western Cape">Western Cape</option>
                <option value="Eastern Cape">Eastern Cape</option>
                <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                <option value="Northern Cape">Northern Cape</option>
              </select>
              {["all", "open", "closing_soon"].map(f => (<button key={f} onClick={() => setTenderFilter(f)} style={{ padding: "8px 14px", border: `1px solid ${tenderFilter === f ? P.accent : P.border}`, borderRadius: 8, background: tenderFilter === f ? `${P.accent}18` : "transparent", color: tenderFilter === f ? P.accent : P.textMuted, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: fontBody, textTransform: "uppercase" }}>{f === "all" ? "All" : f === "open" ? "Open" : "Closing Soon"}</button>))}
            </div>

            {/* Quick keyword buttons */}
            <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, color: P.textDim, padding: "4px 0", marginRight: 4 }}>Quick:</span>
              {["cleaning", "maintenance", "water", "supply and delivery", "PPE", "grass", "sanitation"].map(kw => (
                <button key={kw} onClick={() => setSearchQuery(kw)} style={{ padding: "4px 10px", border: `1px solid ${searchQuery === kw ? P.accent : P.border}`, borderRadius: 12, background: searchQuery === kw ? `${P.accent}15` : "transparent", color: searchQuery === kw ? P.accent : P.textMuted, fontSize: 11, cursor: "pointer", fontFamily: fontBody }}>{kw}</button>
              ))}
              {searchQuery && <button onClick={() => setSearchQuery("")} style={{ padding: "4px 10px", border: "none", borderRadius: 12, background: `${P.red}20`, color: P.red, fontSize: 11, cursor: "pointer", fontFamily: fontBody }}>Clear</button>}
            </div>

            {!loadingData && filteredTenders.length === 0 && <div style={{ textAlign: "center", padding: 40, color: P.textMuted }}>No tenders found. Try adjusting filters.</div>}
            {filteredTenders.map(t => {
              const contact = parseContact(t.contact_info);
              return (
              <div key={t.id} style={{ background: P.bgCard, borderRadius: 10, border: `1px solid ${P.border}`, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", marginBottom: 6, transition: "border-color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = P.accent} onMouseLeave={e => e.currentTarget.style.borderColor = P.border} onClick={() => { setSelectedTender(t); setAiResult(null); }}>
                {/* Match Score */}
                <div style={{ width: 52, height: 52, borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: matchBg(t.ai_match_score), color: matchColor(t.ai_match_score), flexShrink: 0 }}>
                  <div style={{ fontFamily: font, fontSize: 18, fontWeight: 700, lineHeight: 1 }}>{Math.round(t.ai_match_score)}</div>
                  <div style={{ fontSize: 7, textTransform: "uppercase", letterSpacing: 1, marginTop: 1 }}>{matchLabel(t.ai_match_score)}</div>
                </div>
                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.title}</div>
                  <div style={{ display: "flex", gap: 8, fontSize: 11, color: P.textMuted, flexWrap: "wrap", alignItems: "center" }}>
                    <span style={{ color: statusColor(t.status), fontWeight: 600, background: `${statusColor(t.status)}15`, padding: "1px 6px", borderRadius: 4, fontSize: 10 }}>{statusLabel(t.status)}</span>
                    {t.province && <span>{t.province}</span>}
                    {t.category && <span style={{ color: P.textDim }}>| {t.category}</span>}
                  </div>
                </div>
                {/* Right info */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  {t.closing_date && <div style={{ fontFamily: font, fontSize: 12, color: urgencyColor(t.closing_date), fontWeight: 700 }}>{daysLabel(t.closing_date)}</div>}
                  <div style={{ fontSize: 10, color: P.textDim, marginTop: 2 }}>{t.closing_date ? new Date(t.closing_date).toLocaleDateString() : ""}</div>
                  {t.value_estimate && <div style={{ fontFamily: font, fontSize: 12, color: P.accent, fontWeight: 600, marginTop: 2 }}>{t.value_estimate}</div>}
                </div>
                {/* Actions */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
                  <button onClick={e => { e.stopPropagation(); toggleSaved(t); }} style={{ background: savedTenders.has(t.id) ? `${P.accent}30` : "transparent", border: `1px solid ${P.border}`, borderRadius: 6, padding: 5, cursor: "pointer", color: savedTenders.has(t.id) ? P.accent : P.textMuted }}><Icon name="star" size={14} /></button>
                  {t.document_url && <a href={t.document_url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ background: `${P.blue}18`, border: `1px solid ${P.border}`, borderRadius: 6, padding: 5, cursor: "pointer", color: P.blue, display: "flex" }}><Icon name="download" size={14} /></a>}
                </div>
              </div>);
            })}
          </div>
        )}

        {/* TENDER DETAIL */}
        {tab === "discovery" && selectedTender && (() => {
          const contact = parseContact(selectedTender.contact_info);
          return (
          <div style={{ padding: 28 }}>
            <button onClick={() => { setSelectedTender(null); setAiResult(null); }} style={{ background: "transparent", border: "none", color: P.textMuted, cursor: "pointer", fontSize: 13, marginBottom: 16, fontFamily: fontBody }}>← Back to Discovery</button>
            <div style={{ background: P.bgCard, borderRadius: 12, border: `1px solid ${P.border}`, padding: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 10, color: statusColor(selectedTender.status), background: `${statusColor(selectedTender.status)}18` }}>{statusLabel(selectedTender.status)}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 10, color: matchColor(selectedTender.ai_match_score), background: matchBg(selectedTender.ai_match_score) }}>Match: {Math.round(selectedTender.ai_match_score)} — {matchLabel(selectedTender.ai_match_score)}</span>
                  </div>
                  <h2 style={{ fontFamily: font, fontSize: 18, fontWeight: 700, margin: "0 0 8px", lineHeight: 1.4 }}>{selectedTender.title}</h2>
                  {selectedTender.description && <p style={{ fontSize: 13, color: P.textMuted, lineHeight: 1.5, margin: "0 0 16px" }}>{selectedTender.description}</p>}
                </div>
                {selectedTender.value_estimate && <div style={{ fontFamily: font, fontSize: 22, fontWeight: 700, color: P.accent, marginLeft: 20 }}>{selectedTender.value_estimate}</div>}
              </div>

              {/* Detail grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
                {[{ l: "Province", v: selectedTender.province || "—" }, { l: "Category", v: selectedTender.category || "—" }, { l: "Closing Date", v: selectedTender.closing_date ? `${new Date(selectedTender.closing_date).toLocaleDateString()} (${daysLabel(selectedTender.closing_date)})` : "—" }, { l: "B-BBEE", v: selectedTender.bbbee_requirement || "Not specified" }].map((f, i) => (
                  <div key={i} style={{ background: P.bgInput, borderRadius: 8, padding: 12 }}><div style={{ fontSize: 10, color: P.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{f.l}</div><div style={{ fontFamily: font, fontSize: 13, fontWeight: 600 }}>{f.v}</div></div>
                ))}
              </div>

              {/* Contact info */}
              {(contact.name || contact.email || contact.phone) && (
                <div style={{ background: `${P.blue}08`, border: `1px solid ${P.blue}20`, borderRadius: 10, padding: 16, marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: P.blue, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Contact Person</div>
                  <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                    {contact.name && <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}><Icon name="user" size={14} /> {contact.name}</div>}
                    {contact.email && <a href={`mailto:${contact.email}`} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: P.blue, textDecoration: "none" }}><Icon name="mail" size={14} /> {contact.email}</a>}
                    {contact.phone && <a href={`tel:${contact.phone}`} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: P.green, textDecoration: "none" }}><Icon name="phone" size={14} /> {contact.phone}</a>}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {selectedTender.document_url && <a href={selectedTender.document_url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", background: `${P.blue}18`, color: P.blue, border: `1px solid ${P.blue}40`, borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none", cursor: "pointer" }}><Icon name="download" size={16} /> Download Tender Document</a>}
                <button onClick={() => handleAiAnalyse(selectedTender)} disabled={aiLoading} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", background: `linear-gradient(135deg, ${P.accent}, ${P.accentDark})`, color: "#000", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: aiLoading ? "wait" : "pointer", fontFamily: fontBody, opacity: aiLoading ? 0.7 : 1 }}><Icon name="ai" size={16} /> {aiLoading ? "Analysing..." : "AI Bid Analysis"}</button>
<button onClick={async () => { try { const token = localStorage.getItem("tcc_token"); const res = await fetch(`${API}/bidpack/${selectedTender.id}`, { method: "POST", headers: { Authorization: `Bearer ${token}` } }); if (!res.ok) throw new Error("Generation failed"); const blob = await res.blob(); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `Velani_Bid_Pack_${selectedTender.external_id || "tender"}.pdf`; a.click(); URL.revokeObjectURL(url); showToast("Bid pack downloaded!"); } catch (e) { showToast("Bid pack failed: " + e.message, "error"); } }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", background: `linear-gradient(135deg, ${P.green}, ${P.greenDim})`, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: fontBody }}><Icon name="download" size={16} /> Prepare Bid Pack</button>
              </div>

              {aiResult && <div style={{ marginTop: 20, background: `${P.accent}08`, border: `1px solid ${P.accent}25`, borderRadius: 10, padding: 20 }}><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}><Icon name="ai" size={16} /><span style={{ fontFamily: font, fontSize: 11, fontWeight: 600, color: P.accent, textTransform: "uppercase", letterSpacing: 1 }}>AI Analysis — Velani Goods & Services</span></div><div style={{ fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{aiResult}</div></div>}
            </div>
          </div>);
        })()}

        {/* RFP PRICING */}
        {tab === "rfp" && (
          <div style={{ padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div><h1 style={{ fontFamily: font, fontSize: 22, fontWeight: 700, margin: "0 0 6px" }}>RFP Pricing</h1><p style={{ color: P.textMuted, fontSize: 13, margin: 0 }}>Client product/qty requests & supplier pricing</p></div>
              <button onClick={() => setShowNewRfp(true)} style={{ background: `linear-gradient(135deg, ${P.accent}, ${P.accentDark})`, color: "#000", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: fontBody, display: "flex", alignItems: "center", gap: 8 }}><Icon name="plus" size={16} /> New RFP</button>
            </div>
            {showNewRfp && (
              <div style={{ background: P.bgCard, borderRadius: 12, border: `1px solid ${P.accent}40`, padding: 24, marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}><span style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: P.accent }}>New Pricing Request</span><button onClick={() => setShowNewRfp(false)} style={{ background: "transparent", border: "none", color: P.textMuted, cursor: "pointer" }}><Icon name="x" size={18} /></button></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[{ key: "client_name", label: "Client", ph: "e.g. Buildmax Construction" }, { key: "product", label: "Product", ph: "e.g. Portland Cement 42.5N" }, { key: "quantity", label: "Quantity", ph: "e.g. 500 bags (50kg)" }, { key: "deadline", label: "Deadline", ph: "", type: "date" }].map(f => (
                    <div key={f.key}><label style={{ fontSize: 11, color: P.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, display: "block" }}>{f.label}</label><input value={newRfp[f.key]} onChange={e => setNewRfp({ ...newRfp, [f.key]: e.target.value })} placeholder={f.ph} type={f.type || "text"} style={inputStyle} /></div>
                  ))}
                </div>
                <button onClick={handleAddRfp} style={{ marginTop: 16, background: P.accent, color: "#000", border: "none", borderRadius: 8, padding: "10px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: fontBody }}>Create RFP</button>
              </div>
            )}
            {rfps.length === 0 && !showNewRfp && <div style={{ background: P.bgCard, borderRadius: 12, border: `1px solid ${P.border}`, padding: 40, textAlign: "center", color: P.textMuted }}>No RFP requests yet</div>}
            {rfps.length > 0 && (
              <div style={{ background: P.bgCard, borderRadius: 12, border: `1px solid ${P.border}`, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead><tr style={{ borderBottom: `1px solid ${P.border}` }}>{["Ref", "Client", "Product", "Qty", "Deadline", "Status", "Quotes", "Best", "AI"].map(h => (<th key={h} style={{ padding: "12px 12px", textAlign: "left", fontSize: 10, color: P.textMuted, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600, fontFamily: font }}>{h}</th>))}</tr></thead>
                  <tbody>{rfps.map(r => (
                    <tr key={r.id} style={{ borderBottom: `1px solid ${P.border}` }} onMouseEnter={e => e.currentTarget.style.background = P.bgHover} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "10px 12px", fontFamily: font, fontSize: 11, color: P.textMuted }}>{r.reference}</td>
                      <td style={{ padding: "10px 12px", fontWeight: 500 }}>{r.client_name}</td>
                      <td style={{ padding: "10px 12px" }}>{r.product}</td>
                      <td style={{ padding: "10px 12px", fontSize: 12, color: P.textMuted }}>{r.quantity}</td>
                      <td style={{ padding: "10px 12px", fontFamily: font, fontSize: 11, color: P.textMuted }}>{r.deadline ? new Date(r.deadline).toLocaleDateString() : "—"}</td>
                      <td style={{ padding: "10px 12px" }}><span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 10, color: statusColor(r.status), background: `${statusColor(r.status)}18` }}>{statusLabel(r.status)}</span></td>
                      <td style={{ padding: "10px 12px", fontFamily: font, fontWeight: 600 }}>{r.quote_count}</td>
                      <td style={{ padding: "10px 12px", fontFamily: font, color: r.best_price ? P.green : P.textMuted, fontWeight: 600 }}>{r.best_price || "—"}</td>
                      <td style={{ padding: "10px 12px" }}><button onClick={() => handleAiPricing(r)} disabled={aiLoading} style={{ background: `${P.accent}18`, color: P.accent, border: `1px solid ${P.accent}40`, borderRadius: 6, padding: "3px 8px", fontSize: 10, fontWeight: 600, cursor: aiLoading ? "wait" : "pointer", fontFamily: fontBody }}><Icon name="ai" size={12} /></button></td>
                    </tr>))}</tbody>
                </table>
              </div>
            )}
            {aiResult && <div style={{ marginTop: 20, background: `${P.accent}08`, border: `1px solid ${P.accent}25`, borderRadius: 10, padding: 20 }}><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}><Icon name="ai" size={16} /><span style={{ fontFamily: font, fontSize: 11, fontWeight: 600, color: P.accent, textTransform: "uppercase", letterSpacing: 1 }}>AI Pricing Research</span><button onClick={() => setAiResult(null)} style={{ marginLeft: "auto", background: "transparent", border: "none", color: P.textMuted, cursor: "pointer" }}><Icon name="x" size={16} /></button></div><div style={{ fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{aiResult}</div></div>}
          </div>
        )}

        {/* HARVEST SOURCES */}
        {tab === "sources" && (
          <div style={{ padding: 28 }}>
            <h1 style={{ fontFamily: font, fontSize: 22, fontWeight: 700, margin: "0 0 6px" }}>Harvest Sources</h1>
            <p style={{ color: P.textMuted, fontSize: 13, margin: "0 0 24px" }}>Click "Scrape Now" to manually trigger any source</p>
            {sources.map(s => (
              <div key={s.id} style={{ background: P.bgCard, borderRadius: 10, border: `1px solid ${P.border}`, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.status === "active" ? P.green : P.accent, boxShadow: `0 0 8px ${s.status === "active" ? P.green : P.accent}`, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{s.name}</div><div style={{ fontSize: 11, color: P.textMuted, fontFamily: font, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.url}</div></div>
                <div style={{ textAlign: "center", padding: "0 16px" }}><div style={{ fontFamily: font, fontSize: 16, fontWeight: 700, color: P.blue }}>{(s.tenders_found || 0).toLocaleString()}</div><div style={{ fontSize: 9, color: P.textMuted, textTransform: "uppercase" }}>Found</div></div>
                <div style={{ textAlign: "right", minWidth: 90 }}><div style={{ fontSize: 11, color: s.status === "active" ? P.green : P.accent, fontWeight: 600, textTransform: "uppercase" }}>{s.status}</div><div style={{ fontSize: 10, color: P.textDim }}>{s.last_sync_at ? new Date(s.last_sync_at).toLocaleString() : "Never"}</div></div>
                <button onClick={() => handleTriggerScrape(s.id)} style={{ background: `${P.blue}15`, color: P.blue, border: `1px solid ${P.blue}30`, borderRadius: 6, padding: "5px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: fontBody, whiteSpace: "nowrap" }}>Scrape Now</button>
              </div>
            ))}
            {sources.length > 0 && (
              <div style={{ marginTop: 24, background: P.bgCard, borderRadius: 12, border: `1px solid ${P.border}`, padding: 20 }}>
                <div style={{ fontFamily: font, fontSize: 13, fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}><Icon name="zap" size={16} /> Engine Status</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
                  {[{ label: "Total Indexed", value: sources.reduce((a, s) => a + (s.tenders_found || 0), 0).toLocaleString(), color: P.blue }, { label: "Scan Frequency", value: "Every 5 min", color: P.green }, { label: "Sources", value: `${sources.length} portals`, color: P.accent }].map((s, i) => (
                    <div key={i} style={{ background: P.bgInput, borderRadius: 8, padding: 14, textAlign: "center" }}><div style={{ fontFamily: font, fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div><div style={{ fontSize: 11, color: P.textMuted, marginTop: 4 }}>{s.label}</div></div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}