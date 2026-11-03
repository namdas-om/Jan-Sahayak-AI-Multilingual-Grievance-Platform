import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-navy-900 text-slate-300 pt-12 pb-8 border-t border-navy-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-govblue-600 flex items-center justify-center text-white font-bold text-sm">
                JS
              </div>
              <span className="font-extrabold text-lg text-white">{t('brandName')}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('footerDesc')}
            </p>
            <div className="flex items-center gap-2 text-xs text-saffron-500 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>{t('transparency')}</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">{t('quickNav')}</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-white transition-colors">{t('home')}</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">{t('howItWorks')}</Link>
              </li>
              <li>
                <Link to="/languages" className="hover:text-white transition-colors">{t('languages')}</Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-white transition-colors">{t('help')}</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">{t('about')}</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal Services */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">{t('publicServices')}</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/citizen/complaints/new" className="hover:text-white transition-colors">{t('registerGrievance')}</Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-white transition-colors">{t('trackComplaint')}</Link>
              </li>
              <li>
                <Link to="/department/dashboard" className="hover:text-white transition-colors">{t('departmentDashboard')}</Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-white transition-colors">{t('adminDashboard')}</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Digital Public Infrastructure & Help */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">{t('tagline')}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('announcement')}
            </p>
          </div>
        </div>

        <div className="border-t border-navy-800 pt-6 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
};
