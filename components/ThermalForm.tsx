
import React, { useState, useCallback } from 'react';
import { ThermalData } from '../types';
import { getThermalAnalysis } from '../services/geminiService';

interface ThermalFormProps {
  unit: string;
  onSubmit: (data: ThermalData) => Promise<boolean>;
  isSubmitting: boolean;
}

const ThermalForm: React.FC<ThermalFormProps> = ({ unit, onSubmit, isSubmitting }) => {
  const getInitialState = () => ({
    unit: unit,
    stationName: '',
    deviceLocation: '',
    feeder: '',
    inspectionType: 'Định kỳ' as const,
    phase: 'ABC' as const,
    measuredTemp: 0,
    referenceTemp: 0,
    ambientTemp: 30,
    currentLoad: 0,
    thermalImage: null,
    normalImage: null,
    conclusion: '',
    inspector: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [formData, setFormData] = useState<Partial<ThermalData>>(getInitialState());
  const [aiAnalyzing, setAiAnalyzing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'thermalImage' | 'normalImage') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!formData.measuredTemp || !formData.referenceTemp) return;
    setAiAnalyzing(true);
    const suggestion = await getThermalAnalysis(
      formData.measuredTemp || 0, 
      formData.referenceTemp || 0, 
      formData.currentLoad || 0
    );
    setFormData(prev => ({ ...prev, conclusion: suggestion }));
    setAiAnalyzing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit(formData as ThermalData);
    if (success) {
      // Xóa hết các nội dung trong ô sau khi gửi thành công
      setFormData(getInitialState());
      // Cuộn lên đầu form để người dùng thấy thông báo và nhập tiếp
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-1">Tên Trạm / Đường dây</label>
          <input 
            type="text" 
            required
            value={formData.stationName}
            onChange={e => setFormData({...formData, stationName: e.target.value})}
            placeholder="VD: TBA 110kV Đông Anh"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Xuất tuyến</label>
          <input 
            type="text" 
            required
            value={formData.feeder}
            onChange={e => setFormData({...formData, feeder: e.target.value})}
            placeholder="VD: 471, 473..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Loại kiểm tra</label>
          <select 
            value={formData.inspectionType}
            onChange={e => setFormData({...formData, inspectionType: e.target.value as any})}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          >
            <option value="Định kỳ">Định kỳ</option>
            <option value="Đột xuất">Đột xuất</option>
            <option value="Kỹ thuật">Kỹ thuật</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Vị trí / Thiết bị</label>
          <input 
            type="text" 
            required
            value={formData.deviceLocation}
            onChange={e => setFormData({...formData, deviceLocation: e.target.value})}
            placeholder="VD: Dao cách ly 171-1"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Pha</label>
          <select 
            value={formData.phase}
            onChange={e => setFormData({...formData, phase: e.target.value as any})}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          >
            <option value="A">Pha A</option>
            <option value="B">Pha B</option>
            <option value="C">Pha C</option>
            <option value="ABC">Cả 3 Pha</option>
            <option value="N">Trung tính</option>
          </select>
        </div>
      </div>

      <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
        <h3 className="text-sm font-bold text-orange-800 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>
          Số liệu đo nhiệt độ (°C)
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] uppercase font-bold text-orange-600 mb-1">Nhiệt độ đo (t1)</label>
            <input 
              type="number" step="0.1" required
              value={formData.measuredTemp || ''}
              onChange={e => setFormData({...formData, measuredTemp: parseFloat(e.target.value)})}
              className="w-full p-2 bg-white border border-orange-200 rounded-lg outline-none font-mono focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-orange-600 mb-1">Nhiệt độ tham chiếu (t2)</label>
            <input 
              type="number" step="0.1" required
              value={formData.referenceTemp || ''}
              onChange={e => setFormData({...formData, referenceTemp: parseFloat(e.target.value)})}
              className="w-full p-2 bg-white border border-orange-200 rounded-lg outline-none font-mono focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-orange-600 mb-1">Môi trường</label>
            <input 
              type="number" step="0.1" 
              value={formData.ambientTemp || ''}
              onChange={e => setFormData({...formData, ambientTemp: parseFloat(e.target.value)})}
              className="w-full p-2 bg-white border border-orange-200 rounded-lg outline-none font-mono focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-orange-600 mb-1">Dòng điện (A)</label>
            <input 
              type="number" step="1" 
              value={formData.currentLoad || ''}
              onChange={e => setFormData({...formData, currentLoad: parseFloat(e.target.value)})}
              className="w-full p-2 bg-white border border-orange-200 rounded-lg outline-none font-mono focus:ring-1 focus:ring-orange-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Ảnh nhiệt</label>
          <div className="relative group cursor-pointer h-32 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden transition-colors hover:bg-slate-200">
            {formData.thermalImage ? (
              <img src={formData.thermalImage} className="w-full h-full object-cover" alt="Thermal" />
            ) : (
              <>
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span className="text-[10px] text-slate-500 font-medium mt-1">Chụp ảnh nhiệt</span>
              </>
            )}
            <input 
              type="file" accept="image/*" capture="environment" 
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={e => handleFileChange(e, 'thermalImage')}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Ảnh thường</label>
          <div className="relative group cursor-pointer h-32 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden transition-colors hover:bg-slate-200">
            {formData.normalImage ? (
              <img src={formData.normalImage} className="w-full h-full object-cover" alt="Normal" />
            ) : (
              <>
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span className="text-[10px] text-slate-500 font-medium mt-1">Chụp ảnh thường</span>
              </>
            )}
            <input 
              type="file" accept="image/*" capture="environment" 
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={e => handleFileChange(e, 'normalImage')}
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-semibold text-slate-700">Đánh giá / Kết luận</label>
          <button 
            type="button" 
            onClick={handleAnalyze}
            disabled={aiAnalyzing || !formData.measuredTemp}
            className="text-xs flex items-center gap-1 text-blue-600 font-bold hover:text-blue-800 disabled:opacity-50 transition-colors"
          >
            {aiAnalyzing ? (
              <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14H8a2 2 0 104 0z" /></svg>
            )}
            AI Phân tích
          </button>
        </div>
        <textarea 
          value={formData.conclusion}
          onChange={e => setFormData({...formData, conclusion: e.target.value})}
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm h-20 transition-all"
          placeholder="Nhập kết luận đánh giá..."
        ></textarea>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Người đo</label>
          <input 
            type="text" required
            value={formData.inspector}
            onChange={e => setFormData({...formData, inspector: e.target.value})}
            placeholder="Tên nhân viên"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Ngày đo</label>
          <input 
            type="date" required
            value={formData.date}
            onChange={e => setFormData({...formData, date: e.target.value})}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transform active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Đang gửi dữ liệu...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
            Gửi kết quả đo
          </>
        )}
      </button>
    </form>
  );
};

export default ThermalForm;
