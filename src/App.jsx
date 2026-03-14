import { useMemo, useState } from "react";
import axios from "axios";

const API_BASE = "https://hirelensbe.onrender.com";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Modal({ open, title, subtitle, onClose, children, size = "xl" }) {
  if (!open) return null;

  const sizes = {
    md: "max-w-2xl",
    xl: "max-w-5xl",
    full: "max-w-7xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className={cn("relative max-h-[90vh] w-full overflow-hidden rounded-[32px] border border-white/10 bg-white shadow-2xl", sizes[size])}>
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 sm:px-8">
          <div>
            <h3 className="text-2xl font-semibold text-slate-900">{title}</h3>
            {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
          </div>
          <button
            onClick={onClose}
            className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
          >
            Close
          </button>
        </div>
        <div className="max-h-[calc(90vh-96px)] overflow-auto px-6 py-6 sm:px-8">{children}</div>
      </div>
    </div>
  );
}

function SectionCard({ title, subtitle, children, action }) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-7">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">{title}</h2>
          {subtitle ? <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function HeroStat({ label, value, hint }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur-md">
      <p className="text-sm text-slate-300">{label}</p>
      <p className="mt-2 text-4xl font-bold tracking-tight text-white">{value}</p>
      {hint ? <p className="mt-2 text-sm text-slate-300">{hint}</p> : null}
    </div>
  );
}

function ScoreGauge({ value = 0, label, theme = "slate" }) {
  const safe = Math.max(0, Math.min(100, value));
  const colorMap = {
    slate: "from-slate-900 via-slate-700 to-slate-500",
    blue: "from-blue-700 via-cyan-600 to-sky-400",
    emerald: "from-emerald-700 via-teal-600 to-cyan-400",
    purple: "from-violet-700 via-fuchsia-600 to-pink-400",
  };

  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">{safe}<span className="text-base font-medium text-slate-500">/100</span></p>
        </div>
        <div className="relative h-20 w-20 shrink-0">
          <div className="absolute inset-0 rounded-full bg-slate-200" />
          <div
            className={cn("absolute inset-0 rounded-full bg-gradient-to-br", colorMap[theme])}
            style={{ clipPath: `inset(${100 - safe}% 0 0 0 round 9999px)` }}
          />
          <div className="absolute inset-[8px] grid place-items-center rounded-full bg-white text-sm font-semibold text-slate-700">
            {safe}%
          </div>
        </div>
      </div>
    </div>
  );
}

function BadgeList({ items, tone = "slate", emptyText = "None" }) {
  const toneStyles = {
    slate: "border-slate-200 bg-slate-100 text-slate-700",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    red: "border-rose-200 bg-rose-50 text-rose-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    purple: "border-violet-200 bg-violet-50 text-violet-700",
  };

  if (!items || items.length === 0) {
    return <p className="text-sm text-slate-500">{emptyText}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className={cn("rounded-full border px-3 py-1.5 text-sm font-medium", toneStyles[tone])}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function InsightList({ title, items, tone = "green", emptyText = "No items available." }) {
  const titleStyles = {
    green: "text-emerald-700",
    red: "text-rose-700",
    slate: "text-slate-800",
    blue: "text-blue-700",
    purple: "text-violet-700",
  };

  return (
    <div className="rounded-[24px] bg-slate-50 p-4 sm:p-5">
      <h3 className={cn("mb-3 text-base font-semibold", titleStyles[tone])}>{title}</h3>
      {items && items.length > 0 ? (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={`${title}-${index}`} className="rounded-2xl bg-white px-4 py-3 text-sm leading-6 text-slate-700">
              {item}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">{emptyText}</p>
      )}
    </div>
  );
}

function Carousel({ title, items, tone = "slate", emptyText = "No items available." }) {
  const [index, setIndex] = useState(0);
  const safeItems = items || [];
  const hasItems = safeItems.length > 0;
  const current = hasItems ? safeItems[index] : null;

  const toneClass = {
    slate: "bg-slate-50 text-slate-700 border-slate-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    red: "bg-rose-50 text-rose-700 border-rose-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    purple: "bg-violet-50 text-violet-700 border-violet-200",
  };

  const prev = () => setIndex((i) => (i === 0 ? safeItems.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === safeItems.length - 1 ? 0 : i + 1));

  return (
    <div className="rounded-[24px] bg-slate-50 p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {hasItems ? (
          <div className="flex items-center gap-2">
            <button onClick={prev} className="rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100">Prev</button>
            <button onClick={next} className="rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100">Next</button>
          </div>
        ) : null}
      </div>

      {hasItems ? (
        <div className={cn("rounded-[22px] border p-5", toneClass[tone])}>
          <p className="text-sm font-medium opacity-80">Item {index + 1} of {safeItems.length}</p>
          <p className="mt-3 text-base leading-7">{current}</p>
        </div>
      ) : (
        <p className="text-sm text-slate-500">{emptyText}</p>
      )}

      {hasItems && safeItems.length > 1 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {safeItems.map((_, dotIndex) => (
            <button
              key={dotIndex}
              onClick={() => setIndex(dotIndex)}
              className={cn(
                "h-2.5 rounded-full transition-all",
                dotIndex === index ? "w-8 bg-slate-900" : "w-2.5 bg-slate-300 hover:bg-slate-400"
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function parsePossibleJson(value) {
  if (!value) return null;
  if (typeof value === "object") return value;

  try {
    return JSON.parse(value);
  } catch {
    const match = value.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

export default function App() {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [jobMatch, setJobMatch] = useState(null);
  const [aiFeedback, setAiFeedback] = useState(null);
  const [bulletText, setBulletText] = useState("");
  const [rewrittenBullet, setRewrittenBullet] = useState(null);
  const [loadingAction, setLoadingAction] = useState("");
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [jdModalOpen, setJdModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const parsedAiFeedback = useMemo(() => {
    if (!aiFeedback) return null;
    return parsePossibleJson(aiFeedback.raw_response || aiFeedback);
  }, [aiFeedback]);

  const parsedRewrittenBullet = useMemo(() => {
    if (!rewrittenBullet) return null;
    return parsePossibleJson(rewrittenBullet.raw_response || rewrittenBullet);
  }, [rewrittenBullet]);

  const resumeScore = analysis?.score || 0;
  const matchScore = jobMatch?.match_score || 0;

  const uploadLabel = loadingAction === "upload" ? "Uploading..." : "Upload & Analyze";
  const matchLabel = loadingAction === "match" ? "Matching..." : "Run JD Match";
  const aiLabel = loadingAction === "ai" ? "Generating..." : "Generate AI Review";
  const rewriteLabel = loadingAction === "rewrite" ? "Rewriting..." : "Rewrite Bullet";

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a resume file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoadingAction("upload");
      setAiFeedback(null);
      setRewrittenBullet(null);
      setJobMatch(null);

      const uploadResponse = await axios.post(`${API_BASE}/upload-resume`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const resumeText = uploadResponse.data.extracted_text || "";
      setExtractedText(resumeText);

      const analysisResponse = await axios.post(`${API_BASE}/analyze-resume`, {
        resume_text: resumeText,
      });

      setAnalysis(analysisResponse.data);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || "Resume upload or analysis failed.");
    } finally {
      setLoadingAction("");
    }
  };

  const handleJobMatch = async () => {
    if (!extractedText) {
      alert("Upload and analyze a resume first.");
      return;
    }
    if (!jobDescription.trim()) {
      alert("Please paste a job description.");
      return;
    }

    try {
      setLoadingAction("match");
      const response = await axios.post(`${API_BASE}/match-job`, {
        resume_text: extractedText,
        job_description: jobDescription,
      });
      setJobMatch(response.data);
    } catch (error) {
      console.error(error);
      alert("Job matching failed.");
    } finally {
      setLoadingAction("");
    }
  };

  const handleAIFeedback = async () => {
    if (!extractedText) {
      alert("Upload and analyze a resume first.");
      return;
    }

    try {
      setLoadingAction("ai");
      const response = await axios.post(`${API_BASE}/ai-feedback`, {
        resume_text: extractedText,
        job_description: jobDescription,
      });
      setAiFeedback(response.data);
      setAiModalOpen(true);
    } catch (error) {
      console.error(error);
      alert("AI feedback failed.");
    } finally {
      setLoadingAction("");
    }
  };

  const handleRewriteBullet = async () => {
    if (!bulletText.trim()) {
      alert("Enter a bullet point first.");
      return;
    }

    try {
      setLoadingAction("rewrite");
      const response = await axios.post(`${API_BASE}/rewrite-bullet`, {
        bullet_text: bulletText,
        job_description: jobDescription,
      });
      setRewrittenBullet(response.data);
    } catch (error) {
      console.error(error);
      alert("Bullet rewrite failed.");
    } finally {
      setLoadingAction("");
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.12),_transparent_28%),linear-gradient(to_bottom,_#f8fbff,_#eef4ff_45%,_#f8fafc)] text-slate-900">
      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
        <div className="overflow-hidden rounded-[36px] bg-slate-950 shadow-[0_40px_120px_rgba(15,23,42,0.35)]">
          <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-10 lg:py-10">
            <div className="min-w-0">
              <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-sm text-slate-200 backdrop-blur-md">
                AI Resume Analyzer • Clean Portfolio Dashboard
              </div>
              <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl xl:text-6xl">
                Analyze resumes, match job descriptions, and surface AI-ready improvements through a polished interface.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                Designed as a modern SaaS-style product with clean cards, modal detail views, and carousel-based insight browsing so your portfolio project feels product-grade instead of student-grade.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <HeroStat label="Resume Score" value={`${resumeScore}/100`} hint="Rule-based quality scoring" />
              <HeroStat label="JD Match" value={`${matchScore}%`} hint="Keyword and overlap match" />
              <HeroStat label="Detected Skills" value={`${analysis?.detected_skills?.length || 0}`} hint="Technical stack recognition" />
              <HeroStat label="AI Suggestions" value={`${parsedAiFeedback?.improvement_suggestions?.length || 0}`} hint="Returned suggestions" />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 2xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <SectionCard
              title="Resume Intake"
              subtitle="Upload the resume, run extraction, and generate the baseline analysis."
              action={file ? <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">{file.name}</span> : null}
            >
              <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-[28px] border-2 border-dashed border-slate-300 bg-slate-50 p-5 sm:p-6">
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                    className="block w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800"
                  />
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      onClick={handleUpload}
                      disabled={loadingAction !== "" && loadingAction !== "upload"}
                      className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {uploadLabel}
                    </button>
                    <button
                      onClick={() => setResumeModalOpen(true)}
                      disabled={!extractedText}
                      className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Preview Extracted Text
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <ScoreGauge value={resumeScore} label="Resume Quality" theme="slate" />
                  <ScoreGauge value={matchScore} label="JD Alignment" theme="blue" />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Resume Findings" subtitle="Keep the summary concise in the main view and explore details without overflowing the layout.">
              <div className="grid gap-4 xl:grid-cols-2">
                <Carousel
                  title="Strength Highlights"
                  items={analysis?.strengths || []}
                  tone="green"
                  emptyText="Upload a resume to inspect strengths."
                />
                <Carousel
                  title="Weakness Highlights"
                  items={analysis?.weaknesses || []}
                  tone="red"
                  emptyText="Upload a resume to inspect weaknesses."
                />
              </div>

              <div className="mt-5 grid gap-4 xl:grid-cols-2">
                <div className="rounded-[24px] bg-slate-50 p-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="text-base font-semibold text-slate-900">Detected Skills</h3>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">{analysis?.detected_skills?.length || 0}</span>
                  </div>
                  <BadgeList items={analysis?.detected_skills || []} tone="blue" emptyText="No skills detected yet." />
                </div>
                <div className="rounded-[24px] bg-slate-50 p-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="text-base font-semibold text-slate-900">Action Verbs</h3>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">{analysis?.detected_action_verbs?.length || 0}</span>
                  </div>
                  <BadgeList items={analysis?.detected_action_verbs || []} tone="green" emptyText="No action verbs detected yet." />
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Job Description Workspace"
              subtitle="Paste the target role once, then use the modal to edit and inspect larger descriptions comfortably."
              action={
                <button
                  onClick={() => setJdModalOpen(true)}
                  className="rounded-2xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Expand JD Editor
                </button>
              }
            >
              <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-[28px] bg-slate-50 p-4 sm:p-5">
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={9}
                    className="w-full resize-none rounded-[24px] border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700 outline-none placeholder:text-slate-400 focus:border-slate-400"
                    placeholder="Paste the target job description here..."
                  />
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      onClick={handleJobMatch}
                      disabled={loadingAction !== "" && loadingAction !== "match"}
                      className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {matchLabel}
                    </button>
                    <button
                      onClick={handleAIFeedback}
                      disabled={loadingAction !== "" && loadingAction !== "ai"}
                      className="rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {aiLabel}
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                  <ScoreGauge value={matchScore} label="JD Match Score" theme="blue" />
                  <div className="rounded-[24px] bg-slate-50 p-5">
                    <h3 className="mb-3 text-base font-semibold text-slate-900">Quick Match Snapshot</h3>
                    <div className="space-y-3 text-sm text-slate-600">
                      <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3"><span>Matched keywords</span><strong className="text-slate-900">{jobMatch?.matched_keywords?.length || 0}</strong></div>
                      <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3"><span>Missing keywords</span><strong className="text-slate-900">{jobMatch?.missing_keywords?.length || 0}</strong></div>
                      <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3"><span>Recommendations</span><strong className="text-slate-900">{jobMatch?.recommendations?.length || 0}</strong></div>
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>

          <div className="space-y-6">
            <SectionCard
              title="Job Match Insights"
              subtitle="Surfaced in separate clean panels so the page never becomes cluttered or horizontally stretched."
              action={jobMatch ? <button onClick={() => setAiModalOpen(true)} className="rounded-2xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200">Open AI Detail Modal</button> : null}
            >
              <div className="grid gap-4 xl:grid-cols-2">
                <div className="rounded-[24px] bg-slate-50 p-5">
                  <h3 className="mb-3 text-base font-semibold text-emerald-700">Matched Keywords</h3>
                  <BadgeList items={jobMatch?.matched_keywords || []} tone="green" emptyText="Run JD match to populate matched keywords." />
                </div>
                <div className="rounded-[24px] bg-slate-50 p-5">
                  <h3 className="mb-3 text-base font-semibold text-rose-700">Missing Keywords</h3>
                  <BadgeList items={jobMatch?.missing_keywords || []} tone="red" emptyText="Run JD match to populate missing keywords." />
                </div>
              </div>

              <div className="mt-5">
                <Carousel
                  title="JD Recommendations"
                  items={jobMatch?.recommendations || []}
                  tone="blue"
                  emptyText="No recommendations yet."
                />
              </div>
            </SectionCard>

            <SectionCard title="AI Improvement Studio" subtitle="The compact page shows the essentials. Full AI details open in a modal for a much cleaner experience.">
              <div className="grid gap-4 xl:grid-cols-2">
                <div className="rounded-[24px] bg-slate-50 p-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h3 className="text-base font-semibold text-slate-900">AI Summary</h3>
                    <button
                      onClick={() => setAiModalOpen(true)}
                      disabled={!aiFeedback && !parsedAiFeedback}
                      className="rounded-xl bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Expand
                    </button>
                  </div>
                  {aiFeedback?.error ? (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{aiFeedback.error}</div>
                  ) : parsedAiFeedback ? (
                    <div className="space-y-4">
                      <p className="rounded-2xl bg-white p-4 text-sm leading-7 text-slate-700">
                        {parsedAiFeedback.overall_assessment || "No AI assessment returned yet."}
                      </p>
                      <BadgeList items={parsedAiFeedback.missing_keywords || []} tone="purple" emptyText="No suggested keywords returned." />
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-white p-4 text-sm text-slate-500">Generate AI feedback to view the summary here.</div>
                  )}
                </div>

                <div className="rounded-[24px] bg-slate-50 p-5">
                  <h3 className="mb-4 text-base font-semibold text-slate-900">Bullet Rewrite</h3>
                  <textarea
                    value={bulletText}
                    onChange={(e) => setBulletText(e.target.value)}
                    rows={5}
                    className="w-full resize-none rounded-[22px] border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700 outline-none placeholder:text-slate-400 focus:border-slate-400"
                    placeholder="Example: Worked on backend APIs for the application"
                  />
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      onClick={handleRewriteBullet}
                      disabled={loadingAction !== "" && loadingAction !== "rewrite"}
                      className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {rewriteLabel}
                    </button>
                  </div>
                  <div className="mt-4 rounded-2xl bg-white p-4 text-sm leading-7 text-slate-700">
                    {rewrittenBullet?.error
                      ? rewrittenBullet.error
                      : parsedRewrittenBullet?.rewritten_bullet || rewrittenBullet?.raw_response || "Your improved bullet will appear here."}
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>

      <Modal
        open={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
        title="Extracted Resume Text"
        subtitle="Parser output preview in a scroll-safe modal."
        size="full"
      >
        {extractedText ? (
          <pre className="rounded-[24px] bg-slate-50 p-5 text-xs leading-6 text-slate-700 whitespace-pre-wrap">{extractedText}</pre>
        ) : (
          <div className="rounded-[24px] bg-slate-50 p-5 text-sm text-slate-500">Upload a resume to preview extracted text.</div>
        )}
      </Modal>

      <Modal
        open={jdModalOpen}
        onClose={() => setJdModalOpen(false)}
        title="Expanded Job Description Editor"
        subtitle="Use the larger editor when the job description is too long for the main panel."
        size="xl"
      >
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={18}
          className="w-full rounded-[24px] border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700 outline-none placeholder:text-slate-400 focus:border-slate-400"
          placeholder="Paste the target job description here..."
        />
      </Modal>

      <Modal
        open={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        title="AI Detail View"
        subtitle="Full-screen style breakdown for suggestions, rewritten content, and keyword guidance."
        size="full"
      >
        {aiFeedback?.error ? (
          <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">{aiFeedback.error}</div>
        ) : parsedAiFeedback ? (
          <div className="grid gap-5 xl:grid-cols-2">
            <div className="space-y-5">
              <div className="rounded-[24px] bg-slate-50 p-5">
                <h3 className="mb-3 text-lg font-semibold text-slate-900">Overall Assessment</h3>
                <p className="text-sm leading-7 text-slate-700">{parsedAiFeedback.overall_assessment || "No assessment returned."}</p>
              </div>
              <InsightList
                title="Improvement Suggestions"
                items={parsedAiFeedback.improvement_suggestions || []}
                tone="blue"
                emptyText="No suggestions returned."
              />
              <div className="rounded-[24px] bg-slate-50 p-5">
                <h3 className="mb-3 text-lg font-semibold text-slate-900">Suggested Missing Keywords</h3>
                <BadgeList items={parsedAiFeedback.missing_keywords || []} tone="purple" emptyText="No keyword suggestions returned." />
              </div>
            </div>
            <div className="space-y-5">
              <div className="rounded-[24px] bg-slate-50 p-5">
                <h3 className="mb-3 text-lg font-semibold text-slate-900">Rewritten Summary</h3>
                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">{parsedAiFeedback.rewritten_summary || "No rewritten summary returned."}</p>
              </div>
              <Carousel
                title="Improved Bullet Examples"
                items={parsedAiFeedback.rewritten_bullets || []}
                tone="green"
                emptyText="No rewritten bullets returned."
              />
            </div>
          </div>
        ) : aiFeedback?.raw_response ? (
          <pre className="rounded-[24px] bg-slate-50 p-5 text-sm leading-7 text-slate-700 whitespace-pre-wrap">{aiFeedback.raw_response}</pre>
        ) : (
          <div className="rounded-[24px] bg-slate-50 p-5 text-sm text-slate-500">Generate AI feedback to see the full detail view here.</div>
        )}
      </Modal>
    </div>
  );
}
