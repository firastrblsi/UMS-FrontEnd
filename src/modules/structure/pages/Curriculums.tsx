import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Dialog } from '@/shared/ui/Dialog';
import { CurriculumsGrid } from '../components/CurriculumsGrid';
import AddCurriculumForm from '../components/AddCurriculumForm';
import UpdateCurriculumForm from '../components/UpdateCurriculumForm';
import type { Curriculum } from '../types/university.types';

export default function Curriculums() {
  const { t } = useTranslation();
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedCurriculum, setSelectedCurriculum] = useState<Curriculum | null>(null);
  
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const handleEdit = useCallback((curriculum: Curriculum) => {
    setSelectedCurriculum(curriculum);
  }, []);

  return (
    <div className="flex flex-col gap-10 md:gap-15">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <h1 className="text-2xl mb-3 md:mb-0">
          {t('routes.curriculums', 'Curriculums')}
        </h1>
        
        <div className="flex gap-2 justify-center">
          <Button
            buttonType="secondary"
            height={30}
            radius={10}
            className="flex items-center justify-center p-2"
            onClick={handleRefresh}
            title={t('global.refresh', 'Refresh List')}
          >
            <RefreshCw size={16} />
          </Button>

          <Button height={30} radius={10} className="flex gap-3" onClick={() => setIsAddOpen(true)}>
            <span className="font-light">{t('global.add_curriculum', 'Add Curriculum')}</span>
            <Plus />
          </Button>
        </div>
      </div>

      <CurriculumsGrid
        trigger={refreshTrigger}
        onEditCurriculum={handleEdit}
      />

      <Dialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title={t('global.add_curriculum', 'Add Curriculum')}
        size="lg"
      >
        <AddCurriculumForm
          onSuccess={() => {
            setIsAddOpen(false);
            handleRefresh();
          }}
          onCancel={() => setIsAddOpen(false)}
        />
      </Dialog>

      <Dialog
        open={!!selectedCurriculum}
        onClose={() => setSelectedCurriculum(null)}
        title={t('global.update_curriculum', 'Update Curriculum')}
        size="lg"
      >
        {selectedCurriculum && (
          <UpdateCurriculumForm
            curriculum={selectedCurriculum}
            onSuccess={() => {
              setSelectedCurriculum(null);
              handleRefresh();
            }}
            onCancel={() => setSelectedCurriculum(null)}
          />
        )}
      </Dialog>
    </div>
  );
}
