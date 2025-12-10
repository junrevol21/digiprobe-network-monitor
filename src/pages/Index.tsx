import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Activity, ArrowRight, Wifi, Map, BarChart3, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppFooter } from '@/components/layout/AppFooter';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const features = [
    {
      icon: Wifi,
      title: 'Network Detection',
      description: 'Auto-detect ISP and connection details',
    },
    {
      icon: BarChart3,
      title: 'Speed Testing',
      description: 'Measure ping, download, upload & MOS',
    },
    {
      icon: Map,
      title: 'Drive Testing',
      description: 'Map network quality across locations',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero Section */}
      <div className="hero-gradient text-primary-foreground px-4 py-16 text-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-64 h-64 bg-white/5 rounded-full -top-32 -left-32 animate-pulse-slow" />
          <div className="absolute w-48 h-48 bg-white/5 rounded-full -bottom-24 -right-24 animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 bg-primary-foreground/10 rounded-2xl backdrop-blur-sm shadow-glow">
              <Activity className="w-10 h-10" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-3">DigiProbe</h1>
          <p className="text-base text-primary-foreground/80 mb-2">Network Quality Monitoring</p>
          <p className="text-xs text-primary-foreground/60 max-w-xs mx-auto">
            Professional QoE monitoring tool for network quality assessment
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="flex-1 px-4 py-8 -mt-6 relative z-10">
        <div className="max-w-md mx-auto space-y-4">
          {/* Feature Cards */}
          <div className="grid gap-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="card-glass p-4 rounded-xl flex items-center gap-4 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-2.5 rounded-lg bg-primary/10">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Button
            onClick={() => navigate('/auth')}
            className="w-full btn-gradient h-14 text-base gap-2 mt-6"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Button>

          {/* Badge */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-komdigi-red" />
              <div className="w-2 h-2 rounded-full bg-komdigi-yellow" />
              <div className="w-2 h-2 rounded-full bg-primary" />
            </div>
            <p className="text-xs text-muted-foreground">
              by QoS Task Force Balmon Jogja
            </p>
          </div>
        </div>
      </div>

      <AppFooter />
    </div>
  );
};

export default Index;
