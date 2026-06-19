import { useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { MRT_ColumnDef } from "material-react-table";
import { DataTable } from "@/shared/ui/DataTable";
import { useRooms } from "../hooks/useRooms";
import type { Room } from "../types/university.types";
import type { RoomFilterParams } from "../api/roomApi";
import { Edit2, Trash2, Ban, CheckCircle } from "lucide-react";
import { roomApi } from "../api/roomApi";
import { toaster } from "@/components/ui/toaster";

function StatusBadge({ isActive }: { isActive: boolean }) {
  const { t } = useTranslation();
  return (
    <span
      style={{
        display: "inline-block",
        backgroundColor: isActive ? "#F0FDF4" : "#FFF1F2",
        color: isActive ? "#15803D" : "#BE123C",
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.03em",
        padding: "2px 10px",
        borderRadius: "999px",
      }}
    >
      {isActive ? t("labels.active") : t("labels.inactive")}
    </span>
  );
}

interface RoomsGridProps {
  externalFilters?: RoomFilterParams;
  trigger?: number;
  onEditRoom?: (room: Room) => void;
}

export function RoomsGrid({ externalFilters, trigger, onEditRoom }: RoomsGridProps) {
  const { t } = useTranslation();
  const { data, rowCount, isLoading, isFetching, fetchRooms } = useRooms(externalFilters || {});

  useEffect(() => {
    if (trigger && trigger > 0) {
      fetchRooms({
        page: 0,
        pageSize: 10,
        sorting: [],
        columnFilters: [],
        globalFilter: "",
      });
    }
  }, [trigger, fetchRooms]);

  const handleToggleActivation = async (room: Room) => {
    try {
      await roomApi.updateRoom(room.id, { isActive: !room.isActive });
      toaster.create({ title: t("global.updated", "Updated"), type: "success" });
      fetchRooms({ page: 0, pageSize: 10, sorting: [], columnFilters: [], globalFilter: "" });
    } catch (err) {
      toaster.create({ title: t("global.update_failed", "Failed to update"), type: "error" });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t("global.confirm_delete", "Are you sure you want to delete this?"))) {
      try {
        await roomApi.deleteRoom(id);
        toaster.create({ title: t("global.deleted", "Deleted"), type: "success" });
        fetchRooms({
          page: 0,
          pageSize: 10,
          sorting: [],
          columnFilters: [],
          globalFilter: "",
        });
      } catch (err) {
        toaster.create({ title: t("global.delete_failed", "Failed to delete"), type: "error" });
      }
    }
  };

  const columns = useMemo<MRT_ColumnDef<Room>[]>(
    () => [
      {
        accessorKey: "name",
        header: t("labels.room_name", "Room Name"),
        minSize: 150,
        muiTableHeadCellProps: { align: "left" },
        muiTableBodyCellProps: { align: "left" },
        Cell: ({ cell }) => (
          <span style={{ fontWeight: 600, color: "#1E293B" }}>
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "type",
        header: t("labels.room_type", "Type"),
        size: 140,
        filterVariant: 'select',
        filterSelectOptions: [
          { value: 'CLASSROOM', label: 'CLASSROOM' },
          { value: 'LABORATORY', label: 'LABORATORY' },
          { value: 'AMPHITHEATER', label: 'AMPHITHEATER' },
          { value: 'MEETING_ROOM', label: 'MEETING_ROOM' },
        ],
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "capacity",
        header: t("labels.capacity", "Capacity"),
        size: 100,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "building",
        header: t("labels.building", "Building"),
        size: 140,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ cell }) => {
          const val = cell.getValue<string | null>();
          return val ? val : "—";
        },
      },
      {
        accessorKey: "floor",
        header: t("labels.floor", "Floor"),
        size: 100,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ cell }) => {
          const val = cell.getValue<string | null>();
          return val ? val : "—";
        },
      },
      {
        accessorKey: "isActive",
        header: t("labels.status", "Status"),
        size: 110,
        filterVariant: 'select',
        filterSelectOptions: [
          { value: 'true', label: t('labels.active', 'Active') },
          { value: 'false', label: t('labels.inactive', 'Inactive') },
        ],
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ cell }) => <StatusBadge isActive={cell.getValue<boolean>()} />,
      },
      {
        id: "actions",
        header: t("student.actions", "Actions"),
        size: 100,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ row }) => (
          <div className="flex items-center justify-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditRoom?.(row.original);
              }}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title={t("global.edit", "Edit")}
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(row.original.id);
              }}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title={t("global.delete", "Delete")}
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleActivation(row.original);
              }}
              className={`p-2 rounded-full transition-colors ${
                row.original.isActive
                  ? "text-orange-400 hover:text-orange-600 hover:bg-orange-50"
                  : "text-green-400 hover:text-green-600 hover:bg-green-50"
              }`}
              title={row.original.isActive ? t("labels.deactivate_account", "Deactivate") : t("labels.reactivate_account", "Activate")}
            >
              {row.original.isActive ? <Ban size={16} /> : <CheckCircle size={16} />}
            </button>
          </div>
        ),
      },
    ],
    [t, onEditRoom]
  );

  return (
    <DataTable<Room>
      key={JSON.stringify(externalFilters)}
      columns={columns}
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
      rowCount={rowCount}
      onFetchData={fetchRooms}
      initialPageSize={10}
      pageSizeOptions={[5, 10, 25, 50]}
      enableHiding
      enableColumnFilters
    />
  );
}
