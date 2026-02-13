
import React, { useState } from 'react';
import { ViewState, ThermalData } from './types';
import Login from './components/Login';
import ThermalForm from './components/ThermalForm';
import { submitThermalData } from './services/gasService';

// Thay đổi URL này bằng URL triển khai (Deployment URL) từ Google Apps Script của bạn
const GAS_URL = "https://script.google.com/macros/s/AKfycbypfttBiCS2KZ0aGEG91K87fIxD4gk4DubxTQELO_GBGrrxGX3cWkw9C1UOWSSQi3_nVA/exec"; 

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.LOGIN);
  const [userUnit, setUserUnit] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning', text: string } | null>(null);

  const handleLogin = (unit: string) => {
    setUserUnit(unit);
    setView(ViewState.FORM);
    
    if (GAS_URL.includes("AKfycbwKceeanpJUGQ60aZPyWAaYUnvMWDrh11d-25vyiaqVsu87IHaidTyUvJzXcH7rycCUdg")) {
      console.log("Cảnh báo: Đang sử dụng URL Google Apps Script mặc định.");
    }
  };

  const handleSubmit = async (data: ThermalData): Promise<boolean> => {
    setIsSubmitting(true);
    setMessage(null);
    
    const result = await submitThermalData(GAS_URL, data);
    
    setIsSubmitting(false);
    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setTimeout(() => setMessage(null), 6000);
      return true; // Trả về true để Form thực hiện xóa dữ liệu
    } else {
      setMessage({ type: 'error', text: result.message });
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-8 px-4 font-sans text-slate-900">
      <div className="max-w-xl w-full">
        <header className="mb-8 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center p-3 bg-orange-100 rounded-2xl mb-4 shadow-sm">
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Đo camera nhiệt - QNPC</h1>
          <p className="text-slate-500 text-sm mt-1">Ghi nhận dữ liệu nhiệt độ & Phân tích AI</p>
        </header>

        {message && (
          <div className={`mb-6 p-4 rounded-2xl flex items-start gap-3 border shadow-sm transition-all animate-slide-down ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
            message.type === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-100' :
            'bg-rose-50 text-rose-700 border-rose-100'
          }`}>
            <div className="mt-0.5 shrink-0">
              {message.type === 'success' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              )}
            </div>
            <span className="text-sm font-semibold">{message.text}</span>
          </div>
        )}

        {view === ViewState.LOGIN && (
          <Login onLogin={handleLogin} />
        )}

        {view === ViewState.FORM && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Đơn vị công tác</p>
                  <p className="font-bold text-slate-800 leading-tight">{userUnit}</p>
                </div>
              </div>
              <button 
                onClick={() => setView(ViewState.LOGIN)}
                className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors uppercase tracking-wider"
              >
                Thoát
              </button>
            </div>

            <ThermalForm 
              unit={userUnit} 
              onSubmit={handleSubmit} 
              isSubmitting={isSubmitting} 
            />
          </div>
        )}

        <footer className="mt-12 text-center text-slate-400 text-[11px] leading-relaxed px-4">
          <p className="font-semibold text-slate-500 uppercase">Đo camera nhiệt - QNPC</p>
          <p className="mt-1 opacity-75">Sử dụng Google Apps Script & Gemini AI - Không tốn phí vận hành</p>
          <div className="mt-4 flex justify-center gap-4 grayscale opacity-50">
             <div className="w-8 h-8 rounded border border-slate-300 flex items-center justify-center font-bold">EVN</div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
