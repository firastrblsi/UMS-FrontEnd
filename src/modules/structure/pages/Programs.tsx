import { useState } from "react";
import ProgramsFilterForm from "../components/ProgramsFilterForm";
import { ProgramsGrid } from "../components/ProgramsGrid";
import type { ProgramFilterParams } from "../api/programApi";

const Programs = () => {
  const [filters, setFilters] = useState<ProgramFilterParams>({});

  return (
    <div className="flex flex-col gap-6 h-full p-2 lg:p-6 w-full max-w-[1400px] mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Programs
          </h1>
          <p className="text-slate-500 mt-1">Manage university programs and degrees</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
          Filters
        </h2>
        <ProgramsFilterForm onFilter={setFilters} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 min-h-[400px]">
        <ProgramsGrid externalFilters={filters} />
      </div>
    </div>
  );
};

export default Programs;
