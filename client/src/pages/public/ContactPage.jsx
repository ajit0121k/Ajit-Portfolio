import React from 'react';
import { useOutletContext } from 'react-router-dom';
import ContactSection from '../../components/public/ContactSection.jsx';

export default function ContactPage() {
  const { profile, settings } = useOutletContext();

  return (
    <div className="pt-20 pb-12">
      <ContactSection profile={profile} settings={settings} />
    </div>
  );
}
