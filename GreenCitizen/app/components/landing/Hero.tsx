import { Button } from '@/app/components/ui/button';
import { Leaf, ArrowRight } from 'lucide-react';

function Hero() {
  return (
    <section className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 -z-10" />
      
      <div className="max-w-5xl mx-auto">
        {/* Logo/Badge */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Leaf className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold text-primary">GreenCitizen</span>
        </div>

        {/* Main headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center text-primary mb-6 leading-tight">
          Climate action you can see, measure, and trust.
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-center text-secondary max-w-3xl mx-auto mb-10">
          GreenCitizen helps communities log real environmental actions and helps organizations understand their impact through transparent, privacy-first data.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          <Button className="w-full sm:w-auto bg-primary text-white hover:bg-primary-dark">
            Join as a Citizen
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" className="w-full sm:w-auto border-secondary text-secondary hover:bg-secondary/10">
            Partner With Us
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Trust badge */}
        <div className="mt-12 text-center text-xs sm:text-sm text-tertiary">
          No data extraction. No hidden fees. Just transparent impact.
        </div>
      </div>
    </section>
  );
}

export default Hero;