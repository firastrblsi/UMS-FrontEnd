import { useState } from "react";
import { ProgramsGrid } from "../components/ProgramsGrid";
import { Button } from "@/shared/ui/Button";
import { Plus, RefreshCw } from "lucide-react";
import { Dialog } from "@/shared/ui/Dialog";
import AddProgramForm from "../components/AddProgramForm";
import UpdateProgramForm from "../components/UpdateProgramForm";
import type { Program } from "../types/university.types";
import { useTranslation } from "react-i18next";

const Programs = () => {

  const [showAddProgram, setShowAddProgram] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { t } = useTranslation();

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="flex flex-col gap-10 md:gap-15">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <h1 className="text-2xl mb-3 md:mb-0">{t("routes.programs")}</h1>
        
        <div className="flex gap-2 justify-center">
          <Button
            buttonType="secondary"
            height={30}
            radius={10}
            className="flex items-center justify-center p-2"
            onClick={handleRefresh}
            title="Refresh List"
          >
            <RefreshCw size={16} />
          </Button>

          <Button height={30} radius={10} className="flex gap-3" onClick={() => setShowAddProgram(true)}>
            <span className="font-light">{t("global.add_program")}</span>
            <Plus />
          </Button>
        </div>
      </div>

      <Dialog
        open={showAddProgram}
        onClose={() => setShowAddProgram(false)}
        title={t("global.add_program")}
        size="lg"
      >
        <AddProgramForm 
          onSuccess={() => {
            setShowAddProgram(false);
            handleRefresh();
          }}
          onCancel={() => setShowAddProgram(false)}
        />
      </Dialog>



      <ProgramsGrid 
        trigger={refreshTrigger}
        onEditProgram={(prog) => setEditingProgram(prog)}
      />

      <Dialog
        open={!!editingProgram}
        onClose={() => setEditingProgram(null)}
        title={t("global.update_program")}
        size="lg"
      >
        {editingProgram && (
          <UpdateProgramForm 
            program={editingProgram}
            onSuccess={() => {
              setEditingProgram(null);
              handleRefresh();
            }}
            onCancel={() => setEditingProgram(null)}
          />
        )}
      </Dialog>
    </div>
  );
};

export default Programs;
