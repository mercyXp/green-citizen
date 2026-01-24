import { Shield, Eye, Lock } from 'lucide-react';

function Trust() {
  return (
    <section className="px-4 sm:px-6 py-16 sm:py-24 bg-bg-primary">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-8 text-center">
          Built on trust and transparency
        </h2>

        <div className="grid sm:grid-cols-3 gap-8">
          <div className="text-center">
            <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-primary mb-2">Citizens Control</h3>
            <p className="text-sm text-secondary">
              You decide what data is public, anonymous, or private
            </p>
          </div>

          <div className="text-center">
            <Eye className="h-12 w-12 text-secondary mx-auto mb-4" />
            <h3 className="font-semibold text-primary mb-2">Partners See Insights</h3>
            <p className="text-sm text-secondary">
              Aggregated data that respects individual privacy
            </p>
          </div>

          <div className="text-center">
            <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-primary mb-2">Verified System</h3>
            <p className="text-sm text-secondary">
              Admin oversight ensures integrity and accountability
            </p>
          </div>
        </div>

        <p className="text-center text-secondary mt-8 border-t border-border-primary pt-8">
          No hidden extraction. No data resale. No surprise terms. Just transparent climate action.
        </p>
      </div>
    </section>
  );
}

export default Trust;