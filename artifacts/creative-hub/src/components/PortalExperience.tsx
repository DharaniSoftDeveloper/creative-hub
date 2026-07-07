import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Download, FileText, Lock, ShieldCheck, Sparkles, UploadCloud, UserCircle2, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

const logoImg = "/logo.png";

type ProjectStatus = "Draft" | "Confirmed" | "In Progress" | "Review" | "Delivered" | "Completed";

type ProjectRecord = {
  id: string;
  projectName: string;
  clientName: string;
  clientEmail: string;
  description: string;
  status: ProjectStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
  fileName?: string;
  fileUrl?: string;
  progressPercentage?: number;
  estimatedDeliveryDays?: number;
  timeline?: Array<{ step: string; done: boolean }>;
  modules?: Array<{ name: string; progress: number }>;
  dailyLogs?: Array<{ date: string; entries: string[] }>;
  uploads?: Array<{ fileName: string; fileUrl: string; type?: string }>;
};

type ProjectFormState = {
  projectName: string;
  clientName: string;
  clientEmail: string;
  description: string;
  status: ProjectStatus;
  notes: string;
};

const initialProjectForm: ProjectFormState = {
  projectName: "",
  clientName: "",
  clientEmail: "",
  description: "",
  status: "Confirmed",
  notes: "",
};

const statusOptions: ProjectStatus[] = [
  "Draft",
  "Confirmed",
  "In Progress",
  "Review",
  "Delivered",
  "Completed",
];

const statusClasses: Record<ProjectStatus, string> = {
  Draft: "bg-white/10 text-white border-white/10",
  Confirmed: "bg-emerald-500/15 text-emerald-300 border-emerald-400/20",
  "In Progress": "bg-sky-500/15 text-sky-300 border-sky-400/20",
  Review: "bg-amber-500/15 text-amber-300 border-amber-400/20",
  Delivered: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-400/20",
  Completed: "bg-violet-500/15 text-violet-300 border-violet-400/20",
};

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, init);
  let data: any = {};
  try {
    data = await response.json();
  } catch (e) {
    // ignore parse errors; we'll include status/text below
  }

  if (!response.ok) {
    const serverMessage = (data && data.error) || data?.message;
    const fallback = `Request failed (${response.status})`;
    throw new Error(serverMessage || fallback);
  }

  return data as T;
}

function BrandBadge({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <img src={logoImg} alt="Creative Hub logo" className={compact ? "h-10 w-10 rounded-full" : "h-14 w-14 rounded-full"} />
      <div>
        <p className="font-serif text-xl leading-none text-white">Creative Hub</p>
        <p className="text-[10px] uppercase tracking-[0.32em] text-primary/80 mt-1">Client & Admin Portal</p>
      </div>
    </div>
  );
}

export function PortalExperience({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<"client" | "admin">("client");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [authForm, setAuthForm] = useState({ username: "", password: "" });
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [clientProjectId, setClientProjectId] = useState("");
  const [clientProject, setClientProject] = useState<ProjectRecord | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);
  const [clientLoading, setClientLoading] = useState(false);
  const [form, setForm] = useState<ProjectFormState>(initialProjectForm);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [uploadingProjectId, setUploadingProjectId] = useState<string | null>(null);
  const [updatingProjectId, setUpdatingProjectId] = useState<string | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingForm, setEditingForm] = useState<{
    progressPercentage?: number;
    estimatedDeliveryDays?: number;
    timelineText?: string;
    modulesText?: string;
    dailyLogDate?: string;
    dailyLogEntries?: string;
  }>({});

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('creativehub-admin-token');
      if (!token) {
        return;
      }

      try {
        await apiRequest<{ authenticated: boolean; username: string }>('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdminUnlocked(true);
      } catch {
        localStorage.removeItem('creativehub-admin-token');
      }
    };

    void restoreSession();
  }, []);

  useEffect(() => {
    if (!adminUnlocked) {
      return;
    }

    const loadProjects = async () => {
      setLoading(true);
      try {
        const data = await apiRequest<{ projects: ProjectRecord[] }>('/api/projects');
        setProjects(data.projects || []);
      } catch (error) {
        setFormMessage(error instanceof Error ? error.message : "Unable to load projects");
      } finally {
        setLoading(false);
      }
    };

    void loadProjects();
  }, [adminUnlocked]);

  const handleAdminUnlock = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      const data = await apiRequest<{ authenticated: boolean; token: string; username: string }>('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: authForm.username,
          password: authForm.password,
        }),
      });

      if (data.authenticated) {
        localStorage.setItem('creativehub-admin-token', data.token);
        setAdminUnlocked(true);
        setAuthForm({ username: '', password: '' });
        setFormMessage('Admin access granted.');
      }
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Unable to sign in');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleCreateProject = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormMessage(null);

    try {
      const token = localStorage.getItem('creativehub-admin-token');
      const created = await apiRequest<{ project: ProjectRecord }>('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          projectName: form.projectName,
          clientName: form.clientName,
          clientEmail: form.clientEmail,
          description: form.description,
          status: form.status,
          notes: form.notes,
        }),
      });

      setProjects((current) => [created.project, ...current]);
      setForm(initialProjectForm);
      setFormMessage(`Project created successfully. Share project ID ${created.project.id}. The client email has been notified automatically.`);
    } catch (error) {
      setFormMessage(error instanceof Error ? error.message : 'Unable to create project');
    }
  };

  const handleStatusChange = async (projectId: string, nextStatus: ProjectStatus) => {
    setUpdatingProjectId(projectId);
    try {
      const token = localStorage.getItem('creativehub-admin-token');
      const updated = await apiRequest<{ project: ProjectRecord }>(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      setProjects((current) => current.map((project) => project.id === projectId ? updated.project : project));
      setFormMessage(`Status updated to ${updated.project.status}.`);
    } catch (error) {
      setFormMessage(error instanceof Error ? error.message : 'Unable to update status');
    } finally {
      setUpdatingProjectId(null);
    }
  };

  const handleFileUpload = async (projectId: string, file: File | null) => {
    if (!file) {
      return;
    }

    setUploadingProjectId(projectId);
    const formData = new FormData();
    formData.append('file', file);
    // optional: include a type so backend can categorize (screenshot, video, apk, other)
    const lower = (file.name || '').toLowerCase();
    let type = 'other';
    if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.webp')) type = 'screenshot';
    if (lower.endsWith('.mp4') || lower.endsWith('.mov') || lower.endsWith('.webm')) type = 'video';
    if (lower.endsWith('.apk')) type = 'apk';
    formData.append('type', type);

    try {
      const token = localStorage.getItem('creativehub-admin-token');
      const updated = await apiRequest<{ project: ProjectRecord }>(`/api/projects/${projectId}/upload`, {
        method: 'POST',
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      setProjects((current) => current.map((project) => project.id === projectId ? updated.project : project));
      setFormMessage(`File uploaded for ${updated.project.projectName}.`);
    } catch (error) {
      setFormMessage(error instanceof Error ? error.message : 'Unable to upload file');
    } finally {
      setUploadingProjectId(null);
    }
  };

  const startEditProject = (project: ProjectRecord) => {
    setEditingProjectId(project.id);
    setEditingForm({
      progressPercentage: project.progressPercentage ?? 0,
      estimatedDeliveryDays: project.estimatedDeliveryDays ?? undefined,
      timelineText: project.timeline ? project.timeline.map((t) => `${t.done ? '✓ ' : ''}${t.step}`).join('\n') : '',
      modulesText: project.modules ? project.modules.map((m) => `${m.name}:${m.progress}`).join('\n') : '',
      dailyLogDate: '',
      dailyLogEntries: '',
    });
  };

  const cancelEditProject = () => {
    setEditingProjectId(null);
    setEditingForm({});
  };

  const saveProjectDetails = async (projectId: string) => {
    const token = localStorage.getItem('creativehub-admin-token');
    const body: any = {};
    if (editingForm.progressPercentage !== undefined) body.progressPercentage = Number(editingForm.progressPercentage) || 0;
    if (editingForm.estimatedDeliveryDays !== undefined) body.estimatedDeliveryDays = editingForm.estimatedDeliveryDays ? Number(editingForm.estimatedDeliveryDays) : undefined;

    if (editingForm.timelineText) {
      const lines = editingForm.timelineText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      body.timeline = lines.map((ln) => {
        const done = ln.startsWith('✓') || ln.startsWith('✔') || ln.toLowerCase().startsWith('done');
        let step = ln;
        if (done) {
          // remove common check characters and leading punctuation
          step = step.replace(/^\s*[✓✔\u2713\u2714]+\s*/,'');
          step = step.replace(/^[^A-Za-z0-9]+/,'');
        }
        step = step.replace(/^\s*[-–—]\s*/,'').trim();
        return { step, done };
      });
    }

    if (editingForm.modulesText) {
      const lines = editingForm.modulesText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      body.modules = lines.map((ln) => {
        const parts = ln.split(':');
        const name = parts[0].trim();
        const progress = Number(parts[1] ? parts[1].trim().replace('%','') : 0) || 0;
        return { name, progress };
      });
    }

    if (editingForm.dailyLogDate && editingForm.dailyLogEntries) {
      const entries = editingForm.dailyLogEntries.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      body.dailyLogs = [{ date: editingForm.dailyLogDate, entries }];
    }

    try {
      setUpdatingProjectId(projectId);
      const updated = await apiRequest<{ project: ProjectRecord }>(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      setProjects((current) => current.map((p) => p.id === projectId ? updated.project : p));
      setFormMessage('Project details saved.');
      setEditingProjectId(null);
      setEditingForm({});
    } catch (err) {
      setFormMessage(err instanceof Error ? err.message : 'Unable to save details');
    } finally {
      setUpdatingProjectId(null);
    }
  };

  const handleClientLookup = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!clientProjectId.trim()) {
      setClientError('Enter your project ID to continue.');
      return;
    }

    setClientLoading(true);
    setClientError(null);

    try {
      const data = await apiRequest<{ project: ProjectRecord }>(`/api/projects/${encodeURIComponent(clientProjectId.trim())}`);
      setClientProject(data.project);
    } catch (error) {
      setClientError(error instanceof Error ? error.message : 'Unable to find that project.');
      setClientProject(null);
    } finally {
      setClientLoading(false);
    }
  };

  const summary = useMemo(() => {
    const completedCount = projects.filter((item) => item.status === 'Completed').length;
    const inProgressCount = projects.filter((item) => item.status === 'In Progress' || item.status === 'Review' || item.status === 'Delivered').length;
    return { completedCount, inProgressCount };
  }, [projects]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(214,176,96,0.16),_transparent_38%),linear-gradient(135deg,_#09090b,_#121212)] text-white">
      <div className="mx-auto flex max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-[0_0_40px_rgba(214,176,96,0.12)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <BrandBadge />
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" onClick={onBack} className="border-white/15 bg-white/5 text-white hover:bg-white/10">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
              <div className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm text-primary">
                Premium project control center
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[32px] border border-primary/20 bg-gradient-to-br from-primary/10 via-transparent to-[#17120d] p-6 shadow-[0_0_60px_rgba(214,176,96,0.1)] backdrop-blur-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary">
              <Sparkles className="h-4 w-4" />
              Smart delivery workflow
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              Track builds, share delivery files, and keep every client update in one secure portal.
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground">
              Every new project is assigned a unique project ID at creation time, then updated by the admin as work advances. Clients can log in instantly with that ID to view progress, project notes, and downloadable files.
            </p>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-background/70 p-6 shadow-[0_0_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2 text-primary">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-sm font-medium uppercase tracking-[0.24em]">Portal access</span>
            </div>
            <div className="flex rounded-full border border-white/10 bg-white/5 p-1">
              <button
                type="button"
                onClick={() => setActiveTab('client')}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-all ${activeTab === 'client' ? 'bg-primary text-[#17120d]' : 'text-muted-foreground hover:text-white'}`}
              >
                Client Portal
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('admin')}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-all ${activeTab === 'admin' ? 'bg-primary text-[#17120d]' : 'text-muted-foreground hover:text-white'}`}
              >
                Admin Portal
              </button>
            </div>

            {activeTab === 'client' ? (
              <form onSubmit={handleClientLookup} className="mt-6 space-y-4">
                <label className="block text-sm text-muted-foreground">
                  Enter your project ID
                  <input
                    value={clientProjectId}
                    onChange={(event) => setClientProjectId(event.target.value)}
                    placeholder="CH-202607-AB12"
                    className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-white outline-none ring-0 placeholder:text-muted-foreground"
                  />
                </label>
                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent text-[#17120d] hover:opacity-90">
                  {clientLoading ? 'Checking project…' : 'Open project'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                {clientError ? <p className="text-sm text-red-300">{clientError}</p> : null}
              </form>
            ) : (
              <form onSubmit={handleAdminUnlock} className="mt-6 space-y-4">
                <label className="block text-sm text-muted-foreground">
                  Admin username
                  <input
                    value={authForm.username}
                    onChange={(event) => setAuthForm((current) => ({ ...current, username: event.target.value }))}
                    placeholder="Enter admin username"
                    className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-white outline-none ring-0 placeholder:text-muted-foreground"
                  />
                </label>
                <label className="block text-sm text-muted-foreground">
                  Password
                  <input
                    value={authForm.password}
                    onChange={(event) => setAuthForm((current) => ({ ...current, password: event.target.value }))}
                    type="password"
                    placeholder="Enter admin password"
                    className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-white outline-none ring-0 placeholder:text-muted-foreground"
                  />
                </label>
                <Button type="submit" className="w-full border-white/15 bg-white/5 text-white hover:bg-white/10" disabled={authLoading}>
                  <Lock className="mr-2 h-4 w-4" />
                  {authLoading ? 'Signing in…' : 'Unlock admin dashboard'}
                </Button>
                {authError ? <p className="text-sm text-red-300">{authError}</p> : null}
              </form>
            )}
          </div>
        </section>

        {formMessage ? (
          <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
            {formMessage}
          </div>
        ) : null}

        {activeTab === 'client' && clientProject ? (
          <section className="mt-8 rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_0_60px_rgba(214,176,96,0.08)] backdrop-blur-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-primary/80">Live client workspace</p>
                <h2 className="mt-2 font-serif text-2xl font-semibold text-white">{clientProject.projectName}</h2>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{clientProject.description}</p>
              </div>
              <div className={`inline-flex items-center rounded-full border px-3 py-2 text-sm ${statusClasses[clientProject.status]}`}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {clientProject.status}
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-background/70 p-4">
                <p className="text-sm text-muted-foreground">Project ID</p>
                <p className="mt-2 font-semibold text-white">{clientProject.id}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-background/70 p-4">
                <p className="text-sm text-muted-foreground">Client</p>
                <p className="mt-2 font-semibold text-white">{clientProject.clientName}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-background/70 p-4">
                <p className="text-sm text-muted-foreground">Last update</p>
                <p className="mt-2 font-semibold text-white">{new Date(clientProject.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm text-primary">
              <p className="font-medium">Current notes</p>
              <p className="mt-2 text-primary/85">{clientProject.notes || 'No notes yet. Your project is being prepared.'}</p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {clientProject.fileUrl ? (
                <a href={clientProject.fileUrl} download={clientProject.fileName} className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20">
                  <Download className="mr-2 h-4 w-4" />
                  Download latest file
                </a>
              ) : (
                <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-muted-foreground">
                  <FileText className="mr-2 h-4 w-4" />
                  No project file uploaded yet
                </div>
              )}
              {/* Show gallery of uploaded assets if any */}
              {clientProject.uploads && clientProject.uploads.length > 0 ? (
                <div className="mt-4 w-full">
                  <p className="text-sm text-muted-foreground">Uploads</p>
                  <div className="mt-2 flex flex-wrap gap-3">
                    {clientProject.uploads.map((u, idx) => (
                      <div key={idx} className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-background/70 px-3 py-2 text-sm text-white">
                        {u.type === 'screenshot' ? (
                          <a href={u.fileUrl} target="_blank" rel="noreferrer" className="block rounded overflow-hidden">
                            <img src={u.fileUrl} alt={u.fileName} className="h-14 w-24 object-cover rounded" />
                          </a>
                        ) : u.type === 'video' ? (
                          <a href={u.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">
                            <Video className="h-5 w-5" />
                            <span className="truncate max-w-[160px]">{u.fileName}</span>
                          </a>
                        ) : (
                          <a href={u.fileUrl} download={u.fileName} className="inline-flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            <span className="truncate max-w-[160px]">{u.fileName}</span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
            {/* Rich project summary: progress, timeline, modules, daily logs */}
            <div className="mt-8 grid gap-6">
              <div>
                <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Project</p>
                <div className="mt-2 flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{clientProject.projectName}</h3>
                  <div className="inline-flex items-center gap-3">
                    <div className={`inline-flex items-center rounded-full px-3 py-1 text-sm ${statusClasses[clientProject.status]}`}>{clientProject.status}</div>
                    <div className="text-sm text-muted-foreground">Progress: {clientProject.progressPercentage ?? 0}%</div>
                  </div>
                </div>
                <div className="mt-3 w-full bg-white/5 rounded-full h-2 overflow-hidden">
                  <div style={{ width: `${clientProject.progressPercentage ?? 0}%` }} className="h-2 bg-emerald-400 transition-all duration-700 ease-out" />
                </div>
                <div className="mt-2 text-sm text-muted-foreground">Estimated Delivery: {clientProject.estimatedDeliveryDays ? `${clientProject.estimatedDeliveryDays} Days` : 'TBD'}</div>
              </div>

              {/* Timeline */}
              {clientProject.timeline && clientProject.timeline.length > 0 ? (
                <div>
                  <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Project Timeline</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {clientProject.timeline.map((t, i) => (
                      <div key={i} className={`rounded-full px-3 py-2 text-sm ${t.done ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/5 text-muted-foreground'}`}>
                        {t.done ? '✓ ' : '⬤ '} {t.step}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Modules */}
              {clientProject.modules && clientProject.modules.length > 0 ? (
                <div>
                  <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Live Progress Tracker</p>
                  <div className="mt-3 space-y-2">
                    {clientProject.modules.map((m, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between text-sm">
                          <div>{m.name}</div>
                          <div className="text-muted-foreground">{m.progress}%</div>
                        </div>
                        <div className="mt-1 w-full bg-white/5 rounded-full h-2 overflow-hidden">
                          <div style={{ width: `${m.progress}%` }} className="h-2 bg-sky-400 transition-all duration-700 ease-out" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Daily work log */}
              {clientProject.dailyLogs && clientProject.dailyLogs.length > 0 ? (
                <div>
                  <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Daily Work Log</p>
                  <div className="mt-3 space-y-3">
                    {clientProject.dailyLogs.map((d, i) => (
                      <div key={i} className="rounded-2xl border border-white/5 bg-background/70 p-3">
                        <div className="text-sm font-medium">{d.date}</div>
                        <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
                          {d.entries.map((e, j) => <li key={j}>{e}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {activeTab === 'admin' && adminUnlocked ? (
          <section className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_0_60px_rgba(214,176,96,0.08)] backdrop-blur-xl">
              <div className="mb-6 flex items-center gap-2 text-primary">
                <UserCircle2 className="h-5 w-5" />
                <h2 className="font-serif text-2xl font-semibold text-white">Create project entry</h2>
              </div>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <input value={form.projectName} onChange={(event) => setForm((current) => ({ ...current, projectName: event.target.value }))} placeholder="Project name" className="h-12 w-full rounded-2xl border border-white/10 bg-background/70 px-4 text-white outline-none" required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input value={form.clientName} onChange={(event) => setForm((current) => ({ ...current, clientName: event.target.value }))} placeholder="Client name" className="h-12 rounded-2xl border border-white/10 bg-background/70 px-4 text-white outline-none" required />
                  <input value={form.clientEmail} onChange={(event) => setForm((current) => ({ ...current, clientEmail: event.target.value }))} type="email" placeholder="Client email" className="h-12 rounded-2xl border border-white/10 bg-background/70 px-4 text-white outline-none" required />
                </div>
                <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} placeholder="Project brief and scope" className="min-h-28 w-full rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-white outline-none" required />
                <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as ProjectStatus }))} className="h-12 w-full rounded-2xl border border-white/10 bg-background/70 px-4 text-white outline-none">
                  {statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
                <textarea value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} placeholder="Project notes and next steps" className="min-h-24 w-full rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-white outline-none" />
                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent text-[#17120d] hover:opacity-90">
                  Create project entry
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_0_60px_rgba(214,176,96,0.08)] backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-primary/80">Admin control board</p>
                  <h2 className="mt-2 font-serif text-2xl font-semibold text-white">Project queue</h2>
                </div>
                <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary">
                  {summary.inProgressCount} in motion
                </div>
              </div>

              {loading ? <p className="text-sm text-muted-foreground">Loading projects…</p> : null}

              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="rounded-2xl border border-white/10 bg-background/70 p-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-primary">{project.id}</p>
                          <span className={`rounded-full border px-2 py-1 text-[11px] ${statusClasses[project.status]}`}>{project.status}</span>
                        </div>
                        <h3 className="mt-2 font-semibold text-white">{project.projectName}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{project.clientName} • {project.clientEmail}</p>
                        <p className="mt-2 text-sm text-muted-foreground">{project.description}</p>
                      </div>
                      <div className="min-w-[180px]">
                        <label className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Update status</label>
                        <select value={project.status} onChange={(event) => void handleStatusChange(project.id, event.target.value as ProjectStatus)} className="mt-2 h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none" disabled={updatingProjectId === project.id}>
                          {statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Notes</p>
                      <p className="mt-2 text-sm text-muted-foreground">{project.notes || 'No notes yet.'}</p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-muted-foreground hover:text-white">
                        <UploadCloud className="h-4 w-4" />
                        Upload project file
                        <input type="file" className="hidden" onChange={(event) => void handleFileUpload(project.id, event.target.files?.[0] || null)} />
                      </label>
                      <Button onClick={() => startEditProject(project)} className="border-white/10 bg-white/5 text-white hover:bg-white/10">Edit details</Button>
                      {project.fileUrl ? (
                        <a href={project.fileUrl} download={project.fileName} className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-2 text-sm text-primary hover:bg-primary/20">
                          <Download className="h-4 w-4" />
                          Download current file
                        </a>
                      ) : (
                        <span className="text-sm text-muted-foreground">No file added yet</span>
                      )}
                      {uploadingProjectId === project.id ? <span className="text-sm text-primary">Uploading…</span> : null}
                    </div>
                    {editingProjectId === project.id ? (
                      <div className="mt-4 rounded-2xl border border-white/10 bg-background/70 p-4">
                        <p className="text-sm font-medium text-white">Edit project details</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <label className="block text-sm text-muted-foreground">
                            Progress %
                            <input type="number" value={editingForm.progressPercentage ?? 0} onChange={(e) => setEditingForm((c) => ({ ...c, progressPercentage: Number(e.target.value) }))} className="mt-2 h-10 w-full rounded-2xl border border-white/10 bg-background/70 px-3 text-white outline-none" />
                          </label>
                          <label className="block text-sm text-muted-foreground">
                            Estimated delivery (days)
                            <input type="number" value={editingForm.estimatedDeliveryDays ?? ''} onChange={(e) => setEditingForm((c) => ({ ...c, estimatedDeliveryDays: e.target.value ? Number(e.target.value) : undefined }))} className="mt-2 h-10 w-full rounded-2xl border border-white/10 bg-background/70 px-3 text-white outline-none" />
                          </label>
                        </div>
                        <label className="block mt-3 text-sm text-muted-foreground">Timeline (one per line, prefix ✓ for done)
                          <textarea value={editingForm.timelineText ?? ''} onChange={(e) => setEditingForm((c) => ({ ...c, timelineText: e.target.value }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-background/70 px-3 py-2 text-white outline-none" rows={4} />
                        </label>
                        <label className="block mt-3 text-sm text-muted-foreground">Modules (name:progress per line)
                          <textarea value={editingForm.modulesText ?? ''} onChange={(e) => setEditingForm((c) => ({ ...c, modulesText: e.target.value }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-background/70 px-3 py-2 text-white outline-none" rows={3} />
                        </label>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <label className="block text-sm text-muted-foreground">Daily log date
                            <input type="date" value={editingForm.dailyLogDate ?? ''} onChange={(e) => setEditingForm((c) => ({ ...c, dailyLogDate: e.target.value }))} className="mt-2 h-10 w-full rounded-2xl border border-white/10 bg-background/70 px-3 text-white outline-none" />
                          </label>
                          <label className="block text-sm text-muted-foreground">Daily log entries (one per line)
                            <textarea value={editingForm.dailyLogEntries ?? ''} onChange={(e) => setEditingForm((c) => ({ ...c, dailyLogEntries: e.target.value }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-background/70 px-3 py-2 text-white outline-none" rows={3} />
                          </label>
                        </div>
                        <div className="mt-3 flex gap-3">
                          <Button onClick={() => saveProjectDetails(project.id)} className="bg-gradient-to-r from-primary to-accent text-[#17120d]">Save</Button>
                          <Button variant="outline" onClick={cancelEditProject}>Cancel</Button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
