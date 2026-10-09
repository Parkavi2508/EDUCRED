import React from 'react';
import { EduCredLogo } from '../common/EduCredLogo';
import { Mail, Linkedin, Twitter, Youtube } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#101B37] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="bg-white/95 rounded-xl p-3 inline-block shadow-sm">
              <EduCredLogo size="md" showTagline={false} />
            </div>
            <p className="mt-3 text-xs text-slate-400 font-medium tracking-tight">
              Make Every Contribution Visible.
            </p>
            <p className="mt-4 text-xs text-slate-400 leading-relaxed">
              Empowering educational institutions and passionate educators with trusted, AI-assisted recognition of verified contributions.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Product
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#benefits" className="hover:text-white transition-colors">
                  Benefits
                </a>
              </li>
              <li>
                <a href="#responsible-ai" className="hover:text-white transition-colors">
                  Responsible AI
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Help Center & FAQ
                </a>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Security & RLS Architecture
                </span>
              </li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Contact
            </h4>
            <div className="flex items-center gap-2 text-xs text-slate-300 mb-4">
              <Mail className="w-4 h-4 text-[#F7D794]" />
              <a href="mailto:support@educred.in" className="hover:text-white transition-colors">
                support@educred.in
              </a>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:text-white hover:bg-slate-700 transition-colors cursor-pointer">
                <Linkedin className="w-4 h-4" />
              </span>
              <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:text-white hover:bg-slate-700 transition-colors cursor-pointer">
                <Twitter className="w-4 h-4" />
              </span>
              <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:text-white hover:bg-slate-700 transition-colors cursor-pointer">
                <Youtube className="w-4 h-4" />
              </span>
            </div>
          </div>

        </div>

        {/* Bottom row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2025 EduCred. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Work. Verify. Recognize.</span>
            <span>·</span>
            <span>Educational Credentialing System</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
