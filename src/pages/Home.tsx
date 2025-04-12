import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="pt-16">
      {user && (
        <div className="bg-indigo-600 text-white py-2 px-4 text-center">
          Welcome back, {user.name}!
        </div>
      )}
      <Hero />
      <Features />
      <Testimonials />
      <Contact />
    </div>
  );
}