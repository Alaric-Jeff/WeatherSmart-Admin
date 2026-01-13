import React, { useState } from 'react';
import { Header } from './components/website/Header';
import { Footer } from './components/website/Footer';
import { HomePage } from './pages/website/HomePage';
import { AboutPage } from './pages/website/AboutPage';
import { FeaturesPage } from './pages/website/FeaturesPage';
import { ManualsPage } from './pages/website/ManualsPage';
import { InquiriesPage } from './pages/website/InquiriesPage';
import { ContactPage } from './pages/website/ContactPage';
export function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'about':
        return <AboutPage />;
      case 'features':
        return <FeaturesPage />;
      case 'manuals':
        return <ManualsPage />;
      case 'inquiries':
        return <InquiriesPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  return <div className="min-h-screen bg-white font-sans text-gray-900">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <main>{renderPage()}</main>
      <Footer onNavigate={handleNavigate} />
    </div>;
}