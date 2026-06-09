import { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

// ── Styles ──────────────────────────────────────────────────────────────────
const S = `
.gate{min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--navy);padding:24px}
.gate-card{background:white;border-radius:16px;padding:48px;max-width:420px;width:100%;box-shadow:var(--shadow-lg)}
.gate-logo{font-family:'DM Serif Display',serif;font-size:28px;color:var(--navy);margin-bottom:4px}
.gate-sub{font-size:13px;color:var(--gray-600);margin-bottom:32px;letter-spacing:0.02em}
.gate-label{font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--gray-600);margin-bottom:8px}
.gate-input{width:100%;padding:12px 16px;border:2px solid var(--gray-200);border-radius:var(--radius);font-size:15px;font-family:Inter,sans-serif;outline:none;transition:border 0.15s}
.gate-input:focus{border-color:var(--blue)}
.gate-btn{width:100%;margin-top:16px;padding:13px;background:var(--navy);color:white;border:none;border-radius:var(--radius);font-size:14px;font-weight:600;letter-spacing:0.04em;cursor:pointer;transition:background 0.15s}
.gate-btn:hover{background:var(--navy-mid)}
.gate-err{margin-top:12px;font-size:13px;color:var(--red);text-align:center}
.gate-disclaimer{margin-top:24px;padding:16px;background:var(--gray-50);border-radius:var(--radius);font-size:12px;color:var(--gray-600);line-height:1.5;border-left:3px solid var(--amber)}

.app{display:flex;flex-direction:column;min-height:100vh}
.topbar{background:var(--navy);padding:0 32px;display:flex;align-items:center;gap:24px;height:60px;position:sticky;top:0;z-index:100}
.topbar-title{font-family:'DM Serif Display',serif;font-size:20px;color:white;flex-shrink:0}
.topbar-sub{font-size:12px;color:rgba(255,255,255,0.5);letter-spacing:0.03em}
.topbar-spacer{flex:1}
.topbar-badge{font-size:11px;background:rgba(255,255,255,0.12);color:rgba(255,255,255,0.7);padding:4px 10px;border-radius:20px;letter-spacing:0.04em}

.tabnav{background:white;border-bottom:1px solid var(--gray-200);padding:0 32px;display:flex;gap:2px;overflow-x:auto;-ms-overflow-style:none;scrollbar-width:none;position:sticky;top:60px;z-index:99;-webkit-overflow-scrolling:touch;scroll-behavior:smooth}
.tabnav::-webkit-scrollbar{display:none}
.tab{padding:14px 16px;font-size:13px;font-weight:500;color:var(--gray-600);border:none;background:none;cursor:pointer;white-space:nowrap;border-bottom:2px solid transparent;margin-bottom:-1px;transition:all 0.15s;letter-spacing:0.01em;flex-shrink:0}
.tab:hover{color:var(--navy)}
.tab.active{color:var(--blue);border-bottom-color:var(--blue);font-weight:600}
.tab-icon{margin-right:6px;font-size:14px}

.mob-nav-bar{display:none}
.mob-nav-trigger{width:100%;display:flex;align-items:center;gap:10px;padding:12px 16px;background:white;border:none;border-bottom:1px solid var(--gray-200);cursor:pointer;text-align:left;font-family:inherit;font-size:14px;font-weight:600;color:var(--navy);position:sticky;top:60px;z-index:99}
.mob-nav-trigger-icon{font-size:16px;line-height:1;color:var(--blue)}
.mob-nav-trigger-label{flex:1}
.mob-nav-trigger-chevron{font-size:12px;color:var(--gray-600);transition:transform 0.2s}
.mob-nav-trigger-chevron.open{transform:rotate(180deg)}
.mob-nav-overlay{position:fixed;inset:0;background:rgba(15,37,55,0.45);z-index:150;opacity:0;pointer-events:none;transition:opacity 0.2s}
.mob-nav-overlay.open{opacity:1;pointer-events:all}
.mob-nav-panel{position:fixed;left:0;right:0;top:60px;max-height:min(70vh,520px);background:white;z-index:151;border-bottom-left-radius:16px;border-bottom-right-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,0.18);transform:translateY(-8px);opacity:0;pointer-events:none;transition:transform 0.22s cubic-bezier(0.4,0,0.2,1),opacity 0.2s;display:flex;flex-direction:column;overflow:hidden}
.mob-nav-panel.open{transform:translateY(0);opacity:1;pointer-events:all}
.mob-nav-head{display:flex;align-items:center;justify-content:space-between;padding:14px 16px 10px;border-bottom:1px solid var(--gray-100);flex-shrink:0}
.mob-nav-head-title{font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--gray-600)}
.mob-nav-close{background:none;border:none;font-size:22px;line-height:1;color:var(--gray-600);cursor:pointer;padding:4px}
.mob-nav-list{overflow-y:auto;-webkit-overflow-scrolling:touch;padding:8px;flex:1}
.mob-nav-item{display:flex;align-items:center;gap:12px;width:100%;padding:12px 14px;border:none;background:none;border-radius:var(--radius);cursor:pointer;text-align:left;font-family:inherit;font-size:14px;font-weight:500;color:var(--gray-800);transition:background 0.15s}
.mob-nav-item:hover,.mob-nav-item:active{background:var(--gray-100)}
.mob-nav-item.active{background:var(--blue-light);color:var(--blue);font-weight:600}
.mob-nav-item-icon{font-size:16px;width:22px;text-align:center;flex-shrink:0}
.mob-nav-item-label{flex:1}
.mob-nav-item-check{font-size:14px;color:var(--blue);opacity:0}
.mob-nav-item.active .mob-nav-item-check{opacity:1}
.topbar-menu-btn{display:none;align-items:center;justify-content:center;width:40px;height:40px;border:none;border-radius:var(--radius);background:rgba(255,255,255,0.1);color:white;font-size:20px;cursor:pointer;flex-shrink:0;margin-left:auto}
.topbar-menu-btn:hover{background:rgba(255,255,255,0.18)}
.topbar-menu-btn.open{background:rgba(255,255,255,0.2)}

.main{flex:1;padding:32px;max-width:1100px;margin:0 auto;width:100%}

.page-header{margin-bottom:28px}
.page-title{font-family:'DM Serif Display',serif;font-size:32px;color:var(--navy);margin-bottom:6px}
.page-subtitle{font-size:14px;color:var(--gray-600);max-width:680px;line-height:1.6}

.section{background:white;border-radius:var(--radius);box-shadow:var(--shadow);margin-bottom:20px;overflow:hidden}
.section-header{padding:20px 24px 16px;border-bottom:1px solid var(--gray-100);display:flex;align-items:center;gap:12px}
.section-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
.section-title{font-size:15px;font-weight:600;color:var(--navy)}
.section-body{padding:20px 24px}

.narrative{font-size:14px;color:var(--gray-800);line-height:1.75;margin-bottom:12px}
.narrative strong{color:var(--navy);font-weight:600}
.narrative em{color:var(--teal);font-style:normal;font-weight:500}

.finding-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;margin:16px 0}
.finding-card{padding:14px 16px;border-radius:var(--radius);border:1px solid}
.finding-card.confirmed{background:var(--green-light);border-color:#BBF7D0;color:#14532D}
.finding-card.active{background:var(--amber-light);border-color:#FDE68A;color:#92400E}
.finding-card.gap{background:var(--red-light);border-color:#FECACA;color:#991B1B}
.finding-card.info{background:var(--blue-light);border-color:#BFDBFE;color:#1E3A8A}
.finding-card-label{font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:6px;opacity:0.7}
.finding-card-text{font-size:13px;font-weight:500;line-height:1.5}

.stat-row{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;margin:16px 0}
.stat-box{padding:14px;background:var(--gray-50);border-radius:var(--radius);border:1px solid var(--gray-200)}
.stat-box.flagged{background:var(--amber-light);border-color:#FDE68A}
.stat-box.critical{background:var(--red-light);border-color:#FECACA}
.stat-box.normal{background:var(--green-light);border-color:#BBF7D0}
.stat-label{font-size:11px;color:var(--gray-600);font-weight:600;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:4px}
.stat-value{font-size:22px;font-weight:700;color:var(--navy);font-variant-numeric:tabular-nums}
.stat-ref{font-size:11px;color:var(--gray-600);margin-top:2px}
.stat-flag{font-size:10px;font-weight:700;letter-spacing:0.08em;padding:2px 6px;border-radius:4px;display:inline-block;margin-top:4px}
.stat-flag.H{background:#FEF3C7;color:#92400E}
.stat-flag.L{background:#EFF6FF;color:#1E40AF}
.stat-flag.ABN{background:#FEE2E2;color:#991B1B}

.table-wrap{overflow-x:auto;margin:12px 0}
table{width:100%;border-collapse:collapse;font-size:13px}
th{background:var(--navy);color:white;padding:10px 14px;text-align:left;font-weight:600;font-size:12px;letter-spacing:0.04em}
td{padding:10px 14px;border-bottom:1px solid var(--gray-100);color:var(--gray-800);vertical-align:top}
tr:last-child td{border-bottom:none}
tr:nth-child(even) td{background:var(--gray-50)}
td.flag-h{color:var(--amber);font-weight:600}
td.flag-abn{color:var(--red);font-weight:600}
td.flag-neg{color:var(--green);font-weight:600}

.drawer.drawer-doc{width:min(960px,98vw)}
.drawer-doc .drawer-body{padding:0;overflow:hidden;display:flex;flex-direction:column;min-height:0;flex:1}
.drawer-doc.drawer-scroll .drawer-body{overflow:hidden}
.drawer-scroll-pane{flex:1;overflow-y:auto;overflow-x:hidden;min-height:0;-webkit-overflow-scrolling:touch;overscroll-behavior:contain}
.doc-frame{flex:1;width:100%;min-height:calc(100vh - 72px);border:none;background:var(--gray-100)}
.doc-actions{display:flex;gap:8px;margin-top:14px;padding-left:28px;flex-wrap:wrap}
.doc-action-btn,.doc-action-link{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:var(--radius);font-size:12px;font-weight:600;letter-spacing:0.04em;cursor:pointer;text-decoration:none;transition:background 0.15s}
.doc-action-btn{background:var(--navy);color:white;border:none}
.doc-action-btn:hover{background:var(--navy-mid)}
.doc-action-link{background:var(--gray-100);color:var(--navy);border:1px solid var(--gray-200)}
.doc-action-link:hover{background:var(--gray-200)}

.vx-wrap{background:white}
.vx-head{background:var(--navy);color:white;padding:18px 20px}
.vx-head-title{font-family:'DM Serif Display',serif;font-size:18px;margin-bottom:6px}
.vx-head-sub{font-size:11px;line-height:1.5;color:rgba(255,255,255,0.75)}
.vx-tabs{display:flex;gap:2px;border-bottom:1px solid var(--gray-200);padding:0 12px;background:white;position:sticky;top:0;z-index:2}
.vx-tab{padding:10px 12px;font-size:12px;font-weight:600;color:var(--gray-600);background:none;border:none;border-bottom:2px solid transparent;cursor:pointer;white-space:nowrap}
.vx-tab.active{color:var(--blue);border-bottom-color:var(--blue)}
.vx-body{padding:16px 20px 32px;overflow-x:auto}
.vx-cat{padding:8px 12px;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:white;border-radius:4px;margin:16px 0 8px}
.vx-cat:first-child{margin-top:0}
.vx-table{width:100%;min-width:720px;border-collapse:collapse;font-size:12px;margin-bottom:8px}
.vx-table th{background:#2E75B6;color:white;padding:8px 10px;text-align:left;font-size:11px;letter-spacing:0.04em}
.vx-table td{padding:8px 10px;border-bottom:1px solid var(--gray-100);vertical-align:top;color:var(--gray-800)}
.vx-table tr:nth-child(even) td{background:var(--gray-50)}
.vx-rsid{font-weight:700;color:var(--navy);font-family:monospace;font-size:11px}
.vx-gene{font-weight:700;color:var(--blue)}
.vx-note{font-size:11px;color:var(--gray-600);line-height:1.5}
.vx-zyg{display:inline-block;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;letter-spacing:0.03em;text-transform:lowercase}
.vx-zyg.het{background:#FEF3C7;color:#92400E}
.vx-zyg.hom{background:#D1FAE5;color:#14532D}
.vx-loading{padding:40px;text-align:center;color:var(--gray-600);font-size:13px}

.drawer-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;background:var(--navy);color:white;border:none;border-radius:var(--radius);font-size:12px;font-weight:600;letter-spacing:0.04em;cursor:pointer;transition:background 0.15s;margin-top:12px}
.drawer-btn:hover{background:var(--navy-mid)}
.drawer-btn.secondary{background:var(--gray-100);color:var(--navy)}
.drawer-btn.secondary:hover{background:var(--gray-200)}

.drawer-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:200;opacity:0;pointer-events:none;transition:opacity 0.2s}
.drawer-overlay.open{opacity:1;pointer-events:all}
.drawer{position:fixed;right:0;top:0;bottom:0;width:min(680px,95vw);background:white;z-index:201;transform:translateX(100%);transition:transform 0.25s cubic-bezier(0.4,0,0.2,1);display:flex;flex-direction:column;box-shadow:-4px 0 32px rgba(0,0,0,0.15);max-height:100vh;max-height:100dvh}
.drawer.open{transform:translateX(0)}
.drawer-head{padding:20px 24px;border-bottom:1px solid var(--gray-200);display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
.drawer-head-title{font-size:15px;font-weight:600;color:var(--navy)}
.drawer-close{background:none;border:none;font-size:20px;cursor:pointer;color:var(--gray-600);padding:4px;line-height:1}
.drawer-body{flex:1;overflow-y:auto;padding:24px;min-height:0}
.drawer-section{margin-bottom:24px}
.drawer-section-title{font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--gray-600);margin-bottom:12px;padding-bottom:6px;border-bottom:1px solid var(--gray-200)}

.img-wrap{margin:12px 0;border-radius:var(--radius);overflow:hidden;border:1px solid var(--gray-200)}
.img-wrap img{width:100%;height:auto;display:block}
.img-caption{font-size:11px;color:var(--gray-600);padding:8px 12px;background:var(--gray-50);font-style:italic;line-height:1.4}

.alert-box{padding:14px 16px;border-radius:var(--radius);margin:12px 0;font-size:13px;line-height:1.6;border-left:4px solid}
.alert-box.warning{background:var(--amber-light);border-color:var(--amber);color:#78350F}
.alert-box.danger{background:var(--red-light);border-color:var(--red);color:#7F1D1D}
.alert-box.info{background:var(--blue-light);border-color:var(--blue);color:#1E3A8A}
.alert-box.success{background:var(--green-light);border-color:var(--green);color:#14532D}
.alert-box strong{font-weight:700}

.quote-block{border-left:4px solid var(--blue);padding:12px 16px;margin:12px 0;background:var(--blue-light);border-radius:0 var(--radius) var(--radius) 0}
.quote-text{font-size:14px;color:var(--navy-mid);font-style:italic;line-height:1.6;margin-bottom:6px}
.quote-attr{font-size:12px;color:var(--gray-600);font-weight:600}

.pill{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:0.04em;margin:2px}
.pill.confirmed{background:#DCFCE7;color:#14532D}
.pill.active{background:#FEF3C7;color:#92400E}
.pill.excluded{background:#F1F5F9;color:#475569;text-decoration:line-through}
.pill.urgent{background:#FEE2E2;color:#991B1B}

.about-box{background:var(--navy);color:white;border-radius:12px;padding:28px;margin-bottom:24px}
.about-title{font-family:'DM Serif Display',serif;font-size:22px;margin-bottom:12px}
.about-text{font-size:13px;line-height:1.7;color:rgba(255,255,255,0.8);margin-bottom:10px}
.about-disclaimer{font-size:12px;padding:12px;background:rgba(255,255,255,0.08);border-radius:6px;color:rgba(255,255,255,0.65);border-left:3px solid var(--amber);margin-top:16px}

.variant-card{padding:16px;border:1px solid var(--gray-200);border-radius:var(--radius);margin-bottom:12px}
.variant-header{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.variant-rsid{font-size:13px;font-weight:700;color:var(--navy);font-family:monospace}
.variant-gene{font-size:12px;font-weight:600;color:var(--blue);background:var(--blue-light);padding:2px 8px;border-radius:4px}
.variant-q{font-size:11px;color:var(--gray-600)}
.variant-body{font-size:13px;color:var(--gray-800);line-height:1.6}
.variant-q-bar{height:6px;background:var(--gray-200);border-radius:3px;margin-top:8px;overflow:hidden}
.variant-q-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,var(--teal),var(--blue))}

.med-row{display:flex;align-items:flex-start;gap:12px;padding:12px 0;border-bottom:1px solid var(--gray-100)}
.med-row:last-child{border-bottom:none}
.med-name{font-size:14px;font-weight:600;color:var(--navy);min-width:200px}
.med-dose{font-size:12px;color:var(--gray-600);margin-top:2px}
.med-note{font-size:13px;color:var(--gray-700);flex:1}
.med-flag{font-size:11px;padding:2px 8px;border-radius:4px;font-weight:600;flex-shrink:0;margin-left:auto}
.med-flag.pgx{background:#EDE9FE;color:#4C1D95}
.med-flag.cardiac{background:#FEE2E2;color:#991B1B}
.med-flag.active{background:#DCFCE7;color:#14532D}
.med-flag.pending{background:#FEF3C7;color:#92400E}

@media(max-width:768px){
  .topbar{padding:0 14px;height:56px;gap:12px}
  .topbar-title{font-size:17px}
  .topbar-sub{display:none}
  .topbar-spacer{display:none}
  .topbar-badge{font-size:10px;padding:3px 8px;white-space:nowrap}
  .topbar-menu-btn{display:flex}
  .tabnav-desktop{display:none}
  .mob-nav-bar{display:block}
  .mob-nav-trigger{top:56px}
  .mob-nav-panel{top:56px}
  .main{padding:16px}
  .page-title{font-size:26px}
  .section-header{padding:16px 18px 12px}
  .section-body{padding:16px 18px}
  .stat-row{grid-template-columns:1fr 1fr}
  .finding-grid{grid-template-columns:1fr}
  .med-row{flex-direction:column;gap:6px}
  .med-name{min-width:0}
  .med-flag{margin-left:0;align-self:flex-start}
  .gate-card{padding:32px 24px}
}
@media(max-width:480px){
  .topbar-badge{display:none}
  .stat-row{grid-template-columns:1fr}
}
`;

// ── Helpers ──────────────────────────────────────────────────────────────────

function Drawer({ open, onClose, title, children, wide=false, scroll=false }) {
  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);
  return (
    <>
      <div className={`drawer-overlay${open?' open':''}`} onClick={onClose}/>
      <div className={`drawer${open?' open':''}${wide?' drawer-doc':''}${scroll?' drawer-scroll':''}`} role="dialog" aria-modal="true">
        <div className="drawer-head">
          <span className="drawer-head-title">{title}</span>
          <button className="drawer-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="drawer-body">
          {scroll ? <div className="drawer-scroll-pane">{children}</div> : children}
        </div>
      </div>
    </>
  );
}

function Section({ title, dot='#2563EB', children }) {
  return (
    <div className="section">
      <div className="section-header">
        <div className="section-dot" style={{background:dot}}/>
        <span className="section-title">{title}</span>
      </div>
      <div className="section-body">{children}</div>
    </div>
  );
}

function AlertBox({ type='info', children }) {
  return <div className={`alert-box ${type}`}>{children}</div>;
}

function QuoteBlock({ text, attr }) {
  return (
    <div className="quote-block">
      <div className="quote-text">"{text}"</div>
      <div className="quote-attr">— {attr}</div>
    </div>
  );
}

function VariantCard({ rsid, gene, annotation, genotype, quantile, tissue, interpretation, imgKey }) {
  const [open, setOpen] = useState(false);
  const pct = Math.round(quantile * 100);
  return (
    <div className="variant-card">
      <div className="variant-header">
        <span className="variant-rsid">{rsid}</span>
        <span className="variant-gene">{gene}</span>
        <span className="variant-q">Quantile {quantile.toFixed(4)} · top {(100-pct<1?'<1':100-pct)}%</span>
        <span className="pill active">{genotype}</span>
      </div>
      <div className="variant-body">
        <strong>{annotation}</strong><br/>
        <span style={{color:'var(--gray-600)',fontSize:12}}>Modeled tissue: {tissue}</span><br/><br/>
        {interpretation}
      </div>
      <div className="variant-q-bar"><div className="variant-q-fill" style={{width:`${pct}%`}}/></div>
      {imgKey && PORTAL_IMAGES && PORTAL_IMAGES[imgKey] && (
        <>
          <button className="drawer-btn secondary" style={{marginTop:10}} onClick={()=>setOpen(true)}>
            ▶ View AlphaGenome Output
          </button>
          <Drawer open={open} onClose={()=>setOpen(false)} title={`AlphaGenome: ${rsid} (${gene})`}>
            <div className="drawer-section">
              <div className="drawer-section-title">RNA-seq REF vs ALT — {tissue}</div>
              <div className="img-wrap">
                <img src={PORTAL_IMAGES[imgKey]} alt={`AlphaGenome output for ${rsid}`}/>
                <div className="img-caption">{rsid} ({gene}) — {annotation}. Quantile score: {quantile.toFixed(4)}. Tissue: {tissue}. REF (gray) vs ALT (red). This is a research-grade computational prediction, not a clinical diagnostic result.</div>
              </div>
            </div>
            <div className="drawer-section">
              <div className="drawer-section-title">Interpretation</div>
              <p style={{fontSize:13,lineHeight:1.7,color:'var(--gray-800)'}}>{interpretation}</p>
              <div className="alert-box warning" style={{marginTop:12}}>
                <strong>Research disclaimer:</strong> AlphaGenome outputs are model predictions generated for research context. They are not validated clinical diagnostic results and do not alter the clinical classification of any variant.
              </div>
            </div>
          </Drawer>
        </>
      )}
    </div>
  );
}

// ── Password Gate ────────────────────────────────────────────────────────────
const PASSWORD = "sahl2026";

function Gate({ onUnlock }) {
  const [val, setVal] = useState('');
  const [err, setErr] = useState(false);
  const submit = () => {
    if (val === PASSWORD) onUnlock();
    else { setErr(true); setTimeout(()=>setErr(false),2000); }
  };
  return (
    <div className="gate">
      <div className="gate-card">
        <div className="gate-logo">Clinical Reference Portal</div>
        <div className="gate-sub">Sarah K. Sahl · DOB May 18, 1984</div>
        <div className="gate-label">Access Key</div>
        <input
          className="gate-input" type="password" value={val}
          onChange={e=>setVal(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&submit()}
          placeholder="Enter access key" autoFocus
        />
        <button className="gate-btn" onClick={submit}>Access Portal</button>
        {err && <div className="gate-err">Incorrect key. Contact the patient for access.</div>}
        <div className="gate-disclaimer">
          <strong>Provider notice:</strong> This portal contains longitudinal clinical data organized for provider review. All findings are sourced directly from medical records, laboratory results, and imaging reports. Computational genomic analyses are labeled as research-grade and do not constitute clinical diagnostic results. For clinical decisions, verify against primary records.
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB CONTENT
// ══════════════════════════════════════════════════════════════════════════════

function TabOverview() {
  const [drawer, setDrawer] = useState(null);
  return (
    <div>
      <div className="page-header">
        <div className="page-title serif">Clinical Overview</div>
        <div className="page-subtitle">A framework for understanding a multi-system presentation spanning 20+ years of records. This portal is designed so any provider can orient to the full picture in under 10 minutes.</div>
      </div>

      <div className="about-box">
        <div className="about-title">About This Portal</div>
        <div className="about-text">This portal consolidates 20+ years of longitudinal records for provider review. Each new consultant typically receives extensive documentation with limited time to extract the underlying pattern; specialty tabs present that synthesis by discipline, with source data in drawers.</div>
        <div className="about-text">Clinical findings are sourced from physician notes, imaging reports, and laboratory results. Computational genomic analyses (AlphaGenome, 23andMe) are labeled research-grade and supplementary — they do not represent clinical diagnostic findings.</div>
        <div className="about-disclaimer"><strong>Research content notice:</strong> Sections marked with a ⚗ symbol contain computational predictions from AlphaGenome (Google DeepMind) or 23andMe variant analysis. These are model outputs for research context only. They are included to support provider evaluation, not to replace clinical judgment or alter confirmed diagnoses.</div>
      </div>

      <Section title="Patient Summary" dot="#0F2537">
        <div className="stat-row">
          <div className="stat-box"><div className="stat-label">Name</div><div style={{fontSize:15,fontWeight:600,color:'var(--navy)'}}>Sarah K. Sahl</div></div>
          <div className="stat-box"><div className="stat-label">DOB</div><div style={{fontSize:15,fontWeight:600,color:'var(--navy)'}}>May 18, 1984</div><div className="stat-ref">Age 41</div></div>
          <div className="stat-box"><div className="stat-label">Primary Insurer</div><div style={{fontSize:15,fontWeight:600,color:'var(--navy)'}}>Iowa Total Care</div></div>
          <div className="stat-box"><div className="stat-label">Primary Care</div><div style={{fontSize:15,fontWeight:600,color:'var(--navy)'}}>MercyOne Internal Medicine</div><div className="stat-ref">Angela Conley</div></div>
          <div className="stat-box"><div className="stat-label">Cardiology</div><div style={{fontSize:15,fontWeight:600,color:'var(--navy)'}}>Iowa Heart Center</div><div className="stat-ref">Dr. Goerbig Campbell</div></div>
          <div className="stat-box"><div className="stat-label">Pulmonology</div><div style={{fontSize:15,fontWeight:600,color:'var(--navy)'}}>Mayo Clinic</div><div className="stat-ref">Dr. Keogh</div></div>
        </div>
      </Section>

      <Section title="The Central Hypothesis" dot="#0D9488">
        <div className="narrative">
          Two confirmed pathological processes are present simultaneously, each amplifying the severity of the other — a <strong>dual-hit hypothesis</strong> that explains why this presentation is more severe than either condition alone would predict.
        </div>
        <div className="finding-grid">
          <div className="finding-card confirmed">
            <div className="finding-card-label">Hit 1 — Confirmed</div>
            <div className="finding-card-text"><strong>TTN Pathogenic Frameshift Deletion</strong><br/>c.73318_73324delGAATGCT · p.E24440MfsX2 · Heterozygous<br/>Nonischemic dilated cardiomyopathy. EF 56% → ~50%. High family penetrance.</div>
          </div>
          <div className="finding-card active">
            <div className="finding-card-label">Hit 2 — Active Investigation</div>
            <div className="finding-card-text"><strong>Eosinophilic Infiltrative Process</strong><br/>Chronic eosinophilia (peak 15.2%). FeNO 82 ppb. Severe persistent asthma. Cardiac, pulmonary, and possible renal involvement. ANCA-negative. Extensive exclusion workup completed.</div>
          </div>
          <div className="finding-card info">
            <div className="finding-card-label">Emerging — Under Evaluation</div>
            <div className="finding-card-text"><strong>Heritable Connective Tissue Disorder</strong><br/>Formally documented hypermobility. Vascular anomalies (aberrant subclavian, apical blebs, redundant septum, multivalvular regurgitation). COL3A1 rs1800255 heterozygous.</div>
          </div>
        </div>
        <AlertBox type="info">
          <strong>Leading differentials:</strong> ANCA-negative cardiac-predominant EGPA vs. idiopathic hypereosinophilic syndrome (HES). The structural cardiac substrate (TTN + possible CTD) may be amplifying the eosinophilic infiltrative injury beyond what either process would produce independently.
        </AlertBox>
      </Section>

      <Section title="Confirmed Diagnoses — Active Problem List (Mayo Clinic, May 2026)" dot="#16A34A">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Diagnosis</th><th>System</th><th>Since</th><th>Status</th></tr></thead>
            <tbody>
              {[
                ["Nonischemic Cardiomyopathy (TTN pathogenic variant)","Cardiac","2023","Active"],
                ["Cardiomyopathy — Family History (father, brother)","Cardiac/Genetic","Lifelong","Active"],
                ["Eosinophilia Unspecified","Hematologic","2019+","Active — under investigation"],
                ["Asthma, Severe Persistent","Pulmonary","2011+","Active — mepolizumab pending (Accredo)"],
                ["Hypermobility Joint (Beighton markers confirmed)","Musculoskeletal","Documented 2026","Active"],
                ["Chronic Pain Syndrome","Pain","Documented 2026","Active"],
                ["Inappropriate Sinus Tachycardia","Cardiac","~2022","Active — on metoprolol"],
                ["PTSD, Prolonged","Psychiatric","Active","Active"],
                ["Trigonitis Bladder","Urologic","Noted 5/1/2026","Active"],
                ["Mass Bladder (3mm, stable since 2016)","Urologic","2016","Monitoring"],
                ["Genetic Carrier of Other Disease","Genetic","2023","Active"],
              ].map(([dx,sys,since,status],i)=>(
                <tr key={i}>
                  <td style={{fontWeight:500}}>{dx}</td>
                  <td>{sys}</td>
                  <td>{since}</td>
                  <td><span className={`pill ${status.includes('Active')?'confirmed':'active'}`}>{status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Key Outstanding Diagnostic Gaps" dot="#DC2626">
        <div className="finding-grid">
          {[
            ["Formal CTD genetics evaluation","Aberrant subclavian + apical blebs + COL3A1 variant — vEDS vs hEDS distinction not yet made"],
            ["Eosinophil phenotyping / flow cytometry","Required to distinguish EGPA from HES definitively"],
            ["Anti-CCP testing","Elevated RF (17.3 U/mL) not yet followed up"],
            ["Baseline NT-proBNP trend","263 pg/mL flagged abnormal at Mayo 4/1/2026. No prior baseline. Repeat needed."],
            ["Retrospective eosinophil staining","Retained surgical pathology specimens — high-value outstanding step"],
            ["Catecholamine repeat testing","2018 baseline showed markedly elevated isolated dopamine — autonomic dysregulation pattern not followed up"],
          ].map(([title,desc],i)=>(
            <div key={i} className="finding-card gap">
              <div className="finding-card-label">Outstanding</div>
              <div className="finding-card-text"><strong>{title}</strong><br/>{desc}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="The December 2025 Crisis — Strongest Single Data Point" dot="#D97706">
        <div className="narrative">
          A course of oral prednisone completed in December 2025 was followed within days by the <strong>worst recorded physiological values across every tracked metric</strong> — HRV, eosinophil count, inflammatory markers, and symptom burden all simultaneously at nadir. This paradoxical response to steroid treatment is the single most compelling evidentiary event in the record for demonstrating treatment resistance and active disease progression rather than allergy-driven episodic symptoms.
        </div>
        <AlertBox type="danger">
          <strong>Treatment-resistance pattern:</strong> Three steroid courses in 2025. Shortest inter-treatment interval: 46 days. Wearable data shows incomplete physiological recovery between courses. The December 2025 post-steroid crisis contradicts the "allergic asthma" framing that would predict improvement with steroids.
        </AlertBox>
      </Section>
    </div>
  );
}

function TabCardiac() {
  const [drawer, setDrawer] = useState(null);
  return (
    <div>
      <div className="page-header">
        <div className="page-title serif">Cardiac</div>
        <div className="page-subtitle">Confirmed nonischemic cardiomyopathy from a pathogenic TTN truncating variant. Longitudinal monitoring shows EF decline and a February 2026 ECG flag requiring evaluation against the structural baseline.</div>
      </div>

      <Section title="Current Cardiac Status" dot="#DC2626">
        <div className="stat-row">
          <div className="stat-box flagged"><div className="stat-label">EF (Recent)</div><div className="stat-value">50-55%</div><div className="stat-ref">Echo 02/12/2026</div><div className="stat-flag H">DECLINING</div></div>
          <div className="stat-box flagged"><div className="stat-label">NT-proBNP</div><div className="stat-value">263</div><div className="stat-ref">pg/mL · ref ≤162 · 04/01/2026</div><div className="stat-flag H">HIGH</div></div>
          <div className="stat-box"><div className="stat-label">ECG (Mayo 4/1/26)</div><div className="stat-value">59</div><div className="stat-ref">HR bpm · QTc 411</div></div>
          <div className="stat-box flagged"><div className="stat-label">Diastolic HTN</div><div className="stat-value">98</div><div className="stat-ref">mmHg on max beta blockade</div><div className="stat-flag H">ELEVATED</div></div>
        </div>
        <AlertBox type="danger">
          <strong>February 2026 ECG flag:</strong> ECG (02/08/2026) flagged for "Possible Anterior infarct" and "Questionable change in initial forces of Septal leads" compared to May 2024 baseline. Echo (02/12/2026): LVEF 50-55%, mild mitral regurgitation. NT-proBNP 263 pg/mL above ref (≤162) at Mayo 04/01/2026 — no prior baseline for trending. Repeat draw recommended.
        </AlertBox>
        <button className="drawer-btn" onClick={()=>setDrawer('cardiac-labs')}>View Full Cardiac Lab History</button>
        <Drawer open={drawer==='cardiac-labs'} onClose={()=>setDrawer(null)} title="Cardiac Lab & Echo Data">
          <div className="drawer-section">
            <div className="drawer-section-title">NT-proBNP</div>
            <table><thead><tr><th>Date</th><th>Value</th><th>Ref</th><th>Source</th></tr></thead>
            <tbody>
              <tr><td>04/01/2026</td><td className="flag-abn">263 pg/mL (H)</td><td>≤162</td><td>Mayo Clinic</td></tr>
              <tr><td>02/08/2026</td><td className="flag-neg">4 pg/mL</td><td>≤162</td><td>Broadlawns ED</td></tr>
            </tbody></table>
          </div>
          <div className="drawer-section">
            <div className="drawer-section-title">Echocardiogram History</div>
            <table><thead><tr><th>Date</th><th>LVEF</th><th>Key Finding</th></tr></thead>
            <tbody>
              {[["Feb 2026","50-55%","Low-normal; mild MR; ECG anterior infarct flag"],["May 2025","55%","Grade I diastolic dysfunction (new); high-normal filling pressures"],["Jul 2024","56%","Redundant interatrial septum; mild mitral, tricuspid, aortic regurgitation"],["Jan 2023","56%","Stable; normal chamber sizes; mild MR"],["Jul 2020 (MRI)","53%","Baseline; RVEF 60%; no delayed gadolinium enhancement"]].map(([d,ef,f],i)=>(
                <tr key={i}><td>{d}</td><td style={{fontWeight:600}}>{ef}</td><td style={{fontSize:12}}>{f}</td></tr>
              ))}
            </tbody></table>
          </div>
        </Drawer>
      </Section>

      <Section title="Longitudinal Cardiac Timeline" dot="#0F2537">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Date</th><th>Event</th><th>Key Finding</th></tr></thead>
            <tbody>
              {[
                ["Feb 2026","ECG + Echo","ECG: Possible Anterior infarct flag; change in septal leads vs May 2024. Echo: LVEF 50-55%, mild MR."],
                ["May 2025","Echocardiogram","LVEF 55%. New Grade I LV diastolic dysfunction. High-normal filling pressures."],
                ["Jul 2024","Echocardiogram","LVEF 56%. Redundant interatrial septum. Mild MR/TR/AR."],
                ["Jan 2023","Echocardiogram","LVEF 56%. Stable. Normal chamber sizes."],
                ["Dec 2020","Formal Diagnosis (UNMC)","Stage A Cardiomyopathy confirmed. TTN c.73318_73324delGAATGCT p.E24440MfsX2 — pathogenic, highly penetrant."],
                ["Jul 2020","Cardiac MRI (Baseline)","LVEF 53%, RVEF 60%. No delayed gadolinium enhancement — no ischemic damage or fibrosis at baseline."],
                ["Jan 2018","Holter Monitor","Avg HR 106 bpm, peak 125 bpm daytime. Entirely sinus. Later diagnosed as Inappropriate Sinus Tachycardia."],
              ].map(([d,e,f],i)=>(
                <tr key={i}>
                  <td style={{fontWeight:600,whiteSpace:'nowrap',color:'var(--navy)'}}>{d}</td>
                  <td style={{fontWeight:500}}>{e}</td>
                  <td style={{fontSize:12,color:'var(--gray-700)'}}>{f}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <AlertBox type="info">
          <strong>EF trajectory:</strong> Baseline MRI 2020 (53%) → stable echo 2023-2024 (56%) → diastolic changes May 2025 → 50-55% February 2026. Decline coincides with escalating eosinophilic disease — consistent with the dual-hit hypothesis.
        </AlertBox>
      </Section>

      <Section title="TTN Pathogenic Variant" dot="#0F2537">
        <div className="narrative">
          Confirmed pathogenic variant <strong>TTN c.73318_73324delGAATGCT (p.E24440MfsX2, heterozygous)</strong> — 7 base-pair frameshift deletion producing truncated, non-functional titin. Father died from this disease. Brother is further advanced in progression. Genetic anticipation pattern suspected across generations.
        </div>
        <AlertBox type="info">
          <strong>Musculoskeletal note:</strong> Dr. Fernandes (UNMC Neurology, 2020): <em>"TTN mutations can be associated with different presentations of muscular dystrophy, including distal myopathy, limb girdle muscular dystrophy."</em> Dr. Poirier (Mayo) ordered genetic consultation for musculoskeletal concerns related to this variant.
        </AlertBox>
        <button className="drawer-btn" onClick={()=>setDrawer('ttn-genomics')}>⚗ View AlphaGenome TTN Analysis</button>
        <Drawer open={drawer==='ttn-genomics'} onClose={()=>setDrawer(null)} title="AlphaGenome: TTN Deletion Analysis">
          <AlertBox type="warning"><strong>Research content:</strong> Computational model predictions from Google DeepMind AlphaGenome. Not clinical diagnostic results.</AlertBox>
          <div className="drawer-section" style={{marginTop:16}}>
            <div className="drawer-section-title">Multi-panel — Heart tissue (UBERON:0000948)</div>
            <div className="img-wrap">
              {typeof PORTAL_IMAGES !== 'undefined' && PORTAL_IMAGES.ttn_multi && <img src={PORTAL_IMAGES.ttn_multi} alt="TTN AlphaGenome multi-panel"/>}
              <div className="img-caption">TTN_c.73318_73324delGAATGCT. REF (gray) vs ALT (red). Near-identical tracks are expected for heterozygous frameshift — functional allele transcription preserved; pathogenicity is protein-level.</div>
            </div>
          </div>
          <div className="drawer-section">
            <div className="drawer-section-title">Interpretation</div>
            <p style={{fontSize:13,lineHeight:1.7}}>No splice architecture disruption. Deletion does not create a cryptic splice site — consistent with clean frameshift truncation. Pathogenic mechanism is protein-level. ATAC panel incomplete in this run.</p>
          </div>
        </Drawer>
      </Section>

      <Section title="ADRB1 Pharmacogenomics ⚗" dot="#7C3AED">
        <VariantCard
          rsid="rs1801253" gene="ADRB1" annotation="Arg389Gly — beta-1 adrenergic receptor"
          genotype="CG (heterozygous)" quantile={0.9973}
          tissue="Heart + Left Ventricle (UBERON:0000948, UBERON:0006566)"
          imgKey="adrb1"
          interpretation="ADRB1 encodes the beta-1 adrenergic receptor — the exact protein metoprolol binds to reduce heart rate. The Arg389Gly variant alters receptor coupling efficiency. AlphaGenome predicts a top 0.3% functional effect in cardiac tissue and specifically in the left ventricle. Metoprolol titration is being performed against a receptor that may respond differently from the reference genome prediction."
        />
      </Section>
    </div>
  );
}

function TabPulmonary() {
  return (
    <div>
      <div className="page-header">
        <div className="page-title serif">Pulmonary</div>
        <div className="page-subtitle">Severe persistent asthma with an eosinophilic-predominant pattern, documented steroid resistance, and mepolizumab (Nucala) prescribed — first dose pending at Accredo Specialty Pharmacy as of June 2026. The EGPA/HES differential is not yet formally closed.</div>
      </div>

      <Section title="April 2026 Mayo PFT Results" dot="#DC2626">
        <div className="stat-row">
          <div className="stat-box critical"><div className="stat-label">FeNO</div><div className="stat-value">82</div><div className="stat-ref">ppb · ULN 39</div><div className="stat-flag ABN">2× UPPER LIMIT</div></div>
          <div className="stat-box flagged"><div className="stat-label">Pre-BD FEV1/FVC</div><div className="stat-value">57%</div><div className="stat-ref">Obstructive pattern</div><div className="stat-flag H">LOW</div></div>
          <div className="stat-box normal"><div className="stat-label">Post-BD FEV1/FVC</div><div className="stat-value">74%</div><div className="stat-ref">+16 point response</div><div className="stat-flag H">SIG RESPONSE</div></div>
          <div className="stat-box"><div className="stat-label">DLCO</div><div className="stat-value">17.68</div><div className="stat-ref">mL/min/mmHg</div></div>
        </div>
        <AlertBox type="danger">
          <strong>FeNO 82 ppb</strong> is markedly elevated — more than double the upper limit of normal (39 ppb). FeNO this high reflects active eosinophilic airway inflammation, not typical allergic asthma. Combined with a 16-point bronchodilator response and persistent blood eosinophilia, this pattern is consistent with eosinophilic disease (EGPA or HES) rather than simple atopic asthma.
        </AlertBox>
      </Section>

      <Section title="Eosinophilia Timeline" dot="#0D9488">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Date</th><th>Eos %</th><th>Abs Eos</th><th>Source</th><th>Context</th></tr></thead>
            <tbody>
              {[
                ["04/09/2026","12% (H)","0.53 (H)","Mayo","Post-mepolizumab dose 1"],
                ["04/01/2026","14% (H)","0.79 (H)","Mayo","Initial evaluation"],
                ["12/23/2025","15% (H)","1.1 (H)","Broadlawns ED","December crisis"],
                ["Historical","15.2% (peak)","—","Prior records","Peak documented value"],
              ].map(([d,p,a,s,c],i)=>(
                <tr key={i}>
                  <td>{d}</td><td className="flag-h">{p}</td><td className="flag-h">{a}</td><td>{s}</td><td style={{color:'var(--gray-600)',fontSize:12}}>{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Exclusion Workup — Completed at Mayo April 2026" dot="#16A34A">
        <AlertBox type="success">The following conditions have been formally excluded. All results confirmed negative.</AlertBox>
        <div className="table-wrap" style={{marginTop:12}}>
          <table>
            <thead><tr><th>Condition Excluded</th><th>Test</th><th>Result</th></tr></thead>
            <tbody>
              {[
                ["ANCA-positive vasculitis","MPO/PR3 ANCA panel","MPO <0.2, PR3 <0.2 — Negative"],
                ["Systemic mastocytosis","Serum tryptase","2.3 ng/mL (ref <11.5) — Normal"],
                ["B-cell lymphoproliferative disorder","Flow cytometry","No monotypic B-cell population"],
                ["T-cell lymphoproliferative disorder","TCR PCR","No clonal T-cell rearrangement"],
                ["Autoimmune CTD","ANA","<1:80 — Negative"],
                ["FIP1L1-PDGFRA positive CEL","Chronic Eosinophilia FISH panel","All loci normal — Negative"],
                ["Parasitic infection","GI pathogen panel + O&P","All negative"],
              ].map(([c,t,r],i)=>(
                <tr key={i}>
                  <td style={{fontWeight:500}}>{c}</td>
                  <td style={{color:'var(--gray-600)',fontSize:12}}>{t}</td>
                  <td className="flag-neg">{r}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Steroid Resistance — Documented Pattern" dot="#DC2626">
        <div className="narrative">
          Three courses of oral prednisone were administered in 2025 alone. The shortest inter-treatment interval was <strong>46 days</strong>. Wearable biometric data shows <em>incomplete physiological recovery between courses</em>. The December 2025 course was followed within days by the worst recorded values across all tracked metrics — a paradoxical response that contradicts the "allergic asthma" model.
        </div>
        <AlertBox type="warning">
          <strong>GLCCI1 genomic context ⚗:</strong> rs37972 (GLCCI1, heterozygous CT) — this variant is associated in published literature with measurably reduced FEV1 improvement after inhaled corticosteroid treatment. AlphaGenome predicts a functional effect in lung tissue (quantile 0.94 — top 6%). This provides a genomic correlate for the documented steroid resistance pattern.
        </AlertBox>
        <VariantCard
          rsid="rs37972" gene="GLCCI1" annotation="Steroid resistance — glucocorticoid-induced gene"
          genotype="CT (heterozygous)" quantile={0.9397}
          tissue="Lung (UBERON:0002048)"
          imgKey="glcci1"
          interpretation="GLCCI1 is expressed in response to glucocorticoids and modulates the cellular steroid response. The rs37972 variant has been associated in clinical studies with reduced FEV1 improvement after inhaled corticosteroid treatment in asthma patients. This is not a minor pharmacological footnote — it is a documented genetic contributor to treatment resistance in this exact drug class. Combined with the clinical record of three steroid courses in 2025 and the December 2025 paradoxical crisis, this variant provides a molecular-level explanation for why steroids are not controlling this disease."
        />
      </Section>

      <Section title="Pulmonary Variant Signals ⚗" dot="#7C3AED">
        <VariantCard
          rsid="rs1042714" gene="ADRB2" annotation="Gln27Glu — beta-2 adrenergic receptor"
          genotype="CG (heterozygous)" quantile={0.9946}
          tissue="Lung (UBERON:0002048)"
          imgKey="adrb2"
          interpretation="ADRB2 encodes the beta-2 adrenergic receptor — the target of albuterol and salmeterol (rescue bronchodilator and the LABA component of fluticasone-salmeterol 250-50). AlphaGenome predicts this variant has a top 0.5% functional effect on expression in lung tissue. The RNA-seq visualization shows a clear ALT peak at the variant position — visible divergence from reference. The receptor these bronchodilators are designed to activate may behave differently from the reference genome, relevant to bronchodilator selection and dosing."
        />
        <VariantCard
          rsid="rs1837253" gene="TSLP" annotation="Upstream eosinophilic inflammation — thymic stromal lymphopoietin"
          genotype="Variant present" quantile={0.9644}
          tissue="Lung (UBERON:0002048)"
          imgKey="tslp"
          interpretation="TSLP is the epithelial 'alarm signal' that initiates the eosinophilic inflammatory cascade. When airway epithelial cells are irritated or damaged, TSLP is released and drives IL-5 production, which in turn drives eosinophil recruitment. TSLP is upstream of the mepolizumab target (IL-5). AlphaGenome predicts this variant has a top 3.6% functional effect in lung tissue — a regulatory signal in the gene that triggers the eosinophilic process mepolizumab suppresses downstream."
        />
      </Section>

      <Section title="Current Treatment" dot="#0F2537">
        <div className="narrative">
          <strong>Mepolizumab (Nucala)</strong> prescribed 04/16/2026 — anti-IL-5 biologic targeting eosinophil survival and maturation. First dose administered at Mayo Clinic during April 2026 evaluation. As of June 2026, prior authorization is approved and the prescription is being processed at <strong>Accredo Specialty Pharmacy</strong>; home supply (100 mg SQ monthly) has not yet been received. Appropriate mechanistic intervention given the eosinophilic airway disease pattern, but does not address upstream TSLP signaling or the cardiac eosinophilic component.
        </div>
        <div className="narrative">
          Current inhaled regimen: <strong>Fluticasone-salmeterol 250-50 mcg diskus</strong>. Rescue: albuterol as needed.
        </div>
      </Section>
    </div>
  );
}

function TabRheumatology() {
  return (
    <div>
      <div className="page-header">
        <div className="page-title serif">Rheumatology & Systemic Inflammation</div>
        <div className="page-subtitle">Prepared for initial Rheumatology consultation. Summarizes the differential for systemic eosinophilic disease (EGPA vs. HES), objective autoantibody data, and multi-system connective tissue involvement.</div>
      </div>

      <AlertBox type="info">
        <strong>February 2026 ED directive:</strong> Presented with chest pain, wheezing, and transient eGFR drop. Discharge instructions explicitly stated: <em>"follow up with rheumatology and hematology for further workup of autoimmune and eosinophilia concerns."</em>
      </AlertBox>

      <Section title="The EGPA / HES Differential" dot="#DC2626">
        <div className="narrative">
          Patient exhibits the classic clinical triad warranting evaluation for Eosinophilic Granulomatosis with Polyangiitis (EGPA) or Hypereosinophilic Syndrome (HES). Mayo Clinic Hematology formally opened this differential in April 2026. The exclusion workup completed at that visit eliminated all malignant and clonal causes — the differential now sits between ANCA-negative EGPA and idiopathic HES.
        </div>
        <div className="finding-grid">
          <div className="finding-card confirmed">
            <div className="finding-card-label">Phase 1 — Allergic (Confirmed)</div>
            <div className="finding-card-text"><strong>Severe Persistent Asthma</strong> — steroid-dependent, multiple prednisone bursts per year. Stepped up to mepolizumab (Nucala) April 2026. Chronic idiopathic urticaria documented since at least 2011.</div>
          </div>
          <div className="finding-card confirmed">
            <div className="finding-card-label">Phase 2 — Eosinophilic (Confirmed)</div>
            <div className="finding-card-text"><strong>Chronic Eosinophilia</strong> — persistent elevation peaking at 15.2%. Rebounds on steroid taper. Clonal/malignant processes excluded via FISH and flow cytometry (Mayo April 2026).</div>
          </div>
          <div className="finding-card active">
            <div className="finding-card-label">Phase 3 — Vasculitic (Under Evaluation)</div>
            <div className="finding-card-text"><strong>Multi-organ involvement</strong> — cardiac (declining EF, NT-proBNP 263 flagged), renal (eGFR episodes to 73), neurological (paresthesia hands/feet), pulmonary (FeNO 82, bronchial wall thickening).</div>
          </div>
        </div>
        <AlertBox type="warning">
          <strong>ANCA-negative does not exclude EGPA.</strong> MPO and PR3 antibodies are negative (Mayo April 2026). However, up to 60% of clinical EGPA presentations are ANCA-negative — particularly cardiac-predominant EGPA, which is the phenotype most consistent with this patient's presentation. ANCA-negative status is documented, not dismissive.
        </AlertBox>
      </Section>

      <Section title="Objective Autoimmune & Inflammatory Markers" dot="#D97706">
        <div className="stat-row">
          <div className="stat-box flagged"><div className="stat-label">Rheumatoid Factor</div><div className="stat-value">17.3</div><div className="stat-ref">U/mL · ref ≤14.0 · Dec 2025</div><div className="stat-flag H">ELEVATED</div></div>
          <div className="stat-box critical"><div className="stat-label">FeNO</div><div className="stat-value">82</div><div className="stat-ref">ppb · ULN 39 · Apr 2026</div><div className="stat-flag ABN">2× UPPER LIMIT</div></div>
          <div className="stat-box flagged"><div className="stat-label">Eosinophils (peak)</div><div className="stat-value">15.2%</div><div className="stat-ref">Absolute peak · multiple dates</div><div className="stat-flag H">CHRONIC</div></div>
          <div className="stat-box normal"><div className="stat-label">ANA</div><div className="stat-value">NEG</div><div className="stat-ref">&lt;1:80 · Apr 2026</div></div>
          <div className="stat-box normal"><div className="stat-label">MPO-ANCA</div><div className="stat-value">NEG</div><div className="stat-ref">&lt;0.2 · Apr 2026</div></div>
          <div className="stat-box normal"><div className="stat-label">PR3-ANCA</div><div className="stat-value">NEG</div><div className="stat-ref">&lt;0.2 · Apr 2026</div></div>
        </div>
        <AlertBox type="warning">
          <strong>Anti-CCP testing outstanding.</strong> RF elevated at 17.3 U/mL (above ref 14.0). Anti-CCP has not been drawn. This is the critical next step to determine whether the RF elevation represents early seronegative RA, CTD overlap, or a nonspecific inflammatory marker in the context of the eosinophilic process.
        </AlertBox>
        <div className="table-wrap" style={{marginTop:12}}>
          <table>
            <thead><tr><th>Condition</th><th>Test</th><th>Result</th><th>Status</th></tr></thead>
            <tbody>
              {[
                ["ANCA-positive vasculitis","MPO + PR3 ANCA","Both <0.2","Excluded"],
                ["Systemic mastocytosis","Serum tryptase","2.3 ng/mL (normal)","Excluded"],
                ["B-cell lymphoproliferative","Flow cytometry","No monotypic B-cells","Excluded"],
                ["T-cell lymphoproliferative","TCR PCR","No clonal rearrangement","Excluded"],
                ["Autoimmune CTD","ANA","<1:80 negative","Excluded"],
                ["FIP1L1-PDGFRA CEL","Chronic Eos FISH panel","All loci normal","Excluded"],
                ["Parasitic infection","GI pathogen + O&P","All negative","Excluded"],
                ["RA / seronegative","Anti-CCP","NOT YET DRAWN","Outstanding"],
              ].map(([c,t,r,s],i)=>(
                <tr key={i}>
                  <td style={{fontWeight:500}}>{c}</td>
                  <td style={{fontSize:12,color:'var(--gray-600)'}}>{t}</td>
                  <td className={s==="Excluded"?"flag-neg":s==="Outstanding"?"flag-h":""}>{r}</td>
                  <td><span className={`pill ${s==="Excluded"?"excluded":s==="Outstanding"?"urgent":"active"}`}>{s}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Multi-System Organ Involvement" dot="#0D9488">
        <div className="narrative">
          The following organ systems show documented involvement consistent with a systemic eosinophilic vasculitic process. Each finding is sourced from clinical records.
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>System</th><th>Finding</th><th>Source / Date</th><th>Significance</th></tr></thead>
            <tbody>
              {[
                ["Cardiac","NT-proBNP 263 pg/mL (above ref ≤162). EF decline 56% → 50-55%. Nonischemic cardiomyopathy (TTN). Grade I diastolic dysfunction.","Mayo 04/01/2026 · Echo 02/2026","Eosinophilic cardiotoxicity + TTN structural substrate = dual-hit"],
                ["Pulmonary","FeNO 82 ppb (2× ULN). Pre-BD FEV1/FVC 57%. Bronchial wall thickening. Air trapping.","Mayo PFT 04/15/2026","Eosinophilic airway inflammation — not simple atopic asthma"],
                ["Renal","eGFR episodes to 65-73 on multiple occasions. Predicted 24hr protein 224 mg/day (borderline). Trigonitis.","Multiple dates · Mayo 04/01/2026","Eosinophilic interstitial nephritis pattern; NSAID contraindicated"],
                ["Neurological","Documented paresthesia hands and feet. Chronic myalgia since high school. Chronic Pain Syndrome.","Clinical notes · Dr. Fernandes UNMC 2020","Peripheral neuropathy pattern consistent with EGPA Phase 3"],
                ["Dermatologic","Chronic idiopathic urticaria documented since at least 2011. History of hives.","Medical records ≥2011","Mast cell / eosinophilic allergic manifestation"],
                ["GI / Pelvic","IBS, spastic pelvic floor syndrome. Retrospective eosinophil staining of retained surgical specimens outstanding.","Documented diagnoses","Eosinophilic GI/pelvic involvement possible — specimens not yet stained"],
              ].map(([sys,finding,source,sig],i)=>(
                <tr key={i}>
                  <td style={{fontWeight:600,color:'var(--navy)',whiteSpace:'nowrap'}}>{sys}</td>
                  <td style={{fontSize:12}}>{finding}</td>
                  <td style={{fontSize:11,color:'var(--gray-600)'}}>{source}</td>
                  <td style={{fontSize:11,color:'var(--teal)',fontStyle:'italic'}}>{sig}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Connective Tissue & Vascular Fragility Overlap" dot="#7C3AED">
        <div className="narrative">
          A concurrent heritable connective tissue disorder is suspected and awaiting formal genetics evaluation. The rheumatologic relevance is significant: EGPA causes eosinophilic vasculitis, and if vascular walls are simultaneously compromised by CTD-related collagen deficiency, the threshold for vascular events is lowered. Both processes independently affect the same end organs.
        </div>
        <div className="finding-grid">
          <div className="finding-card active">
            <div className="finding-card-label">Genomic Signal ⚗ (Research)</div>
            <div className="finding-card-text"><strong>COL3A1 rs1800255 heterozygous (AG)</strong> — vEDS-associated variant. AlphaGenome predicts top 0.05% functional effect in cardiac tissue (quantile 0.9995 — highest in full batch). Pending clinical genetics confirmation.</div>
          </div>
          <div className="finding-card confirmed">
            <div className="finding-card-label">Imaging Confirmed</div>
            <div className="finding-card-text"><strong>Aberrant right subclavian artery</strong> — retroesophageal origin from thoracic aorta. Right apical blebs. Both documented CT Chest Mayo 04/15/2026.</div>
          </div>
          <div className="finding-card confirmed">
            <div className="finding-card-label">Cardiac Imaging</div>
            <div className="finding-card-text"><strong>Redundant interatrial septum</strong> + mild multivalvular regurgitation (mitral, tricuspid, aortic). Multi-valve without rheumatic history — CTD marker. Echo 07/2024.</div>
          </div>
          <div className="finding-card confirmed">
            <div className="finding-card-label">Physical Exam (Mayo)</div>
            <div className="finding-card-text"><strong>Hypermobility Joint</strong> — Active Problem. Beighton markers confirmed by Dr. Poirier: knee hyperextension, ankle hyperextension, thumb-to-wrist apposition.</div>
          </div>
        </div>
        <QuoteBlock
          text="I have ordered genetic consultation as I am concerned that in addition to the cardiomyopathy, there are musculoskeletal issues related to this genetic pathogenic variant."
          attr="Dr. Maria Poirier, M.D., Mayo Clinic — documented in clinical note"
        />
      </Section>

      <Section title="The Triple-Hit Hypothesis" dot="#0F2537">
        <div className="narrative">
          The emerging clinical picture suggests three concurrent pathological processes, each independently serious and potentially interacting to produce a phenotype more severe than any alone would predict.
        </div>
        <div className="finding-grid">
          <div className="finding-card confirmed">
            <div className="finding-card-label">Hit 1 — Confirmed</div>
            <div className="finding-card-text"><strong>TTN Pathogenic Frameshift Deletion</strong><br/>Structural cardiac substrate. Haploinsufficiency → dilated cardiomyopathy. High family penetrance. EF declining.</div>
          </div>
          <div className="finding-card active">
            <div className="finding-card-label">Hit 2 — Active Investigation</div>
            <div className="finding-card-text"><strong>EGPA / HES</strong><br/>Eosinophilic infiltration of cardiac, pulmonary, renal, and neurological tissue. ANCA-negative. Steroid-resistant. Mepolizumab initiated.</div>
          </div>
          <div className="finding-card active">
            <div className="finding-card-label">Hit 3 — Pending Genetics</div>
            <div className="finding-card-text"><strong>Heritable CTD (vEDS suspected)</strong><br/>Vascular wall fragility from collagen deficiency. Eosinophilic vasculitis acting on already-compromised vessels. Formal genetics evaluation ordered.</div>
          </div>
        </div>
        <AlertBox type="danger">
          <strong>Interaction risk:</strong> EGPA-driven eosinophilic vasculitis inflames and infiltrates vessel walls. If those walls carry vEDS-related structural collagen deficiency, the combined risk of arterial event is substantially higher than either condition alone would predict. This interaction has not yet been formally evaluated as an integrated clinical question.
        </AlertBox>
      </Section>

      <Section title="Priority Questions for Rheumatology" dot="#DC2626">
        <div className="table-wrap">
          <table>
            <thead><tr><th>#</th><th>Question</th><th>Supporting Evidence</th></tr></thead>
            <tbody>
              {[
                ["1","Does the multi-system eosinophilic involvement pattern meet criteria for ANCA-negative EGPA, and if not, what additional workup is needed to formally evaluate or exclude it?","Three-phase pattern (allergic → eosinophilic → vasculitic); cardiac, pulmonary, renal, neurological involvement; steroid resistance; December 2025 paradoxical crisis"],
                ["2","Is the elevated RF (17.3 U/mL) a CTD overlap marker, an early RA signal, or a nonspecific inflammatory finding? Anti-CCP has not been drawn.","RF 17.3 above ref 14.0; ANA negative; full CTD serology incomplete"],
                ["3","Is there evidence of eosinophilic vasculitis on skin or tissue biopsy that would support the EGPA diagnosis?","Chronic urticaria since 2011; multi-organ involvement pattern"],
                ["4","How does the suspected vascular CTD (COL3A1 variant, aberrant subclavian, apical blebs) change the risk framing for eosinophilic vasculitis affecting already-fragile vessel walls?","vEDS-associated COL3A1 variant pending genetics; documented vascular anomalies on imaging"],
                ["5","Is retrospective eosinophil staining of retained surgical pathology specimens (2017 laparoscopy, 2020 hysterectomy) feasible and indicated?","If eosinophilic infiltration is found in pelvic tissue predating this workup, it significantly extends the disease timeline"],
              ].map(([n,q,e],i)=>(
                <tr key={i}>
                  <td style={{fontWeight:700,color:'var(--navy)',textAlign:'center',width:32}}>{n}</td>
                  <td style={{fontWeight:500,fontSize:13}}>{q}</td>
                  <td style={{fontSize:12,color:'var(--gray-600)'}}>{e}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}

function TabCTD() {
  return (
    <div>
      <div className="page-header">
        <div className="page-title serif">Connective Tissue</div>
        <div className="page-subtitle">A constellation of vascular anomalies, tissue laxity findings, and tendon pathology documented across imaging, examination, and genomic analysis. Formal CTD genetics evaluation is an outstanding next step.</div>
      </div>

      <AlertBox type="warning">
        <strong>Formal genetics evaluation not yet completed.</strong> The findings below represent an emerging pattern documented in existing records. The connective tissue disorder hypothesis has been raised by multiple providers but not yet formally classified. Dr. Poirier (Mayo) has ordered genetic consultation specifically for this reason.
      </AlertBox>

      <Section title="Vascular Anomalies — Documented in Imaging" dot="#DC2626">
        <div className="narrative">The co-occurrence of these vascular findings in a patient under 50 with hypermobility and multi-system fragility constitutes a clinically significant pattern warranting formal CTD genetics evaluation.</div>
        <div className="finding-grid">
          <div className="finding-card confirmed">
            <div className="finding-card-label">CT Chest — Mayo 4/15/2026</div>
            <div className="finding-card-text"><strong>Aberrant right subclavian artery</strong> — retroesophageal origin from thoracic aorta. Vascular anomaly associated with heritable CTDs.</div>
          </div>
          <div className="finding-card confirmed">
            <div className="finding-card-label">CT Chest — Mayo 4/15/2026</div>
            <div className="finding-card-text"><strong>Few right apical blebs</strong> — in patients under 50, strongly associated with heritable CTDs including Marfan, vEDS, and hEDS.</div>
          </div>
          <div className="finding-card confirmed">
            <div className="finding-card-label">Echocardiogram — 7/2024</div>
            <div className="finding-card-text"><strong>Redundant interatrial septum</strong> — classic finding of floppy, lax tissue in hypermobility disorders.</div>
          </div>
          <div className="finding-card confirmed">
            <div className="finding-card-label">Echocardiogram</div>
            <div className="finding-card-text"><strong>Multivalvular regurgitation</strong> — mild mitral, tricuspid, and aortic regurgitation. Multi-valve involvement in a young patient without rheumatic history is a CTD marker.</div>
          </div>
        </div>
      </Section>

      <Section title="Hypermobility — Formally Documented" dot="#0D9488">
        <div className="finding-grid">
          <div className="finding-card confirmed">
            <div className="finding-card-label">Diagnosis</div>
            <div className="finding-card-text">Hypermobility Joint — Active Problem, Mayo Clinic (noted 04/01/2026)</div>
          </div>
          <div className="finding-card confirmed">
            <div className="finding-card-label">Beighton Markers (Dr. Poirier, Mayo)</div>
            <div className="finding-card-text">Knee hyperextension confirmed. Ankle hyperextension confirmed. Thumb to wrist apposition confirmed.</div>
          </div>
        </div>
        <QuoteBlock
          text="I have ordered genetic consultation as I am concerned that in addition to the cardiomyopathy, there are musculoskeletal issues related to this genetic pathogenic variant."
          attr="Dr. Maria Poirier, M.D., Mayo Clinic — documented in clinical note"
        />
      </Section>

      <Section title="Tendon & Bone Pathology" dot="#D97706">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Location</th><th>Finding</th><th>Source</th></tr></thead>
            <tbody>
              {[
                ["Left shoulder","Partial bursal surface tearing of supraspinatus tendon","MRI"],
                ["Right hip","Partial gluteal tendon tearing (prior read) / trace bursal edema (Mayo re-read 4/9/2026)","MRI — note discrepancy between reads"],
                ["Left iliac (pelvis)","7 mm hyperintense lesion","MRI"],
                ["T3 vertebral body","9 mm sclerotic focus, nonspecific","CT Chest, Mayo 4/15/2026"],
                ["Distal left femur","1.9 cm circumscribed sclerosis (nonossifying fibroma pattern)","MRI"],
              ].map(([l,f,s],i)=>(
                <tr key={i}><td style={{fontWeight:500}}>{l}</td><td>{f}</td><td style={{color:'var(--gray-600)',fontSize:12}}>{s}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <AlertBox type="info">
          Multi-site unexplained bone lesions in the setting of chronic eosinophilia may warrant consideration of eosinophilic bone marrow involvement, a recognized manifestation of HES.
        </AlertBox>
      </Section>

      <Section title="COL3A1 Genomic Signal ⚗" dot="#7C3AED">
        <div className="narrative">
          COL3A1 encodes Type III collagen — the structural protein that gives blood vessels, skin, and hollow organs their elasticity. Pathogenic variants in COL3A1 cause <strong>vascular Ehlers-Danlos syndrome (vEDS)</strong>, characterized by arterial fragility and spontaneous vascular events.
        </div>
        <VariantCard
          rsid="rs1800255" gene="COL3A1" annotation="Ala698Thr — vEDS-associated variant"
          genotype="AG (heterozygous)" quantile={0.9995}
          tissue="Heart (UBERON:0000948) — highest signal in full batch"
          imgKey="col3a1"
          interpretation="This is the highest quantile score in the entire AlphaGenome batch (0.9995 — top 0.05%). AlphaGenome predicts this COL3A1 variant has a top 0.05% functional effect on expression specifically in cardiac tissue. This is the same tissue where redundant interatrial septum and multivalvular regurgitation are documented. The variant is heterozygous — one copy affected. Combined with the vascular anomaly pattern (aberrant subclavian, apical blebs), this finding warrants formal vEDS evaluation by a genetics provider."
        />
      </Section>

      <Section title="GI & Pelvic Connective Tissue Manifestations" dot="#475569">
        <div className="narrative">Connective tissue disorders characteristically affect smooth muscle and pelvic floor integrity. The following documented diagnoses are consistent with systemic CTD:</div>
        <div className="finding-grid">
          {[
            ["IBS","Longstanding — documented"],
            ["Spastic pelvic floor syndrome","High-tone pelvic floor dysfunction"],
            ["Internal & external hemorrhoids","Surgically treated 2026"],
            ["Trigonitis bladder","Active Problem — Mayo 5/1/2026"],
            ["Bladder mass 3mm","Stable since 2016 — CT Urogram 4/1/2026"],
          ].map(([t,d],i)=>(
            <div key={i} className="finding-card info">
              <div className="finding-card-label">Documented</div>
              <div className="finding-card-text"><strong>{t}</strong><br/>{d}</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function TabSurgicalTrauma() {
  return (
    <div>
      <div className="page-header">
        <div className="page-title serif">Surgical & Trauma History</div>
        <div className="page-subtitle">A 20+ year history of chronic pelvic inflammation followed by early surgical menopause and major blunt force trauma — establishing the allostatic load relevant to current immunological and autonomic findings.</div>
      </div>

      <AlertBox type="info">
        <strong>Clinical relevance:</strong> The combination of long-standing endometriosis, multiple surgical interventions, loss of protective ovarian hormones, and significant blunt force trauma is directly relevant to the systemic dysautonomia, mast cell activation, and central sensitization currently under evaluation. Retrospective eosinophil staining of retained surgical pathology specimens is a high-priority outstanding diagnostic step.
      </AlertBox>

      <Section title="Reproductive Pathology & Surgical History" dot="#DC2626">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Date</th><th>Event</th><th>Clinical Significance</th></tr></thead>
            <tbody>
              {[
                ["1998 (Age 14)","Clinical diagnosis: Endometriosis","Severe dysmenorrhea, ER evaluations. 20+ year inflammatory disease burden begins."],
                ["July 2017","Diagnostic laparoscopy","Excision/fulguration of pelvic endometriosis and paraovarian cysts."],
                ["September 2020","Robotic Total Hysterectomy + BSO","Intractable endometriosis and PCOS. Triggered sudden early surgical menopause at age 36 — severely altered baseline hormonal and inflammatory mediators."],
                ["2026","Hemorrhoidectomy","Documented. Consistent with CTD pelvic floor and GI fragility pattern."],
              ].map(([d,e,c],i)=>(
                <tr key={i}>
                  <td style={{fontWeight:600,whiteSpace:'nowrap',color:'var(--navy)'}}>{d}</td>
                  <td style={{fontWeight:500}}>{e}</td>
                  <td style={{fontSize:12,color:'var(--gray-700)'}}>{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <AlertBox type="warning">
          <strong>Outstanding diagnostic step:</strong> Retrospective eosinophil staining of retained surgical pathology specimens from the 2017 laparoscopy and 2020 hysterectomy. If eosinophilic infiltration is identified in pelvic tissue predating the current eosinophilic workup, this would significantly extend the known disease timeline and strengthen the EGPA/HES case.
        </AlertBox>
      </Section>

      <Section title="Major Trauma — June 2021" dot="#D97706">
        <div className="narrative">
          Nine months after surgical menopause, a high-speed motor vehicle accident introduced a second major inflammatory insult. This temporal proximity is clinically relevant to the subsequent acceleration of systemic symptoms.
        </div>
        <div className="finding-grid">
          <div className="finding-card gap">
            <div className="finding-card-label">Date</div>
            <div className="finding-card-text"><strong>June 10, 2021</strong><br/>Single vehicle impact into guardrail at 65-70 mph. Loss of consciousness confirmed.</div>
          </div>
          <div className="finding-card gap">
            <div className="finding-card-label">Documented Injuries</div>
            <div className="finding-card-text"><strong>Nondisplaced sternal fracture</strong><br/>Chest wall trauma. Widespread musculoskeletal pain — ribs, bilateral knees, shoulders.</div>
          </div>
          <div className="finding-card active">
            <div className="finding-card-label">Clinical Significance</div>
            <div className="finding-card-text">Sternal fracture is directly adjacent to the cardiac structures with documented pathology. Blunt chest trauma 9 months post-BSO in the context of a structural cardiomyopathy and emerging eosinophilic process.</div>
          </div>
        </div>
      </Section>

      <Section title="Allostatic Load — Clinical Synthesis" dot="#0D9488">
        <div className="narrative">
          The sequence of events — 20+ years of endometriosis-driven chronic pelvic inflammation, early surgical menopause with abrupt hormonal withdrawal, and major blunt force trauma within 9 months — represents a compounding allostatic burden. Each event individually is a recognized driver of autonomic dysregulation, mast cell activation, and central sensitization. Their sequential occurrence in this patient provides important context for the multisystem presentation.
        </div>
        <div className="finding-grid">
          <div className="finding-card confirmed">
            <div className="finding-card-label">Confirmed</div>
            <div className="finding-card-text">Inappropriate Sinus Tachycardia — autonomic dysregulation documented</div>
          </div>
          <div className="finding-card confirmed">
            <div className="finding-card-label">Confirmed</div>
            <div className="finding-card-text">Idiopathic urticaria since at least 2011 — mast cell/allergic hyperreactivity documented</div>
          </div>
          <div className="finding-card active">
            <div className="finding-card-label">Under Evaluation</div>
            <div className="finding-card-text">Central sensitization contributing to Chronic Pain Syndrome — supported by COMT Val158Met variant</div>
          </div>
          <div className="finding-card active">
            <div className="finding-card-label">Under Evaluation</div>
            <div className="finding-card-text">Eosinophilic infiltration of pelvic tissue — retrospective staining of retained specimens outstanding</div>
          </div>
        </div>
      </Section>
    </div>
  );
}

function TabPain() {
  return (
    <div>
      <div className="page-header">
        <div className="page-title serif">Pain & Musculoskeletal</div> 
        <div className="page-subtitle">Chronic Pain Syndrome with a documented structural and systemic basis. Traditional pain management is severely limited, as NSAID use is now formally contraindicated by cardiac and renal status.</div> 
      </div>

      <AlertBox type="danger">
        <strong>Current bridge gap (as of June 2026):</strong> Meloxicam was discontinued without notification or replacement plan. OTC ibuprofen was used in the interim and has been stopped due to acute bilateral ankle edema and BP elevation. Acetaminophen alone is not providing adequate pain control. Next pain management appointment: June 18, 2026.
      </AlertBox>

      <Section title="Structural Pain Substrates — Imaging Confirmed" dot="#DC2626">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Location</th><th>Finding</th><th>Source</th></tr></thead>
            <tbody>
              {[
                ["Left shoulder","Partial bursal surface tearing of supraspinatus tendon","MRI"],
                ["Right hip","Gluteal bursal inflammation + trace edema","MRI — Mayo re-read 4/9/2026"],
                ["Left iliac (pelvis)","7 mm hyperintense lesion","MRI"],
                ["T3 vertebral body","9 mm sclerotic focus","CT Chest, Mayo 4/15/2026"],
                ["Distal left femur","1.9 cm circumscribed sclerosis","MRI"],
                ["Knee/ankle","Hyperextension — Beighton markers confirmed","Dr. Poirier exam, Mayo"],
                ["Diffuse","Chronic myalgia dating to high school","Dr. Fernandes, UNMC Neurology 2020"],
              ].map(([l,f,s],i)=>(
                <tr key={i}><td style={{fontWeight:500}}>{l}</td><td>{f}</td><td style={{color:'var(--gray-600)',fontSize:12}}>{s}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="NSAID Contraindication — Cardiac & Renal" dot="#DC2626">
        <AlertBox type="danger">
          <strong>NSAIDs carry meaningful risk in this patient:</strong> Nonischemic cardiomyopathy with declining EF (NSAIDs increase cardiac preload/afterload) · Baseline eGFR variability (73 documented 2025) — NSAIDs cause renal vasoconstriction · Diastolic hypertension despite max beta blockade — NSAIDs blunt antihypertensive effect · NT-proBNP 263 flagged abnormal — fluid retention risk is additive · Recent episode of NSAID-induced ankle edema confirmed June 2026.
        </AlertBox>
      </Section>

      <Section title="COMT Pain Sensitivity ⚗" dot="#7C3AED">
        <VariantCard
          rsid="rs4680" gene="COMT" annotation="Val158Met — catechol-O-methyltransferase pain sensitivity"
          genotype="AG (heterozygous)" quantile={0.9970}
          tissue="Cerebellum / Brain (UBERON:0002037)"
          imgKey="comt"
          interpretation="COMT breaks down dopamine and norepinephrine in the brain. The Val158Met variant reduces COMT enzyme efficiency — catecholamines linger longer, amplifying pain signal transmission. Heterozygous individuals have intermediate COMT activity, producing a pain sensitivity phenotype between high and low responders. AlphaGenome predicts a top 0.3% functional effect in brain tissue. Supports rationale for individualized pain management dosing — altered catecholamine clearance may amplify pain signal transmission relative to population-average COMT activity. Standard dosing calibrated against average COMT activity may be systematically inadequate for this patient."
        />
      </Section>

      <Section title="Pharmacogenomics Relevant to Pain Management ⚗" dot="#7C3AED">
        <div className="narrative">The following pharmacogenomic variants are relevant to analgesic selection and dosing. All are sourced from 23andMe raw data (rs IDs confirmed present in file).</div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Gene</th><th>Variant</th><th>Genotype</th><th>Clinical Relevance</th></tr></thead>
            <tbody>
              {[
                ["OPRM1","rs1799971 — A118G","AA (homozygous)","Opioid receptor binding affinity altered. Homozygous AA — may require higher opioid doses for equivalent effect. Relevant to tramadol and any opioid analgesic."],
                ["COMT","rs4680 — Val158Met","AG (heterozygous)","Intermediate pain sensitivity (see above). Relevant to all analgesic dosing."],
                ["CYP2D6","rs5030655 — *6 allele","II (variant)","CYP2D6 metabolizes tramadol to active form. *6 allele affects metabolizer status — may reduce tramadol efficacy."],
                ["CYP2C9","rs1799853 — *2 allele","CC","CYP2C9 metabolizes NSAIDs and some analgesics. *2 allele = reduced function."],
                ["CACNA2D1","Gabapentin binding site","Present","CACNA2D1 encodes the alpha-2-delta subunit — the binding site for gabapentin and pregabalin. Variant present."],
              ].map(([g,v,gt,r],i)=>(
                <tr key={i}><td style={{fontWeight:600,color:'var(--navy)'}}>{g}</td><td style={{fontFamily:'monospace',fontSize:12}}>{v}</td><td style={{fontFamily:'monospace',fontSize:12,color:'var(--teal)'}}>{gt}</td><td style={{fontSize:12}}>{r}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <AlertBox type="info">
          <strong>Pregabalin vs gabapentin:</strong> Pregabalin has more predictable pharmacokinetics and better bioavailability than gabapentin. Given the CACNA2D1 variant and the COMT intermediate phenotype, pregabalin is the more pharmacologically rational choice. Prior provider (pain management pre-Mayo) was already considering this direction.
        </AlertBox>
      </Section>
    </div>
  );
}

function TabGenomics() {
  return (
    <div>
      <div className="page-header">
       <div className="page-title serif">Genomics & Bioinformatics</div> 
        <div className="page-subtitle">Translational functional analysis utilizing AlphaGenome and AlphaMissense. Raw .tsv data highlights significant connective tissue and structural variants (including COL3A1) to be formally evaluated at the upcoming Genetics consult.</div>
      </div>
      
      <AlertBox type="warning">
        <strong>Research content:</strong> This entire tab contains computational predictions from AlphaGenome and 23andMe variant analysis. None of these outputs are clinical diagnostic results. They are included as supplementary context for provider evaluation. Confirmed clinical diagnoses are presented on the relevant specialty tabs.
      </AlertBox>

      <Section title="AlphaGenome Batch Summary" dot="#7C3AED">
        <div className="narrative">Ten variants were scored through AlphaGenome in tissue-specific contexts. Quantile scores reflect the predicted functional effect of each variant relative to all other variants scored — 0.99 = top 1% of predicted effects.</div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Variant</th><th>Gene</th><th>Category</th><th>Tissue</th><th>Peak Quantile</th><th>Clinical Relevance</th></tr></thead>
            <tbody>
              {[
                ["rs1800255","COL3A1","Connective tissue","Heart","0.9995","Highest signal in batch. vEDS-associated. Cardiac tissue."],
                ["rs1801253","ADRB1","Cardiac/PGx","Heart + LV","0.9973","Metoprolol target receptor. Cardiac tissue signal."],
                ["rs9923231","VKORC1","Pharmacogenomics","Muscle","0.9995","Warfarin sensitivity. High signal in skeletal muscle."],
                ["rs4680","COMT","Pain","Cerebellum","0.9970","Pain sensitivity. Brain tissue signal."],
                ["rs1042714","ADRB2","Pulmonary","Lung","0.9946","Bronchodilator target. Lung tissue signal."],
                ["rs9290877","LPP","EGPA","Lung","0.9778","Airway inflammation. Lung tissue signal."],
                ["rs1837253","TSLP","EGPA","Lung","0.9644","Upstream eosinophilic alarm. Lung tissue signal."],
                ["rs6454802","BACH2","EGPA","Lung","0.9459","Immune regulation. Lung tissue signal."],
                ["rs1801131","MTHFR","Methylation","Liver","0.9792","Homocysteine metabolism. Liver tissue signal."],
                ["rs37972","GLCCI1","Pulmonary","Lung","0.9397","Steroid resistance. Lung tissue signal."],
              ].map(([rsid,gene,cat,tissue,q,rel],i)=>(
                <tr key={i}>
                  <td style={{fontFamily:'monospace',fontWeight:600,color:'var(--navy)'}}>{rsid}</td>
                  <td style={{fontWeight:600,color:'var(--blue)'}}>{gene}</td>
                  <td style={{fontSize:12}}>{cat}</td>
                  <td style={{fontSize:12,color:'var(--gray-600)'}}>{tissue}</td>
                  <td style={{fontWeight:700,color:parseFloat(q)>0.99?'var(--red)':'var(--amber)'}}>{q}</td>
                  <td style={{fontSize:12}}>{rel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="TTN Deletion — Full Analysis" dot="#0F2537">
        <VariantCard
          rsid="TTN_c.73318_73324delGAATGCT" gene="TTN" annotation="p.E24440MfsX2 — pathogenic frameshift deletion"
          genotype="Heterozygous" quantile={0.9957}
          tissue="Heart (UBERON:0000948)"
          imgKey="ttn_multi"
          interpretation="Confirmed pathogenic variant. 7 base-pair deletion causing frameshift and premature stop at p.E24440MfsX2. Titin haploinsufficiency → dilated cardiomyopathy. AlphaGenome analysis shows preserved transcription from the functional allele (expected for heterozygous frameshift) and no splice architecture disruption — consistent with a clean protein-level truncation mechanism. ATAC panel incomplete in this run. Full clinical context on the Cardiac tab."
        />
      </Section>

      <Section title="EGPA-Relevant Variants" dot="#D97706">
        <VariantCard rsid="rs1837253" gene="TSLP" annotation="Upstream eosinophilic inflammation alarm signal" genotype="Variant present" quantile={0.9644} tissue="Lung (UBERON:0002048)" imgKey="tslp" interpretation="TSLP is the epithelial 'danger signal' released by airway epithelium that initiates the eosinophilic cascade. It drives Th2 differentiation, IL-5 production, and eosinophil recruitment. AlphaGenome predicts a top 3.6% functional effect in lung tissue — a regulatory variant in the gene upstream of the patient's active eosinophilic inflammatory process." />
        <VariantCard rsid="rs6454802" gene="BACH2" annotation="Immune regulatory transcription factor" genotype="Variant present" quantile={0.9459} tissue="Lung (UBERON:0002048)" imgKey="bach2" interpretation="BACH2 is a transcriptional repressor that regulates Th2 immune responses and eosinophilic disease susceptibility. GWAS studies have linked BACH2 variants to asthma and eosinophilic conditions. AlphaGenome predicts a top 5.4% functional effect in lung tissue." />
        <VariantCard rsid="rs9290877" gene="LPP" annotation="Airway structural integrity / cell adhesion" genotype="Variant present" quantile={0.9778} tissue="Lung (UBERON:0002048)" imgKey="lpp" interpretation="LPP encodes a scaffold protein involved in cell adhesion and tissue integrity. Emerging evidence links LPP to airway inflammation and remodeling. AlphaGenome predicts a top 2.2% functional effect on LPP expression in lung tissue." />
      </Section>

      <Section title="Methylation / Metabolic" dot="#475569">
        <VariantCard rsid="rs1801131" gene="MTHFR" annotation="c.1298A>C — folate metabolism" genotype="GT (heterozygous)" quantile={0.9792} tissue="Liver / Small intestine" imgKey="mthfr" interpretation="MTHFR A1298C variant reduces enzyme efficiency for converting folate to its active form. Combined with the C677T variant (rs1801133, GG homozygous — also present), both MTHFR checkpoints carry variants. This affects homocysteine clearance, methylation capacity, and B12/folate metabolism. Elevated homocysteine is an independent cardiovascular risk factor." />
      </Section>
    </div>
  );
}

function TabLabs() {
  const [drawer, setDrawer] = useState(null);
  return (
    <div>
      <div className="page-header">
        <div className="page-title serif">Labs & Trends</div>
        <div className="page-subtitle">Two persistent longitudinal patterns: chronic elevated eosinophilia and recurring eGFR decline. Both directly inform the EGPA/HES differential and the NSAID contraindication.</div>
      </div>

      <Section title="Mayo Clinic Labs — April 2026" dot="#0F2537">
        <div className="stat-row">
          <div className="stat-box flagged"><div className="stat-label">NT-proBNP</div><div className="stat-value">263</div><div className="stat-ref">pg/mL · ref ≤162</div><div className="stat-flag H">HIGH</div></div>
          <div className="stat-box critical"><div className="stat-label">Eosinophils %</div><div className="stat-value">14%</div><div className="stat-ref">Manual smear · ref 1-3%</div><div className="stat-flag ABN">HIGH</div></div>
          <div className="stat-box flagged"><div className="stat-label">Abs Eosinophils</div><div className="stat-value">0.79</div><div className="stat-ref">K/uL · ref 0.0-0.5</div><div className="stat-flag H">HIGH</div></div>
          <div className="stat-box normal"><div className="stat-label">eGFR (Apr 2026)</div><div className="stat-value">&gt;90</div><div className="stat-ref">mL/min/1.73m²</div></div>
          <div className="stat-box normal"><div className="stat-label">Tryptase</div><div className="stat-value">2.3</div><div className="stat-ref">ng/mL · ref &lt;11.5</div></div>
          <div className="stat-box normal"><div className="stat-label">ANA</div><div className="stat-value">NEG</div><div className="stat-ref">&lt;1:80</div></div>
        </div>
        <button className="drawer-btn" onClick={()=>setDrawer('mayo-full')}>View Full Mayo Lab Panel</button>
        <Drawer open={drawer==='mayo-full'} onClose={()=>setDrawer(null)} title="Mayo Clinic April 2026 — Full Labs">
          <div className="drawer-section">
            <div className="drawer-section-title">CBC — April 9, 2026</div>
            <table><thead><tr><th>Test</th><th>Value</th><th>Ref</th><th>Flag</th></tr></thead>
            <tbody>
              {[["Hemoglobin","12.3 g/dL","11.6-15.0",""],["WBC","4.4 x10(9)/L","3.4-9.6",""],["Neutrophils (auto)","1.51 x10(9)/L","1.56-6.45","L"],["Neutrophils (manual ANC)","1.85 x10(9)/L","1.56-6.45","Normal"],["Eosinophils","0.58 x10(9)/L","0.03-0.48","H"],["Eos % (manual)","12%","1-3%","H"],["Basophils","0.06 x10(9)/L","0.01-0.08",""],["Tryptase","2.3 ng/mL","<11.5","Normal"]].map(([t,v,r,f],i)=>(
                <tr key={i}><td>{t}</td><td className={f==="H"||f==="L"?"flag-h":""}>{v}</td><td>{r}</td><td>{f}</td></tr>
              ))}
            </tbody></table>
          </div>
          <div className="drawer-section">
            <div className="drawer-section-title">Metabolic / Immunology</div>
            <table><thead><tr><th>Test</th><th>Value</th><th>Result</th></tr></thead>
            <tbody>
              {[["eGFR",">90","Normal"],["Creatinine","0.83 mg/dL","Normal"],["IgE","42.4 IU/mL","Normal (ref ≤214)"],["ANA","<1:80","Negative"],["MPO-ANCA","<0.2","Negative"],["PR3-ANCA","<0.2","Negative"],["RF","17.3 U/mL","Elevated — anti-CCP outstanding"],["Predicted 24hr Protein","224 mg/day","Borderline (ref <229)"]].map(([t,v,r],i)=>(
                <tr key={i}><td>{t}</td><td>{v}</td><td style={{fontSize:12,color:'var(--gray-600)'}}>{r}</td></tr>
              ))}
            </tbody></table>
          </div>
        </Drawer>
      </Section>

      <Section title="Eosinophil Longitudinal Trend" dot="#D97706">
        <div className="narrative">Persistent elevation across 6+ years. Three documented severe flares above 13%. Not episodic — chronic and progressive.</div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Date</th><th>Eos %</th><th>Context</th></tr></thead>
            <tbody>
              {[
                ["Apr 2026","12.0-14.0% (H)","Mayo evaluation. Post-mepolizumab dose 1."],
                ["Feb 2026","8.8% (H)","ER visit for chest pain."],
                ["Dec 2025","14.2% (H)","Severe flare — December crisis. Post-steroid paradoxical response."],
                ["Sep 2024","13.9% (H)","Severe flare."],
                ["Jul 2023","7.5% (H)","Elevated."],
                ["Jan 2023","15.2% (H)","Peak documented value. Severe flare."],
                ["Sep 2020","7.4% (H)","Elevated."],
              ].map(([d,p,c],i)=>(
                <tr key={i}>
                  <td style={{fontWeight:600,color:'var(--navy)'}}>{d}</td>
                  <td className="flag-h">{p}</td>
                  <td style={{fontSize:12,color:'var(--gray-600)'}}>{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="eGFR Longitudinal Trend" dot="#DC2626">
        <div className="narrative">Recurring significant drops below 90, with recovery between episodes. Pattern directly contraindates NSAID use and warrants monitoring for eosinophilic interstitial nephritis.</div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Date</th><th>eGFR</th><th>Status</th></tr></thead>
            <tbody>
              {[
                ["Feb 2026","112","Recovered"],
                ["Dec 2025","95","Recovered"],
                ["May 2025","73","Significant drop"],
                ["Oct 2024","113","Recovered"],
                ["May 2024","99","Normal"],
                ["Apr 2021","73.4","Significant drop"],
                ["Sep 2020","65.2-69.9","Severe sustained drop"],
              ].map(([d,v,s],i)=>(
                <tr key={i}>
                  <td style={{fontWeight:600,color:'var(--navy)'}}>{d}</td>
                  <td className={s.includes("drop")||s.includes("Severe")?"flag-abn":"flag-neg"}>{v}</td>
                  <td>{s}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <AlertBox type="danger">
          <strong>NSAID contraindication:</strong> eGFR has dropped to 65-73 on multiple occasions. NSAIDs cause direct renal vasoconstriction and can precipitate acute kidney injury in this context. June 2026 NSAID use (ibuprofen bridge) produced acute bilateral ankle edema — consistent with this pattern.
        </AlertBox>
      </Section>
    </div>
  );
}
function TabMeds() {
  return (
    <div>
      <div className="page-header">
        <div className="page-title serif">Medications</div>
        <div className="page-subtitle">Current pharmacological regimen as of June 2026. NSAIDs strictly contraindicated. Gabapentin under review at pain management June 18, 2026.</div>
      </div>

      <AlertBox type="danger">
        <strong>NSAID contraindication active.</strong> Meloxicam discontinued June 2026. Ibuprofen (OTC bridge) also discontinued after producing acute bilateral ankle edema. All NSAIDs strictly contraindicated — cardiac, renal, and BP risk. See Pain tab for detail.
      </AlertBox>

      <Section title="Biologics & Immunology" dot="#0D9488">
        {[
          {name:"Mepolizumab (Nucala)",dose:"100mg SQ monthly",started:"TBD",note:"Anti-IL-5 biologic. First dose processing at Accredo Specialty Pharmacy as of June 2026.",flag:"active",flagLabel:"NEW"},
          {name:"Montelukast (Singulair)",dose:"10mg daily (bedtime)",started:"09/10/2024",note:"Leukotriene receptor antagonist. Dual-purpose: asthma controller and MCAS protocol.",flag:"active",flagLabel:"ACTIVE"},
          {name:"Fluticasone-salmeterol (Advair)",dose:"250-50 mcg 1 puff BID",started:"02/08/2026",note:"ICS + LABA. ADRB2 variant affects salmeterol target. GLCCI1 variant predicts reduced steroid response.",flag:"pgx",flagLabel:"PGx: ADRB2"},
          {name:"Albuterol",dose:"90mcg/act 2 puffs PRN",started:"—",note:"Rescue bronchodilator. Currently requiring near-daily use to maintain airway. ADRB2 variant affects receptor.",flag:"active",flagLabel:"RESCUE"},
          {name:"Cetirizine (Zyrtec)",dose:"10mg daily",started:"—",note:"H1 antihistamine for MCAS protocol and chronic idiopathic urticaria.",flag:"active",flagLabel:"ACTIVE"},
          {name:"Famotidine (Pepcid)",dose:"20mg daily (bedtime)",started:"—",note:"H2 antihistamine for MCAS protocol.",flag:"active",flagLabel:"ACTIVE"},
        ].map((m,i)=>(
          <div key={i} className="med-row">
            <div><div className="med-name">{m.name}</div><div className="med-dose">{m.dose} · Started {m.started}</div></div>
            <div className="med-note">{m.note}</div>
            <div className={`med-flag ${m.flag}`}>{m.flagLabel}</div>
          </div>
        ))}
      </Section>

      <Section title="Cardiac & Dysautonomia" dot="#DC2626">
        {[
          {name:"Metoprolol succinate",dose:"100mg BID (200mg total daily)",started:"01/03/2026",note:"Beta-1 blocker for IST + cardiomyopathy. ADRB1 rs1801253 variant — receptor may respond atypically. Diastolic HTN 98 mmHg persists on this dose.",flag:"pgx",flagLabel:"PGx: ADRB1"},
          {name:"Furosemide",dose:"20mg PRN",started:"07/08/2024",note:"Loop diuretic. Refill pending as of June 2026. Active edema episode. Recent administration: 5 lb diuresis within 48 hours.",flag:"cardiac",flagLabel:"CARDIAC"},
          {name:"Potassium Chloride",dose:"10 mEq with furosemide",started:"07/08/2024",note:"Electrolyte replacement. Must be taken with furosemide doses.",flag:"active",flagLabel:"ACTIVE"},
          {name:"Rosuvastatin (Crestor)",dose:"5mg daily",started:"12/05/2025",note:"Statin. SLCO1B1 *5 allele — increased myopathy risk. Monitor myalgia (confounded by baseline MSK pain from TTN/CTD).",flag:"pgx",flagLabel:"PGx: SLCO1B1"},
        ].map((m,i)=>(
          <div key={i} className="med-row">
            <div><div className="med-name">{m.name}</div><div className="med-dose">{m.dose} · Started {m.started}</div></div>
            <div className="med-note">{m.note}</div>
            <div className={`med-flag ${m.flag}`}>{m.flagLabel}</div>
          </div>
        ))}
      </Section>

      <Section title="Pain, Spasms & CNS" dot="#7C3AED">
        {[
          {name:"Gabapentin (Neurontin)",dose:"400mg 4x daily (1,600mg/day)",started:"01/07/2020",note:"CURRENT — UNDER REVIEW at pain management 06/18/2026. Pregabalin being considered as replacement (more predictable pharmacokinetics, CACNA2D1 variant relevant).",flag:"pending",flagLabel:"UNDER REVIEW"},
          {name:"Baclofen (Lioresal)",dose:"10mg daily PRN",started:"03/09/2020",note:"Muscle relaxant for spasms. Also under review 06/18/2026 — more targeted options for CTD-related spasm being considered.",flag:"pending",flagLabel:"UNDER REVIEW"},
          {name:"Tramadol (Ultram)",dose:"50mg q6h PRN",started:"02/19/2018",note:"Analgesic PRN. OPRM1 A118G homozygous AA — altered opioid receptor binding. CYP2D6 *6 allele affects metabolism to active form.",flag:"pgx",flagLabel:"PGx: OPRM1"},
          {name:"Fluoxetine (Prozac)",dose:"10mg daily",started:"02/26/2026",note:"SSRI. CYP2C19 *2 poor metabolizer (homozygous AA) — drug accumulation risk. Dose monitoring warranted.",flag:"pgx",flagLabel:"PGx: CYP2C19"},
          {name:"Buspirone (BuSpar)",dose:"5mg BID",started:"-",note:"Anxiolytic. Initiated after ER admission for chest pain that was initially attributed to anxiety despite structural cardiac history.",flag:"active",flagLabel:"ACTIVE"},
          {name:"Acetaminophen",dose:"1,000mg PRN",started:"—",note:"Currently primary analgesic (ibuprofen discontinued). Inadequate for pain control. Bridge until 06/18/2026 pain management.",flag:"active",flagLabel:"BRIDGE"},
        ].map((m,i)=>(
          <div key={i} className="med-row">
            <div><div className="med-name">{m.name}</div><div className="med-dose">{m.dose} · Started {m.started}</div></div>
            <div className="med-note">{m.note}</div>
            <div className={`med-flag ${m.flag}`}>{m.flagLabel}</div>
          </div>
        ))}
      </Section>

      <Section title="Hormonal & Other" dot="#475569">
        {[
          {name:"Estradiol (Climara)",dose:"0.1mg/24hr patch 2x weekly",started:"—",note:"HRT post-surgical menopause. Insurance note: Iowa Total Care will only fill 1-month supply. Must be written as 1-month Rx. Amazon Pharmacy preferred.",flag:"active",flagLabel:"INS NOTE"},
          {name:"Atomoxetine (Strattera)",dose:"Active",started:"—",note:"Non-stimulant ADHD. CYP2D6 metabolized — *6 allele may affect drug levels.",flag:"pgx",flagLabel:"PGx: CYP2D6"},
          {name:"Prednisone",dose:"20mg PRN",started:"09/30/2022",note:"Oral steroid PRN only. Steroid resistance documented. Three courses in 2025. December 2025 course produced paradoxical crisis.",flag:"active",flagLabel:"PRN ONLY"},
        ].map((m,i)=>(
          <div key={i} className="med-row">
            <div><div className="med-name">{m.name}</div><div className="med-dose">{m.dose} · Started {m.started}</div></div>
            <div className="med-note">{m.note}</div>
            <div className={`med-flag ${m.flag}`}>{m.flagLabel}</div>
          </div>
        ))}
      </Section>
    </div>
  );
}
const PORTAL_DOCUMENTS = [
  {
    icon:"◉",
    color:"var(--blue)",
    title:"Primary Clinical Summary",
    type:"Multi-Specialty Reference",
    desc:"10-section provider-facing document covering demographics, critical alerts (NSAID contraindication), genetic findings, CTD pattern, AuDHD triad, pulmonary/hematologic profile, cardiovascular status, urological findings, complete medication table, and prioritized provider review list.",
    file:"/documents/Primary_Clinical_Summary.pdf",
    downloadName:"Primary_Clinical_Summary.pdf",
  },
  {
    icon:"◈",
    color:"var(--teal)",
    title:"Deep Reference Appendix",
    type:"Complete Raw Data Index",
    desc:"Full chronological encounter log (April–May 2026), complete PFT data table, all CBC values, Mayo provider directory, FISH loci detail, MRI read discrepancy notation, full medication reference with start dates, and longitudinal problem list.",
    file:"/documents/Deep_Reference_Appendix.pdf",
    downloadName:"Deep_Reference_Appendix.pdf",
  },
  {
    icon:"⬡",
    color:"var(--amber)",
    title:"Connective Tissue, Vascular & Structural Findings",
    type:"Pain Management / Genetics Reference",
    desc:"Five-section document organized for any provider needing to interpret 20+ years of structural records. Section 5 specifically tailored for pain management. Includes physician quotes, imaging findings, NSAID contraindication context, and Mayo active problem list.",
    file:"/documents/CTD_Structural_Findings_Summary.pdf",
    downloadName:"CTD_Structural_Findings_Summary.pdf",
  },
  {
    icon:"⌬",
    color:"var(--navy)",
    title:"AlphaGenome Computational Analysis — TTN Pathogenic Deletion",
    type:"Genomics / Research (Supplementary)",
    desc:"Complete documentation of AlphaGenome outputs for TTN c.73318_73324delGAATGCT in cardiac tissue. RNA-seq, splice site usage, and ATAC panels with interpretation. Research disclaimers prominent. Not a clinical diagnostic report.",
    file:"/documents/TTN_AlphaGenome_Summary.pdf",
    downloadName:"TTN_AlphaGenome_Summary.pdf",
  },
];

function ZygosityPill({ value }) {
  if (!value) return null;
  const het = String(value).toLowerCase().includes('hetero');
  return <span className={`vx-zyg ${het ? 'het' : 'hom'}`}>{value}</span>;
}

function VariantsClinicalViewer() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('clinical');

  useEffect(() => {
    fetch('/documents/variants_clinical_formatted.json')
      .then((r) => {
        if (!r.ok) throw new Error('Could not load formatted variant data');
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="vx-loading">{error}</div>;
  if (!data) return <div className="vx-loading">Loading variant extract…</div>;

  return (
    <div className="vx-wrap">
      <div className="vx-head">
        <div className="vx-head-title">{data.title}</div>
        <div className="vx-head-sub">{data.subtitle}</div>
      </div>
      <div className="vx-tabs">
        {[['clinical','Clinical Variants'],['hetero','Heterozygous'],['pgx','Pharmacogenomics']].map(([id,label])=>(
          <button key={id} type="button" className={`vx-tab${tab===id?' active':''}`} onClick={()=>setTab(id)}>{label}</button>
        ))}
      </div>
      <div className="vx-body">
        {tab === 'clinical' && (
          <table className="vx-table">
            <thead>
              <tr>
                <th>rsID</th><th>Gene</th><th>Variant / Annotation</th><th>Category</th>
                <th>Chr</th><th>Position (hg19)</th><th>Genotype</th><th>Zygosity</th>
              </tr>
            </thead>
            <tbody>
              {data.clinicalVariants.map((row,i)=>(
                row.type === 'category' ? (
                  <tr key={i}>
                    <td colSpan={8} className="vx-cat" style={{background:row.color,borderRadius:0}}>{row.label}</td>
                  </tr>
                ) : (
                  <>
                    <tr key={i}>
                      <td className="vx-rsid">{row.rsid}</td>
                      <td className="vx-gene">{row.gene}</td>
                      <td>{row.annotation}</td>
                      <td>{row.category}</td>
                      <td>{row.chrom}</td>
                      <td>{row.pos}</td>
                      <td>{row.genotype}</td>
                      <td><ZygosityPill value={row.zygosity}/></td>
                    </tr>
                    {row.note && (
                      <tr key={`${i}-note`}>
                        <td colSpan={8} className="vx-note" style={{paddingLeft:20,borderBottom:'2px solid var(--gray-200)'}}>{row.note}</td>
                      </tr>
                    )}
                  </>
                )
              ))}
            </tbody>
          </table>
        )}

        {tab === 'hetero' && (
          <table className="vx-table">
            <thead><tr>{data.heterozygous.headers.map((h,i)=><th key={i}>{h}</th>)}</tr></thead>
            <tbody>
              {data.heterozygous.rows.map((row,i)=>(
                <tr key={i}>
                  {data.heterozygous.headers.map((h,j)=>(
                    <td key={j} className={h==='rsID'?'vx-rsid':h==='Gene'?'vx-gene':h.includes('Note')?'vx-note':''}>{row[h]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'pgx' && (
          <>
            <div style={{fontSize:12,color:'var(--gray-600)',marginBottom:12,lineHeight:1.6}}>{data.pharmacogenomics.subtitle}</div>
            <table className="vx-table">
              <thead><tr>{data.pharmacogenomics.headers.map((h,i)=><th key={i}>{h}</th>)}</tr></thead>
              <tbody>
                {data.pharmacogenomics.rows.map((row,i)=>(
                  <tr key={i}>
                    {data.pharmacogenomics.headers.map((h,j)=>(
                      <td key={j} className={h.includes('Gene')||h.includes('Enzyme')?'vx-gene':h.includes('Implication')||h.includes('Note')?'vx-note':''}>{row[h]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}

function TabDocuments() {
  const [viewer, setViewer] = useState(null);
  const [variantsOpen, setVariantsOpen] = useState(false);
  const activeDoc = viewer !== null ? PORTAL_DOCUMENTS[viewer] : null;

  return (
    <div>
      <div className="page-header">
        <div className="page-title serif">Documents</div>
        <div className="page-subtitle">Reference documents prepared for provider evaluation. All clinical findings sourced directly from medical records. Research content clearly labeled throughout.</div>
      </div>

      <Section title="Available Documents" dot="#0F2537">
        {PORTAL_DOCUMENTS.map((doc,i)=>(
          <div key={i} style={{padding:'20px',border:'1px solid var(--gray-200)',borderRadius:'var(--radius)',marginBottom:12,borderLeft:`4px solid ${doc.color}`,background:'white'}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:6}}>
              <span style={{fontSize:18,color:doc.color}}>{doc.icon}</span>
              <div>
                <div style={{fontWeight:600,fontSize:15,color:'var(--navy)'}}>{doc.title}</div>
                <div style={{fontSize:11,color:doc.color,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase'}}>{doc.type}</div>
              </div>
            </div>
            <div style={{fontSize:13,color:'var(--gray-700)',lineHeight:1.6,paddingLeft:28}}>{doc.desc}</div>
            <div className="doc-actions">
              <button type="button" className="doc-action-btn" onClick={()=>setViewer(i)}>View PDF</button>
              <a className="doc-action-link" href={doc.file} download={doc.downloadName}>Download PDF</a>
              <a className="doc-action-link" href={doc.file} target="_blank" rel="noopener noreferrer">Open in new tab</a>
            </div>
          </div>
        ))}
      </Section>

      <Drawer open={activeDoc !== null} onClose={()=>setViewer(null)} title={activeDoc?.title ?? 'Document'} wide>
        {activeDoc && (
          <iframe
            className="doc-frame"
            src={activeDoc.file}
            title={activeDoc.title}
          />
        )}
      </Drawer>

      <Section title="23andMe Variant Extract — Clinical Genes ⚗" dot="#7C3AED">
        <div style={{padding:'20px',border:'1px solid var(--gray-200)',borderRadius:'var(--radius)',borderLeft:'4px solid #7C3AED',background:'white'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:6}}>
            <span style={{fontSize:18,color:'#7C3AED'}}>◎</span>
            <div>
              <div style={{fontWeight:600,fontSize:15,color:'var(--navy)'}}>23andMe Variant Extract — Clinical Genes</div>
              <div style={{fontSize:11,color:'#7C3AED',fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase'}}>Genomics / Research (Supplementary)</div>
            </div>
          </div>
          <div style={{fontSize:13,color:'var(--gray-700)',lineHeight:1.6,paddingLeft:28}}>
            27 clinically characterized variants with category grouping, zygosity highlighting, and clinical notes. Formatted view matches the Excel workbook; raw TSV available for import into other tools.
          </div>
          <div className="doc-actions">
            <button type="button" className="doc-action-btn" onClick={()=>setVariantsOpen(true)}>View formatted extract</button>
            <a className="doc-action-link" href="/documents/sarah_variants_clinical.tsv" download="sarah_variants_clinical.tsv">Download TSV</a>
            <a className="doc-action-link" href="/documents/sarah_variants_formatted.xlsx" download="sarah_variants_formatted.xlsx">Download Excel</a>
          </div>
        </div>
      </Section>

      <Drawer open={variantsOpen} onClose={()=>setVariantsOpen(false)} title="23andMe Clinical Variant Extract" wide scroll>
        <VariantsClinicalViewer/>
      </Drawer>

      <Section title="About This Portal & Research Content" dot="#7C3AED">
        <div className="finding-grid">
          <div className="finding-card confirmed">
            <div className="finding-card-label">Clinical Findings</div>
            <div className="finding-card-text">Sourced from physician notes, imaging reports, and lab results. Facts in the medical record. Presented on specialty tabs without research labeling.</div>
          </div>
          <div className="finding-card active">
            <div className="finding-card-label">Research Content ⚗</div>
            <div className="finding-card-text">AlphaGenome outputs and 23andMe variant analysis. Model predictions — not validated clinical results. Labeled throughout with ⚗ symbol.</div>
          </div>
        </div>
        <AlertBox type="info">
          Research content does not alter the clinical classification of any confirmed diagnosis. It is supplementary context — a computational layer to inform provider thinking. All AlphaGenome analyses were conducted by the patient using the Google DeepMind API. Access this portal again at any time using the same URL and key.
        </AlertBox>
      </Section>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════════════════════

const TABS = [
  { id:'overview', label:'Overview', icon:'◎' },
  { id:'cardiac', label:'Cardiac', icon:'♥' },
  { id:'pulmonary', label:'Pulmonary', icon:'⊕' },
  { id:'rheumatology', label:'Rheumatology', icon:'⊘' },
  { id:'ctd', label:'Connective Tissue', icon:'⬡' },
  { id:'surgical', label:'Surgical & Trauma', icon:'⚕' },
  { id:'pain', label:'Pain & MSK', icon:'⚡' },
  { id:'genomics', label:'Genomics ⚗', icon:'⌬' },
  { id:'labs', label:'Labs & Trends', icon:'⊞' },
  { id:'meds', label:'Medications', icon:'⊛' },
  { id:'documents', label:'Documents', icon:'⊟' },
];

function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [tab, setTab] = useState('overview');
  const [navOpen, setNavOpen] = useState(false);
  const tabnavRef = useRef(null);

  const currentTab = TABS.find(t => t.id === tab) || TABS[0];

  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e) => e.key === 'Escape' && setNavOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [navOpen]);

  useEffect(() => {
    if (!navOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [navOpen]);

  useEffect(() => {
    const el = tabnavRef.current?.querySelector('.tab.active');
    el?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [tab]);

  const selectTab = (id) => {
    setTab(id);
    setNavOpen(false);
  };

  const content = {
    overview: <TabOverview/>,
    cardiac: <TabCardiac/>,
    pulmonary: <TabPulmonary/>,
    rheumatology: <TabRheumatology/>,
    ctd: <TabCTD/>,
    surgical: <TabSurgicalTrauma/>,
    pain: <TabPain/>,
    genomics: <TabGenomics/>,
    labs: <TabLabs/>,
    meds: <TabMeds/>,
    documents: <TabDocuments/>,
  };

  if (!unlocked) return <Gate onUnlock={()=>setUnlocked(true)}/>;

  return (
    <>
      <style>{S}</style>
      <div className="app">
        <div className="topbar">
          <div>
            <div className="topbar-title">Clinical Portal</div>
          </div>
          <div className="topbar-sub">Sarah K. Sahl · DOB 05/18/1984</div>
          <div className="topbar-spacer"/>
          <div className="topbar-badge">Provider Access</div>
          <button
            type="button"
            className={`topbar-menu-btn${navOpen ? ' open' : ''}`}
            aria-label={navOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={navOpen}
            onClick={() => setNavOpen(v => !v)}
          >
            {navOpen ? '×' : '☰'}
          </button>
        </div>

        <div className="mob-nav-bar">
          <button
            type="button"
            className="mob-nav-trigger"
            aria-label="Choose section"
            aria-expanded={navOpen}
            onClick={() => setNavOpen(v => !v)}
          >
            <span className="mob-nav-trigger-icon">{currentTab.icon}</span>
            <span className="mob-nav-trigger-label">{currentTab.label}</span>
            <span className={`mob-nav-trigger-chevron${navOpen ? ' open' : ''}`}>▾</span>
          </button>
        </div>

        <div className={`mob-nav-overlay${navOpen ? ' open' : ''}`} onClick={() => setNavOpen(false)} aria-hidden={!navOpen}/>
        <nav className={`mob-nav-panel${navOpen ? ' open' : ''}`} aria-label="Portal sections" aria-hidden={!navOpen}>
          <div className="mob-nav-head">
            <span className="mob-nav-head-title">Sarah K. Sahl · DOB 05/18/1984</span>
            <button type="button" className="mob-nav-close" aria-label="Close navigation" onClick={() => setNavOpen(false)}>×</button>
          </div>
          <div className="mob-nav-list">
            {TABS.map(t => (
              <button
                key={t.id}
                type="button"
                className={`mob-nav-item${tab === t.id ? ' active' : ''}`}
                onClick={() => selectTab(t.id)}
              >
                <span className="mob-nav-item-icon">{t.icon}</span>
                <span className="mob-nav-item-label">{t.label}</span>
                <span className="mob-nav-item-check">✓</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="tabnav tabnav-desktop" ref={tabnavRef}>
          {TABS.map(t=>(
            <button key={t.id} className={`tab${tab===t.id?' active':''}`} onClick={()=>setTab(t.id)}>
              <span className="tab-icon">{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        <div className="main">
          {content[tab]}
        </div>
      </div>
    </>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App/>);