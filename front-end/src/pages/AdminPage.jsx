//هاي صفحة الادمن اللي بظهر فيها الجدول وهو بكون مسؤول عن ترشيح الحرفي او لا

import { useEffect, useMemo, useRef, useState } from "react";

/* ═══════════════════════════════════════════
   CONFIG
═══════════════════════════════════════════ */
const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
const ADMIN_CRAFTSMEN_ENDPOINT = `${API_BASE_URL}/api/admin/craftsmen`;
const DEFAULT_PROFILE_IMAGE = "/images/default-user.png";

const BASE_PROFESSIONS = ["مهندس", "سباك", "دهان", "نجار", "كهربائي"];
const PROFESSION_LABELS = {
  engineer: "مهندس",
  plumber: "سباك",
  painter: "دهان",
  carpenter: "نجار",
  electrician: "كهربائي",
  technician: "فني",
  driver: "سائق",
  mechanic: "ميكانيكي",
};

const PAGE_SIZE = 10;
const PROF_COLORS = ["#2563EB","#7C3AED","#059669","#D97706","#DC2626","#0EA5E9","#BE185D","#0891B2"];

/* ═══════════════════════════════════════════
   STYLES
═══════════════════════════════════════════ */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --accent:#2563EB;
  --accent-light:#EFF6FF;
  --accent-mid:#BFDBFE;
  --emerald:#059669;
  --amber:#D97706;
  --purple:#7C3AED;
  --white:#fff;
  --bg:#F0F5FA;
  --text:#111827;
  --text-2:#374151;
  --text-3:#6B7280;
  --border:#E5E7EB;
  --red:#DC2626;
  --red-bg:#FEF2F2;
  --red-border:#FECACA;
  --green:#059669;
}

html,body,#root{
  height:100%;font-family:'Almarai',sans-serif;
  background:var(--bg);color:var(--text);direction:rtl;
}
body{overflow-x:hidden}
.app{display:flex;min-height:100vh;width:100%}

/* ══════════════════════
   SIDEBAR  — sky-blue
══════════════════════ */
.sidebar{
  width:242px;
  background:linear-gradient(175deg,#0C4A6E 0%,#075985 45%,#0284C7 100%);
  display:flex;flex-direction:column;
  position:fixed;top:0;right:0;bottom:0;z-index:100;
  overflow-y:auto;overflow-x:hidden;scrollbar-width:none;
  box-shadow:-2px 0 18px rgba(3,105,161,.3);
}
.sidebar::before{
  content:'';position:absolute;inset:0;
  background-image:radial-gradient(rgba(255,255,255,.05) 1px,transparent 1px);
  background-size:22px 22px;pointer-events:none;
}
.sidebar::-webkit-scrollbar{display:none}

.sb-brand{
  padding:20px 16px 17px;
  display:flex;align-items:center;gap:10px;
  border-bottom:1px solid rgba(255,255,255,.1);
  flex-shrink:0;position:relative;
}
.sb-logo{width:32px;height:32px;object-fit:contain;flex-shrink:0;border-radius:7px}
.sb-name{font-family:'Almarai',sans-serif;font-size:21px;font-weight:800;color:#fff}
.sb-name span{color:#7DD3FC}

.sb-user{
  margin:12px 12px 6px;
  background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.13);
  border-radius:12px;padding:10px 12px;
  display:flex;align-items:center;gap:10px;flex-shrink:0;position:relative;
}
.sb-user-icon{
  width:34px;height:34px;background:rgba(255,255,255,.2);
  border-radius:50%;display:flex;align-items:center;justify-content:center;
  color:#fff;flex-shrink:0;
}
.sb-user-name{font-size:12.5px;font-weight:800;color:#fff}
.sb-user-role{font-size:10.5px;color:rgba(255,255,255,.45);margin-top:1px;font-weight:400}

.sb-section{
  font-size:9px;color:rgba(255,255,255,.28);
  padding:14px 16px 5px;font-weight:800;letter-spacing:1.6px;text-transform:uppercase;flex-shrink:0;
}

.sb-nav{padding:4px 10px;display:flex;flex-direction:column;gap:2px;flex-shrink:0}
.sb-item{
  display:flex;align-items:center;gap:9px;
  padding:10px 12px;border-radius:10px;cursor:pointer;transition:all .16s;
  color:rgba(255,255,255,.5);font-size:13px;font-weight:700;
  border:none;background:none;width:100%;text-align:right;
  font-family:'Almarai',sans-serif;position:relative;
}
.sb-item:hover{background:rgba(255,255,255,.12);color:#fff}
.sb-item.active{background:rgba(255,255,255,.18);color:#fff;border:1px solid rgba(255,255,255,.22)}
.sb-item.active::after{
  content:'';position:absolute;right:0;top:50%;transform:translateY(-50%);
  width:3px;height:55%;background:#7DD3FC;border-radius:0 3px 3px 0;
}
.sb-item-spacer{flex:1}
.sb-chevron{display:flex;align-items:center;transition:transform .2s;color:rgba(255,255,255,.35)}
.sb-chevron.open{transform:rotate(90deg)}

.sb-divider{height:1px;background:rgba(255,255,255,.1);margin:6px 14px;flex-shrink:0}

.sb-footer{flex-shrink:0}
.sb-home,.sb-logout{
  margin:1px 10px;padding:10px 12px;border-radius:10px;cursor:pointer;
  display:flex;align-items:center;gap:9px;font-size:13px;font-weight:700;
  transition:all .16s;font-family:'Almarai',sans-serif;border:none;background:none;
  width:calc(100% - 20px);text-align:right;color:rgba(255,255,255,.45);
}
.sb-home:hover{color:#BAE6FD;background:rgba(255,255,255,.1)}
.sb-logout:hover{color:#FCA5A5;background:rgba(239,68,68,.2)}
.sb-footer-pad{height:14px}

/* ══════════════════════
   MAIN
══════════════════════ */
.main{
  margin-right:242px;width:calc(100% - 242px);
  display:flex;flex-direction:column;min-height:100vh;
}

/* Topbar — gradient blue */
.topbar{
  background:linear-gradient(115deg,#1e3a8a 0%,#2563eb 55%,#0ea5e9 100%);
  padding:0 28px;
  display:flex;align-items:center;justify-content:space-between;gap:12px;
  height:68px;flex-shrink:0;position:relative;overflow:hidden;
}
.topbar::after{
  content:'';position:absolute;bottom:0;left:0;right:0;height:3px;
  background:linear-gradient(90deg,#60A5FA,#818CF8,#34D399,#FBBF24,#F87171);
}
.topbar::before{
  content:'';position:absolute;top:-30px;left:38%;
  width:220px;height:220px;
  background:radial-gradient(circle,rgba(255,255,255,.07) 0%,transparent 70%);
  border-radius:50%;pointer-events:none;
}
.topbar-left{display:flex;flex-direction:column;justify-content:center;position:relative}
.topbar-title{
  font-family:'Almarai',sans-serif;font-size:18px;font-weight:800;color:#fff;
  display:flex;align-items:center;gap:10px;
  text-shadow:0 1px 4px rgba(0,0,0,.15);
}
.topbar-sub{font-size:11px;color:rgba(255,255,255,.45);margin-top:3px;display:flex;align-items:center;gap:5px}
.topbar-right{display:flex;align-items:center;gap:10px;position:relative}
.admin-chip{
  background:rgba(255,255,255,.15);color:#fff;
  border:1px solid rgba(255,255,255,.25);border-radius:20px;padding:6px 14px;
  font-size:12px;font-weight:800;display:flex;align-items:center;gap:6px;
  backdrop-filter:blur(8px);
}

/* Content area */
.content{padding:20px 24px 30px;flex:1;min-width:0;overflow:hidden}

/* Filter bar */
.filter-bar{
  background:#fff;border:1px solid var(--border);border-radius:12px;
  padding:12px 16px;margin-bottom:16px;
  display:flex;align-items:center;gap:12px;flex-wrap:wrap;
  box-shadow:0 1px 4px rgba(0,0,0,.05);
}
.filter-label{font-size:12px;font-weight:800;color:var(--text-2);white-space:nowrap;display:flex;align-items:center;gap:6px}
.filter-chips{display:flex;gap:6px;flex-wrap:wrap;flex:1 1 240px}
.chip{
  padding:5px 13px;border-radius:20px;font-size:12px;font-weight:700;font-family:'Almarai',sans-serif;
  cursor:pointer;border:1.5px solid var(--border);background:#fff;color:var(--text-3);transition:all .15s;
}
.chip:hover{border-color:var(--accent);color:var(--accent);background:var(--accent-light)}
.chip.active{background:var(--text);color:#fff;border-color:var(--text)}

.search-wrap{position:relative;flex:0 1 260px;min-width:180px}
.search-inp{
  background:#F9FAFB;border:1.5px solid var(--border);border-radius:9px;
  padding:8px 36px 8px 12px;font-size:12.5px;font-family:'Almarai',sans-serif;
  color:var(--text);outline:none;width:100%;direction:rtl;transition:all .2s;
}
.search-inp:focus{border-color:var(--accent);background:#fff;box-shadow:0 0 0 3px rgba(37,99,235,.08)}
.search-ico{position:absolute;right:11px;top:50%;transform:translateY(-50%);color:var(--text-3);pointer-events:none}

/* Table container */
.table-wrap{
  background:#fff;border:1px solid var(--border);border-radius:14px;
  box-shadow:0 2px 10px rgba(0,0,0,.06);overflow:hidden;
}
.table-head-bar{
  padding:14px 18px;border-bottom:1px solid var(--border);
  display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;
}
.table-title{
  font-family:'Almarai',sans-serif;font-size:15px;font-weight:800;color:var(--text);
  display:flex;align-items:center;gap:8px;
}
.count-badge{background:var(--text);color:#fff;border-radius:20px;padding:2px 10px;font-size:11px;font-weight:800}
.refresh-btn{
  border:1.5px solid var(--border);background:#fff;color:var(--text-2);
  padding:7px 14px;border-radius:9px;font-family:'Almarai',sans-serif;font-size:12px;font-weight:700;
  cursor:pointer;display:flex;align-items:center;gap:6px;transition:all .16s;
}
.refresh-btn:hover{background:#EFF6FF;border-color:var(--accent);color:var(--accent)}

.tbl-outer{overflow-x:auto}
table{width:100%;border-collapse:collapse;min-width:860px}

thead th{
  position:sticky;top:0;z-index:2;
  background:linear-gradient(135deg,#EFF6FF 0%,#DBEAFE 100%);
  padding:12px 14px;font-size:10.5px;font-weight:800;
  color:#1E40AF;text-align:right;white-space:nowrap;
  border-bottom:2px solid #93C5FD;letter-spacing:.5px;text-transform:uppercase;
}

/* Clear dividers between rows */
tbody tr{
  border-bottom:2px solid #F0F4F8;
  transition:background .12s;
}
tbody tr:last-child{border-bottom:none}
tbody tr:hover{background:#F0F7FF}
tbody td{
  padding:13px 14px;font-size:13px;color:var(--text);vertical-align:middle;
  border-left:1px solid #F3F4F6;
}
tbody td:last-child{border-left:none}

/* Green left border on featured rows */
tbody tr.row-featured{border-right:3px solid #059669}
tbody tr.row-featured:hover{background:#F0FFF9}

.sticky-featured{
  position:sticky;left:0;z-index:3;background:#fff;min-width:130px;
  box-shadow:-4px 0 8px rgba(0,0,0,.06);
}
thead .sticky-featured{z-index:5;background:#DBEAFE}
tbody tr:hover .sticky-featured{background:#F0F7FF}
tbody tr.row-featured .sticky-featured{background:#F7FFFC}
tbody tr.row-featured:hover .sticky-featured{background:#ECFDF5}

/* Cells */
.user-cell{display:flex;align-items:center;gap:10px;min-width:155px}
.user-avatar{
  width:38px;height:38px;border-radius:50%;object-fit:cover;
  background:#F3F4F6;flex-shrink:0;border:2.5px solid #E5E7EB;
}
.cell-name{font-weight:800;color:var(--text);font-size:13px;white-space:nowrap}
.cell-sub{font-size:10px;color:var(--text-3);margin-top:1px;font-family:monospace;letter-spacing:.3px}
.cell-badge{
  display:inline-flex;align-items:center;background:#F3F4F6;color:var(--text-2);
  border:1px solid var(--border);border-radius:6px;
  padding:3px 9px;font-size:11.5px;font-weight:800;white-space:nowrap;
}
.cell-phone{direction:ltr;display:inline-block;font-size:13px;letter-spacing:.3px;color:var(--text-2);font-weight:600}
.email-cell{
  max-width:150px;display:inline-block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  direction:ltr;font-size:12.5px;color:var(--text-2);font-weight:500;
}
.cell-muted{color:var(--text-3);font-size:12px}
.location-main{font-weight:800;color:var(--text);font-size:12.5px}
.location-sub{font-size:11px;color:var(--text-3);margin-top:1px}

/* Status badge — replaces toggle */
.status-badge{
  display:inline-flex;align-items:center;gap:6px;
  padding:6px 14px;border-radius:20px;
  font-size:12px;font-weight:800;cursor:pointer;
  font-family:'Almarai',sans-serif;transition:all .2s;white-space:nowrap;
}
.status-badge:disabled{opacity:.55;cursor:not-allowed;pointer-events:none}
.status-badge.s-on{
  background:#D1FAE5;color:#065F46;border:1.5px solid #6EE7B7;
}
.status-badge.s-on:hover:not(:disabled){
  background:#A7F3D0;box-shadow:0 3px 10px rgba(5,150,105,.22);transform:translateY(-1px);
}
.status-badge.s-off{
  background:#FEE2E2;color:#991B1B;border:1.5px solid #FCA5A5;
}
.status-badge.s-off:hover:not(:disabled){
  background:#FECACA;box-shadow:0 3px 10px rgba(220,38,38,.18);transform:translateY(-1px);
}
.status-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;animation:pulse 2s infinite}
.s-on .status-dot{background:#059669}
.s-off .status-dot{background:#DC2626;animation:none}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}

/* Delete */
.del-btn{
  display:inline-flex;align-items:center;justify-content:center;gap:5px;
  padding:6px 12px;border-radius:7px;font-size:11.5px;font-weight:800;
  font-family:'Almarai',sans-serif;cursor:pointer;
  border:1.5px solid var(--red-border);background:var(--red-bg);color:var(--red);
  transition:all .16s;
}
.del-btn:hover{background:#FEE2E2;transform:translateY(-1px);box-shadow:0 3px 8px rgba(220,38,38,.15)}
.del-btn:disabled{opacity:.5;cursor:not-allowed;transform:none;box-shadow:none}

/* Pagination */
.pagination{
  display:flex;align-items:center;justify-content:space-between;
  padding:12px 18px;border-top:1px solid var(--border);flex-wrap:wrap;gap:10px;
}
.page-info{font-size:12px;color:var(--text-3);font-weight:600}
.page-info strong{color:var(--text);font-weight:800}
.page-btns{display:flex;gap:4px;align-items:center}
.page-btn{
  min-width:32px;height:32px;border-radius:8px;border:1.5px solid var(--border);
  background:#fff;color:var(--text-2);font-size:12.5px;font-weight:800;padding:0 6px;
  cursor:pointer;display:inline-flex;align-items:center;justify-content:center;
  transition:all .15s;font-family:'Almarai',sans-serif;
}
.page-btn:hover:not(:disabled):not(.active){border-color:var(--accent);color:var(--accent);background:var(--accent-light)}
.page-btn.active{background:var(--text);color:#fff;border-color:var(--text);cursor:default}
.page-btn:disabled{opacity:.35;cursor:not-allowed}
.page-ellipsis{width:28px;height:32px;display:inline-flex;align-items:center;justify-content:center;color:var(--text-3)}

/* ══════════════════════
   STATISTICS VIEW
══════════════════════ */
.stats-view{animation:fadeUp .25s ease}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

/* KPI grid */
.kpi-grid{
  display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:20px;
}
.kpi-card{
  border-radius:16px;padding:22px 20px;
  box-shadow:0 4px 16px rgba(0,0,0,.1);
  position:relative;overflow:hidden;
  transition:transform .2s,box-shadow .2s;cursor:default;
}
.kpi-card:hover{transform:translateY(-4px);box-shadow:0 10px 28px rgba(0,0,0,.15)}
.kpi-card::after{
  content:'';position:absolute;bottom:-20px;left:-20px;
  width:100px;height:100px;border-radius:50%;background:rgba(255,255,255,.12);
}
.kpi-card::before{
  content:'';position:absolute;top:-10px;right:-10px;
  width:60px;height:60px;border-radius:50%;background:rgba(255,255,255,.08);
}
.kpi-c1{background:linear-gradient(135deg,#1D4ED8,#2563EB)}
.kpi-c2{background:linear-gradient(135deg,#047857,#059669)}
.kpi-c3{background:linear-gradient(135deg,#B45309,#D97706)}
.kpi-c4{background:linear-gradient(135deg,#6D28D9,#7C3AED)}
.kpi-num{
  font-family:'Almarai',sans-serif;font-size:44px;font-weight:800;
  color:#fff;line-height:1;margin-bottom:6px;position:relative;z-index:1;
}
.kpi-lbl{font-size:13px;font-weight:700;color:rgba(255,255,255,.75);position:relative;z-index:1}
.kpi-sub{font-size:11px;color:rgba(255,255,255,.45);margin-top:3px;font-weight:400;position:relative;z-index:1}
.kpi-icon-bg{
  position:absolute;bottom:8px;left:12px;
  opacity:.1;color:#fff;z-index:0;
}

/* Charts layout */
.charts-row{display:grid;grid-template-columns:340px 1fr;gap:16px;margin-bottom:16px}
.charts-col{display:flex;flex-direction:column;gap:16px}

.chart-card{
  background:#fff;border:1px solid var(--border);border-radius:14px;
  padding:20px;box-shadow:0 1px 5px rgba(0,0,0,.05);
}
.chart-title{
  font-family:'Almarai',sans-serif;font-size:14px;font-weight:800;color:var(--text);
  margin-bottom:4px;display:flex;align-items:center;gap:7px;
}
.chart-sub{font-size:11.5px;color:var(--text-3);font-weight:400;margin-bottom:16px}

/* Donut chart */
.donut-wrap{display:flex;align-items:center;gap:22px;flex-wrap:wrap}
.donut-legend{display:flex;flex-direction:column;gap:14px;flex:1;min-width:100px}
.legend-row{display:flex;align-items:center;gap:9px}
.legend-dot{width:12px;height:12px;border-radius:50%;flex-shrink:0}
.legend-text{}
.legend-name{font-size:12px;font-weight:700;color:var(--text-3)}
.legend-val{font-size:22px;font-weight:800;color:var(--text);line-height:1.1;margin-top:1px}

/* Profession bars */
.prof-bars{display:flex;flex-direction:column;gap:13px}
.prof-bar-row{}
.prof-bar-top{display:flex;justify-content:space-between;margin-bottom:5px}
.prof-bar-name{font-size:12.5px;font-weight:700;color:var(--text-2)}
.prof-bar-num{font-size:13px;font-weight:800;color:var(--text)}
.prof-bar-bg{height:10px;background:#F3F4F6;border-radius:5px;overflow:hidden}
.prof-bar-fill{
  height:100%;border-radius:5px;
  transition:width .7s cubic-bezier(.34,1,.64,1);
}

/* City bars */
.city-bars{display:flex;flex-direction:column;gap:10px}
.city-bar-row{display:flex;align-items:center;gap:10px}
.city-name{font-size:12px;font-weight:700;color:var(--text-2);min-width:75px;text-align:right}
.city-bar-outer{flex:1}
.city-bar-bg{height:8px;background:#F3F4F6;border-radius:4px;overflow:hidden}
.city-bar-fill{
  height:100%;border-radius:4px;
  background:linear-gradient(90deg,#0369A1,#0EA5E9);
  transition:width .7s cubic-bezier(.34,1,.64,1);
}
.city-count{font-size:12.5px;font-weight:800;color:#0369A1;min-width:22px}

/* Empty / Loading */
.state-wrap{padding:48px 24px;text-align:center;color:var(--text-3)}
.state-ico{font-size:40px;opacity:.35;margin-bottom:10px}
.spinner{
  width:40px;height:40px;border:3.5px solid var(--border);border-top-color:var(--accent);
  border-radius:50%;animation:spin .65s linear infinite;margin:0 auto 14px;
}
@keyframes spin{to{transform:rotate(360deg)}}
.state-title{font-size:14px;font-weight:800;color:var(--text);margin-bottom:4px}
.state-desc{font-size:13px}
.error-box{
  margin-bottom:14px;background:var(--red-bg);border:1px solid var(--red-border);
  color:var(--red);padding:11px 14px;border-radius:10px;font-size:13px;font-weight:700;
}

/* Confirm modal */
.confirm-overlay{
  position:fixed;inset:0;background:rgba(0,0,0,.4);
  backdrop-filter:blur(6px);z-index:9998;
  display:flex;align-items:center;justify-content:center;padding:16px;
}
.confirm-modal{
  background:#fff;border-radius:18px;padding:28px 24px 22px;
  max-width:360px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.2);
  text-align:center;direction:rtl;border:1px solid var(--border);
}
.confirm-icon{font-size:36px;margin-bottom:12px}
.confirm-title{font-family:'Almarai',sans-serif;font-size:18px;font-weight:800;color:var(--text);margin-bottom:7px}
.confirm-desc{font-size:13px;color:var(--text-2);margin-bottom:20px;line-height:1.7}
.confirm-name{font-weight:800;color:var(--red)}
.confirm-actions{display:flex;gap:10px}
.confirm-cancel{
  flex:1;padding:11px;border-radius:10px;border:1.5px solid var(--border);
  background:#fff;color:var(--text-2);font-family:'Almarai',sans-serif;
  font-size:13px;font-weight:800;cursor:pointer;transition:background .15s;
}
.confirm-cancel:hover{background:#F9FAFB}
.confirm-delete{
  flex:1;padding:11px;border-radius:10px;border:none;background:#DC2626;color:#fff;
  font-family:'Almarai',sans-serif;font-size:13px;font-weight:800;cursor:pointer;
  box-shadow:0 4px 12px rgba(220,38,38,.22);transition:opacity .15s;
}
.confirm-delete:hover{opacity:.88}
.confirm-delete:disabled{opacity:.6;cursor:not-allowed}

/* Toast */
.toast{
  position:fixed;bottom:24px;left:50%;transform:translateX(-50%);
  background:#111827;color:#fff;padding:12px 22px;border-radius:12px;
  font-size:13px;font-weight:700;box-shadow:0 8px 28px rgba(0,0,0,.25);
  z-index:9999;display:flex;align-items:center;gap:8px;
  animation:toastIn .3s ease;pointer-events:none;border:1px solid rgba(255,255,255,.06);
}
@keyframes toastIn{
  from{opacity:0;transform:translateX(-50%) translateY(10px)}
  to{opacity:1;transform:translateX(-50%) translateY(0)}
}

@media(max-width:1200px){.kpi-grid{grid-template-columns:1fr 1fr}}
@media(max-width:1100px){
  .sidebar{width:210px}.main{margin-right:210px;width:calc(100% - 210px)}
  .charts-row{grid-template-columns:1fr}
}
@media(max-width:900px){
  .sidebar{width:190px}.main{margin-right:190px;width:calc(100% - 190px)}
  .content,.topbar{padding-left:16px;padding-right:16px}
  table{min-width:780px}
}
@media(max-width:640px){
  .sidebar{display:none}.main{margin-right:0;width:100%}
  .kpi-grid{grid-template-columns:1fr 1fr}
}
`;

/* ═══════════════════════════════════════════
   SVG ICONS
═══════════════════════════════════════════ */
function Ic({ d, s = 16, stroke = 1.8, fill = "none" }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={fill}
      stroke="currentColor" strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const IcUsers      = () => <Ic s={16} d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />;
const IcFilter     = () => <Ic s={14} d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />;
const IcSearch     = () => <Ic s={14} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />;
const IcLogout     = () => <Ic s={15} d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />;
const IcGrid       = () => <Ic s={16} d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />;
const IcHome       = () => <Ic s={15} d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10" />;
const IcTrash      = () => <Ic s={13} d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />;
const IcRefresh    = () => <Ic s={13} d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />;
const IcShield     = () => <Ic s={14} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />;
const IcChevron    = () => <Ic s={11} d="M9 18l6-6-6-6" />;
const IcBarChart   = () => <Ic s={15} d="M18 20V10M12 20V4M6 20v-6" />;
const IcUserCircle = () => <Ic s={16} d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM3 20a9 9 0 0 1 18 0" />;
const IcStar       = () => <Ic s={28} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" stroke="none" />;
const IcMapPin     = () => <Ic s={28} d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" fill="currentColor" stroke="none" />;
const IcTool       = () => <Ic s={28} d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" fill="currentColor" stroke="none" />;
const IcPeople     = () => <Ic s={28} d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" fill="currentColor" stroke="none" />;

/* ═══════════════════════════════════════════
   CHART COMPONENTS
═══════════════════════════════════════════ */
function DonutChart({ value, total, colorOn = "#059669", colorOff = "#DC2626" }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const pct  = total > 0 ? Math.min(value / total, 1) : 0;
  const dash = pct * circ;
  return (
    <div style={{ position: "relative", width: 140, height: 140, flexShrink: 0 }}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#FEE2E2" strokeWidth="18" />
        <circle
          cx="70" cy="70" r={r} fill="none" stroke={colorOn} strokeWidth="18"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
          style={{ transition: "stroke-dasharray .8s ease" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: 26, fontWeight: 800, color: "#111827", lineHeight: 1 }}>
          {total > 0 ? Math.round(pct * 100) : 0}%
        </span>
        <span style={{ fontSize: 10, color: "#6B7280", marginTop: 4 }}>نسبة الترشيح</span>
      </div>
    </div>
  );
}

function StatsView({ craftsmen, professionCounts, topCities, featuredCount, citiesCount }) {
  const total       = craftsmen.length;
  const notFeatured = total - featuredCount;
  const maxProf     = professionCounts[0]?.[1] || 1;
  const maxCity     = topCities[0]?.[1] || 1;

  return (
    <div className="stats-view">
      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card kpi-c1">
          <div className="kpi-num">{total}</div>
          <div className="kpi-lbl">إجمالي الحرفيين</div>
          <div className="kpi-sub">مسجّلون في المنصة</div>
          <div className="kpi-icon-bg"><IcPeople /></div>
        </div>
        <div className="kpi-card kpi-c2">
          <div className="kpi-num">{featuredCount}</div>
          <div className="kpi-lbl">حرفيون مُرشَّحون</div>
          <div className="kpi-sub">يظهرون للمستخدمين</div>
          <div className="kpi-icon-bg"><IcStar /></div>
        </div>
        <div className="kpi-card kpi-c3">
          <div className="kpi-num">{citiesCount}</div>
          <div className="kpi-lbl">مدن مختلفة</div>
          <div className="kpi-sub">تغطية جغرافية</div>
          <div className="kpi-icon-bg"><IcMapPin /></div>
        </div>
        <div className="kpi-card kpi-c4">
          <div className="kpi-num">{professionCounts.length}</div>
          <div className="kpi-lbl">مهن مختلفة</div>
          <div className="kpi-sub">تنوع في التخصصات</div>
          <div className="kpi-icon-bg"><IcTool /></div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-row">
        {/* Left column */}
        <div className="charts-col">

          {/* Donut */}
          <div className="chart-card">
            <div className="chart-title"><IcBarChart /> نسبة الترشيح</div>
            <div className="chart-sub">المُرشَّحون مقابل غير المُرشَّحين</div>
            <div className="donut-wrap">
              <DonutChart value={featuredCount} total={total} />
              <div className="donut-legend">
                <div className="legend-row">
                  <div className="legend-dot" style={{ background: "#059669" }} />
                  <div className="legend-text">
                    <div className="legend-name">مُرشَّحون</div>
                    <div className="legend-val" style={{ color: "#059669" }}>{featuredCount}</div>
                  </div>
                </div>
                <div className="legend-row">
                  <div className="legend-dot" style={{ background: "#DC2626" }} />
                  <div className="legend-text">
                    <div className="legend-name">غير مُرشَّحين</div>
                    <div className="legend-val" style={{ color: "#DC2626" }}>{notFeatured}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top cities */}
          <div className="chart-card" style={{ flex: 1 }}>
            <div className="chart-title"><IcMapPin /> أبرز المدن</div>
            <div className="chart-sub">توزيع الحرفيين جغرافياً</div>
            <div className="city-bars">
              {topCities.slice(0, 7).map(([city, count]) => (
                <div key={city} className="city-bar-row">
                  <span className="city-name">{city}</span>
                  <div className="city-bar-outer">
                    <div className="city-bar-bg">
                      <div
                        className="city-bar-fill"
                        style={{ width: `${Math.round((count / maxCity) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className="city-count">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — profession bars */}
        <div className="chart-card">
          <div className="chart-title"><IcTool /> توزيع المهن</div>
          <div className="chart-sub">عدد الحرفيين في كل تخصص</div>
          <div className="prof-bars">
            {professionCounts.map(([name, count], i) => (
              <div key={name} className="prof-bar-row">
                <div className="prof-bar-top">
                  <span className="prof-bar-name">{name}</span>
                  <span className="prof-bar-num">{count}</span>
                </div>
                <div className="prof-bar-bg">
                  <div
                    className="prof-bar-fill"
                    style={{
                      width: `${Math.round((count / maxProf) * 100)}%`,
                      background: PROF_COLORS[i % PROF_COLORS.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Status Badge (replaces toggle switch) ── */
function FeaturedBadge({ craftsman, loading, onToggle }) {
  const busy = loading === craftsman.id;
  return (
    <button
      type="button"
      className={`status-badge ${craftsman.featured ? "s-on" : "s-off"}`}
      disabled={busy}
      onClick={() => onToggle(craftsman)}
    >
      <span className="status-dot" />
      {busy ? "..." : craftsman.featured ? "مُرشَّح" : "غير مرشح"}
    </button>
  );
}

/* ── Pagination ── */
function Pagination({ page, totalPages, total, pageSize, onPage }) {
  const start = (page - 1) * pageSize + 1;
  const end   = Math.min(page * pageSize, total);

  function getPages() {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 4)            return [1, 2, 3, 4, 5, "...", totalPages];
    if (page >= totalPages - 3)
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  }

  if (totalPages <= 1) return null;
  return (
    <div className="pagination">
      <div className="page-info">
        عرض <strong>{start}–{end}</strong> من <strong>{total}</strong> حرفي
      </div>
      <div className="page-btns">
        <button className="page-btn" disabled={page === 1} onClick={() => onPage(page - 1)}>
          <IcChevron />
        </button>
        {getPages().map((item, idx) =>
          item === "..." ? (
            <span key={`e${idx}`} className="page-ellipsis">···</span>
          ) : (
            <button
              key={item}
              className={`page-btn${page === item ? " active" : ""}`}
              onClick={() => onPage(item)}
            >{item}</button>
          )
        )}
        <button
          className="page-btn"
          style={{ transform: "scaleX(-1)" }}
          disabled={page === totalPages}
          onClick={() => onPage(page + 1)}
        >
          <IcChevron />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   DATA HELPERS
═══════════════════════════════════════════ */
function getAuthToken() {
  return (
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    ""
  );
}
function getHeaders(includeJson = false) {
  const token = getAuthToken();
  const h = {};
  if (includeJson) h["Content-Type"] = "application/json";
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}
function extractCraftsmen(payload) {
  if (Array.isArray(payload))                    return payload;
  if (Array.isArray(payload?.data?.craftsmen))   return payload.data.craftsmen;
  if (Array.isArray(payload?.data))              return payload.data;
  if (Array.isArray(payload?.craftsmen))         return payload.craftsmen;
  return [];
}
function normalizeArrayImages(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return [];
}
function normalizeProfessionName(value) {
  if (!value) return "غير محدد";
  const t = String(value).trim();
  return PROFESSION_LABELS[t] || t;
}
function resolveImageUrl(src) {
  if (!src) return "";
  if (src.startsWith("http")) return src;
  if (src.startsWith("/uploads")) return `${API_BASE_URL}${src}`;
  return src;
}
function getDisplayProfileImage(craftsman) {
  return resolveImageUrl(craftsman?.profileImage) || DEFAULT_PROFILE_IMAGE;
}
function normalizeCraftsman(item) {
  const fullName =
    `${item?.firstName || ""} ${item?.lastName || ""}`.trim() ||
    item?.name || "بدون اسم";
  return {
    id: item?._id || item?.id,
    firstName: item?.firstName || "",
    lastName:  item?.lastName  || "",
    fullName,
    phone:      item?.phone || "-",
    email:      item?.email || "-",
    profession: normalizeProfessionName(item?.profession),
    years:      Number(item?.yearsOfExperience ?? item?.years ?? 0),
    city:       item?.city || item?.region || "-",
    neighborhood: item?.neighborhood || item?.address || "",
    photos:     normalizeArrayImages(item?.workImages || item?.photos || item?.images),
    profileImage: item?.profileImage || item?.avatar || item?.image || "",
    featured:   Boolean(item?.featured ?? item?.isFeatured ?? false),
  };
}
function uniqueProfessions(list) {
  const fetched = list.map((c) => c.profession).filter(Boolean);
  return ["الكل", ...new Set([...BASE_PROFESSIONS, ...fetched])];
}
async function readJsonSafe(res) {
  try { return await res.json(); } catch { return null; }
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export default function AdminPage() {
  const [craftsmen, setCraftsmen]         = useState([]);
  const [profession, setProfession]       = useState("الكل");
  const [search, setSearch]               = useState("");
  const [toast, setToast]                 = useState(null);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState("");
  const [updatingId, setUpdatingId]       = useState(null);
  const [deletingId, setDeletingId]       = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [page, setPage]                   = useState(1);
  const [view, setView]                   = useState("table"); // "table" | "stats"

  useEffect(() => { setPage(1); }, [profession, search]);

  const toastTimerRef = useRef(null);
  const showToast = (msg, icon = "✅") => {
    setToast({ msg, icon });
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 2600);
  };

  const redirectToLogin = () => {
    ["adminToken", "token", "accessToken", "forsaAdmin", "forsaAdminEmail"].forEach(
      (k) => localStorage.removeItem(k)
    );
    window.location.replace("/login");
  };

  const fetchCraftsmen = async () => {
    try {
      setLoading(true); setError("");
      const res = await fetch(`${ADMIN_CRAFTSMEN_ENDPOINT}?limit=100`, { method: "GET", headers: getHeaders() });
      if (res.status === 401) { redirectToLogin(); return; }
      const payload = await readJsonSafe(res);
      if (!res.ok) throw new Error(payload?.status?.message || payload?.message || "فشل جلب بيانات الحرفيين");
      setCraftsmen(extractCraftsmen(payload).map(normalizeCraftsman));
    } catch (err) {
      setError(err.message || "حدث خطأ أثناء جلب البيانات");
      setCraftsmen([]);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (!getAuthToken()) { redirectToLogin(); return; }
    fetchCraftsmen();
  }, []);

  const professions    = useMemo(() => uniqueProfessions(craftsmen), [craftsmen]);
  const featuredCount  = useMemo(() => craftsmen.filter((c) => c.featured).length, [craftsmen]);
  const citiesCount    = useMemo(() => new Set(craftsmen.map((c) => c.city).filter(Boolean)).size, [craftsmen]);

  const professionCounts = useMemo(() => {
    const counts = {};
    craftsmen.forEach((c) => {
      if (c.profession && c.profession !== "غير محدد")
        counts[c.profession] = (counts[c.profession] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [craftsmen]);

  const topCities = useMemo(() => {
    const counts = {};
    craftsmen.forEach((c) => {
      if (c.city && c.city !== "-") counts[c.city] = (counts[c.city] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [craftsmen]);

  const filtered = useMemo(() => {
    let list = [...craftsmen];
    if (profession !== "الكل") list = list.filter((c) => c.profession === profession);
    const q = search.trim().toLowerCase();
    if (q) list = list.filter((c) =>
      [c.fullName, c.phone, c.email, c.city, c.neighborhood, c.profession]
        .filter(Boolean).some((v) => String(v).toLowerCase().includes(q))
    );
    return list;
  }, [craftsmen, profession, search]);

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated   = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const toggleFeatured = async (craftsman) => {
    const nextFeatured = !craftsman.featured;
    try {
      setUpdatingId(craftsman.id);
      const res = await fetch(`${ADMIN_CRAFTSMEN_ENDPOINT}/${craftsman.id}/featured`, {
        method: "PATCH",
        headers: getHeaders(true),
        body: JSON.stringify({ featured: nextFeatured, isFeatured: nextFeatured }),
      });
      if (res.status === 401) { redirectToLogin(); return; }
      const payload = await readJsonSafe(res);
      if (!res.ok) throw new Error(payload?.status?.message || payload?.message || "فشل تحديث حالة الترشيح");
      const serverFeatured = Boolean(
        payload?.data?.isFeatured ?? payload?.data?.featured ??
        payload?.isFeatured ?? payload?.featured ?? nextFeatured
      );
      setCraftsmen((prev) => prev.map((c) => c.id === craftsman.id ? { ...c, featured: serverFeatured } : c));
      showToast(serverFeatured ? "تم ترشيح الحرفي ضمن المميزين" : "تم إلغاء ترشيح الحرفي", serverFeatured ? "⭐" : "↩️");
    } catch (err) {
      showToast(err.message || "تعذر تحديث الحالة", "❌");
    } finally { setUpdatingId(null); }
  };

  const deleteCraftsman = async (craftsman) => {
    try {
      setDeletingId(craftsman.id);
      const res = await fetch(`${ADMIN_CRAFTSMEN_ENDPOINT}/${craftsman.id}`, { method: "DELETE", headers: getHeaders() });
      if (res.status === 401) { redirectToLogin(); return; }
      const payload = await readJsonSafe(res);
      if (!res.ok) throw new Error(payload?.status?.message || payload?.message || "فشل حذف الحرفي");
      setCraftsmen((prev) => prev.filter((c) => c.id !== craftsman.id));
      setConfirmTarget(null);
      showToast(`تم حذف الحرفي ${craftsman.fullName} بنجاح`, "🗑️");
    } catch (err) {
      showToast(err.message || "تعذر حذف الحرفي", "❌");
    } finally { setDeletingId(null); }
  };

  const handleLogout = () => {
    ["adminToken","token","accessToken","forsaAdmin","forsaAdminEmail"].forEach((k) => localStorage.removeItem(k));
    window.location.href = "/";
  };

  return (
    <>
      <style>{css}</style>

      <div className="app">
        {/* ══════ SIDEBAR ══════ */}
        <aside className="sidebar">

          <div className="sb-brand">
            <img src="/images/logo1.png" alt="فرصة" className="sb-logo" />
            <div className="sb-name">فُر<span>صة</span></div>
          </div>

          <div className="sb-user">
            <div className="sb-user-icon"><IcUserCircle /></div>
            <div>
              <div className="sb-user-name">مدير النظام</div>
              <div className="sb-user-role">Admin Panel</div>
            </div>
          </div>

          <div className="sb-section">القائمة</div>
          <div className="sb-nav">
            <button
              type="button"
              className={`sb-item${view === "table" ? " active" : ""}`}
              onClick={() => setView("table")}
            >
              <IcUsers /> إدارة الحرفيين
            </button>
            <button
              type="button"
              className={`sb-item${view === "stats" ? " active" : ""}`}
              onClick={() => setView("stats")}
            >
              <IcBarChart /> الإحصائيات
            </button>
          </div>

          <div style={{ flex: 1 }} />

          <div className="sb-footer">
            <div className="sb-divider" />
            <button type="button" className="sb-home" onClick={() => (window.location.href = "/")}>
              <IcHome /> الصفحة الرئيسية
            </button>
            <button type="button" className="sb-logout" onClick={handleLogout}>
              <IcLogout /> تسجيل الخروج
            </button>
            <div className="sb-footer-pad" />
          </div>
        </aside>

        {/* ══════ MAIN ══════ */}
        <main className="main">

          {/* Gradient header */}
          <div className="topbar">
            <div className="topbar-left">
              <div className="topbar-title">
                <IcGrid /> {view === "stats" ? "الإحصائيات والتقارير" : "لوحة إدارة الحرفيين"}
              </div>
              <div className="topbar-sub">
                الرئيسية <IcChevron /> {view === "stats" ? "الإحصائيات" : "الحرفيون"}
              </div>
            </div>
            <div className="topbar-right">
              <div className="admin-chip">
                <IcShield /> مدير النظام
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="content">
            {error && <div className="error-box">❌ {error}</div>}

            {/* ── STATS VIEW ── */}
            {view === "stats" && !loading && (
              <StatsView
                craftsmen={craftsmen}
                professionCounts={professionCounts}
                topCities={topCities}
                featuredCount={featuredCount}
                citiesCount={citiesCount}
              />
            )}

            {/* ── TABLE VIEW ── */}
            {view === "table" && (
              <>
                {/* Filter bar */}
                <div className="filter-bar">
                  <div className="filter-label"><IcFilter /> تصفية:</div>
                  <div className="filter-chips">
                    {professions.map((item) => (
                      <button
                        key={item}
                        type="button"
                        className={`chip${profession === item ? " active" : ""}`}
                        onClick={() => setProfession(item)}
                      >{item}</button>
                    ))}
                  </div>
                  <div className="search-wrap">
                    <input
                      className="search-inp"
                      placeholder="بحث بالاسم، الهاتف، المدينة..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <span className="search-ico"><IcSearch /></span>
                  </div>
                </div>

                {/* Table */}
                <div className="table-wrap">
                  <div className="table-head-bar">
                    <div className="table-title">
                      <IcUsers /> قائمة الحرفيين
                      <span className="count-badge">{filtered.length}</span>
                    </div>
                    <button type="button" className="refresh-btn" onClick={fetchCraftsmen}>
                      <IcRefresh /> تحديث
                    </button>
                  </div>

                  {loading ? (
                    <div className="state-wrap">
                      <div className="spinner" />
                      <div className="state-title">جاري تحميل البيانات</div>
                      <div className="state-desc">انتظر لحظة...</div>
                    </div>
                  ) : (
                    <>
                      <div className="tbl-outer">
                        <table>
                          <thead>
                            <tr>
                              <th style={{ width: 46 }}>#</th>
                              <th>الحرفي</th>
                              <th>المهنة</th>
                              <th>الخبرة</th>
                              <th>المدينة / الحي</th>
                              <th>الهاتف</th>
                              <th>البريد</th>
                              <th className="sticky-featured" style={{ textAlign: "center" }}>الحالة</th>
                              <th style={{ textAlign: "center", width: 80 }}>حذف</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginated.length === 0 ? (
                              <tr>
                                <td colSpan={9}>
                                  <div className="state-wrap">
                                    <div className="state-ico">🔍</div>
                                    <div className="state-title">لا توجد نتائج</div>
                                    <div className="state-desc">جرّب تغيير التصفية أو كلمة البحث</div>
                                  </div>
                                </td>
                              </tr>
                            ) : (
                              paginated.map((craftsman, index) => (
                                <tr
                                  key={craftsman.id || index}
                                  className={craftsman.featured ? "row-featured" : ""}
                                >
                                  <td style={{ fontWeight: 600, fontSize: 12, color: "var(--text-3)" }}>
                                    {(currentPage - 1) * PAGE_SIZE + index + 1}
                                  </td>
                                  <td>
                                    <div className="user-cell">
                                      <img
                                        src={getDisplayProfileImage(craftsman)}
                                        alt={craftsman.fullName}
                                        className="user-avatar"
                                        loading="lazy"
                                      />
                                      <div>
                                        <div className="cell-name">{craftsman.fullName}</div>
                                        <div className="cell-sub">{String(craftsman.id || "-").slice(-8)}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td><span className="cell-badge">{craftsman.profession}</span></td>
                                  <td>
                                    <span style={{ fontWeight: 800 }}>{craftsman.years}</span>
                                    <span className="cell-muted"> سنة</span>
                                  </td>
                                  <td>
                                    <div className="location-main">{craftsman.city || "-"}</div>
                                    <div className="location-sub">{craftsman.neighborhood || "—"}</div>
                                  </td>
                                  <td><span className="cell-phone">{craftsman.phone}</span></td>
                                  <td><span className="email-cell">{craftsman.email}</span></td>
                                  <td className="sticky-featured" style={{ textAlign: "center" }}>
                                    <FeaturedBadge
                                      craftsman={craftsman}
                                      loading={updatingId}
                                      onToggle={toggleFeatured}
                                    />
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    <button
                                      type="button"
                                      className="del-btn"
                                      onClick={() => setConfirmTarget(craftsman)}
                                      disabled={deletingId === craftsman.id}
                                    >
                                      <IcTrash /> حذف
                                    </button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                      <Pagination
                        page={currentPage}
                        totalPages={totalPages}
                        total={filtered.length}
                        pageSize={PAGE_SIZE}
                        onPage={setPage}
                      />
                    </>
                  )}
                </div>
              </>
            )}

            {/* Loading in stats view */}
            {view === "stats" && loading && (
              <div className="state-wrap">
                <div className="spinner" />
                <div className="state-title">جاري تحميل الإحصائيات</div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Confirm Modal */}
      {confirmTarget && (
        <div className="confirm-overlay" onClick={() => setConfirmTarget(null)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">🗑️</div>
            <div className="confirm-title">تأكيد الحذف</div>
            <div className="confirm-desc">
              هل أنت متأكد من حذف الحرفي{" "}
              <span className="confirm-name">{confirmTarget.fullName}</span>؟
              <br />هذا الإجراء لا يمكن التراجع عنه.
            </div>
            <div className="confirm-actions">
              <button
                type="button"
                className="confirm-cancel"
                onClick={() => setConfirmTarget(null)}
                disabled={deletingId === confirmTarget.id}
              >إلغاء</button>
              <button
                type="button"
                className="confirm-delete"
                onClick={() => deleteCraftsman(confirmTarget)}
                disabled={deletingId === confirmTarget.id}
              >
                {deletingId === confirmTarget.id ? "جاري الحذف..." : "نعم، احذف"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="toast">{toast.icon} {toast.msg}</div>
      )}
    </>
  );
}
