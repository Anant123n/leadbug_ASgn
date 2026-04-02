import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

// Pages
import OnboardingWizard from './pages/onboarding/OnboardingWizard';
import ConnectHome from './pages/whatsapp/ConnectHome';
import IntegrationStatus from './pages/whatsapp/IntegrationStatus';
import TemplateList from './pages/templates/TemplateList';
import CreateTemplate from './pages/templates/CreateTemplate';
import SequenceList from './pages/sequences/SequenceList';
import CreateSequence from './pages/sequences/CreateSequence';
import ContactHub from './pages/contacts/ContactHub';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root → onboarding */}
        <Route path="/" element={<Navigate to="/onboarding" replace />} />

        {/* Onboarding (no sidebar/nav) */}
        <Route path="/onboarding" element={<OnboardingWizard />} />

        {/* App pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/whatsapp" element={<ConnectHome />} />
        <Route path="/whatsapp/integration" element={<IntegrationStatus />} />
        <Route path="/templates" element={<TemplateList />} />
        <Route path="/templates/create" element={<CreateTemplate />} />
        <Route path="/sequences" element={<SequenceList />} />
        <Route path="/sequences/create" element={<CreateSequence />} />
        <Route path="/contacts" element={<ContactHub />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
