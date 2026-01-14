import Image from "next/image";
import Link from "next/link";


// import { Geist, Geist_Mono } from "next/font/google";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export default function Home() {
//   return (
//     <div>
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
//         <h1 className="text-4xl font-bold mb-4 text-center">AI-Powered Resume Analyzer</h1>
//         <p className="text-lg text-center mb-8 max-w-2xl">
//           Welcome to the AI-Powered Resume Analyzer! Upload your resume to get personalized job matches and career advice powered by advanced AI models.
//         </p>

//         <Link href="/auth/sign-in" className="text-blue-500">
//           Get Started
//         </Link>
//       </div>
//     </div>
//   );
// }



import { useState, useEffect } from 'react';
// import Link from 'next/link';
import { 
  Sparkles, 
  Upload, 
  Brain, 
  Target, 
  Zap, 
  Shield, 
  Users, 
  BarChart3,
  ChevronRight,
  CheckCircle,
  Star,
  Globe,
  Cpu,
  Lock,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  Menu,
  X,
  CloudUpload
} from 'lucide-react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Analysis",
      description: "Advanced Gemini AI analyzes your resume for keywords, skills, and experience gaps",
      color: "from-cyan-400 to-blue-500"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Smart Job Matching",
      description: "Get personalized job recommendations based on your profile and market trends",
      color: "from-purple-400 to-pink-500"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Career Insights",
      description: "Visual analytics showing your strengths, weaknesses, and career trajectory",
      color: "from-green-400 to-emerald-500"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Enterprise-grade security with encrypted storage and GDPR compliance",
      color: "from-orange-400 to-red-500"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-time Feedback",
      description: "Instant analysis and suggestions to improve your resume immediately",
      color: "from-yellow-400 to-amber-500"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Industry Benchmarks",
      description: "Compare your profile with industry standards and top performers",
      color: "from-indigo-400 to-purple-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Senior Developer @ Google",
      content: "The AI analysis helped me identify key skills I was missing. Landed 3 interviews in 2 weeks!",
      avatar: "SC"
    },
    {
      name: "Marcus Rodriguez",
      role: "Product Manager",
      content: "Revolutionary tool! The career path suggestions were spot-on for my transition into tech.",
      avatar: "MR"
    },
    {
      name: "Jessica Park",
      role: "Data Scientist",
      content: "The ATS score prediction feature alone is worth it. My resume passes every scanner now.",
      avatar: "JP"
    }
  ];

  const stats = [
    { value: "98%", label: "User Satisfaction", icon: <Star className="w-5 h-5" /> },
    { value: "3.2x", label: "More Interviews", icon: <TrendingUp className="w-5 h-5" /> },
    { value: "50K+", label: "Resumes Analyzed", icon: <CloudUpload className="w-5 h-5" /> },
    { value: "24/7", label: "AI Assistant", icon: <Cpu className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm">Powered by Google Gemini AI</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Supercharge Your Career
              </span>
              <br />
              <span className="text-white">with AI Resume Analysis</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Upload your resume and get instant AI-powered feedback, job matching, and personalized career guidance. 
              Join thousands who've transformed their job search.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link 
                href="/dashboard" 
                className="group px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40 flex items-center justify-center space-x-3 text-lg font-semibold"
              >
                <Upload className="w-6 h-6" />
                <span>Analyze My Resume</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="#how-it-works" 
                className="px-8 py-4 rounded-xl border border-cyan-500/30 hover:bg-cyan-500/10 transition-all"
              >
                See How It Works
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-4 rounded-xl bg-white/5 border border-cyan-500/10 hover:border-cyan-500/30 transition-all">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    {stat.icon}
                    <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                  </div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto">
              Everything you need to optimize your resume and accelerate your career growth
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-black/50 border border-cyan-500/10 hover:border-cyan-500/30 transition-all hover:shadow-2xl hover:shadow-cyan-500/10"
              >
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 mb-4">{feature.description}</p>
                <div className="flex items-center text-cyan-400 group-hover:text-cyan-300 transition-colors">
                  <span className="text-sm">Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-gradient-to-b from-transparent to-black/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Upload Resume", desc: "Drag & drop your resume in any format (PDF, DOC, TXT)" },
              { step: "02", title: "AI Analysis", desc: "Our AI scans and analyzes every aspect of your resume" },
              { step: "03", title: "Get Insights", desc: "Receive detailed feedback and actionable recommendations" }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-900/50 to-black/50 border border-purple-500/10">
                  <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-gray-400">{step.desc}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 text-purple-400">
                    <ChevronRight className="w-8 h-8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Trusted by Professionals
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="p-8 rounded-2xl bg-gradient-to-br from-gray-900/50 to-black/50 border border-emerald-500/10 hover:border-emerald-500/30 transition-all"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">"{testimonial.content}"</p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-8 rounded-3xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join 50,000+ professionals who've accelerated their job search with AI
            </p>
            <Link 
              href="/dashboard" 
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40 text-lg font-semibold space-x-3"
            >
              <Sparkles className="w-6 h-6" />
              <span>Start Free Analysis</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-gray-500 text-sm mt-4">
              No credit card required • 10 free analyses per month
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg">
                <Brain className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                ResumAI
              </span>
            </div>
            
            <div className="flex items-center space-x-6 text-gray-400">
              <a href="#" className="hover:text-cyan-400">Privacy Policy</a>
              <a href="#" className="hover:text-cyan-400">Terms of Service</a>
              <a href="#" className="hover:text-cyan-400">Contact</a>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>English</span>
              </div>
            </div>
          </div>
          
          <div className="text-center text-gray-500 text-sm mt-8 pt-8 border-t border-gray-800">
            © 2024 ResumAI. All rights reserved. Powered by Google Gemini AI.
          </div>
        </div>
      </footer>
    </div>
  );
}