import React from 'react';
import { Navigate } from 'react-router-dom';

export default function SEOPage() {
  return <Navigate to="/admin/settings?tab=seo" replace />;
}

