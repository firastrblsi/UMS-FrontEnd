import { useState } from "react";
import { RoomsGrid } from "../components/RoomsGrid";
import { Button } from "@/shared/ui/Button";
import { Plus, RefreshCw } from "lucide-react";
import { Dialog } from "@/shared/ui/Dialog";
import AddRoomForm from "../components/AddRoomForm";
import UpdateRoomForm from "../components/UpdateRoomForm";
import type { Room } from "../types/university.types";
import { useTranslation } from "react-i18next";

const Rooms = () => {

  const [showAddRoom, setShowAddRoom] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { t } = useTranslation();

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="flex flex-col gap-10 md:gap-15">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <h1 className="text-2xl mb-3 md:mb-0">{t("routes.rooms")}</h1>
        
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

          <Button height={30} radius={10} className="flex gap-3" onClick={() => setShowAddRoom(true)}>
            <span className="font-light">{t("global.add_room")}</span>
            <Plus />
          </Button>
        </div>
      </div>

      <Dialog
        open={showAddRoom}
        onClose={() => setShowAddRoom(false)}
        title={t("global.add_room")}
        size="md"
      >
        <AddRoomForm 
          onSuccess={() => {
            setShowAddRoom(false);
            handleRefresh();
          }}
          onCancel={() => setShowAddRoom(false)}
        />
      </Dialog>



      <RoomsGrid 
        trigger={refreshTrigger}
        onEditRoom={(room) => setEditingRoom(room)}
      />

      <Dialog
        open={!!editingRoom}
        onClose={() => setEditingRoom(null)}
        title={t("global.update_room")}
        size="md"
      >
        {editingRoom && (
          <UpdateRoomForm 
            room={editingRoom}
            onSuccess={() => {
              setEditingRoom(null);
              handleRefresh();
            }}
            onCancel={() => setEditingRoom(null)}
          />
        )}
      </Dialog>
    </div>
  );
};

export default Rooms;
