import { Leaf, Lock, Award, Map } from 'lucide-react';

const features = [
  {
    icon: Leaf,
    title: 'Log Actions Easily',
    description: 'Record environmental actions with photos or videos as proof',
  },
  {
    icon: Award,
    title: 'Earn Recognition',
    description: 'Get points and badges for verified climate impact',
  },
  {
    icon: Lock,
    title: 'Control Your Data',
    description: 'Choose what\'s public, anonymous, or private',
  },
  {
    icon: Map,
    title: 'See Your Impact',
    description: 'Discover how your district contributes to climate action',
  },
];

function ForCitizens() {
  return (
    <section className="px-4 sm:px-6 py-16 sm:py-24 bg-bg-secondary">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
            For everyday citizens
          </h2>
          <p className="text-lg text-secondary max-w-2xl">
            GreenCitizen is built for people already taking action — planting trees, conserving water, cleaning communities, and caring for the environment.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="p-6 bg-bg-primary rounded-2xl border border-border-primary hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <Icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-secondary text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ForCitizens;