import React from 'react';

interface SettingsBoxProps {
  description: string;
  setDescription: (text: string) => void;
  disabled: boolean;
}

export const SettingsBox: React.FC<SettingsBoxProps> = ({ description, setDescription, disabled }) => {
  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gold-200 p-6 mb-8 transition-all duration-300 hover:shadow-2xl hover:border-gold-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">درباره آکادمی</h2>
        <div className="h-2 w-12 bg-gold-400 rounded-full"></div>
      </div>
      
      <p className="text-sm text-gray-500 mb-3">
        توضیحات کسب و کار خود را بنویسید تا هوش مصنوعی بر اساس آن پاسخ دهد:
      </p>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={disabled}
        placeholder="مثال: آکادمی مد ما در تهران واقع شده و دوره‌های طراحی لباس، خیاطی و استایلینگ برگزار می‌کند. ساعات کاری ما..."
        className={`w-full h-32 p-4 rounded-xl border-2 bg-gray-50 resize-none focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all
          ${disabled ? 'opacity-50 cursor-not-allowed border-gray-200' : 'border-gold-100'}`}
      />
    </div>
  );
};