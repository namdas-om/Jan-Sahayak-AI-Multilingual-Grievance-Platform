import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Mic,
  Languages,
  ChevronRight,
  FileCheck,
  HelpCircle,
  UserPlus,
  LogIn,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const LandingPage: React.FC = () => {
  const { t, availableLanguages } = useLanguage();
  const [trackTicketInput, setTrackTicketInput] = useState('');
  const navigate = useNavigate();

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackTicketInput.trim()) {
      navigate(`/track?ticket=${encodeURIComponent(trackTicketInput.trim().toUpperCase())}`);
    }
  };

  const steps = [
    { num: '01', title: t('step1Title'), desc: t('step1Desc') },
    { num: '02', title: t('step2Title'), desc: t('step2Desc') },
    { num: '03', title: t('step3Title'), desc: t('step3Desc') },
    { num: '04', title: t('step4Title'), desc: t('step4Desc') },
    { num: '05', title: t('step5Title'), desc: t('step5Desc') },
    { num: '06', title: t('step6Title'), desc: t('step6Desc') },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-900 via-navy-800 to-navy-900 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-navy-700">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-navy-700/80 border border-navy-600 px-3.5 py-1.5 rounded-full text-xs font-semibold text-saffron-500 shadow-sm">
            <Languages className="w-3.5 h-3.5" />
            <span>{t('heroBadge')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            {t('heroTitle1')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-govblue-500 via-sky-300 to-saffron-500">
              {t('heroTitle2')}
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            {t('heroDesc')}
          </p>

          {/* Primary Call to Actions */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/citizen/complaints/new"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-saffron-500 hover:bg-saffron-600 text-navy-900 font-bold px-5 py-3 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 text-xs sm:text-sm cursor-pointer"
            >
              <Mic className="w-4 h-4" />
              <span>{t('registerGrievance')}</span>
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-navy-900 font-bold px-5 py-3 rounded-xl shadow-md transition-colors text-xs sm:text-sm cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-govblue-600" />
              <span>Create Account</span>
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-navy-700/80 hover:bg-navy-600 border border-slate-600 text-white font-semibold px-5 py-3 rounded-xl transition-colors text-xs sm:text-sm cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-slate-300" />
              <span>Sign In</span>
            </Link>
            <Link
              to="/track"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-navy-800/80 hover:bg-navy-700 border border-slate-700 text-slate-200 font-semibold px-5 py-3 rounded-xl transition-colors text-xs sm:text-sm cursor-pointer"
            >
              <Search className="w-4 h-4 text-slate-300" />
              <span>{t('trackComplaint')}</span>
            </Link>
          </div>

          {/* Quick Ticket Tracker Bar */}
          <div className="pt-8 max-w-xl mx-auto">
            <form
              onSubmit={handleTrackSubmit}
              className="bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-2xl flex items-center gap-2"
            >
              <Search className="w-5 h-5 text-slate-300 ml-3 flex-shrink-0" />
              <input
                type="text"
                placeholder={t('ticketPlaceholder')}
                value={trackTicketInput}
                onChange={(e) => setTrackTicketInput(e.target.value)}
                className="w-full bg-transparent text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none px-2"
              />
              <button
                type="submit"
                className="bg-govblue-600 hover:bg-govblue-500 text-white font-semibold px-4 py-2 rounded-xl text-xs sm:text-sm flex-shrink-0 transition-colors cursor-pointer"
              >
                {t('trackNow')}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Quick Action Navigation Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/citizen/complaints/new"
            className="bg-surface p-5 rounded-2xl shadow-sm border border-govborder hover:border-govblue-500 hover:shadow-md transition-all flex items-center gap-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-govblue-50 text-govblue-600 flex items-center justify-center group-hover:bg-govblue-600 group-hover:text-white transition-colors">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-navy-800">{t('registerGrievance')}</h3>
              <p className="text-xs text-mutedtext mt-0.5">{t('voiceStudioTitle')}</p>
            </div>
          </Link>

          <Link
            to="/track"
            className="bg-surface p-5 rounded-2xl shadow-sm border border-govborder hover:border-govblue-500 hover:shadow-md transition-all flex items-center gap-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-saffron-500 flex items-center justify-center group-hover:bg-saffron-500 group-hover:text-white transition-colors">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-navy-800">{t('trackComplaint')}</h3>
              <p className="text-xs text-mutedtext mt-0.5">{t('timeline')}</p>
            </div>
          </Link>

          <Link
            to="/languages"
            className="bg-surface p-5 rounded-2xl shadow-sm border border-govborder hover:border-govblue-500 hover:shadow-md transition-all flex items-center gap-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-govteal-500 flex items-center justify-center group-hover:bg-govteal-500 group-hover:text-white transition-colors">
              <Languages className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-navy-800">{t('feature1Title')}</h3>
              <p className="text-xs text-mutedtext mt-0.5">{t('languages')}</p>
            </div>
          </Link>

          <Link
            to="/help"
            className="bg-surface p-5 rounded-2xl shadow-sm border border-govborder hover:border-govblue-500 hover:shadow-md transition-all flex items-center gap-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-navy-800">{t('help')}</h3>
              <p className="text-xs text-mutedtext mt-0.5">{t('howItWorks')}</p>
            </div>
          </Link>
        </div>
      </section>

      {/* 6-Step Redressal Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-govblue-600 uppercase tracking-wider">
            {t('gatewayTitle')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-800">
            {t('howWorksHeading')}
          </h2>
          <p className="text-xs sm:text-sm text-mutedtext">
            {t('howWorksSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((st) => (
            <div
              key={st.num}
              className="bg-surface p-6 rounded-2xl border border-govborder shadow-sm hover:border-slate-300 transition-all space-y-3 relative overflow-hidden"
            >
              <div className="text-3xl font-black text-slate-200 select-none">{st.num}</div>
              <h3 className="text-sm font-bold text-navy-800">{st.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Supported Languages Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-navy-900 rounded-3xl p-8 sm:p-12 text-white border border-navy-700 shadow-xl space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-saffron-500 uppercase tracking-wider">
                {t('featuresHeading')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {t('feature1Title')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {t('feature1Desc')}
              </p>
            </div>
            <Link
              to="/languages"
              className="text-xs font-semibold bg-navy-800 hover:bg-navy-700 text-slate-200 px-4 py-2 rounded-lg border border-navy-600 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{t('languages')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {availableLanguages.map((l) => (
              <div
                key={l.code}
                className="bg-navy-800/80 p-3 rounded-xl border border-navy-700 text-center space-y-1 hover:border-govblue-500 transition-colors"
              >
                <div className="text-sm font-bold text-white">{l.native_name}</div>
                <div className="text-[10px] text-slate-400 font-medium">{l.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Feature Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-surface p-6 rounded-2xl border border-govborder shadow-sm space-y-2">
            <h3 className="font-bold text-sm text-navy-800">{t('feature1Title')}</h3>
            <p className="text-xs text-mutedtext leading-relaxed">{t('feature1Desc')}</p>
          </div>
          <div className="bg-surface p-6 rounded-2xl border border-govborder shadow-sm space-y-2">
            <h3 className="font-bold text-sm text-navy-800">{t('feature2Title')}</h3>
            <p className="text-xs text-mutedtext leading-relaxed">{t('feature2Desc')}</p>
          </div>
          <div className="bg-surface p-6 rounded-2xl border border-govborder shadow-sm space-y-2">
            <h3 className="font-bold text-sm text-navy-800">{t('feature3Title')}</h3>
            <p className="text-xs text-mutedtext leading-relaxed">{t('feature3Desc')}</p>
          </div>
          <div className="bg-surface p-6 rounded-2xl border border-govborder shadow-sm space-y-2">
            <h3 className="font-bold text-sm text-navy-800">{t('feature4Title')}</h3>
            <p className="text-xs text-mutedtext leading-relaxed">{t('feature4Desc')}</p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-govblue-600 to-navy-900 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-xl">
          <h2 className="text-2xl sm:text-4xl font-extrabold">{t('ctaHeading')}</h2>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-200">
            {t('ctaDesc')}
          </p>
          <div>
            <Link
              to="/citizen/complaints/new"
              className="inline-flex items-center gap-2 bg-saffron-500 hover:bg-saffron-600 text-navy-900 font-bold px-8 py-4 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 text-sm cursor-pointer"
            >
              <Mic className="w-5 h-5" />
              <span>{t('registerGrievance')}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
