
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (unit: string) => void;
}

const UNITS = [
  'Truyền tải điện 1',
  'Truyền tải điện 2',
  'Điện lực Hà Nội',
  'Điện lực TP.HCM',
  'Điện lực Miền Trung',
  'Điện lực Miền Nam',
  'Khác'
];

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [unit, setUnit] = useState('');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  const handleEnter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unit) {
      setError('Vui lòng chọn đơn vị');
      return;
    }
    // Mật mã đơn giản để tránh người lạ, có thể đổi tùy ý
    if (passcode === '123456' || passcode === 'evn2024') {
      onLogin(unit);
    } else {
      setError('Mã truy cập không chính xác');
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 w-full animate-fadeIn">
      <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">Đăng nhập hệ thống</h2>
      <form onSubmit={handleEnter} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Đơn vị công tác</label>
          <select 
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          >
            <option value="">-- Chọn đơn vị --</option>
            {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Mã truy cập (Passcode)</label>
          <input 
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Nhập mã bảo mật"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
        <button 
          type="submit"
          className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold hover:bg-slate-800 transform active:scale-95 transition-all shadow-lg"
        >
          Bắt đầu đo hiện trường
        </button>
      </form>
    </div>
  );
};

export default Login;
