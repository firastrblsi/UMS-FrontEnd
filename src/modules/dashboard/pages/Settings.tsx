import { useTranslation } from "react-i18next";

const Settings = () => {
  const { t } = useTranslation();

  return (
    <div className="p-8 max-w-[1400px] mx-auto w-full h-full animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
        {t("routes.settings", "Settings")}
      </h1>
      <p className="text-slate-500 mt-1 mb-8">Manage application preferences and configurations.</p>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex items-center justify-center min-h-[300px]">
        <div className="text-center text-slate-500">
          <p className="text-lg">Settings Module</p>
          <p className="text-sm">Coming Soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
