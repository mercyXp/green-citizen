import { Button } from '@/app/components/ui/button';
import { ArrowRight } from 'lucide-react';

function CTA() {
  return (
    <section className="relative px-4 sm:px-6 py-16 sm:py-24 bg-gradient-to-r from-primary to-primary-dark text-white overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
          Be part of measurable climate action
        </h2>

        <p className="text-lg text-white/90 mb-10">
          Whether you're taking action on the ground or supporting it through policy, funding, or education — GreenCitizen connects effort to evidence.
        </p>

        <Button className="bg-white text-primary hover:bg-white/90">
          Get Started
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}

export default CTA;