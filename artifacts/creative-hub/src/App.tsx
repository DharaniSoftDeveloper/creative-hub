import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Mail, Phone, ArrowRight, Sparkles, Zap, Brain, Globe, CheckCircle2, ClipboardList, Layers, Cpu, Smartphone, Globe2, Layout, Server, Code2, MonitorSmartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImg from "@assets/IMG-20260412-WA0110_1776010236262.jpg";


const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const projects = [
  {
    title: "E-Commerce Web Application",
    description: "Full-featured online store with product catalog, cart, payment gateway integration, and admin dashboard for real-time order management.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    category: "Web Application"
  },
  {
    title: "School Management System",
    description: "Comprehensive software for managing students, staff, attendance, grades, timetables, and parent communication in one unified platform.",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    category: "Software Project"
  },
  {
    title: "Restaurant Business Website",
    description: "Premium restaurant website with online menu, table reservation system, photo gallery, and integrated Google Maps location.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    category: "Website Building"
  },
  {
    title: "Food Delivery Mobile App",
    description: "Cross-platform mobile app for food ordering with real-time tracking, push notifications, payment integration, and ratings system.",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
    category: "Mobile Application"
  },
  {
    title: "Cloud Hosting & Deployment",
    description: "End-to-end cloud hosting setup with custom domain, SSL certificates, auto-scaling, daily backups, and 99.9% uptime guarantee.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    category: "Hosting"
  },
  {
    title: "Educational Learning Portal",
    description: "Interactive e-learning platform with video courses, live classes, quizzes, progress tracking, certificates, and student dashboards.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
    category: "Web Application"
  },
  {
    title: "AI Construction Site Safety",
    description: "Fully automated AI surveillance system for construction sites — real-time accident detection, PPE violation alerts, sudden collapse prediction, and 24/7 camera monitoring with instant on-site notifications.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
    category: "AI / ML"
  },
  {
    title: "AI Exam Malpractice Detection",
    description: "Advanced ML system that monitors students via camera during exams — tracks eye movement, head position, body posture, detects speaking, turning, tab switching, and flags suspicious behaviour in real time.",
    image: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&q=80",
    category: "AI / ML"
  },
  {
    title: "Emergency Alert & Response System",
    description: "Smart emergency management platform — detects fire, structural collapse, and hazards using AI sensors, then automatically alerts and calls ambulance, police, and fire fighters with live location data.",
    image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80",
    category: "AI / ML"
  }
];

const services = [
  {
    icon: Code2,
    title: "Software Projects",
    description: "Custom desktop and enterprise software built with modern technologies — from ERP systems to automation tools tailored to your workflow.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80",
    color: "from-purple-500/20 to-primary/10",
    border: "border-purple-500/30"
  },
  {
    icon: Layout,
    title: "Web Applications",
    description: "Powerful browser-based apps with real-time features, user authentication, databases, and beautiful dashboards — built to scale.",
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&q=80",
    color: "from-cyan-500/20 to-accent/10",
    border: "border-cyan-500/30"
  },
  {
    icon: Globe2,
    title: "Website Building",
    description: "Professional business websites, portfolios, and landing pages designed to impress — fast, mobile-friendly, and SEO optimized.",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80",
    color: "from-blue-500/20 to-indigo-500/10",
    border: "border-blue-500/30"
  },
  {
    icon: MonitorSmartphone,
    title: "Mobile Applications",
    description: "Cross-platform iOS and Android apps with smooth animations, offline support, push notifications, and app store deployment.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80",
    color: "from-green-500/20 to-emerald-500/10",
    border: "border-green-500/30"
  },
  {
    icon: Server,
    title: "Hosting & Deployment",
    description: "Complete hosting solutions — custom domain setup, SSL, cloud deployment, database management, and ongoing maintenance.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80",
    color: "from-orange-500/20 to-yellow-500/10",
    border: "border-orange-500/30"
  }
];

const projectTypes = [
  { id: "website", label: "Website", icon: Globe2, desc: "Static or dynamic web presence" },
  { id: "web-app", label: "Web Application", icon: Layout, desc: "Interactive browser-based app" },
  { id: "mobile-app", label: "Mobile Application", icon: Smartphone, desc: "iOS or Android app" },
  { id: "desktop-app", label: "Desktop Application", icon: Cpu, desc: "Windows / Mac / Linux software" },
];

const featureOptions = [
  "User Login / Signup",
  "Admin Dashboard",
  "Payment Integration",
  "Real-time Chat",
  "Push Notifications",
  "Data Analytics",
  "File Uploads",
  "API Integration",
  "Multi-language Support",
  "Search & Filter",
  "Email Notifications",
  "Dark / Light Mode",
];

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function ProjectForm() {
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    orgName: "",
    projectTitle: "",
    howItWorks: "",
    additionalNotes: "",
  });

  function toggleFeature(feature: string) {
    setSelectedFeatures(prev =>
      prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]
    );
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          orgName: form.orgName,
          projectTitle: form.projectTitle,
          projectType: selectedType,
          howItWorks: form.howItWorks,
          features: selectedFeatures.join(", "),
          additionalNotes: form.additionalNotes,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error || "Failed to send");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 gap-6 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.4)]">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-3xl font-bold">Request Submitted!</h3>
        <p className="text-muted-foreground text-lg max-w-md">
          Your project requirements have been sent directly to Dharani. Expect a response within 24 hours!
        </p>
        <Button
          onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", orgName: "", projectTitle: "", howItWorks: "", additionalNotes: "" }); setSelectedType(""); setSelectedFeatures([]); }}
          variant="outline"
          className="border-primary/30 hover:bg-primary/10 text-primary"
        >
          Submit Another Request
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Personal Info */}
      <div>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary">
          <span className="w-7 h-7 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center font-bold border border-primary/30">1</span>
          Your Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { name: "name", label: "Full Name", placeholder: "Enter your name", required: true },
            { name: "orgName", label: "Organization / Institution", placeholder: "School, company, or group name" },
            { name: "email", label: "Email Address", placeholder: "yourmail@example.com", required: true, type: "email" },
            { name: "phone", label: "Phone Number", placeholder: "+91 XXXXX XXXXX", type: "tel" },
          ].map(field => (
            <div key={field.name}>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">
                {field.label} {field.required && <span className="text-primary">*</span>}
              </label>
              <input
                name={field.name}
                type={field.type ?? "text"}
                value={(form as Record<string, string>)[field.name]}
                onChange={handleChange}
                required={field.required}
                placeholder={field.placeholder}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Project Title */}
      <div>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary">
          <span className="w-7 h-7 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center font-bold border border-primary/30">2</span>
          Project Title
        </h3>
        <input
          name="projectTitle"
          value={form.projectTitle}
          onChange={handleChange}
          required
          placeholder="Give your project a name..."
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>

      {/* Project Type */}
      <div>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary">
          <span className="w-7 h-7 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center font-bold border border-primary/30">3</span>
          Project Type
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {projectTypes.map(type => {
            const Icon = type.icon;
            const active = selectedType === type.id;
            return (
              <button
                type="button"
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer group ${
                  active
                    ? "border-primary bg-primary/15 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                    : "border-white/10 bg-white/5 hover:border-primary/40 hover:bg-white/10"
                }`}
              >
                <Icon className={`w-7 h-7 mb-3 ${active ? "text-primary" : "text-muted-foreground group-hover:text-primary/70"} transition-colors`} />
                <p className={`font-bold text-sm mb-1 ${active ? "text-white" : "text-muted-foreground"}`}>{type.label}</p>
                <p className="text-xs text-muted-foreground/70">{type.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* How It Works */}
      <div>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary">
          <span className="w-7 h-7 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center font-bold border border-primary/30">4</span>
          How Should the Project Work?
        </h3>
        <textarea
          name="howItWorks"
          value={form.howItWorks}
          onChange={handleChange}
          required
          rows={5}
          placeholder="Describe how you envision the project working. What problem does it solve? Who will use it? What is the main flow or journey for a user? Be as detailed as possible..."
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
        />
      </div>

      {/* Features */}
      <div>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary">
          <span className="w-7 h-7 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center font-bold border border-primary/30">5</span>
          Required Features
          <span className="text-sm font-normal text-muted-foreground ml-1">(select all that apply)</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {featureOptions.map(feature => {
            const active = selectedFeatures.includes(feature);
            return (
              <button
                type="button"
                key={feature}
                onClick={() => toggleFeature(feature)}
                className={`px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all duration-200 cursor-pointer ${
                  active
                    ? "border-primary bg-primary/15 text-white shadow-[0_0_12px_rgba(168,85,247,0.25)]"
                    : "border-white/10 bg-white/5 text-muted-foreground hover:border-primary/30 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className={`mr-2 ${active ? "text-primary" : "text-muted-foreground/50"}`}>{active ? "✓" : "+"}</span>
                {feature}
              </button>
            );
          })}
        </div>
      </div>

      {/* Additional Notes */}
      <div>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary">
          <span className="w-7 h-7 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center font-bold border border-primary/30">6</span>
          Additional Requirements / Notes
        </h3>
        <textarea
          name="additionalNotes"
          value={form.additionalNotes}
          onChange={handleChange}
          rows={4}
          placeholder="Any specific design preferences, deadlines, budget range, or other details you'd like to share..."
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
        />
      </div>

      {/* Submit */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
          {error}
        </div>
      )}
      <div className="pt-2">
        <Button
          type="submit"
          size="lg"
          disabled={sending}
          className="w-full h-16 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 border-none text-white shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {sending ? (
            <>
              <svg className="animate-spin mr-2 w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
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
          Your requirements will be sent directly to Dharani at creativehub2k@gmail.com
        </p>
      </div>
    </form>
  );
}

function Home() {
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary/30">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute top-[40%] right-[10%] w-[30%] h-[30%] bg-purple-500/10 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 border-b border-white/5 bg-background/50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <img
            src={logoImg}
            alt="Creative Hub Logo"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/40"
          />
          <span className="text-xl font-bold tracking-tight">Creative Hub</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <button onClick={() => scrollToSection("services")} className="hover:text-primary transition-colors cursor-pointer bg-transparent border-none">Services</button>
          <button onClick={() => scrollToSection("projects")} className="hover:text-primary transition-colors cursor-pointer bg-transparent border-none">Projects</button>
          <button onClick={() => scrollToSection("about")} className="hover:text-primary transition-colors cursor-pointer bg-transparent border-none">About</button>
          <button onClick={() => scrollToSection("request")} className="hover:text-primary transition-colors cursor-pointer bg-transparent border-none">Request Project</button>
          <button onClick={() => scrollToSection("contact")} className="hover:text-primary transition-colors cursor-pointer bg-transparent border-none">Contact</button>
        </div>
        <Button
          onClick={() => scrollToSection("request")}
          className="bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] border-none"
        >
          Get Started
        </Button>
      </nav>

      <main className="relative z-10 pt-24">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center px-6 py-20 overflow-hidden">
          <motion.div
            style={{ y: yHero }}
            className="absolute inset-0 z-0 opacity-40"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-10" />
            <img src="/hero.png" alt="Creative Hub Hero" className="w-full h-full object-cover object-center" />
          </motion.div>

          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center gap-4 mb-8"
            >
              <img
                src={logoImg}
                alt="Creative Hub Logo"
                className="w-24 h-24 rounded-full object-cover ring-4 ring-primary/40 shadow-[0_0_40px_rgba(168,85,247,0.5)]"
              />
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm text-primary text-sm font-medium shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                <Sparkles className="w-4 h-4" />
                <span>Curated by Dharani</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-tight mb-6"
            >
              Innovation Meets <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-accent drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                Education
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              We turn ideas into spectacular interactive experiences. Step into our high-end creative studio and discover digital solutions that radiate professionalism and energy.
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
                className="w-full sm:w-auto h-14 px-8 text-base bg-white text-black hover:bg-gray-100 hover:scale-105 transition-all duration-300"
              >
                Explore Projects
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection("request")}
                className="w-full sm:w-auto h-14 px-8 text-base border-white/20 hover:bg-white/5 backdrop-blur-md"
              >
                Request a Project
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-32 px-6 relative border-y border-white/5">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="mb-16 text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                What We Build
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Services</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                From software to mobile apps, we deliver end-to-end digital solutions with precision and creativity.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6, delay: index * 0.08 }}
                    className={`group relative rounded-2xl overflow-hidden border ${service.border} bg-card hover:shadow-[0_0_40px_rgba(168,85,247,0.15)] transition-all duration-500 cursor-pointer`}
                    onClick={() => scrollToSection("request")}
                  >
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-b ${service.color} to-card`} />
                      <div className="absolute top-4 left-4">
                        <div className="w-10 h-10 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white">
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{service.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">{service.description}</p>
                      <span className="text-sm text-primary font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Get a Quote <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section id="projects" className="py-32 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Real <span className="text-primary">Projects</span> We Build</h2>
              <p className="text-muted-foreground text-lg max-w-2xl">Explore real-world projects across every domain — from e-commerce to mobile apps and cloud hosting.</p>
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
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm mb-4">{project.description}</p>
                    <span className="text-sm text-primary font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Request Similar <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section id="about" className="py-32 px-6 relative border-y border-white/5 bg-background/40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
            >
              <div>
                <motion.h2 variants={fadeIn} className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                  Intelligent Design. <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">Brilliant Execution.</span>
                </motion.h2>
                <motion.p variants={fadeIn} className="text-muted-foreground text-lg mb-8 leading-relaxed">
                  Creative Hub isn't just an agency; it's an innovation laboratory. We engineer educational tools that feel like premium consumer products, wrapping complex pedagogy in breathtaking design.
                </motion.p>
                <div className="space-y-6">
                  {[
                    { icon: Zap, title: "Dynamic Interaction", desc: "Every module reacts and adapts, making learning an active conversation rather than a passive lecture." },
                    { icon: Brain, title: "Cognitive Architecture", desc: "Structures built on proven educational frameworks disguised as immersive entertainment." },
                    { icon: Globe, title: "Limitless Scale", desc: "From solitary students to enterprise organizations, our platforms scale effortlessly." }
                  ].map((feature, i) => (
                    <motion.div key={i} variants={fadeIn} className="flex gap-4 items-start">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20 text-primary">
                        <feature.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
                        <p className="text-muted-foreground">{feature.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <motion.div variants={fadeIn} className="relative h-full min-h-[500px] rounded-3xl overflow-hidden border border-white/10 p-8 flex flex-col justify-between bg-gradient-to-br from-card to-background">
                <div className="absolute inset-0 bg-primary/5 opacity-50 blur-3xl" />
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2">Who We Serve</h3>
                  <div className="space-y-4 mt-8">
                    {[
                      { name: "Students", role: "Individual learners seeking extraordinary tools" },
                      { name: "Small Groups", role: "Collaborative pods needing synchronized spaces" },
                      { name: "Organizations", role: "Institutions demanding premium educational infrastructure" }
                    ].map((audience, i) => (
                      <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                        <h4 className="text-lg font-bold text-white mb-1">{audience.name}</h4>
                        <p className="text-sm text-muted-foreground">{audience.role}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Project Request Form */}
        <section id="request" className="py-32 px-6 relative">
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
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                Tell Us About Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Project</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Fill in your requirements and Dharani will get back to you with a customized solution tailored to your needs.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative rounded-3xl border border-white/10 bg-card/60 backdrop-blur-xl p-8 md:p-12 shadow-[0_0_60px_rgba(168,85,247,0.1)]"
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
                { icon: ClipboardList, step: "01", title: "Submit Requirements", desc: "Fill out the form with your project details and desired features." },
                { icon: Layers, step: "02", title: "Get a Custom Plan", desc: "Dharani reviews your request and prepares a tailored proposal for you." },
                { icon: CheckCircle2, step: "03", title: "Project Kickoff", desc: "Once approved, we begin building your interactive experience." },
              ].map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="p-6 rounded-2xl bg-white/3 border border-white/8 text-center group hover:border-primary/30 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4 text-primary group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <p className="text-xs text-primary font-bold tracking-widest uppercase mb-2">Step {step.step}</p>
                    <h4 className="font-bold text-lg mb-2">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-32 px-6 relative border-t border-white/5">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">Ready to Elevate Your Vision?</h2>
              <p className="text-xl text-muted-foreground mb-12">Connect with Dharani directly to discuss bespoke interactive projects.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="p-8 rounded-2xl bg-card border border-white/5 flex flex-col items-center justify-center gap-4 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all">
                  <img src={logoImg} alt="Dharani" className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/40" />
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Owner</p>
                    <p className="font-bold text-lg">Dharani</p>
                  </div>
                </div>

                <a
                  href="tel:9786954984"
                  className="p-8 rounded-2xl bg-card border border-white/5 flex flex-col items-center justify-center gap-4 hover:border-accent/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all no-underline text-inherit"
                >
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Call Us</p>
                    <p className="font-bold text-lg">9786954984</p>
                  </div>
                </a>

                <a
                  href="mailto:creativehub2k@gmail.com"
                  className="p-8 rounded-2xl bg-card border border-white/5 flex flex-col items-center justify-center gap-4 hover:border-purple-400/30 hover:shadow-[0_0_30px_rgba(192,132,252,0.15)] transition-all no-underline text-inherit"
                >
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Email Us</p>
                    <p className="font-bold text-lg break-all">creativehub2k@gmail.com</p>
                  </div>
                </a>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <Button
                  size="lg"
                  onClick={() => window.open("https://mail.google.com/mail/?view=cm&fs=1&to=creativehub2k@gmail.com", "_blank")}
                  className="h-16 px-10 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 border-none text-white shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] transition-all duration-300"
                >
                  Send an Email
                  <Mail className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => window.open("tel:9786954984", "_self")}
                  className="h-16 px-10 text-lg border-white/20 hover:bg-white/5"
                >
                  Call Now
                  <Phone className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-white/10 bg-background/80 backdrop-blur-md relative z-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 text-white">
              <img src={logoImg} alt="Creative Hub Logo" className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/40" />
              <span className="font-bold text-lg tracking-tight">Creative Hub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Creative Hub by Dharani. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="mailto:creativehub2k@gmail.com" className="hover:text-primary transition-colors">creativehub2k@gmail.com</a>
              <a href="tel:9786954984" className="hover:text-primary transition-colors">9786954984</a>
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
