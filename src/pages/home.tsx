import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Menu, X, Phone, Mail, MapPin, CheckCircle, 
  Home as HomeIcon, TrendingUp, Key, FileText, 
  Map, Star, ArrowRight, ShieldCheck, ThumbsUp, 
  Building, Users, Target, MessageCircle, Award,
  HandshakeIcon, ClipboardList, CalendarCheck, BadgeCheck, Compass
} from "lucide-react";
import { SiWhatsapp, SiInstagram, SiFacebook } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Counter = ({ end, suffix = "+", duration = 2, label }: { end: number, suffix?: string, duration?: number, label: string }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setHasStarted(true); observer.disconnect(); } },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;
    let start = 0;
    const totalFrames = duration * 60;
    let frame = 0;
    const timer = setInterval(() => {
      frame++;
      // ease-out curve: fast start, slow finish
      const progress = 1 - Math.pow(1 - frame / totalFrames, 3);
      const value = Math.round(progress * end);
      setCount(value);
      if (frame >= totalFrames) { setCount(end); clearInterval(timer); }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [hasStarted, end, duration]);

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center p-4"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="text-4xl md:text-5xl font-bold text-primary mb-2 tracking-tight tabular-nums"
        animate={hasStarted ? { scale: [1, 1.12, 1] } : {}}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {count}{suffix}
      </motion.div>
      <div className="text-xs md:text-sm text-gray-600 font-semibold uppercase tracking-wider text-center">{label}</div>
    </motion.div>
  );
};

const SectionHeading = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <motion.div
    className="text-center max-w-3xl mx-auto mb-16"
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  >
    <h2 className="text-sm font-bold text-primary tracking-[0.2em] uppercase mb-3">{subtitle}</h2>
    <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">{title}</h3>
  </motion.div>
);

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: "Home", id: "home" },
    { name: "About", id: "about" },
    { name: "Services", id: "services" },
    { name: "Areas", id: "areas" },
    { name: "Testimonials", id: "testimonials" },
    { name: "Contact", id: "contact" },
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Inquiry Sent Successfully",
      description: "Balaji will get back to you shortly.",
    });
  };

  const logoUrl = "/balaji-logo.jpeg";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* 1. Sticky Navbar */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md py-3" : "bg-white/90 backdrop-blur-md py-4"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center cursor-pointer" onClick={() => scrollTo("home")}>
            <img src={logoUrl} alt="Balaji R Logo" className="h-12 w-12 rounded-full object-cover mr-3 border-2 border-primary/20 shadow-sm" />
            <div className="flex flex-col">
              <span className="font-bold text-xl leading-none text-gray-900 tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>BALAJI R</span>
              <span className="text-[10px] text-primary font-bold tracking-widest uppercase mt-0.5">Real Estate Advisor</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button 
                key={link.id} 
                onClick={() => scrollTo(link.id)}
                className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors uppercase tracking-wide"
              >
                {link.name}
              </button>
            ))}
            <Button onClick={() => scrollTo("contact")} className="rounded-full shadow-lg font-semibold tracking-wide px-6">
              Book Consultation
            </Button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden text-gray-900 p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t py-6 px-6 flex flex-col space-y-2"
          >
            {navLinks.map((link) => (
              <button 
                key={link.id} 
                onClick={() => scrollTo(link.id)}
                className="text-left text-lg font-semibold text-gray-800 py-3 border-b border-gray-100 uppercase tracking-wider hover:text-primary"
              >
                {link.name}
              </button>
            ))}
            <Button onClick={() => scrollTo("contact")} className="w-full mt-6 py-6 text-lg rounded-xl">
              Book Consultation
            </Button>
          </motion.div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        
        {/* 2. Hero Section */}
        <section id="home" className="relative overflow-hidden min-h-screen flex items-center" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0faf0 40%, #E8F5E9 100%)' }}>
          {/* Decorative background blobs */}
          <motion.div
            className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-30 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #c8e6c9 0%, transparent 70%)' }}
            animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-20 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #a5d6a7 0%, transparent 70%)' }}
            animate={{ x: [0, -15, 0], y: [0, 15, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          {/* Dot grid pattern */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #2E7D32 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />

          <div className="container relative z-10 mx-auto px-4 md:px-6 pt-24 pb-12 md:pt-36 md:pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

              {/* LEFT: Text content — always first on all screen sizes */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="order-1"
              >
                {/* Tag */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white border border-green-200 shadow-sm mb-5 max-w-full">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0"></span>
                  <span className="text-[10px] md:text-xs font-bold tracking-[0.12em] md:tracking-[0.18em] text-green-700 uppercase leading-tight">North Bangalore Property Consultant</span>
                </div>

                {/* Headline */}
                <h1 className="text-[2.4rem] sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-1 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Don't Buy
                </h1>
                <h1 className="text-[2.4rem] sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-1" style={{ fontFamily: 'Poppins, sans-serif', color: '#2E7D32' }}>
                  Overpriced.
                </h1>
                <h1 className="text-[2.4rem] sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-5 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Don't Sell<br className="sm:hidden" /> Underpriced.
                </h1>

                <p className="text-base md:text-lg text-gray-600 mb-7 max-w-xl leading-relaxed">
                  I'll help you evaluate the right property value — whether you're buying or selling in North Bangalore. Expert guidance for the best deal, every time.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <Button
                    size="lg"
                    onClick={() => scrollTo("contact")}
                    className="rounded-full text-base h-13 px-7 shadow-lg font-bold"
                    style={{ background: '#2E7D32', color: '#fff' }}
                    data-testid="button-book-consultation-hero"
                  >
                    Book Free Consultation
                  </Button>
                  <a
                    href="tel:+919036727332"
                    className="inline-flex items-center justify-center gap-2 rounded-full text-base h-13 px-7 font-bold border-2 transition-all"
                    style={{ borderColor: '#2E7D32', color: '#2E7D32', background: 'white' }}
                    data-testid="link-call-now-hero"
                  >
                    <Phone className="h-5 w-5" /> Call Now
                  </a>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-2 pt-5 border-t border-green-100">
                  {[
                    { icon: <ShieldCheck className="h-4 w-4" />, label: 'Trusted Advisor' },
                    { icon: <CheckCircle className="h-4 w-4" />, label: 'Verified Projects' },
                    { icon: <Users className="h-4 w-4" />, label: 'End-to-End Assistance' },
                    { icon: <Target className="h-4 w-4" />, label: 'Local Market Expert' },
                  ].map((badge, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700"
                    >
                      <span className="text-green-600 shrink-0">{badge.icon}</span>
                      {badge.label}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* RIGHT: Balaji's photo — second on mobile */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
                className="order-2 flex justify-center lg:justify-end relative"
              >
                {/* Decorative card behind photo */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-60 h-60 sm:w-80 sm:h-80 md:w-[420px] md:h-[420px] rounded-[3rem] rotate-6 opacity-60" style={{ background: 'linear-gradient(135deg, #c8e6c9, #E8F5E9)' }} />
                </div>

                {/* Silver Award badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="absolute -top-5 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl px-3 py-2 flex items-center gap-2 z-20 border border-green-100 whitespace-nowrap"
                >
                  <div className="bg-yellow-50 rounded-xl p-1.5">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-400" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Silver Partner</div>
                    <div className="text-xs font-bold text-gray-900">Award Winner</div>
                  </div>
                </motion.div>

                {/* Phone badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                  className="absolute bottom-6 left-2 lg:-left-8 bg-white rounded-2xl shadow-xl px-3 py-2 flex items-center gap-2 z-20 border border-green-100"
                >
                  <div className="bg-green-50 rounded-xl p-1.5">
                    <Phone className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Call Directly</div>
                    <div className="text-xs font-bold text-gray-900">+91 90367 27332</div>
                  </div>
                </motion.div>

                {/* Main photo */}
                <motion.div
                  className="relative z-10 mt-6"
                  animate={{ y: [0, -14, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <img
                    src="/balaji-photo.png"
                    alt="Balaji R – North Bangalore Real Estate Advisor"
                    className="w-56 sm:w-72 md:w-[380px] lg:w-[440px] object-cover object-top rounded-[2.5rem] shadow-2xl border-4 border-white"
                    style={{ maxHeight: '480px' }}
                    data-testid="img-balaji-hero"
                  />
                  {/* Green accent line */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-1.5 rounded-full" style={{ background: '#2E7D32' }} />
                </motion.div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* 3. About Section */}
        <section id="about" className="py-24 md:py-32 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-[#F8FAFC] -skew-x-12 transform origin-top-right z-0"></div>

          <div className="container relative z-10 mx-auto px-4 md:px-6">

            {/* Two-column: text left, award right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

              {/* LEFT: Text + Stats */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
              >
                <h2 className="text-sm font-bold text-primary tracking-[0.2em] uppercase mb-4 flex items-center">
                  <span className="w-8 h-0.5 bg-primary mr-3"></span> About Balaji R
                </h2>
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                  Your Local North Bangalore Market Expert
                </h3>
                <div className="space-y-5 text-gray-600 text-lg leading-relaxed mb-10">
                  <p className="font-medium text-gray-800">
                    With deep roots in North Bangalore, I specialize in providing honest, transparent, and highly personalized real estate guidance.
                  </p>
                  <p>
                    Whether you are looking for your dream home or a high-ROI investment, my local expertise ensures you make the right choice. I focus strictly on verified, RERA-approved properties and provide end-to-end support — from initial site visits to legal documentation and final registration.
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50/80 p-4 rounded-2xl border border-gray-100 shadow-inner">
                  <Counter end={5} label="Years Exp." />
                  <Counter end={200} label="Happy Clients" />
                  <Counter end={100} label="Properties" />
                  <Counter end={95} suffix="%" label="Satisfaction" />
                </div>
              </motion.div>

              {/* RIGHT: Award photo only */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
                className="flex justify-center"
              >
                <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    src="/balaji-award2.jpeg"
                    alt="Balaji R – Silver Partner Award"
                    className="w-full object-cover"
                    data-testid="img-balaji-award"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 to-transparent px-5 py-5 flex items-center gap-3">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 shrink-0" />
                    <span className="text-white font-bold text-sm tracking-wide">
                      Silver Partner Award – Recognised for Outstanding Contribution
                    </span>
                  </div>
                </div>
              </motion.div>

            </div>

            {/* Authorised Channel Partner strip — full width below */}
            <motion.div
              className="mt-20"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-0.5 bg-primary shrink-0"></span>
                <p className="text-sm font-bold text-primary tracking-[0.18em] uppercase">Authorised Channel Partner</p>
                <span className="flex-1 h-0.5 bg-gray-100"></span>
              </div>
              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white py-6 px-2">
                <div className="flex gap-8 partner-scroll" style={{ width: 'max-content' }}>
                  {[
                    { name: "Prestige",    logo: "logos/prestige.png",    bg: "#fff" },
                    { name: "Sobha",       logo: "logos/sobha.png",       bg: "#F5E97A" },
                    { name: "Puravankara", logo: "logos/puravankara.png", bg: "#fff" },
                    { name: "Sattva",      logo: "logos/sattva.png",      bg: "#fff" },
                    { name: "Brigade",     logo: "logos/brigade.png",     bg: "#fff" },
                    { name: "TVS Emerald", logo: "logos/tvsemerald.png",  bg: "#fff" },
                    { name: "Century",     logo: "logos/century.png",     bg: "#fff" },
                    { name: "Embassy",     logo: "logos/embassy.png",     bg: "#fff" },
                    { name: "DNR",         logo: "logos/dnr.png",         bg: "#fff" },
                    { name: "Lodha",       logo: "logos/lodha.png",       bg: "#fff" },
                    { name: "Prestige",    logo: "logos/prestige.png",    bg: "#fff" },
                    { name: "Sobha",       logo: "logos/sobha.png",       bg: "#F5E97A" },
                    { name: "Puravankara", logo: "logos/puravankara.png", bg: "#fff" },
                    { name: "Sattva",      logo: "logos/sattva.png",      bg: "#fff" },
                    { name: "Brigade",     logo: "logos/brigade.png",     bg: "#fff" },
                    { name: "TVS Emerald", logo: "logos/tvsemerald.png",  bg: "#fff" },
                    { name: "Century",     logo: "logos/century.png",     bg: "#fff" },
                    { name: "Embassy",     logo: "logos/embassy.png",     bg: "#fff" },
                    { name: "DNR",         logo: "logos/dnr.png",         bg: "#fff" },
                    { name: "Lodha",       logo: "logos/lodha.png",       bg: "#fff" },
                  ].map((p, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-center px-6 py-3 rounded-xl border border-gray-100 shrink-0 shadow-sm"
                      style={{ background: p.bg, minWidth: 160, height: 72 }}
                    >
                      <img
                        src={`/${p.logo}`}
                        alt={p.name}
                        className={`w-auto object-contain ${p.name === 'Prestige' ? 'max-h-16 max-w-[160px]' : 'max-h-10 max-w-[140px]'}`}
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3 text-center tracking-wide">
                Authorised to sell projects by 10+ leading developers across North Bangalore
              </p>
            </motion.div>

          </div>
        </section>

        {/* 4. Services Section */}
        <section id="services" className="py-24 md:py-32 bg-[#F8FAFC]">
          <div className="container mx-auto px-4 md:px-6">
            <SectionHeading 
              subtitle="Comprehensive Solutions" 
              title="Real Estate Services" 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: <HomeIcon className="h-8 w-8" />, title: "Property Buying", desc: "Expert guidance to find the perfect home that matches your lifestyle and budget." },
                { icon: <Key className="h-8 w-8" />, title: "Property Selling", desc: "Strategic marketing and valuation to get the best price for your property." },
                { icon: <TrendingUp className="h-8 w-8" />, title: "Investment Advisory", desc: "Data-driven insights to identify high-growth plots and commercial investments." },
                { icon: <Map className="h-8 w-8" />, title: "Site Visit Coordination", desc: "Hassle-free scheduling and accompanied visits to shortlisted properties." },
                { icon: <FileText className="h-8 w-8" />, title: "Documentation Support", desc: "Complete assistance with legal checks, registration, and home loan processing." },
                { icon: <ShieldCheck className="h-8 w-8" />, title: "RERA Approved", desc: "Exclusive focus on verified, safe, and legally clear builder projects." }
              ].map((service, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="h-full border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group overflow-hidden bg-white rounded-2xl">
                    <CardContent className="p-6 md:p-10">
                      <div className="bg-[#E8F5E9] w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-primary mb-5 md:mb-8 group-hover:bg-primary group-hover:text-white transition-colors duration-300 transform group-hover:scale-110">
                        {service.icon}
                      </div>
                      <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">{service.title}</h4>
                      <p className="text-gray-600 text-base md:text-lg leading-relaxed">{service.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Areas Section */}
        <section id="areas" className="py-24 md:py-32 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-16 gap-5 md:gap-8"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="max-w-2xl">
                <h2 className="text-sm font-bold text-primary tracking-[0.2em] uppercase mb-3 flex items-center">
                  <span className="w-8 h-0.5 bg-primary mr-3"></span> Prime Locations
                </h2>
                <h3 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">North Bangalore Hubs</h3>
                <p className="text-gray-600 text-lg md:text-xl">The fastest growing corridor in the city, offering excellent connectivity to the airport and major IT parks.</p>
              </div>
              <Button onClick={() => scrollTo("contact")} className="shrink-0 rounded-full font-bold px-8 h-14 text-lg">
                Explore Properties <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "Yelahanka", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80" },
                { name: "Devanahalli", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80" },
                { name: "Hebbal", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80" },
                { name: "Thanisandra", img: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80" },
                { name: "Hennur", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80" },
                { name: "Kogilu", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80" },
                { name: "Jakkur", img: "https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&q=80" },
                { name: "Bagalur", img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80" }
              ].map((area, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="group relative overflow-hidden rounded-3xl h-56 sm:h-72 cursor-pointer shadow-lg"
                >
                  <div className="absolute inset-0 bg-gray-900">
                    <img src={area.img} alt={area.name} className="w-full h-full object-cover opacity-70 group-hover:scale-110 group-hover:opacity-50 transition-all duration-700 ease-in-out" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 w-full p-8 transform transition-transform duration-300">
                    <h4 className="text-2xl font-bold text-white mb-2 flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-primary" /> {area.name}
                    </h4>
                    <p className="text-green-300 text-sm font-bold tracking-wider uppercase transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      High ROI • Great Connectivity
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Why Choose Balaji R */}
        <section className="py-24 md:py-32 bg-[#F8FAFC]">
          <div className="container mx-auto px-4 md:px-6">
            <SectionHeading 
              subtitle="The Balaji Advantage" 
              title="Why Choose Balaji R" 
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: <MapPin />, title: "Local Market Expertise", desc: "Deep knowledge of North Bangalore micro-markets and upcoming infrastructure." },
                { icon: <MessageCircle />, title: "Transparent Advice", desc: "Clear, honest communication about property pros, cons, and actual pricing." },
                { icon: <ShieldCheck />, title: "Verified Options", desc: "Every property goes through strict legal and title verification before suggestion." },
                { icon: <Users />, title: "Personalized Service", desc: "Dedicated 1-on-1 support tailored to your family's specific needs and lifestyle." },
                { icon: <Building />, title: "Strong Builder Network", desc: "Direct access to top developers for priority allocations and best pricing." },
                { icon: <Target />, title: "Investment-Focused", desc: "Strategic guidance to maximize rental yields and capital appreciation." }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -6, scale: 1.02, boxShadow: "0 12px 32px rgba(46,125,50,0.12)" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex items-start gap-4 p-6 rounded-2xl bg-white shadow-sm border border-gray-100 cursor-default"
                >
                  <div className="bg-[#E8F5E9] p-4 rounded-full text-primary shrink-0">
                    {React.cloneElement(feature.icon as React.ReactElement, { className: "h-6 w-6" })}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Testimonials */}
        <section id="testimonials" className="py-24 md:py-32 bg-white relative">
          <div className="container mx-auto px-4 md:px-6">
            <SectionHeading
              subtitle="Client Success Stories"
              title="Real Google Reviews"
            />
            {/* Google rating summary */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 bg-[#F8FAFC] rounded-2xl px-6 py-5 max-w-lg mx-auto border border-gray-100 shadow-sm"
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <img src="https://www.google.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg" alt="Google" className="h-6 object-contain" />
              <div className="flex items-center gap-2">
                <span className="text-3xl font-extrabold text-gray-900">5.0</span>
                <div className="flex text-yellow-400">
                  {[1,2,3,4,5].map(s => <Star key={s} className="h-5 w-5 fill-current" />)}
                </div>
                <span className="text-gray-500 text-sm font-medium">(5 reviews)</span>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  name: "Babu V",
                  time: "8 months ago",
                  role: "Plot Buyer",
                  text: "Balaji is giving good service on north Bangalore. I have taken one plot from his reference. Thanks Balaji, God bless you.",
                  initials: "B"
                },
                {
                  name: "Theju",
                  time: "6 months ago",
                  role: "Property Buyer",
                  text: "Good service. Very helpful and professional throughout the entire process.",
                  initials: "T"
                },
                {
                  name: "Chandra Achar",
                  time: "8 months ago",
                  role: "Verified Buyer",
                  text: "Excellent and trustworthy real estate advisor in North Bangalore. Highly recommended for anyone looking for the right property.",
                  initials: "C"
                }
              ].map((review, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="h-full"
                >
                  <Card className="h-full border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 rounded-3xl bg-white group">
                    <CardContent className="p-7 md:p-8 flex flex-col h-full">
                      {/* Header: avatar + name + Google logo */}
                      <div className="flex items-start justify-between mb-5">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 rounded-full bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0">
                            {review.initials}
                          </div>
                          <div>
                            <h5 className="font-bold text-gray-900 text-base leading-tight">{review.name}</h5>
                            <p className="text-xs text-gray-400 mt-0.5">{review.time}</p>
                          </div>
                        </div>
                        <img src="https://www.google.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg" alt="Google Review" className="h-4 object-contain opacity-60 mt-1" />
                      </div>
                      {/* Stars */}
                      <div className="flex text-yellow-400 mb-4">
                        {[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4 fill-current" />)}
                      </div>
                      {/* Review text */}
                      <p className="text-gray-600 text-base leading-relaxed flex-grow">
                        "{review.text}"
                      </p>
                      {/* Footer */}
                      <div className="flex items-center gap-2 border-t border-gray-100 pt-5 mt-5">
                        <BadgeCheck className="h-4 w-4 text-green-600 shrink-0" />
                        <span className="text-xs font-semibold text-green-700 uppercase tracking-wider">{review.role}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* View all on Google */}
            <div className="text-center mt-10">
              <a
                href="https://share.google/iWmTqNNrZMRs4Xpvk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                data-testid="link-google-reviews"
              >
                <Star className="h-4 w-4 fill-primary" />
                View all reviews on Google
              </a>
            </div>
          </div>
        </section>

        {/* 8. Lead Capture CTA */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary"></div>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
          <div className="container relative z-10 mx-auto px-4 md:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 md:mb-6 leading-tight">Looking for Property in North Bangalore?</h2>
              <p className="text-green-50 text-base md:text-xl mb-8 md:mb-10 max-w-2xl mx-auto">Get exclusive access to pre-launch offers, prime locations, and expert negotiation assistance.</p>
              <motion.div
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block"
              >
                <Button size="lg" onClick={() => scrollTo("contact")} className="bg-white text-primary hover:bg-gray-100 rounded-full text-base md:text-xl h-14 md:h-16 px-8 md:px-12 shadow-2xl font-bold">
                  Book Free Consultation
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 9. Contact Section */}
        <section id="contact" className="py-24 md:py-32 bg-white relative">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-sm font-bold text-primary tracking-[0.2em] uppercase mb-4 flex items-center">
                  <span className="w-8 h-0.5 bg-primary mr-3"></span> Get In Touch
                </h2>
                <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">Let's Find Your Perfect Property</h3>
                <p className="text-gray-600 text-base md:text-xl mb-8 md:mb-12 leading-relaxed">
                  Whether you're looking to buy a home, invest in a plot, or sell your property, I'm here to help. Schedule a free consultation today.
                </p>

                <div className="space-y-5 md:space-y-8">
                  <div className="flex items-center group">
                    <div className="bg-[#E8F5E9] p-3 md:p-5 rounded-2xl mr-4 md:mr-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300 shrink-0">
                      <Phone className="h-6 w-6 md:h-8 md:w-8 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Call / WhatsApp</h4>
                      <p className="text-xl md:text-2xl font-bold text-gray-900">+91 90367 27332</p>
                    </div>
                  </div>
                  <div className="flex items-center group">
                    <div className="bg-[#E8F5E9] p-3 md:p-5 rounded-2xl mr-4 md:mr-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300 shrink-0">
                      <Mail className="h-6 w-6 md:h-8 md:w-8 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Email</h4>
                      <p className="text-base md:text-xl font-bold text-gray-900 break-all">balajir.properties@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-start group">
                    <div className="bg-[#E8F5E9] p-3 md:p-5 rounded-2xl mr-4 md:mr-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300 shrink-0">
                      <MapPin className="h-6 w-6 md:h-8 md:w-8 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Office Location</h4>
                      <p className="text-base md:text-xl font-bold text-gray-900">Hebbal Kempapura, North Bangalore</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Form */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-[2rem] shadow-2xl p-6 md:p-12 border border-gray-100"
              >
                <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">Send an Inquiry</h4>
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Full Name</label>
                    <Input required placeholder="John Doe" className="h-14 bg-gray-50 border-gray-200 text-lg rounded-xl focus-visible:ring-primary" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Phone Number</label>
                    <Input required type="tel" placeholder="+91 XXXXX XXXXX" className="h-14 bg-gray-50 border-gray-200 text-lg rounded-xl focus-visible:ring-primary" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Requirement</label>
                    <Select required>
                      <SelectTrigger className="h-14 bg-gray-50 border-gray-200 text-lg rounded-xl focus-visible:ring-primary">
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buy-apt">Buy Apartment/Villa</SelectItem>
                        <SelectItem value="buy-plot">Buy Plot/Land</SelectItem>
                        <SelectItem value="sell">Sell Property</SelectItem>
                        <SelectItem value="invest">Investment Advisory</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Message</label>
                    <Textarea placeholder="How can I help you?" className="min-h-[150px] bg-gray-50 border-gray-200 resize-none text-lg rounded-xl focus-visible:ring-primary" />
                  </div>
                  <Button type="submit" className="w-full h-16 text-xl rounded-xl shadow-lg font-bold">
                    Send Inquiry
                  </Button>
                </form>
              </motion.div>

            </div>
          </div>
        </section>

        {/* Map Section */}
        <section id="map" className="relative">
          <div className="bg-[#F8FAFC] py-12 px-4 md:px-6 text-center">
            <h2 className="text-sm font-bold text-primary tracking-[0.2em] uppercase mb-3 flex items-center justify-center gap-2">
              <MapPin className="h-4 w-4" /> Find Us
            </h2>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
              Hebbal Kempapura, North Bangalore
            </h3>
            <p className="text-gray-500 mt-2 text-base">No:16, 14th A Cross, Dasarahalli Main Rd, Bhuvaneswari Nagar, Hebbal, Bengaluru – 560024</p>
          </div>
          <div className="w-full h-[420px] md:h-[500px]">
            <iframe
              title="Balaji R North Bangalore Location"
              src="https://maps.google.com/maps?q=Balaji+R+North+Bangalore,+Hebbal+Kempapura,+Bengaluru&output=embed&z=15"
              width="100%"
              height="100%"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              data-testid="iframe-google-map"
            />
          </div>
          <div className="bg-[#F8FAFC] py-6 text-center">
            <a
              href="https://share.google/iWmTqNNrZMRs4Xpvk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary font-bold hover:underline text-base"
              data-testid="link-open-google-maps"
            >
              <MapPin className="h-4 w-4" />
              Open in Google Maps
            </a>
          </div>
        </section>

      </main>

      {/* 10. Footer */}
      <footer className="bg-gray-900 text-white pt-14 md:pt-20 pb-10 border-t border-gray-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 mb-12 md:mb-16">
            <div>
              <div className="flex items-center mb-5 cursor-pointer" onClick={() => scrollTo("home")}>
                <img src={logoUrl} alt="Balaji R Logo" className="h-16 w-16 md:h-20 md:w-20 rounded-full object-cover mr-3 md:mr-4 border-2 border-white/20" />
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white">BALAJI R</h3>
                  <p className="text-primary text-xs md:text-sm font-bold tracking-widest uppercase mt-1">Real Estate Advisor</p>
                </div>
              </div>
              <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-sm mt-4 md:mt-6">
                Your Trusted Property Partner. Buying, Selling & Investing in North Bangalore with transparency and expertise.
              </p>
              <div className="flex gap-4 mt-6">
                <a href="https://www.instagram.com/balajirnorthbangalore?utm_source=qr" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-pink-600 text-gray-400 hover:text-white p-3 rounded-full transition-colors duration-300">
                  <SiInstagram className="h-5 w-5" />
                </a>
                <a href="https://www.facebook.com/share/r/14f47SkrXSg/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-blue-600 text-gray-400 hover:text-white p-3 rounded-full transition-colors duration-300">
                  <SiFacebook className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg md:text-xl font-bold mb-6 md:mb-8 text-white border-b border-gray-800 pb-3 md:pb-4 inline-block uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-3 md:space-y-4">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <button onClick={() => scrollTo(link.id)} className="text-gray-400 hover:text-primary transition-colors text-left text-base md:text-lg font-medium">
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg md:text-xl font-bold mb-6 md:mb-8 text-white border-b border-gray-800 pb-3 md:pb-4 inline-block uppercase tracking-wider">Contact Info</h4>
              <ul className="space-y-4 md:space-y-6 text-gray-400 text-base md:text-lg">
                <li className="flex items-center hover:text-white transition-colors gap-3"><Phone className="h-5 w-5 md:h-6 md:w-6 shrink-0 text-primary" /> <a href="tel:+919036727332">+91 90367 27332</a></li>
                <li className="flex items-start hover:text-white transition-colors gap-3 min-w-0"><Mail className="h-5 w-5 md:h-6 md:w-6 shrink-0 text-primary mt-0.5" /> <a href="mailto:balajir.properties@gmail.com" className="break-all text-sm md:text-base">balajir.properties@gmail.com</a></li>
                <li className="flex items-start gap-3"><MapPin className="h-5 w-5 md:h-6 md:w-6 shrink-0 text-primary mt-0.5" /> <span className="text-sm md:text-base">Hebbal Kempapura,<br/>North Bangalore, India</span></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-6 md:pt-8 border-t border-gray-800 text-center text-gray-500 flex flex-col md:flex-row justify-between items-center text-xs md:text-sm font-medium gap-2">
            <p>&copy; 2026 Balaji R. All Rights Reserved.</p>
            <p>North Bangalore's Premium Real Estate Consultancy</p>
          </div>
        </div>
      </footer>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
        <motion.a
          href="tel:+919036727332"
          className="bg-gray-900 text-white p-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.18)] flex items-center justify-center border-2 border-white"
          aria-label="Call Now"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 20 }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.92 }}
          data-testid="link-float-call"
        >
          <Phone className="h-7 w-7" />
        </motion.a>
        <motion.a
          href="https://wa.me/919036727332?text=Hi%20Balaji%2C%20I%20am%20interested%20in%20a%20property%20consultation%20in%20North%20Bangalore.%20Please%20get%20in%20touch."
          target="_blank"
          rel="noopener noreferrer"
          className="relative bg-[#25D366] text-white p-4 rounded-full shadow-[0_8px_30px_rgba(37,211,102,0.4)] flex items-center justify-center border-2 border-white"
          aria-label="WhatsApp"
          data-testid="link-float-whatsapp"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: [0, 1.15, 1] }}
          transition={{ delay: 1.5, duration: 0.5, type: "spring" }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.92 }}
        >
          {/* Pulse ring */}
          <motion.span
            className="absolute w-14 h-14 rounded-full bg-[#25D366] opacity-40"
            animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
          <SiWhatsapp className="h-7 w-7 relative z-10" />
        </motion.a>
      </div>

    </div>
  );
}
