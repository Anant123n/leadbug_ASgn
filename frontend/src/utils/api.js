const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';

const request = async (method, path, body = null) => {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${API_BASE}${path}`, opts);
  const data = await res.json();
  if (!data.success && res.status >= 400) {
    throw new Error(data.message || 'API Error');
  }
  return data;
};

export const api = {
  // Onboarding
  saveOnboarding: (data) => request('POST', '/onboarding', data),
  sendOtp: (onboardingId) => request('POST', '/onboarding/send-otp', { onboardingId }),
  verifyOtp: (onboardingId, otp) => request('POST', '/onboarding/verify-otp', { onboardingId, otp }),
  verifyMeta: (onboardingId) => request('POST', '/onboarding/verify-meta', { onboardingId }),
  getOnboardingStatus: () => request('GET', '/onboarding/status'),

  // Templates
  getTemplates: (search = '') => request('GET', `/templates?search=${encodeURIComponent(search)}`),
  createTemplate: (data) => request('POST', '/templates', data),
  deleteTemplate: (id) => request('DELETE', `/templates/${id}`),
  getTemplate: (id) => request('GET', `/templates/${id}`),

  // Sequences
  getSequences: () => request('GET', '/sequences'),
  createSequence: (data) => request('POST', '/sequences', data),
  updateSequence: (id, data) => request('PATCH', `/sequences/${id}`, data),
  deleteSequence: (id) => request('DELETE', `/sequences/${id}`),

  // Contacts
  getContacts: (search = '') => request('GET', `/contacts?search=${encodeURIComponent(search)}`),
  createContact: (data) => request('POST', '/contacts', data),
  getContactLists: () => request('GET', '/contacts/lists'),
  seedContacts: () => request('POST', '/contacts/seed'),
  deleteContact: (id) => request('DELETE', `/contacts/${id}`),
};
