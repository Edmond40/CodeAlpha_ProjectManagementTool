import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Zap, Users, LayoutDashboard, Shield, Smartphone } from 'lucide-react';
import { Button } from '../components/Button';
import demoImg from '../assets/demo.png';
import logo from '../assets/planoralogo4.png';
import heroImg from '../assets/hero.png';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-violet-500 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/70 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between max-w-7xl">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logo} alt="Planora Logo" className="h-10 w-auto group-hover:scale-105 transition-transform" />
            <span className="font-extrabold text-2xl tracking-tighter text-foreground">Planora</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#solutions" className="hover:text-foreground transition-colors">Solutions</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/auth/login" className="hidden sm:block text-sm font-semibold hover:text-primary transition-colors">
              Sign In
            </Link>
            <Link to="/auth/register">
              <Button className="rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative z-10 pt-32 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-6 max-w-7xl text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-4xl mx-auto space-y-8 relative z-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4 border border-primary/20">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              Planora 2.0 is here
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter text-foreground leading-[1.1]">
              Manage work <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary/80 to-violet-600">
                beautifully.
              </span>
            </h1>
            <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
              Planora brings your team's tasks, projects, and collaboration into one incredibly fast, modern workspace. Say goodbye to clutter.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/auth/register">
                <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-10 rounded-full shadow-xl shadow-primary/25 hover:-translate-y-1 transition-all">
                  Start for free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg h-14 px-10 rounded-full hover:bg-muted/50 transition-all">
                  View Live Demo
                </Button>
              </Link>
            </div>
            <div className="pt-8 text-sm text-muted-foreground flex items-center justify-center gap-6">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> No credit card required</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> 14-day free trial</span>
            </div>
          </motion.div>

          {/* Hero Image / Demo App Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="mt-24 relative mx-auto max-w-6xl"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-violet-500 to-primary rounded-[2.5rem] blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative glass-card rounded-[2rem] border border-border/50 overflow-hidden shadow-2xl bg-background/50 backdrop-blur-sm">
              {/* Browser Chrome */}
              <div className="bg-muted/30 border-b border-border/50 p-4 flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="mx-auto bg-background/50 rounded-md px-32 py-1 text-xs text-muted-foreground/50 font-mono hidden md:block">app.planora.com</div>
              </div>
              <img src={demoImg} alt="Planora App Dashboard" className="w-full h-auto object-cover border-t border-border/10" />
            </div>
            
            {/* Floating Hero Accents */}
            <motion.img 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              src={heroImg} 
              alt="Hero Element" 
              className="absolute -right-12 -top-12 w-48 h-auto drop-shadow-2xl hidden lg:block hover:rotate-12 transition-transform duration-500" 
            />
          </motion.div>
        </section>

        {/* Feature Highlights */}
        <section id="features" className="container mx-auto px-6 max-w-7xl mt-40">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Everything you need to ship faster</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Powerful features designed for modern teams who demand speed, clarity, and beautiful design.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="h-6 w-6 text-yellow-500" />}
              title="Lightning Fast"
              desc="Built on modern tech to ensure actions happen instantly without reloading. Your workflow, uninterrupted."
              bg="bg-yellow-500/10"
            />
            <FeatureCard 
              icon={<LayoutDashboard className="h-6 w-6 text-blue-500" />}
              title="Intuitive Kanban"
              desc="Seamless drag-and-drop boards to track your tasks from To Do to Done with perfect clarity."
              bg="bg-blue-500/10"
            />
            <FeatureCard 
              icon={<Users className="h-6 w-6 text-violet-500" />}
              title="Collaborative"
              desc="Real-time updates, comments, and team management baked right into the core experience."
              bg="bg-violet-500/10"
            />
            <FeatureCard 
              icon={<Shield className="h-6 w-6 text-green-500" />}
              title="Enterprise Security"
              desc="Bank-grade encryption and SOC2 compliance to keep your company data perfectly safe."
              bg="bg-green-500/10"
            />
            <FeatureCard 
              icon={<Smartphone className="h-6 w-6 text-pink-500" />}
              title="Mobile Ready"
              desc="A fully responsive web app and native mobile apps ensure you can manage work from anywhere."
              bg="bg-pink-500/10"
            />
            <FeatureCard 
              icon={<CheckCircle2 className="h-6 w-6 text-primary" />}
              title="Automated Workflows"
              desc="Set up custom rules to automate repetitive tasks and save your team hours every week."
              bg="bg-primary/10"
            />
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="container mx-auto px-6 max-w-5xl mt-40 mb-20">
          <div className="bg-gradient-to-br from-primary to-violet-600 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-noise"></div>
            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">Ready to transform your workflow?</h2>
              <p className="text-primary-foreground/80 text-xl max-w-2xl mx-auto">Join thousands of teams who have already upgraded their project management with Planora.</p>
              <div className="pt-4">
                <Link to="/auth/register">
                  <Button size="lg" variant="secondary" className="bg-background text-foreground hover:bg-muted text-lg h-14 px-10 rounded-full shadow-xl">
                    Get Started Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/20 pt-16 pb-8">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-80 group">
            <img src={logo} alt="Planora Logo" className="h-6 w-auto grayscale group-hover:grayscale-0 transition-all" />
            <span className="font-bold text-lg tracking-tight">Planora</span>
          </div>
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Planora Inc. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm font-medium text-muted-foreground">
            <Link to="#" className="hover:text-foreground">Privacy</Link>
            <Link to="#" className="hover:text-foreground">Terms</Link>
            <Link to="#" className="hover:text-foreground">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc, bg }: { icon: React.ReactNode, title: string, desc: string, bg: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-8 rounded-3xl bg-card border border-border/50 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300"
    >
      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 ${bg}`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </motion.div>
  );
}
