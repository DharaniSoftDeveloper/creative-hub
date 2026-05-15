import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Mail, Phone, ArrowRight, Sparkles, Zap, Brain, Globe, CheckCircle2, ClipboardList, Layers, Cpu, Smartphone, Globe2, Layout } from "lucide-react";
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
    title: "Interactive Science Lab",
    description: "A fully immersive digital sandbox for exploring complex molecular structures and physics simulations in real-time.",
    image: "/project-science.png",
    category: "Simulation"
  },
  {
    title: "Team Collaboration Kit",
    description: "Synchronize creative minds with interconnected workspaces that turn fragmented ideas into unified digital masterpieces.",
    image: "/project-collab.png",
    category: "Workspace"
  },
  {
    title: "Digital Storytelling Studio",
    description: "Craft cinematic narratives with interactive particles and dynamic lighting engines designed for next-gen creators.",
    image: "/project-story.png",
    category: "Creation"
  },
  {
    title: "Design Thinking Module",
    description: "Transform abstract concepts into concrete geometries through our advanced spatial reasoning and rendering engine.",
    image: "/project-design.png",
    category: "Education"
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      `Organization/Institution: ${form.orgName}`,
      `Project Title: ${form.projectTitle}`,
      `Project Type: ${selectedType}`,
      `How the Project Works:\n${form.howItWorks}`,
      `Required Features: ${selectedFeatures.join(", ") || "None specified"}`,
      `Additional Notes:\n${form.additionalNotes}`,
    ].join("\n\n");

    const subject = encodeURIComponent(`New Project Request: ${form.projectTitle || "Untitled"}`);
    const bodyEncoded = encodeURIComponent(body);
    window.open(`mailto:creativehub2k@gmail.com?subject=${subject}&body=${bodyEncoded}`, "_blank");
    setSubmitted(true);
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
          Your project requirements have been prepared. Your email client opened with all the details — just hit send to reach Dharani.
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
      <div className="pt-2">
        <Button
          type="submit"
          size="lg"
          className="w-full h-16 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 border-none text-white shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] transition-all duration-300"
        >
          <Mail className="mr-2 w-5 h-5" />
          Submit Project Requirements
          <ArrowRight className="ml-2 w-5 h-5" />
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
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Featured <span className="text-primary">Experiences</span></h2>
              <p className="text-muted-foreground text-lg max-w-2xl">Discover our portfolio of premium interactive modules crafted for modern learners and organizations.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                  <div className="p-8 relative z-20 bg-card/90 backdrop-blur-sm border-t border-white/5">
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{project.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">{project.description}</p>
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
                  onClick={() => window.open("mailto:creativehub2k@gmail.com", "_blank")}
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
