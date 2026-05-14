import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { extractProfileFromResume, resumeFileToPlainText } from '../utils/resumeExtract.js';
import { fetchJobsByPlatform, hasJSearchConfigured, JSEARCH_PLATFORMS } from '../utils/jobFeeds.js';

/** Only list jobs at or above this fit % (integer scores). */
const MIN_FIT = 80;

/** Platforms scanned by "Count keyword" (one fetch each; JSearch uses 1 page). */
const KEYWORD_SNAPSHOT_PLATFORMS = [
  ['remoteok', 'Remote OK'],
  ['arbeitnow', 'Arbeitnow'],
  ['remotive', 'Remotive'],
  ['google_jsearch', 'Google Jobs (JSearch)'],
  ['linkedin_jsearch', 'LinkedIn (JSearch)'],
  ['indeed_jsearch', 'Indeed (JSearch)'],
  ['glassdoor_jsearch', 'Glassdoor (JSearch)'],
  ['dice_jsearch', 'Dice (JSearch)'],
  ['ziprecruiter_jsearch', 'ZipRecruiter (JSearch)'],
  ['monster_jsearch', 'Monster (JSearch)'],
  ['simplyhired_jsearch', 'SimplyHired (JSearch)'],
  ['careerbuilder_jsearch', 'CareerBuilder (JSearch)'],
  ['snagajob_jsearch', 'Snagajob (JSearch)'],
];

/** Visual + copy tone: job seeker / career search (not generic SaaS purple). */
const JOB_THEME = {
  bg: 'linear-gradient(165deg, #eef2f6 0%, #e0f2fe 38%, #f8fafc 100%)',
  cardBg: '#ffffff',
  cardBorder: '1px solid #cbd5e1',
  cardRadius: 16,
  ink: '#0f172a',
  muted: '#64748b',
  sub: '#475569',
  accent: '#0d9488',
  accentDark: '#0f766e',
  accentSoft: '#f0fdfa',
  accentMuted: '#ccfbf1',
  accentBorder: '#5eead4',
  label: '#115e59',
  snapshotBox: '#f8fafc',
  snapshotBorder: '#bae6fd',
  tableHead: '#f0fdfa',
  tableStroke: '#99f6e4',
  listBorder: '#ccfbf1',
  rowApplied: 'rgba(13, 148, 136, 0.09)',
  link: '#0369a1',
  primaryBtn: '#0f766e',
  primaryBtnDisabled: '#94a3b8',
};

function jobTextMatchesKeyword(j, kw) {
  const k = String(kw || '').trim().toLowerCase();
  if (k.length < 2) return false;
  const blob = `${j.title}\n${j.company}\n${j.bodyText}`.toLowerCase();
  return blob.includes(k);
}

const APPLIED_STORAGE_KEY = 'applykit-applied-jobs-v1';

/** Stable key for “already applied” across reloads (URL preferred). */
function stableJobKey(j) {
  const u = String(j.url || '').trim();
  if (u) {
    try {
      const x = new URL(u);
      return x.href.split('#')[0];
    } catch {
      return u;
    }
  }
  return `id:${j.id || ''}`;
}

function loadAppliedMap() {
  try {
    const raw = localStorage.getItem(APPLIED_STORAGE_KEY);
    if (!raw) return {};
    const o = JSON.parse(raw);
    return o && typeof o === 'object' ? o : {};
  } catch {
    return {};
  }
}

function fitScore(skills, text) {
  if (!text?.trim() || !skills?.length) return null;
  const t = text.toLowerCase();
  const hits = skills.filter((s) => t.includes(String(s).toLowerCase()));
  return Math.min(100, Math.round((hits.length / Math.max(skills.length, 1)) * 100));
}

export default function ApplyKitPage() {
  const [headline, setHeadline] = useState('');
  const [skills, setSkills] = useState([]);
  const [resumeBusy, setResumeBusy] = useState(false);
  const [resumeError, setResumeError] = useState('');
  const [dropHover, setDropHover] = useState(false);
  const resumeFileRef = useRef(null);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [filter, setFilter] = useState('');
  const [jobTab, setJobTab] = useState('all');
  const [jobPlatform, setJobPlatform] = useState('both_free');
  const [appliedMap, setAppliedMap] = useState(loadAppliedMap);
  const [appliedListFilter, setAppliedListFilter] = useState('all');
  const [countKeyword, setCountKeyword] = useState('');
  const [snapshotLoading, setSnapshotLoading] = useState(false);
  const [snapshotError, setSnapshotError] = useState('');
  const [snapshotRows, setSnapshotRows] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(APPLIED_STORAGE_KEY, JSON.stringify(appliedMap));
    } catch {
      /* ignore quota / private mode */
    }
  }, [appliedMap]);

  const toggleApplied = useCallback((j) => {
    const key = stableJobKey(j);
    setAppliedMap((prev) => {
      const next = { ...prev };
      if (next[key]) delete next[key];
      else next[key] = { at: new Date().toISOString() };
      return next;
    });
  }, []);

  /** Opens listing in a new tab and records as Applied (does not clear if already applied). */
  const openAndTrackApply = useCallback((j) => {
    const u = String(j.url || '').trim();
    if (!u) return;
    window.open(u, '_blank', 'noopener,noreferrer');
    const key = stableJobKey(j);
    setAppliedMap((prev) => {
      if (prev[key]) return prev;
      return { ...prev, [key]: { at: new Date().toISOString() } };
    });
  }, []);

  const searchQuery = useMemo(() => {
    const bits = [headline, ...skills.slice(0, 12)].filter(Boolean);
    const q = bits.join(' ').trim();
    return q.length >= 2 ? q.slice(0, 220) : 'software developer';
  }, [headline, skills]);

  const scored = useMemo(() => {
    const withFit = jobs.map((j) => {
      const k = stableJobKey(j);
      const entry = appliedMap[k];
      return {
        ...j,
        _key: k,
        fit: skills.length > 0 ? fitScore(skills, j.bodyText) : null,
        applied: Boolean(entry),
        appliedAt: entry?.at || null,
      };
    });
    if (skills.length === 0) return withFit;
    return [...withFit].sort((a, b) => (b.fit ?? 0) - (a.fit ?? 0));
  }, [jobs, skills, appliedMap]);

  const filterByApplied = useCallback(
    (list) => {
      if (appliedListFilter === 'hide_applied') return list.filter((j) => !j.applied);
      if (appliedListFilter === 'applied_only') return list.filter((j) => j.applied);
      return list;
    },
    [appliedListFilter]
  );

  const visibleAll = useMemo(() => {
    const q = filter.trim().toLowerCase();
    let list = !q
      ? scored
      : scored.filter((j) =>
          `${j.title} ${j.company} ${j.location} ${j.bodyText}`.toLowerCase().includes(q)
        );
    return filterByApplied(list);
  }, [scored, filter, filterByApplied]);

  const visibleMatch = useMemo(() => {
    if (skills.length === 0) return [];
    let list = scored.filter((j) => j.fit != null && j.fit >= MIN_FIT);
    const q = filter.trim().toLowerCase();
    if (q) {
      list = list.filter((j) =>
        `${j.title} ${j.company} ${j.location} ${j.bodyText}`.toLowerCase().includes(q)
      );
    }
    return filterByApplied(list);
  }, [scored, filter, skills, filterByApplied]);

  const displayRows = jobTab === 'all' ? visibleAll : visibleMatch;

  const applyResumeText = useCallback((plain) => {
    setResumeError('');
    const ex = extractProfileFromResume(plain);
    setHeadline(ex.headline);
    setSkills(ex.skills.length ? ex.skills : []);
  }, []);

  const ingestFile = useCallback(
    async (file) => {
      if (!file) return;
      setResumeBusy(true);
      setResumeError('');
      try {
        const text = await resumeFileToPlainText(file);
        applyResumeText(text);
      } catch (e) {
        setResumeError(e?.message || 'Could not read file.');
      } finally {
        setResumeBusy(false);
        if (resumeFileRef.current) resumeFileRef.current.value = '';
      }
    },
    [applyResumeText]
  );

  const loadJobs = async () => {
    setLoading(true);
    setFetchError('');
    try {
      if (JSEARCH_PLATFORMS.has(jobPlatform) && !hasJSearchConfigured()) {
        setFetchError(
          'This platform uses JSearch on RapidAPI. Add VITE_RAPIDAPI_KEY to applykit/.env (subscribe to JSearch), restart npm run dev, then try again.'
        );
        return;
      }
      const { jobs: next, errors } = await fetchJobsByPlatform(jobPlatform, { searchQuery });
      setJobs(next);
      if (errors.length) setFetchError(errors.join(' · '));
    } catch (e) {
      setFetchError(e?.message || 'Could not load job listings.');
    } finally {
      setLoading(false);
    }
  };

  const runKeywordSnapshot = async () => {
    const kw = countKeyword.trim();
    if (kw.length < 2) {
      setSnapshotError('Enter at least 2 characters for your role or skill (e.g. ICU nurse, React Native).');
      setSnapshotRows(null);
      return;
    }
    setSnapshotLoading(true);
    setSnapshotError('');
    setSnapshotRows(null);
    try {
      const hasKey = hasJSearchConfigured();
      const specs = KEYWORD_SNAPSHOT_PLATFORMS.filter(([id]) => !JSEARCH_PLATFORMS.has(id) || hasKey);
      const results = await Promise.all(
        specs.map(async ([id, label]) => {
          try {
            const { jobs, errors } = await fetchJobsByPlatform(id, { searchQuery: kw, numPages: 1 });
            const err = errors?.length ? errors.join(' · ') : '';
            const matching = jobs.filter((j) => jobTextMatchesKeyword(j, kw)).length;
            return { id, label, total: jobs.length, matching, apiNote: err || null };
          } catch (e) {
            return { id, label, total: 0, matching: 0, apiNote: e?.message || 'Failed' };
          }
        })
      );
      setSnapshotRows(results);
    } catch (e) {
      setSnapshotError(e?.message || 'Could not complete snapshot.');
    } finally {
      setSnapshotLoading(false);
    }
  };

  const card = {
    border: JOB_THEME.cardBorder,
    borderRadius: JOB_THEME.cardRadius,
    padding: 20,
    background: JOB_THEME.cardBg,
    marginBottom: 16,
  };

  return (
    <div
      style={{
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial',
        minHeight: '100vh',
        background: JOB_THEME.bg,
        padding: 24,
        color: JOB_THEME.ink,
      }}
    >
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div
          style={{
            marginBottom: 22,
            paddingBottom: 18,
            borderBottom: `1px solid ${JOB_THEME.accentMuted}`,
          }}
        >
          <div style={{ display: 'inline-block', marginBottom: 8 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 0.06,
                textTransform: 'uppercase',
                color: JOB_THEME.accentDark,
                background: JOB_THEME.accentSoft,
                border: `1px solid ${JOB_THEME.accentBorder}`,
                padding: '4px 10px',
                borderRadius: 999,
              }}
            >
              Job search
            </span>
          </div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, letterSpacing: -0.5, color: JOB_THEME.ink }}>ApplyKit</h1>
          <p style={{ margin: '8px 0 0', fontSize: 14, color: JOB_THEME.sub, lineHeight: 1.55, maxWidth: 640 }}>
            Built around <strong>finding work</strong>: load open roles from job boards, score how well each posting matches your résumé, and keep a simple{' '}
            <strong>application log</strong> in this browser.
          </p>
          <p style={{ margin: '10px 0 0', fontSize: 13, color: JOB_THEME.muted, lineHeight: 1.5 }}>
            <strong>All open roles</strong> lists every listing in the last fetch. <strong>Strong matches</strong> shows only roles at <strong>{MIN_FIT}%+</strong> skill fit once your CV is uploaded.
          </p>
        </div>

        {resumeError ? <div style={{ ...card, background: '#fef2f2', borderColor: '#fecaca', color: '#991b1b', fontWeight: 700 }}>{resumeError}</div> : null}
        {fetchError ? <div style={{ ...card, background: '#fffbeb', borderColor: '#fde68a', color: '#92400e', fontSize: 13 }}>{fetchError}</div> : null}

        <div
          style={{
            ...card,
            borderStyle: dropHover ? 'dashed' : 'solid',
            borderColor: dropHover ? JOB_THEME.accent : JOB_THEME.cardBorder,
            background: dropHover ? JOB_THEME.accentSoft : JOB_THEME.cardBg,
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            setDropHover(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDropHover(true);
          }}
          onDragLeave={() => setDropHover(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDropHover(false);
            const f = e.dataTransfer.files?.[0];
            if (f) ingestFile(f);
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 900, color: JOB_THEME.label, marginBottom: 10, letterSpacing: 0.04 }}>Résumé & skills</div>
          <p style={{ margin: '0 0 12px', fontSize: 14, color: JOB_THEME.sub, lineHeight: 1.55 }}>
            Drop a <strong>PDF</strong> or <strong>.txt</strong> résumé. We extract a target role line and tech skills so job descriptions can be scored against <em>your</em> profile—nothing is guessed until you upload.
          </p>
          <input ref={resumeFileRef} type="file" accept=".pdf,.txt,.md,application/pdf,text/plain" onChange={(e) => ingestFile(e.target.files?.[0])} style={{ marginBottom: 12 }} />
          {resumeBusy ? <div style={{ fontSize: 13, color: JOB_THEME.accentDark, fontWeight: 700 }}>Reading your file…</div> : null}
          {headline ? (
            <div style={{ marginTop: 12, fontSize: 13, color: JOB_THEME.ink }}>
              <strong>Target role line:</strong> {headline}
            </div>
          ) : null}
          {skills.length ? (
            <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {skills.slice(0, 24).map((s) => (
                <span
                  key={s}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '4px 8px',
                    borderRadius: 999,
                    background: JOB_THEME.accentSoft,
                    border: `1px solid ${JOB_THEME.accentBorder}`,
                    color: JOB_THEME.accentDark,
                  }}
                >
                  {s}
                </span>
              ))}
              {skills.length > 24 ? <span style={{ fontSize: 11, color: JOB_THEME.muted }}>+{skills.length - 24} more</span> : null}
            </div>
          ) : null}
          {!skills.length ? (
            <div style={{ marginTop: 10, fontSize: 13, color: '#b45309', fontWeight: 700, lineHeight: 1.45 }}>
              {headline
                ? 'No clear skills extracted yet — role-to-description fit % stays off until we see technologies on your CV.'
                : 'Upload your résumé to unlock skill fit scores against job descriptions.'}
            </div>
          ) : null}
        </div>

        <div style={card}>
          <div style={{ fontSize: 12, fontWeight: 900, color: JOB_THEME.label, marginBottom: 10, letterSpacing: 0.04 }}>Open roles & applications</div>
          <div style={{ display: 'flex', gap: 4, marginBottom: 12, flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All open roles', count: jobs.length ? visibleAll.length : 0 },
              { id: 'match', label: 'Strong matches', count: visibleMatch.length },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setJobTab(tab.id)}
                style={{
                  padding: '10px 16px',
                  borderRadius: 12,
                  border: jobTab === tab.id ? `2px solid ${JOB_THEME.accentDark}` : JOB_THEME.cardBorder,
                  background: jobTab === tab.id ? JOB_THEME.accentSoft : JOB_THEME.cardBg,
                  color: jobTab === tab.id ? JOB_THEME.accentDark : JOB_THEME.sub,
                  fontWeight: jobTab === tab.id ? 900 : 700,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                {tab.label}
                <span style={{ opacity: 0.85, marginLeft: 6 }}>({tab.count})</span>
              </button>
            ))}
          </div>

          <div
            style={{
              marginBottom: 16,
              padding: 14,
              borderRadius: 12,
              border: `1px solid ${JOB_THEME.snapshotBorder}`,
              background: JOB_THEME.snapshotBox,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 900, color: JOB_THEME.accentDark, marginBottom: 6 }}>Job market snapshot (sample)</div>
            <p style={{ fontSize: 11, color: JOB_THEME.muted, margin: '0 0 10px', lineHeight: 1.45 }}>
              See how often your <strong>target title or keyword</strong> appears in a <strong>single sample pull</strong> per board (not total jobs on the internet). Free boards use full feeds where possible; Remotive/JSearch return API-sized pages. <strong>Keyword hits</strong> = listings in that batch whose title, employer, or description still mention your term. Without <code style={{ fontSize: 10 }}>VITE_RAPIDAPI_KEY</code>, JSearch-backed boards are skipped.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'flex-end', marginBottom: snapshotRows?.length ? 12 : 0 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, fontWeight: 800, color: JOB_THEME.sub }}>
                Role title or keyword
                <input
                  value={countKeyword}
                  onChange={(e) => setCountKeyword(e.target.value)}
                  placeholder="e.g. staff nurse, MERN, SRE"
                  style={{ padding: '10px 12px', borderRadius: 12, border: '1px solid #cbd5e1', minWidth: 220, fontWeight: 600 }}
                />
              </label>
              <button
                type="button"
                disabled={snapshotLoading}
                onClick={runKeywordSnapshot}
                style={{
                  padding: '12px 16px',
                  borderRadius: 12,
                  border: `1px solid ${JOB_THEME.accentDark}`,
                  background: snapshotLoading ? JOB_THEME.accentMuted : JOB_THEME.accentSoft,
                  color: JOB_THEME.accentDark,
                  fontWeight: 900,
                  fontSize: 13,
                  cursor: snapshotLoading ? 'wait' : 'pointer',
                }}
              >
                {snapshotLoading ? 'Scanning boards…' : 'Run snapshot'}
              </button>
            </div>
            {snapshotError ? <div style={{ fontSize: 12, color: '#b45309', fontWeight: 700, marginTop: 8 }}>{snapshotError}</div> : null}
            {snapshotRows && snapshotRows.length > 0 ? (
              <div style={{ overflowX: 'auto', marginTop: 10 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ textAlign: 'left', color: JOB_THEME.muted, borderBottom: `1px solid ${JOB_THEME.accentBorder}` }}>
                      <th style={{ padding: '8px 6px' }}>Job board</th>
                      <th style={{ padding: '8px 6px', whiteSpace: 'nowrap' }}>Roles in sample</th>
                      <th style={{ padding: '8px 6px', whiteSpace: 'nowrap' }}>Keyword hits</th>
                      <th style={{ padding: '8px 6px' }}>Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {snapshotRows.map((row) => (
                      <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#334155' }}>
                        <td style={{ padding: '8px 6px', fontWeight: 700 }}>{row.label}</td>
                        <td style={{ padding: '8px 6px' }}>{row.total}</td>
                        <td style={{ padding: '8px 6px', fontWeight: 800, color: row.matching ? '#059669' : '#64748b' }}>{row.matching}</td>
                        <td style={{ padding: '8px 6px', fontSize: 11, color: '#94a3b8' }}>{row.apiNote || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p style={{ fontSize: 11, color: '#94a3b8', margin: '8px 0 0' }}>
                  Example: “Keyword hits 12” on LinkedIn (JSearch) means twelve postings in that API batch mentioned your keyword—not twelve total openings on LinkedIn.
                </p>
              </div>
            ) : null}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'flex-end', marginBottom: 12 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, fontWeight: 800, color: JOB_THEME.sub }}>
              Where to pull jobs from
              <select
                value={jobPlatform}
                onChange={(e) => setJobPlatform(e.target.value)}
                style={{
                  padding: '10px 12px',
                  borderRadius: 12,
                  border: JOB_THEME.cardBorder,
                  minWidth: 280,
                  maxWidth: '100%',
                  fontWeight: 700,
                  color: JOB_THEME.ink,
                  background: JOB_THEME.cardBg,
                }}
              >
                <optgroup label="Public job feeds — no API key">
                  <option value="both_free">Remote OK + Arbeitnow + Remotive (merged, deduped)</option>
                  <option value="remoteok">Remote OK only</option>
                  <option value="arbeitnow">Arbeitnow only</option>
                  <option value="remotive">Remotive only</option>
                </optgroup>
                <optgroup label="Broader index (JSearch / RapidAPI — needs VITE_RAPIDAPI_KEY)">
                  <option value="google_jsearch">Google Jobs index (broad)</option>
                  <option value="indeed_jsearch">Indeed (query bias)</option>
                  <option value="linkedin_jsearch">LinkedIn (query bias)</option>
                  <option value="glassdoor_jsearch">Glassdoor (query bias)</option>
                  <option value="dice_jsearch">Dice (query bias)</option>
                  <option value="ziprecruiter_jsearch">ZipRecruiter (query bias)</option>
                  <option value="monster_jsearch">Monster (query bias)</option>
                  <option value="simplyhired_jsearch">SimplyHired (query bias)</option>
                  <option value="careerbuilder_jsearch">CareerBuilder (query bias)</option>
                  <option value="snagajob_jsearch">Snagajob (query bias)</option>
                </optgroup>
              </select>
            </label>
            <button
              type="button"
              disabled={loading}
              onClick={loadJobs}
              style={{
                padding: '12px 18px',
                borderRadius: 12,
                border: 'none',
                background: loading ? JOB_THEME.primaryBtnDisabled : JOB_THEME.primaryBtn,
                color: '#fff',
                fontWeight: 900,
                cursor: loading ? 'wait' : 'pointer',
              }}
            >
              {loading ? 'Loading listings…' : 'Fetch job listings'}
            </button>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, fontWeight: 800, color: JOB_THEME.sub }}>
              Application status
              <select
                value={appliedListFilter}
                onChange={(e) => setAppliedListFilter(e.target.value)}
                style={{ padding: '10px 12px', borderRadius: 12, border: JOB_THEME.cardBorder, minWidth: 150, fontWeight: 700, color: JOB_THEME.ink, background: JOB_THEME.cardBg }}
              >
                <option value="all">All applications</option>
                <option value="hide_applied">Hide submitted</option>
                <option value="applied_only">Submitted only</option>
              </select>
            </label>
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter by company, title, location…"
              style={{ flex: 1, minWidth: 160, padding: 10, borderRadius: 12, border: '1px solid #cbd5e1' }}
            />
            <span style={{ fontSize: 12, color: JOB_THEME.muted, fontWeight: 700 }}>
              {jobs.length === 0
                ? 'No roles loaded yet — fetch listings to start'
                : jobTab === 'all'
                  ? `${visibleAll.length} roles shown · ${jobs.length} in batch`
                  : !skills.length
                    ? `Strong matches need your résumé · ${jobs.length} roles loaded`
                    : `${visibleMatch.length} at ${MIN_FIT}%+ fit · ${jobs.length} in batch`}
            </span>
          </div>
          <p style={{ fontSize: 12, color: JOB_THEME.muted, margin: '0 0 12px', lineHeight: 1.45 }}>
            <strong>Public feeds</strong> need no key. <strong>JSearch</strong> needs <code style={{ fontSize: 11 }}>VITE_RAPIDAPI_KEY</code> and returns aggregated job-index results (search text is biased toward certain employers, not their official APIs). Search sent to boards: <b>{searchQuery}</b>.
            {' '}
            <strong>Apply to role</strong> opens the employer’s page and logs that you started an application; <strong>Peek</strong> opens without logging. Data stays in this browser only.
            {!skills.length ? <span style={{ color: '#b45309', fontWeight: 700 }}> Add your résumé to turn on fit % in Strong matches.</span> : null}
          </p>
          {jobs.length === 0 ? (
            <div style={{ color: JOB_THEME.muted, fontSize: 14 }}>Fetch job listings to load open roles into this workspace.</div>
          ) : jobTab === 'match' && !skills.length ? (
            <div style={{ color: JOB_THEME.muted, fontSize: 14, lineHeight: 1.5 }}>
              Upload your résumé to surface <b>{MIN_FIT}%+</b> skill matches, or browse everything under <b>All open roles</b>.
            </div>
          ) : displayRows.length === 0 ? (
            <div style={{ color: JOB_THEME.muted, fontSize: 14, lineHeight: 1.5 }}>
              {filter.trim()
                ? 'No roles match this filter—try another employer, title, or location.'
                : jobTab === 'match'
                  ? `No roles in this batch reach ${MIN_FIT}%+ fit—widen sources or fetch again.`
                  : 'No rows returned—try fetching listings again.'}
            </div>
          ) : (
            <div style={{ maxHeight: 480, overflow: 'auto', border: `1px solid ${JOB_THEME.listBorder}`, borderRadius: 12 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead style={{ position: 'sticky', top: 0, background: JOB_THEME.tableHead, zIndex: 1 }}>
                  <tr style={{ textAlign: 'left', color: JOB_THEME.muted, borderBottom: `1px solid ${JOB_THEME.tableStroke}` }}>
                    <th style={{ padding: '10px 8px', width: 1 }}>Apply</th>
                    <th style={{ padding: '10px 8px' }}>Skill fit</th>
                    <th style={{ padding: '10px 8px' }}>Submitted?</th>
                    <th style={{ padding: '10px 8px' }}>Source</th>
                    <th style={{ padding: '10px 8px' }}>Job</th>
                    <th style={{ padding: '10px 8px' }}> </th>
                  </tr>
                </thead>
                <tbody>
                  {displayRows.map((j) => (
                    <tr
                      key={j.id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        verticalAlign: 'top',
                        background: j.applied ? JOB_THEME.rowApplied : undefined,
                      }}
                    >
                      <td style={{ padding: '10px 8px', whiteSpace: 'nowrap' }}>
                        <button
                          type="button"
                          disabled={!j.url}
                          onClick={() => openAndTrackApply(j)}
                          aria-label={`Start application for ${j.title} at ${j.company}`}
                          title={j.url ? 'Open posting in a new tab and log as application started' : 'No application URL for this role'}
                          style={{
                            padding: '8px 12px',
                            borderRadius: 10,
                            border: 'none',
                            background: !j.url ? '#e2e8f0' : JOB_THEME.primaryBtn,
                            color: !j.url ? '#94a3b8' : '#fff',
                            fontWeight: 900,
                            fontSize: 12,
                            cursor: !j.url ? 'not-allowed' : 'pointer',
                          }}
                        >
                          Apply
                        </button>
                      </td>
                      <td
                        style={{
                          padding: '10px 8px',
                          fontWeight: 950,
                          color: j.fit == null ? '#94a3b8' : j.fit >= MIN_FIT ? '#059669' : '#64748b',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {j.fit == null ? '—' : `${j.fit}%`}
                      </td>
                      <td style={{ padding: '10px 8px', whiteSpace: 'nowrap' }}>
                        <button
                          type="button"
                          onClick={() => toggleApplied(j)}
                          title={j.appliedAt ? `Logged ${new Date(j.appliedAt).toLocaleString()}` : 'Toggle when you have submitted this application'}
                          style={{
                            padding: '6px 10px',
                            borderRadius: 10,
                            border: j.applied ? '1px solid #34d399' : '1px solid #cbd5e1',
                            background: j.applied ? '#ecfdf5' : '#fff',
                            color: j.applied ? '#047857' : '#475569',
                            fontWeight: 800,
                            fontSize: 11,
                            cursor: 'pointer',
                          }}
                        >
                          {j.applied ? 'Submitted' : 'Log'}
                        </button>
                        {j.applied && j.appliedAt ? (
                          <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4, maxWidth: 88 }}>
                            {new Date(j.appliedAt).toLocaleDateString()}
                          </div>
                        ) : null}
                      </td>
                      <td style={{ padding: '10px 8px', fontWeight: 700, color: JOB_THEME.accentDark, fontSize: 12, whiteSpace: 'nowrap' }}>{j.source}</td>
                      <td style={{ padding: '10px 8px' }}>
                        <div style={{ fontWeight: 800, color: '#0f172a' }}>{j.title}</div>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{j.company}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{j.location}</div>
                      </td>
                      <td style={{ padding: '10px 8px' }}>
                        {j.url ? (
                          <a href={j.url} target="_blank" rel="noreferrer" style={{ fontWeight: 800, color: JOB_THEME.link, fontSize: 12 }}>
                            Peek
                          </a>
                        ) : (
                          '—'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
