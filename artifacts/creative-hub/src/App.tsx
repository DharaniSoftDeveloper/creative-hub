import React, { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Mail,
  Phone,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ClipboardList,
  Layers,
  Cpu,
  Smartphone,
  Globe2,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
const logoImg = "/logo.png";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const projects = [
  {
    title: "E-Commerce Web Application",
    description:
      "Full-featured online store with product catalog, cart, payment gateway integration, and admin dashboard for real-time order management.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    category: "Web Application",
  },
  {
    title: "School Management System",
    description:
      "Comprehensive software for managing students, staff, attendance, grades, timetables, and parent communication in one unified platform.",
    image:
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    category: "Software Project",
  },
  {
    title: "Restaurant Business Website",
    description:
      "Restaurant website with online menu, table reservation system, photo gallery, and integrated Google Maps location.",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    category: "Website Building",
  },
  {
    title: "Food Delivery Mobile App",
    description:
      "Cross-platform mobile app for food ordering with real-time tracking, push notifications, payment integration, and ratings system.",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
    category: "Mobile Application",
  },
  {
    title: "Cloud Hosting & Deployment",
    description:
      "End-to-end cloud hosting setup with custom domain, SSL certificates, auto-scaling, daily backups, and 99.9% uptime guarantee.",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    category: "Hosting",
  },
  {
    title: "Educational Learning Portal",
    description:
      "Interactive e-learning platform with video courses, live classes, quizzes, progress tracking, certificates, and student dashboards.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
    category: "Web Application",
  },
  {
    title: "AI Construction Site Safety",
    description:
      "Fully automated AI surveillance system for construction sites — real-time accident detection, PPE violation alerts, sudden collapse prediction, and 24/7 camera monitoring with instant on-site notifications.",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
    category: "AI / ML",
  },
  {
    title: "AI Exam Malpractice Detection",
    description:
      "Advanced ML system that monitors students via camera during exams — tracks eye movement, head position, body posture, detects speaking, turning, tab switching, and flags suspicious behaviour in real time.",
    image:
      "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&q=80",
    category: "AI / ML",
  },
  {
    title: "Emergency Alert & Response System",
    description:
      "Smart emergency management platform — detects fire, structural collapse, and hazards using AI sensors, then automatically alerts and calls ambulance, police, and fire fighters with live location data.",
    image:
      "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80",
    category: "AI / ML",
  },
];

const platforms = [
  { id: "android", label: "Android", icon: Smartphone },
  { id: "ios", label: "iPhone (iOS)", icon: Smartphone },
  { id: "website", label: "Website", icon: Globe2 },
  { id: "desktop", label: "Desktop App", icon: Cpu },
];

const featureOptions = [
  "User Login / Signup",
  "OTP Verification",
  "Admin Panel",
  "Push Notifications",
  "Payment Gateway",
  "Live Chat",
  "GPS / Location Tracking",
  "Camera Access",
  "QR Code Scanner",
  "File Upload",
  "Booking System",
  "Video Streaming",
  "AI Features",
  "Multi-language Support",
  "Real-time Chat",
  "Data Analytics",
  "API Integration",
  "Search & Filter",
  "Email Notifications",
  "Dark / Light Mode",
];

const targetUserOptions = [
  "Students",
  "Customers",
  "Employees",
  "Shop Owners",
  "Drivers",
  "General Public",
  "Other",
];
const loginTypeOptions = [
  "Email Login",
  "Phone Login",
  "Google Login",
  "Guest Login",
];
const notificationOptions = [
  "Push Notifications",
  "SMS",
  "Email Notifications",
  "WhatsApp Notifications",
];
const budgetOptions = [
  "Under ₹5,000",
  "₹5,000 – ₹10,000",
  "₹10,000 – ₹25,000",
  "₹25,000+",
];
const navItems = [
  { id: "projects", label: "Projects" },
  { id: "request", label: "Request Project" },
  { id: "contact", label: "Contact" },
];
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || "";
const contactEmail = "creativehub2k@gmail.com";
const contactPhone = "9786954984";
const submitTimeoutMs = 15000;
const emailjsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID?.trim();
const emailjsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID?.trim();
const emailjsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY?.trim();

if (emailjsPublicKey) {
  emailjs.init(emailjsPublicKey);
}

function buildContactPayload({
  form,
  selectedPlatforms,
  selectedFeatures,
  targetUsers,
  loginTypes,
  notificationTypes,
}: {
  form: {
    name: string;
    businessName: string;
    email: string;
    phone: string;
    contactMethod: string;
    appName: string;
    purpose: string;
    problemSolved: string;
    howItWorks: string;
    referenceApps: string;
    hasAdminDashboard: string;
    hasFileUpload: string;
    needsCloud: string;
    hasLogo: string;
    onlineOffline: string;
    launchDate: string;
    budget: string;
    additionalNotes: string;
    specialInstructions: string;
  };
  selectedPlatforms: string[];
  selectedFeatures: string[];
  targetUsers: string[];
  loginTypes: string[];
  notificationTypes: string[];
}) {
  return {
    name: form.name,
    email: form.email,
    phone: form.phone,
    orgName: form.businessName,
    projectTitle: form.appName,
    projectType: selectedPlatforms.join(", "),
    howItWorks: form.howItWorks,
    features: selectedFeatures.join(", "),
    additionalNotes: form.additionalNotes,
    contactMethod: form.contactMethod,
    purpose: form.purpose,
    problemSolved: form.problemSolved,
    targetUsers: targetUsers.join(", "),
    hasAdminDashboard: form.hasAdminDashboard,
    hasFileUpload: form.hasFileUpload,
    needsCloud: form.needsCloud,
    referenceApps: form.referenceApps,
    loginTypes: loginTypes.join(", "),
    onlineOffline: form.onlineOffline,
    notificationTypes: notificationTypes.join(", "),
    hasLogo: form.hasLogo,
    launchDate: form.launchDate,
    budget: form.budget,
    specialInstructions: form.specialInstructions,
  };
}

function buildEmailTemplateParams(
  payload: ReturnType<typeof buildContactPayload>,
) {
  const details = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone || "Not provided"}`,
    `Business: ${payload.orgName || "Not provided"}`,
    `Preferred Contact: ${payload.contactMethod || "Not provided"}`,
    `Project Name: ${payload.projectTitle}`,
    `Platforms: ${payload.projectType || "Not provided"}`,
    `Purpose: ${payload.purpose || "Not provided"}`,
    `Problem Solved: ${payload.problemSolved || "Not provided"}`,
    `Target Users: ${payload.targetUsers || "Not provided"}`,
    `Features: ${payload.features || "Not provided"}`,
    `Admin Dashboard: ${payload.hasAdminDashboard || "Not provided"}`,
    `File Upload: ${payload.hasFileUpload || "Not provided"}`,
    `Needs Cloud: ${payload.needsCloud || "Not provided"}`,
    `How It Works: ${payload.howItWorks}`,
    `Reference Apps: ${payload.referenceApps || "Not provided"}`,
    `Login Types: ${payload.loginTypes || "Not provided"}`,
    `Online / Offline: ${payload.onlineOffline || "Not provided"}`,
    `Notifications: ${payload.notificationTypes || "Not provided"}`,
    `Has Logo: ${payload.hasLogo || "Not provided"}`,
    `Launch Date: ${payload.launchDate || "Not provided"}`,
    `Budget: ${payload.budget || "Not provided"}`,
    `Additional Notes: ${payload.additionalNotes || "Not provided"}`,
    `Special Instructions: ${payload.specialInstructions || "Not provided"}`,
  ].join("\n");

  return {
    ...payload,
    businessName: payload.orgName,
    to_email: contactEmail,
    recipient_email: contactEmail,
    contact_email: contactEmail,
    from_name: payload.name,
    from_email: payload.email,
    user_email: payload.email,
    reply_to: payload.email,
    subject: `New Project Request: ${payload.projectTitle}`,
    message: details,
  };
}

function getContactApiUrl() {
  if (!apiBaseUrl) {
    return "/api/contact";
  }

  return `${apiBaseUrl.replace(/\/$/, "")}/api/contact`;
}

async function postContactRequest(payload: ReturnType<typeof buildContactPayload>) {
  if (emailjsServiceId && emailjsTemplateId && emailjsPublicKey) {
    try {
      const result = await emailjs.send(
        emailjsServiceId,
        emailjsTemplateId,
        buildEmailTemplateParams(payload),
      );

      if (result.status >= 200 && result.status < 300) {
        return new Response(
          JSON.stringify({
            success: true,
            queued: false,
            message: "Your request has been received successfully!",
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
    } catch (error) {
      console.error("EmailJS submission failed, falling back to API.", error);
    }
  }

  const contactApiUrl = getContactApiUrl();
  if (!contactApiUrl) {
    throw new Error(
      "The website submission service is not connected yet. Please use the email or call options below.",
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), submitTimeoutMs);

  try {
    return await fetch(contactApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Submission service timed out. Please try again.");
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

function formatSubmitError(error: unknown) {
  if (!(error instanceof Error)) {
    return "Failed to send. Please try again.";
  }

  if (/timed out/i.test(error.message)) {
    return "The submission is taking too long. Please use the email or call options below, or try again in a moment.";
  }

  if (/account not found/i.test(error.message)) {
    return "The website email service is not configured correctly yet. Please use the email or call options below while setup is completed.";
  }

  if (/failed to fetch/i.test(error.message)) {
    return "We could not reach the submission service right now. Please use the email or call options below.";
  }

  return error.message || "Failed to send. Please try again.";
}

function buildMailtoUrl(payload: ReturnType<typeof buildContactPayload>) {
  const params = buildEmailTemplateParams(payload);
  return `mailto:${contactEmail}?subject=${encodeURIComponent(params.subject)}&body=${encodeURIComponent(params.message)}`;
}

function CheckGroup({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            type="button"
            key={opt}
            onClick={() => onToggle(opt)}
            className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer ${active ? "border-primary bg-primary/15 text-white shadow-[0_0_12px_rgba(214,176,96,0.24)]" : "border-white/10 bg-white/5 text-muted-foreground hover:border-primary/30 hover:bg-white/10 hover:text-white"}`}
          >
            <span
              className={`mr-1.5 ${active ? "text-primary" : "text-muted-foreground/50"}`}
            >
              {active ? "✓" : "+"}
            </span>
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function RadioGroup({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            type="button"
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-5 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer ${active ? "border-primary bg-primary/15 text-white shadow-[0_0_12px_rgba(214,176,96,0.24)]" : "border-white/10 bg-white/5 text-muted-foreground hover:border-primary/30 hover:text-white"}`}
          >
            {active && <span className="mr-1.5 text-primary">●</span>}
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function StepTitle({ num, label }: { num: string; label: string }) {
  return (
    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary">
      <span className="w-7 h-7 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center font-bold border border-primary/30">
        {num}
      </span>
      {label}
    </h3>
  );
}

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function BrandPanel({
  className = "",
  imageClassName = "",
  alt = "Creative Hub Logo",
}: {
  className?: string;
  imageClassName?: string;
  alt?: string;
}) {
  return (
    <div className={`brand-frame p-2 ${className}`}>
      <img
        src={logoImg}
        alt={alt}
        className={`relative z-10 h-full w-full rounded-full object-cover object-center ${imageClassName}`}
      />
    </div>
  );
}

function ProjectForm() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [targetUsers, setTargetUsers] = useState<string[]>([]);
  const [loginTypes, setLoginTypes] = useState<string[]>([]);
  const [notificationTypes, setNotificationTypes] = useState<string[]>([]);
  const [submitResult, setSubmitResult] = useState<{
    message: string;
    queued: boolean;
  } | null>(null);
  const [fallbackMailtoUrl, setFallbackMailtoUrl] = useState(
    `mailto:${contactEmail}`,
  );
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    businessName: "",
    email: "",
    phone: "",
    contactMethod: "",
    appName: "",
    purpose: "",
    problemSolved: "",
    howItWorks: "",
    referenceApps: "",
    hasAdminDashboard: "",
    hasFileUpload: "",
    needsCloud: "",
    hasLogo: "",
    onlineOffline: "",
    launchDate: "",
    budget: "",
    additionalNotes: "",
    specialInstructions: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function toggle(
    arr: string[],
    set: React.Dispatch<React.SetStateAction<string[]>>,
    val: string,
  ) {
    set((prev) =>
      prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const payload = buildContactPayload({
        form,
        selectedPlatforms,
        selectedFeatures,
        targetUsers,
        loginTypes,
        notificationTypes,
      });
      setFallbackMailtoUrl(buildMailtoUrl(payload));

      const res = await postContactRequest(payload);
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        message?: string;
        queued?: boolean;
        success?: boolean;
      };
      if (!res.ok || data.success !== true) {
        throw new Error(
          data.error || "Failed to send. Please try again.",
        );
      }
      setSubmitResult({
        message: data.message || "Your request has been received successfully!",
        queued: Boolean(data.queued),
      });
    } catch (err) {
      setError(formatSubmitError(err));
    } finally {
      setSending(false);
    }
  }

  function resetForm() {
    setSubmitResult(null);
    setError(null);
    setFallbackMailtoUrl(`mailto:${contactEmail}`);
    setForm({
      name: "",
      businessName: "",
      email: "",
      phone: "",
      contactMethod: "",
      appName: "",
      purpose: "",
      problemSolved: "",
      howItWorks: "",
      referenceApps: "",
      hasAdminDashboard: "",
      hasFileUpload: "",
      needsCloud: "",
      hasLogo: "",
      onlineOffline: "",
      launchDate: "",
      budget: "",
      additionalNotes: "",
      specialInstructions: "",
    });
    setSelectedPlatforms([]);
    setSelectedFeatures([]);
    setTargetUsers([]);
    setLoginTypes([]);
    setNotificationTypes([]);
  }

  if (submitResult) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-16 sm:py-20 gap-6 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shadow-[0_0_40px_rgba(214,176,96,0.28)]">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-3xl font-bold">
          {submitResult.queued ? "Request Saved" : "Request Submitted!"}
        </h3>
        <p className="text-muted-foreground text-base sm:text-lg max-w-lg">
          {submitResult.message}
        </p>
        <div className="w-full max-w-lg rounded-xl border border-primary/30 bg-primary/10 px-5 py-4 text-sm sm:text-base text-primary">
          For priority requests, please pay Rs. 250 and register in our
          application.
        </div>
        <div className="flex w-full max-w-lg flex-col gap-3">
          {submitResult.queued && (
            <>
              <Button
                onClick={() =>
                  window.open(fallbackMailtoUrl, "_self")
                }
                className="w-full bg-gradient-to-r from-primary to-accent text-white border-none"
              >
                Email Dharani
              </Button>
              <Button
                onClick={() => window.open(`tel:${contactPhone}`, "_self")}
                variant="outline"
                className="w-full border-white/20 hover:bg-white/5"
              >
                Call Now
              </Button>
            </>
          )}
          <Button
            onClick={resetForm}
            variant="outline"
            className="w-full border-primary/30 hover:bg-primary/10 text-primary"
          >
            Submit Another Request
          </Button>
        </div>
      </motion.div>
    );
  }

  const inp =
    "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      {/* Step 1: Basic Information */}
      <div>
        <StepTitle num="1" label="Basic Information" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            {
              name: "name",
              label: "Full Name",
              placeholder: "Your full name",
              required: true,
            },
            {
              name: "businessName",
              label: "Business / Company Name",
              placeholder: "Company, school, or institution",
            },
            {
              name: "email",
              label: "Email Address",
              placeholder: "yourmail@example.com",
              required: true,
              type: "email",
            },
            {
              name: "phone",
              label: "Phone Number",
              placeholder: "+91 XXXXX XXXXX",
              type: "tel",
            },
          ].map((f) => (
            <div key={f.name}>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">
                {f.label}{" "}
                {f.required && <span className="text-primary">*</span>}
              </label>
              <input
                name={f.name}
                type={f.type ?? "text"}
                value={(form as Record<string, string>)[f.name]}
                onChange={handleChange}
                required={f.required}
                placeholder={f.placeholder}
                className={inp}
              />
            </div>
          ))}
        </div>
        <div className="mt-6">
          <label className="block text-sm font-semibold text-muted-foreground mb-3">
            Preferred Contact Method
          </label>
          <RadioGroup
            options={["WhatsApp", "Call", "Email"]}
            value={form.contactMethod}
            onChange={(v) => setForm((p) => ({ ...p, contactMethod: v }))}
          />
        </div>
      </div>

      {/* Step 2: Project Overview */}
      <div>
        <StepTitle num="2" label="Project Overview" />
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-2">
              App / Project Name <span className="text-primary">*</span>
            </label>
            <input
              name="appName"
              value={form.appName}
              onChange={handleChange}
              required
              placeholder="What is the name of your app or project?"
              className={inp}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-2">
              Main Purpose of the App <span className="text-primary">*</span>
            </label>
            <textarea
              name="purpose"
              value={form.purpose}
              onChange={handleChange}
              required
              rows={3}
              placeholder="e.g. Food delivery, booking system, CCTV monitoring, e-learning platform..."
              className={inp + " resize-none"}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-2">
              What Problem Will This App Solve?{" "}
              <span className="text-primary">*</span>
            </label>
            <textarea
              name="problemSolved"
              value={form.problemSolved}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Describe the core problem your app will address..."
              className={inp + " resize-none"}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-3">
              Who Are the Target Users?
            </label>
            <CheckGroup
              options={targetUserOptions}
              selected={targetUsers}
              onToggle={(v) => toggle(targetUsers, setTargetUsers, v)}
            />
          </div>
        </div>
      </div>

      {/* Step 3: Platform */}
      <div>
        <StepTitle num="3" label="Which Platform Do You Need?" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {platforms.map((p) => {
            const Icon = p.icon;
            const active = selectedPlatforms.includes(p.id);
            return (
              <button
                type="button"
                key={p.id}
                onClick={() =>
                  toggle(selectedPlatforms, setSelectedPlatforms, p.id)
                }
                className={`p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer group ${active ? "border-primary bg-primary/15 shadow-[0_0_20px_rgba(214,176,96,0.24)]" : "border-white/10 bg-white/5 hover:border-primary/40 hover:bg-white/10"}`}
              >
                <Icon
                  className={`w-7 h-7 mb-3 ${active ? "text-primary" : "text-muted-foreground group-hover:text-primary/70"} transition-colors`}
                />
                <p
                  className={`font-bold text-sm ${active ? "text-white" : "text-muted-foreground"}`}
                >
                  {p.label}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 4: App Features */}
      <div>
        <StepTitle num="4" label="App Features" />
        <div className="space-y-7">
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-3">
              Select all features you need{" "}
              <span className="text-xs text-muted-foreground/60">
                (choose all that apply)
              </span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {featureOptions.map((feature) => {
                const active = selectedFeatures.includes(feature);
                return (
                  <button
                    type="button"
                    key={feature}
                    onClick={() =>
                      toggle(selectedFeatures, setSelectedFeatures, feature)
                    }
                    className={`px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all duration-200 cursor-pointer ${active ? "border-primary bg-primary/15 text-white shadow-[0_0_12px_rgba(214,176,96,0.24)]" : "border-white/10 bg-white/5 text-muted-foreground hover:border-primary/30 hover:bg-white/10 hover:text-white"}`}
                  >
                    <span
                      className={`mr-2 ${active ? "text-primary" : "text-muted-foreground/50"}`}
                    >
                      {active ? "✓" : "+"}
                    </span>
                    {feature}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-3">
                Admin Dashboard?
              </label>
              <RadioGroup
                options={["Yes", "No"]}
                value={form.hasAdminDashboard}
                onChange={(v) =>
                  setForm((p) => ({ ...p, hasAdminDashboard: v }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-3">
                Users Upload Photos / Videos / Files?
              </label>
              <RadioGroup
                options={["Yes", "No"]}
                value={form.hasFileUpload}
                onChange={(v) => setForm((p) => ({ ...p, hasFileUpload: v }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-3">
                Need Cloud Storage / Database?
              </label>
              <RadioGroup
                options={["Yes", "No", "Not Sure"]}
                value={form.needsCloud}
                onChange={(v) => setForm((p) => ({ ...p, needsCloud: v }))}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Step 5: How It Works */}
      <div>
        <StepTitle num="5" label="How the App Should Work" />
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-2">
              Describe the app step-by-step{" "}
              <span className="text-primary">*</span>
            </label>
            <textarea
              name="howItWorks"
              value={form.howItWorks}
              onChange={handleChange}
              required
              rows={5}
              placeholder="e.g. User opens app → logs in → selects product → makes payment → receives confirmation..."
              className={inp + " resize-none"}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-2">
              Reference Apps / Websites You Like
            </label>
            <textarea
              name="referenceApps"
              value={form.referenceApps}
              onChange={handleChange}
              rows={3}
              placeholder="Share any app names or website URLs that inspire your idea..."
              className={inp + " resize-none"}
            />
          </div>
        </div>
      </div>

      {/* Step 6: Technical Requirements */}
      <div>
        <StepTitle num="6" label="Technical Requirements" />
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-3">
              User Login Type
            </label>
            <CheckGroup
              options={loginTypeOptions}
              selected={loginTypes}
              onToggle={(v) => toggle(loginTypes, setLoginTypes, v)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-3">
              Should the App Work Online or Offline?
            </label>
            <RadioGroup
              options={["Online", "Offline", "Both"]}
              value={form.onlineOffline}
              onChange={(v) => setForm((p) => ({ ...p, onlineOffline: v }))}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-3">
              Notifications / Alerts Needed
            </label>
            <CheckGroup
              options={notificationOptions}
              selected={notificationTypes}
              onToggle={(v) =>
                toggle(notificationTypes, setNotificationTypes, v)
              }
            />
          </div>
        </div>
      </div>

      {/* Step 7: Design & Planning */}
      <div>
        <StepTitle num="7" label="Design & Project Planning" />
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-3">
              Do You Already Have a Logo or Design?
            </label>
            <RadioGroup
              options={["Yes", "No"]}
              value={form.hasLogo}
              onChange={(v) => setForm((p) => ({ ...p, hasLogo: v }))}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">
                Expected Launch Date
              </label>
              <input
                name="launchDate"
                type="date"
                value={form.launchDate}
                onChange={handleChange}
                className={inp}
                style={{ colorScheme: "dark" }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-3">
                Estimated Budget
              </label>
              <RadioGroup
                options={budgetOptions}
                value={form.budget}
                onChange={(v) => setForm((p) => ({ ...p, budget: v }))}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Step 8: Final Notes */}
      <div>
        <StepTitle num="8" label="Additional Requirements" />
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-2">
              Any Additional Requirements?
            </label>
            <textarea
              name="additionalNotes"
              value={form.additionalNotes}
              onChange={handleChange}
              rows={4}
              placeholder="Specific design preferences, integrations, deadlines, or anything else..."
              className={inp + " resize-none"}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-2">
              Special Instructions
            </label>
            <textarea
              name="specialInstructions"
              value={form.specialInstructions}
              onChange={handleChange}
              rows={3}
              placeholder="Any special notes or instructions for Dharani..."
              className={inp + " resize-none"}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="space-y-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-center">
          <p className="text-sm text-red-300">{error}</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              type="button"
              onClick={() => window.open(fallbackMailtoUrl, "_self")}
              className="bg-gradient-to-r from-primary to-accent border-none text-[#17120d]"
            >
              Email Instead
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => window.open(`tel:${contactPhone}`, "_self")}
              className="border-white/20 hover:bg-white/5"
            >
              Call Instead
            </Button>
          </div>
        </div>
      )}
      <div className="pt-2">
        <Button
          type="submit"
          size="lg"
          disabled={sending}
          className="w-full h-16 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 border-none text-[#17120d] shadow-[0_0_30px_rgba(214,176,96,0.28)] hover:shadow-[0_0_40px_rgba(255,232,176,0.18)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {sending ? (
            <>
              <svg
                className="animate-spin mr-2 w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Sending...
            </>
          ) : (
            <>
              <Mail className="mr-2 w-5 h-5" />
              Submit Project Requirements
              <ArrowRight className="ml-2 w-5 h-5" />
            </>
          )}
        </Button>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Your request will be sent directly to Dharani at{" "}
          creativehub2k@gmail.com.
        </p>
        <p className="text-center text-sm text-primary mt-2">
          For priority requests, pay Rs. 250 and register in our application.
        </p>
      </div>
    </form>
  );
}

function Home() {
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    scrollToSection(id);
  };

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/18 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent/16 blur-[140px] rounded-full mix-blend-screen" />
        <div className="absolute top-[40%] right-[10%] w-[30%] h-[30%] bg-primary/10 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 lg:px-12 py-3 sm:py-4 border-b border-primary/10 bg-[rgba(7,7,7,0.72)] backdrop-blur-xl">
        <div className="flex items-center gap-3 sm:gap-4">
          <BrandPanel className="w-14 h-14 sm:w-16 sm:h-16" />
          <div>
            <p className="font-serif text-xl sm:text-2xl text-white leading-none">
              Creative Hub
            </p>
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.34em] text-primary/85 mt-1">
              Project Showcase
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="hover:text-primary transition-colors cursor-pointer bg-transparent border-none"
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            onClick={() => handleNavClick("request")}
            className="hidden sm:inline-flex bg-gradient-to-r from-primary to-accent hover:opacity-90 text-[#17120d] shadow-[0_0_20px_rgba(214,176,96,0.24)] border-none"
          >
            Start Project
          </Button>
          <button
            type="button"
            aria-label={
              mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-colors hover:border-primary/40 hover:bg-white/10"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <>
          <button
            type="button"
            aria-label="Close mobile menu"
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-30 bg-background/70 backdrop-blur-sm md:hidden"
          />
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-20 inset-x-4 sm:inset-x-6 z-40 rounded-3xl border border-primary/15 bg-card/95 p-4 shadow-[0_0_40px_rgba(214,176,96,0.12)] backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className="rounded-2xl border border-transparent px-4 py-3 text-left text-sm font-medium text-white transition-colors hover:border-primary/30 hover:bg-primary/10"
                >
                  {item.label}
                </button>
              ))}
              <Button
                onClick={() => handleNavClick("request")}
                className="mt-2 w-full bg-gradient-to-r from-primary to-accent text-[#17120d] border-none"
              >
                Start Project
              </Button>
            </div>
          </motion.div>
        </>
      )}

      <main className="relative z-10 pt-20 sm:pt-24">
        {/* Hero Section */}
        <section className="relative min-h-[100svh] md:min-h-[92vh] flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20 overflow-hidden">
          <motion.div
            style={{ y: yHero }}
            className="absolute inset-0 z-0 opacity-20"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-background/65 to-background z-10" />
            <img
              src="/hero.png"
              alt="Creative Hub Hero"
              className="w-full h-full object-cover object-center"
            />
          </motion.div>

          <div className="relative z-10 max-w-6xl mx-auto text-center px-1 sm:px-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center gap-5 mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/25 bg-primary/10 backdrop-blur-sm text-primary text-xs sm:text-sm font-medium shadow-[0_0_20px_rgba(214,176,96,0.18)]">
                <Sparkles className="w-4 h-4" />
                <span>Projects across web, mobile, software, and AI</span>
              </div>
              <BrandPanel
                className="h-[220px] w-[220px] sm:h-[280px] sm:w-[280px] lg:h-[320px] lg:w-[320px]"
                imageClassName="scale-[1.08]"
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-[5.6rem] font-semibold tracking-tight leading-[0.92] mb-6"
            >
              Project-Focused Digital Builds <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f7ddb1] via-primary to-accent drop-shadow-[0_0_28px_rgba(214,176,96,0.24)]">
                Showcasing Real Work
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              This page is now centered on project examples only. Browse
              websites, apps, software, and AI systems we can build, then send
              your own project requirements for a similar custom solution.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                size="lg"
                onClick={() => scrollToSection("projects")}
                className="w-full sm:w-auto h-14 px-8 text-base bg-gradient-to-r from-primary to-accent text-[#17120d] hover:opacity-90 hover:scale-[1.02] shadow-[0_0_28px_rgba(214,176,96,0.24)] transition-all duration-300 border-none"
              >
                View Projects
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection("request")}
                className="w-full sm:w-auto h-14 px-8 text-base border-primary/25 text-white hover:bg-primary/10 backdrop-blur-md"
              >
                Request a Project
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto"
            >
              {[
                {
                  title: "Project-Only Layout",
                  desc: "The homepage stays focused on project examples and requests.",
                },
                {
                  title: "Web, Mobile, Software & AI",
                  desc: "Examples cover multiple product types in one showcase.",
                },
                {
                  title: "Ready for Custom Builds",
                  desc: "Every project card leads directly into the request flow.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-primary/15 bg-white/[0.03] px-5 py-5 backdrop-blur-md"
                >
                  <p className="text-sm uppercase tracking-[0.28em] text-primary/80 mb-2">
                    Focus
                  </p>
                  <h3 className="font-sans text-lg font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Featured Projects */}
        <section
          id="projects"
          className="py-24 sm:py-28 lg:py-32 px-4 sm:px-6 relative"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Featured <span className="text-primary">Projects</span>
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl">
                A focused showcase of websites, apps, software products, cloud
                systems, and AI workflows.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative rounded-2xl overflow-hidden bg-card border border-white/5 hover:border-primary/50 transition-colors duration-500 cursor-pointer"
                  onClick={() => scrollToSection("request")}
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-4 left-4 z-20">
                      <span className="px-3 py-1 rounded-full bg-background/80 backdrop-blur-md text-xs font-semibold text-primary uppercase tracking-wider border border-white/10">
                        {project.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 relative z-20 bg-card/90 backdrop-blur-sm border-t border-white/5">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm mb-4">
                      {project.description}
                    </p>
                    <span className="text-sm text-primary font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Request Similar <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Project Request Form */}
        <section
          id="request"
          className="py-24 sm:py-28 lg:py-32 px-4 sm:px-6 relative"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="mb-14 text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
                <ClipboardList className="w-4 h-4" />
                Project Request Form
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Tell Us About Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  Project
                </span>
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
                Fill in your requirements and Dharani will get back to you with
                a customized solution tailored to your needs.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative rounded-3xl border border-primary/15 bg-card/70 backdrop-blur-xl p-5 sm:p-8 md:p-12 shadow-[0_0_60px_rgba(214,176,96,0.08)]"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-t-3xl" />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
              <div className="relative z-10">
                <ProjectForm />
              </div>
            </motion.div>

            {/* Process Steps */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {[
                {
                  icon: ClipboardList,
                  step: "01",
                  title: "Submit Requirements",
                  desc: "Fill out the form with your project details and desired features.",
                },
                {
                  icon: Layers,
                  step: "02",
                  title: "Get a Custom Plan",
                  desc: "Dharani reviews your request and prepares a tailored proposal for you.",
                },
                {
                  icon: CheckCircle2,
                  step: "03",
                  title: "Project Kickoff",
                  desc: "Once approved, we begin building your interactive experience.",
                },
              ].map((step, i) => {
                const Icon = step.icon;
                return (
                  <div
                    key={i}
                    className="p-6 rounded-2xl bg-white/3 border border-white/8 text-center group hover:border-primary/30 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4 text-primary group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <p className="text-xs text-primary font-bold tracking-widest uppercase mb-2">
                      Step {step.step}
                    </p>
                    <h4 className="font-bold text-lg mb-2">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          className="py-24 sm:py-28 lg:py-32 px-4 sm:px-6 relative border-t border-white/5"
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-8">
                Talk Through Your Next Project
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground mb-12">
                Use the form above or contact Dharani directly to discuss
                project scope, features, and delivery.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="p-8 rounded-2xl bg-card border border-primary/15 flex flex-col items-center justify-center gap-4 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(214,176,96,0.14)] transition-all">
                  <BrandPanel className="w-24 h-24 sm:w-28 sm:h-28" alt="Creative Hub Brand" />
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Studio</p>
                    <p className="font-bold text-lg">Creative Hub</p>
                  </div>
                </div>

                <a
                  href="tel:9786954984"
                  className="p-8 rounded-2xl bg-card border border-primary/15 flex flex-col items-center justify-center gap-4 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(214,176,96,0.14)] transition-all no-underline text-inherit"
                >
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-primary">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">
                      Call Us
                    </p>
                    <p className="font-bold text-lg">9786954984</p>
                  </div>
                </a>

                <a
                  href="mailto:creativehub2k@gmail.com"
                  className="p-8 rounded-2xl bg-card border border-primary/15 flex flex-col items-center justify-center gap-4 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(214,176,96,0.14)] transition-all no-underline text-inherit"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center text-primary">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">
                      Email Us
                    </p>
                    <p className="font-bold text-lg break-all">
                      creativehub2k@gmail.com
                    </p>
                  </div>
                </a>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <Button
                  size="lg"
                  onClick={() =>
                    window.open(
                      "https://mail.google.com/mail/?view=cm&fs=1&to=creativehub2k@gmail.com",
                      "_blank",
                    )
                  }
                  className="w-full sm:w-auto h-16 px-8 sm:px-10 text-base sm:text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 border-none text-[#17120d] shadow-[0_0_30px_rgba(214,176,96,0.28)] hover:shadow-[0_0_40px_rgba(255,232,176,0.18)] transition-all duration-300"
                >
                  Send Project Email
                  <Mail className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => window.open("tel:9786954984", "_self")}
                  className="w-full sm:w-auto h-16 px-8 sm:px-10 text-base sm:text-lg border-white/20 hover:bg-white/5"
                >
                  Call Now
                  <Phone className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 sm:px-6 border-t border-white/10 bg-background/80 backdrop-blur-md relative z-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="flex items-center gap-3 text-white">
              <BrandPanel className="w-14 h-14" />
              <div>
                <p className="font-serif text-2xl leading-none">Creative Hub</p>
                <p className="text-[10px] uppercase tracking-[0.32em] text-primary/80 mt-1">
                  Project Showcase
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Copyright {new Date().getFullYear()} Creative Hub by Dharani. All
              rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-muted-foreground">
              <a
                href="mailto:creativehub2k@gmail.com"
                className="hover:text-primary transition-colors"
              >
                creativehub2k@gmail.com
              </a>
              <a
                href="tel:9786954984"
                className="hover:text-primary transition-colors"
              >
                9786954984
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default function App() {
  return <Home />;
}
