import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import officeImg from '../assets/about-office.jpg';
import { CONTACT_EMAIL, CONTACT_PHONE } from '../utils/contact';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Page heading */}
     

        {/* Main card: image + content */}
        <div className="grid lg:grid-cols-2 gap-10 items-stretch max-w-6xl mx-auto">
          {/* Image card */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl group">
            <img
              src={officeImg}
              alt={t('trips.imageAlt', 'Afreshtrip office building')}
              className="w-full h-full object-cover min-h-[360px] group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-sm uppercase tracking-wider opacity-80">
                {t('trips.ourLocation', 'Our location')}
              </p>
              <p className="text-xl font-serif font-semibold">
                Hangzhou, China
              </p>
            </div>
          </div>

        {/* Info card */}
<div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 flex flex-col justify-between border border-slate-100">
  <div>
    {/* Brand header — matches footer style */}
    <Link to="/" className="flex items-center gap-3 mb-6 group">
      <img
        src="/assets/tubiao.png"
        alt="Afreshtrip Logo"
        className="w-11 h-11 rounded-full border-2 border-slate-200 group-hover:border-teal-500 transition-colors"
      />
      <span className="text-2xl font-bold text-slate-900 tracking-tight font-serif group-hover:text-teal-600 transition-colors">
        Afreshtrip
      </span>
    </Link>

    <p className="text-slate-600 leading-relaxed mb-8">
      {t('trips.missionText', 'Your trusted travel companion for unforgettable adventures.')}
    </p>
  </div>

            {/* Contact block */}
            <div className="border-t border-slate-100 pt-6 space-y-5">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    {t('trips.addressLabel', 'Our address')}
                  </p>
                  <div className="text-slate-700 leading-relaxed text-sm">
                    {t('footer.workAddress').split('\n').map((line, index) => (
                      <span key={index}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    {t('trips.emailLabel', 'Contact mail')}
                  </p>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-slate-700 hover:text-teal-600 transition-colors text-sm">
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    {t('trips.phoneLabel', 'Telephone')}
                  </p>
                  <a href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`} className="text-slate-700 hover:text-teal-600 transition-colors text-sm">
                    {CONTACT_PHONE}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;