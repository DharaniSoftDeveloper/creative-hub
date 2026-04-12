import React, { useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Mail, Phone, User, ArrowRight, Sparkles, Zap, Brain, Hexagon, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6 border-b border-white/5 bg-background/50 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Hexagon className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold tracking-tight">Creative Hub</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#projects" className="hover:text-primary transition-colors">Projects</a>
          <a href="#about" className="hover:text-primary transition-colors">About</a>
          <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] border-none">
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm text-primary text-sm font-medium mb-8 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Curated by Dharani</span>
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
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base bg-white text-black hover:bg-gray-100 hover:scale-105 transition-all duration-300">
                Explore Projects
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base border-white/20 hover:bg-white/5 backdrop-blur-md">
                Contact Dharani
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
                  className="group relative rounded-2xl overflow-hidden bg-card border border-white/5 hover:border-primary/50 transition-colors duration-500"
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
                    <p className="text-muted-foreground leading-relaxed">{project.description}</p>
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

        {/* Contact Section */}
        <section id="contact" className="py-32 px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">Ready to Elevate Your Vision?</h2>
              <p className="text-xl text-muted-foreground mb-12">Connect with Dharani to commission bespoke interactive projects for your organization.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="p-8 rounded-2xl bg-card border border-white/5 flex flex-col items-center justify-center gap-4 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Owner</p>
                    <p className="font-bold text-lg">Dharani</p>
                  </div>
                </div>
                
                <div className="p-8 rounded-2xl bg-card border border-white/5 flex flex-col items-center justify-center gap-4 hover:border-accent/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Contact</p>
                    <p className="font-bold text-lg">9786954984</p>
                  </div>
                </div>
                
                <div className="p-8 rounded-2xl bg-card border border-white/5 flex flex-col items-center justify-center gap-4 hover:border-purple-400/30 hover:shadow-[0_0_30px_rgba(192,132,252,0.15)] transition-all">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="font-bold text-lg">creativehub2k@gmail.com</p>
                  </div>
                </div>
              </div>

              <Button size="lg" className="h-16 px-10 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 border-none text-white shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] transition-all duration-300">
                Initiate Project
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-white/10 bg-background/80 backdrop-blur-md relative z-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-white">
              <Hexagon className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg tracking-tight">Creative Hub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Creative Hub by Dharani. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default function App() {
  return <Home />;
}