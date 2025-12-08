
declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'js',
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}

export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

// Eventos específicos para filtros de opiniones
export const trackOpinionSearch = (params: {
  search_term?: string;
  career_id?: string | null;
  career_name?: string;
  subject_id?: string | null;
  subject_name?: string;
  faculty_id?: number | null;
  faculty_name?: string;
}) => {
  trackEvent('search_opinions', {
    search_term: params.search_term || 'none',
    career_id: params.career_id || 'all',
    career_name: params.career_name || 'Todas las Carreras',
    subject_id: params.subject_id || 'all',
    subject_name: params.subject_name || 'Todas las Materias',
    faculty_id: params.faculty_id || 'all',
    faculty_name: params.faculty_name || 'Todas las Facultades',
  });
};

export const trackFilterChange = (
  filterType: 'career' | 'subject' | 'search' | 'faculty',
  value: string,
  label?: string
) => {
  trackEvent('filter_change', {
    filter_type: filterType,
    filter_value: value,
    filter_label: label || value,
  });
};
