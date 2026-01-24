import { Leaf, MapPin, Check } from 'lucide-react';

const dataTypes = [
  {
    icon: Leaf,
    title: 'Action Type',
    description: 'What environmental action was taken',
  },
  {
    icon: MapPin,
    title: 'Location',
    description: 'District-level data only (privacy-first)',
  },
  {
    icon: Check,
    title: 'Verification',
    description: 'Status and timestamps with evidence',
  },
];

function DataTypes() {
  return (
    <section className="px-4 sm:px-6 py-16 sm:py-24 bg-bg-secondary">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
            What data we collect
          </h2>
          <p className="text-lg text-secondary max-w-3xl">
            We collect only what is necessary to demonstrate impact and accountability. No personal tracking. No resale.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {dataTypes.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-6 bg-bg-primary rounded-2xl border border-border-primary text-center"
              >
                <Icon className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-secondary">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default DataTypes;