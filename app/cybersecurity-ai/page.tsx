'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Shield, 
  Cpu, 
  AlertTriangle, 
  Activity,
  Zap,
  Eye,
  Lock,
  Search,
  TrendingUp,
  Globe,
  Server,
  Database,
  Code,
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  Mail
} from 'lucide-react';
import { MatrixBackground } from '@/components/matrix-background';
import { GlitchText } from '@/components/glitch-text';

export default function CybersecurityAIPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [threatsDetected, setThreatsDetected] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  const startThreatScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setThreatsDetected(0);
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setThreatsDetected(Math.floor(Math.random() * 5) + 1);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const aiCapabilities = [
    {
      title: "Threat Detection",
      description: "AI-powered real-time threat identification and classification",
      icon: <AlertTriangle className="h-6 w-6" />,
      color: "text-red-500",
      features: ["Malware Detection", "Anomaly Recognition", "Behavioral Analysis"]
    },
    {
      title: "Predictive Analytics",
      description: "Machine learning models for predicting security incidents",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "text-blue-500",
      features: ["Risk Assessment", "Vulnerability Prediction", "Attack Forecasting"]
    },
    {
      title: "Automated Response",
      description: "Intelligent incident response and remediation systems",
      icon: <Zap className="h-6 w-6" />,
      color: "text-yellow-500",
      features: ["Auto-Remediation", "Incident Classification", "Response Orchestration"]
    },
    {
      title: "Network Security",
      description: "AI-driven network monitoring and intrusion detection",
      icon: <Globe className="h-6 w-6" />,
      color: "text-green-500",
      features: ["Traffic Analysis", "Intrusion Detection", "Network Segmentation"]
    }
  ];

  const demoScenarios = [
    {
      id: "malware-detection",
      title: "Malware Detection Demo",
      description: "Watch AI identify and quarantine malicious software in real-time",
      icon: <Shield className="h-5 w-5" />,
      status: "Ready"
    },
    {
      id: "phishing-prevention",
      title: "Phishing Prevention",
      description: "AI analysis of suspicious emails and websites",
      icon: <Eye className="h-5 w-5" />,
      status: "Active"
    },
    {
      id: "network-analysis",
      title: "Network Traffic Analysis",
      description: "Real-time monitoring of network anomalies",
      icon: <Activity className="h-5 w-5" />,
      status: "Running"
    },
    {
      id: "vulnerability-scan",
      title: "Vulnerability Scanner",
      description: "AI-powered security assessment tool",
      icon: <Search className="h-5 w-5" />,
      status: "Ready"
    }
  ];

  const microsoftSkills = [
    {
      title: "Microsoft Azure Security Center",
      description: "Advanced threat protection across hybrid cloud environments",
      icon: <Server className="h-5 w-5" />,
      features: ["Advanced Threat Protection", "Security Posture Management", "Compliance Monitoring"]
    },
    {
      title: "Microsoft Entra ID Protection",
      description: "AI-driven identity and access management security",
      icon: <Lock className="h-5 w-5" />,
      features: ["Risk-Based Authentication", "Identity Protection", "Access Control"]
    },
    {
      title: "Microsoft Loop Security",
      description: "Collaborative workspace security with AI monitoring",
      icon: <Database className="h-5 w-5" />,
      features: ["Content Security", "Collaboration Monitoring", "Data Loss Prevention"]
    },
    {
      title: "Microsoft Admin Center",
      description: "Unified administration portal with security integration",
      icon: <Code className="h-5 w-5" />,
      features: ["User Management", "Policy Deployment", "Security Monitoring"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white relative overflow-hidden">
      <MatrixBackground />
      
      {/* Header */}
      <header className="container mx-auto py-6 relative z-10">
        <nav className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-16 h-16">
              <img
                src="/images/logo-green.png"
                alt="Goodnbad.exe Logo"
                width={64}
                height={64}
                className="rounded-full"
              />
            </div>
            <GlitchText text="Goodnbad.exe" className="font-bold text-xl" />
          </Link>
          
          <Button variant="outline" className="border-emerald-500 text-emerald-500 hover:bg-emerald-500/20" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Portfolio
            </Link>
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto py-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <Brain className="w-4 h-4 mr-2" /> Cybersecurity AI
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <GlitchText text="AI-Powered Cybersecurity" />
          </h1>
          
          <p className="text-xl text-zinc-300 mb-8 leading-relaxed">
            Leveraging artificial intelligence and machine learning to revolutionize cybersecurity. 
            Experience next-generation threat detection, predictive analytics, and automated response systems.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700 text-white group"
              onClick={startThreatScan}
              disabled={isScanning}
            >
              {isScanning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Scanning... {scanProgress}%
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  Start AI Threat Scan
                </>
              )}
            </Button>
            
            <Button size="lg" variant="outline" className="border-emerald-500 text-emerald-500 hover:bg-emerald-500/20">
              <Brain className="mr-2 h-4 w-4" />
              Explore AI Models
            </Button>
          </div>
          
          {threatsDetected > 0 && (
            <div className="mt-8 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-red-400">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-semibold">{threatsDetected} Potential Threats Detected!</span>
              </div>
              <p className="text-sm text-zinc-300 mt-2">
                AI analysis complete. Review detailed threat intelligence below.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* AI Capabilities Section */}
      <section className="container mx-auto py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <GlitchText text="AI Security Capabilities" />
            </h2>
            <p className="text-zinc-400 text-lg">
              Advanced artificial intelligence systems designed to protect your digital assets
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aiCapabilities.map((capability, index) => (
              <Card key={index} className="bg-zinc-800/50 border-zinc-700 hover:border-purple-500/50 transition-all duration-300 group">
                <CardHeader>
                  <div className={`${capability.color} mb-3 group-hover:scale-110 transition-transform`}>
                    {capability.icon}
                  </div>
                  <CardTitle className="text-white group-hover:text-purple-400 transition-colors">
                    {capability.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-zinc-400 mb-4">
                    {capability.description}
                  </CardDescription>
                  <div className="space-y-2">
                    {capability.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-zinc-300">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demos Section */}
      <section className="container mx-auto py-20 px-4 relative z-10 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <GlitchText text="Interactive AI Demos" />
            </h2>
            <p className="text-zinc-400 text-lg">
              Experience our AI cybersecurity tools in action
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {demoScenarios.map((demo, index) => (
              <Card key={index} className="bg-zinc-800/50 border-zinc-700 hover:border-emerald-500/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-emerald-500">
                      {demo.icon}
                    </div>
                    <Badge className={
                      demo.status === 'Ready' ? 'bg-green-500/20 text-green-400' :
                      demo.status === 'Active' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }>
                      {demo.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-white">{demo.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-zinc-400 mb-4">
                    {demo.description}
                  </CardDescription>
                  <Button 
                    variant="outline" 
                    className="border-emerald-500 text-emerald-500 hover:bg-emerald-500/20 w-full"
                    onClick={() => setActiveDemo(activeDemo === demo.id ? null : demo.id)}
                  >
                    {activeDemo === demo.id ? (
                      <>
                        <Pause className="mr-2 h-4 w-4" />
                        Stop Demo
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Start Demo
                      </>
                    )}
                  </Button>
                  
                  {activeDemo === demo.id && (
                    <div className="mt-4 p-4 bg-black/50 rounded-lg border border-emerald-500/30">
                      <div className="flex items-center gap-2 text-emerald-400 mb-2">
                        <div className="animate-pulse w-2 h-2 bg-emerald-500 rounded-full" />
                        <span className="text-sm font-mono">AI Analysis Running...</span>
                      </div>
                      <div className="text-xs text-zinc-300 font-mono space-y-1">
                        <div>• Scanning network traffic patterns...</div>
                        <div>• Analyzing behavioral anomalies...</div>
                        <div>• Cross-referencing threat databases...</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Microsoft AI Skills Section */}
      <section className="container mx-auto py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <GlitchText text="Microsoft AI Skills" />
            </h2>
            <p className="text-zinc-400 text-lg">
              Advanced cybersecurity skills with Microsoft AI technologies
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {microsoftSkills.map((skill, index) => (
              <Card key={index} className="bg-zinc-800/50 border-zinc-700 hover:border-blue-500/50 transition-all duration-300 group">
                <CardHeader>
                  <div className="text-blue-500 mb-3 group-hover:scale-110 transition-transform">
                    {skill.icon}
                  </div>
                  <CardTitle className="text-white group-hover:text-blue-400 transition-colors">
                    {skill.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-zinc-400 mb-4">
                    {skill.description}
                  </CardDescription>
                  <div className="space-y-3">
                    {skill.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm text-zinc-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white group">
              <Shield className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              Explore Microsoft Security Suite
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto py-20 px-4 relative z-10 bg-gradient-to-r from-purple-900/30 to-emerald-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <GlitchText text="Ready to Secure Your Future?" />
          </h2>
          <p className="text-xl text-zinc-300 mb-8">
            Let's discuss how AI-powered cybersecurity can protect your organization 
            and stay ahead of emerging threats.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-black" asChild>
              <Link href="mailto:alramli.hamzah@gmail.com">
                <Mail className="mr-2 h-4 w-4" />
                Contact for Consultation
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-purple-500 text-purple-500 hover:bg-purple-500/20" asChild>
              <Link href="/security">
                <ArrowRight className="mr-2 h-4 w-4" />
                View Security Atlas
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900/80 py-12 border-t border-zinc-800 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="relative w-16 h-16">
                <img
                  src="/images/logo-green.png"
                  alt="Goodnbad.exe Logo"
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              </div>
              <GlitchText text="Goodnbad.exe" className="font-bold text-xl" />
            </div>
            <div className="text-zinc-400 text-sm">
              © {new Date().getFullYear()} Hamzah Al-Ramli. AI-powered cybersecurity solutions.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}