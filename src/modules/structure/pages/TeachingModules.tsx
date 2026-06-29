import { useState } from "react";
import { TeachingModulesGrid } from "../components/TeachingModulesGrid";
import { Button } from "@/shared/ui/Button";
import { Plus, RefreshCw } from "lucide-react";
import { Dialog } from "@/shared/ui/Dialog";
import AddTeachingModuleForm from "../components/AddTeachingModuleForm";
import UpdateTeachingModuleForm from "../components/UpdateTeachingModuleForm";
import type { TeachingModule } from "../types/university.types";
import { useTranslation } from "react-i18next";

const TeachingModules = () => {

  const [showAddModule, setShowAddModule] = useState(false);
  const [editingModule, setEditingModule] = useState<TeachingModule | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { t } = useTranslation();

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="flex flex-col gap-10 md:gap-15">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <h1 className="text-2xl mb-3 md:mb-0">
          {t("routes.teaching_modules", "Teaching Modules")}
        </h1>
        
        <div className="flex gap-2 justify-center">
          <Button
            buttonType="secondary"
            height={30}
            radius={10}
            className="flex items-center justify-center p-2"
            onClick={handleRefresh}
            title={t("global.refresh", "Refresh List")}
          >
            <RefreshCw size={16} />
          </Button>

          <Button height={30} radius={10} className="flex gap-3" onClick={() => setShowAddModule(true)}>
            <span className="font-light">{t("global.add_teaching_module", "Add Teaching Module")}</span>
            <Plus />
          </Button>
        </div>
      </div>

      <Dialog
        open={showAddModule}
        onClose={() => setShowAddModule(false)}
        title={t("global.add_teaching_module", "Add Teaching Module")}
        size="lg"
      >
        <AddTeachingModuleForm 
          onSuccess={() => {
            setShowAddModule(false);
            handleRefresh();
          }}
          onCancel={() => setShowAddModule(false)}
        />
      </Dialog>

      <TeachingModulesGrid 
        trigger={refreshTrigger}
        onEditTeachingModule={(mod) => setEditingModule(mod)}
      />

      <Dialog
        open={!!editingModule}
        onClose={() => setEditingModule(null)}
        title={t("global.update_teaching_module", "Update Teaching Module")}
        size="lg"
      >
        {editingModule && (
          <UpdateTeachingModuleForm 
            module={editingModule}
            onSuccess={() => {
              setEditingModule(null);
              handleRefresh();
            }}
            onCancel={() => setEditingModule(null)}
          />
        )}
      </Dialog>
    </div>
  );
};

export default TeachingModules;
