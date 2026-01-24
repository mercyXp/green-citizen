import { Leaf } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-border-primary">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid sm:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="h-5 w-5 text-primary" />
              <span className="font-bold text-primary">GreenCitizen</span>
            </div>
            <p className="text-sm text-secondary">
              Transparent climate action, measured by community.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-primary mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-secondary">
              <li><a href="#" className="hover:text-primary transition">Dashboard</a></li>
              <li><a href="#" className="hover:text-primary transition">Analytics</a></li>
              <li><a href="#" className="hover:text-primary transition">API</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-primary mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-secondary">
              <li><a href="#" className="hover:text-primary transition">About</a></li>
              <li><a href="#" className="hover:text-primary transition">Blog</a></li>
              <li><a href="#" className="hover:text-primary transition">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-primary mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-secondary">
              <li><a href="#" className="hover:text-primary transition">Privacy</a></li>
              <li><a href="#" className="hover:text-primary transition">Terms</a></li>
              <li><a href="#" className="hover:text-primary transition">Security</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border-primary pt-8 text-center text-sm text-tertiary">
          <p>&copy; 2026 GreenCitizen. Built for climate action.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;