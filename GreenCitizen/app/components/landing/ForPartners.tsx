import { BarChart3, TrendingUp, Shield, FileDown } from 'lucide-react';

const partnerFeatures = [
  {
    icon: BarChart3,
    title: 'District-Level Analytics',
    description: 'Aggregated action summaries by geographic area',
  },
  {
    icon: TrendingUp,
    title: 'Trend Analysis',
    description: 'Insights by action type and time period',
  },
  {
    icon: Shield,
    title: 'Verified Data',
    description: 'Verification rates and participation metrics',
  },
  {
    icon: FileDown,
    title: 'Export Reports',
    description: 'Download data for reports and funding proposals',
  },
];

function ForPartners() {
  return (
    <section className="px-4 sm:px-6 py-16 sm:py-24 bg-bg-primary">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
            For NGOs, schools, and funders
          </h2>
          <p className="text-lg text-secondary max-w-3xl">
            Access aggregated, privacy-respecting climate action data to support programs, funding decisions, and reporting — without extracting from communities.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {partnerFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="p-6 bg-bg-secondary rounded-2xl border border-border-primary hover:border-secondary/50 hover:shadow-lg transition-all"
              >
                <Icon className="h-8 w-8 text-secondary mb-4" />
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

export default ForPartners;