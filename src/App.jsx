import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import Cursor from './components/Cursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Services from './components/Services';
import Showcase from './components/Showcase';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { useReveal } from './hooks/useReveal';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProjectDetail from './pages/ProjectDetail';

function Portfolio() {
  useReveal();

  useEffect(() => {
    document.title = 'Fozeals';
    document.body.classList.add('custom-cursor');
    const overlay = document.getElementById('page-overlay');
    const t = setTimeout(() => {
      if (overlay) {
        overlay.style.transform = 'translateY(-100%)';
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
      }
      document.body.classList.add('loaded');
    }, 150);
    return () => {
      clearTimeout(t);
      document.body.classList.remove('custom-cursor', 'loaded');
    };
  }, []);

  return (
    <>
      <div id="page-overlay"></div>
      <Cursor />
      <Navbar />
      <Hero />
      <Marquee />
      <Services />
      <Showcase />
      <Contact />
      <Footer />
    </>
  );
}

function AdminRoute() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) return null;
  return session ? <AdminDashboard /> : <AdminLogin />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/project/:slug" element={<ProjectDetail />} />
        <Route path="/admin" element={<AdminRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
