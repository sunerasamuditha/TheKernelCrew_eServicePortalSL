import React from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Footer from './components/Footer';
import FloatingChatbot from './components/FloatingChatbot';
import Dashboard from './screens/Dashboard';
import AiSmartScan from './screens/AiSmartScan';
import AiPhotoGuard from './screens/AiPhotoGuard';
import Documents from './screens/Documents';
import PaymentsAndBooking from './screens/PaymentsAndBooking';
import StatusAndQueue from './screens/StatusAndQueue';
import Support from './screens/Support';
import Profile from './screens/Profile';
import { useApp } from './contexts/AppContext';

function App() {
  const { activeScreen } = useApp();

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home': return <Dashboard />;
      case 'smartscan': return <AiSmartScan />;
      case 'photoguard': return <AiPhotoGuard />;
      case 'documents': return <Documents />;
      case 'payments': return <PaymentsAndBooking />;
      case 'status': return <StatusAndQueue />;
      case 'support': return <Support />;
      case 'profile': return <Profile />;
      default: return <Dashboard />;
    }
  };

  return (
    <>
      <div className="container">
        <Sidebar />
        <main className="main">
          <Topbar />
          {renderScreen()}
          <Footer />
        </main>
      </div>
      <FloatingChatbot />
    </>
  );
}

export default App;
