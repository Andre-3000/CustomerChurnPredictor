import React from 'react';
import { Dashboard } from './components/Dashboard';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-6 max-w-[1600px] mx-auto w-full">
          <Dashboard />
        </main>
        <footer className="bg-white border-t border-gray-200 py-4">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 text-center text-gray-500 text-sm">
            © 2025 Churn Predictor - Demo ML Application
          </div>
        </footer>
      </div>
    </AppProvider>
  );
}

export default App;