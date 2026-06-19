import { useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { MRT_ColumnDef } from "material-react-table";
import { DataTable } from "@/shared/ui/DataTable";
import { DateColumnFilter } from "@/shared/ui/DateColumnFilter";
import { useHolidays } from "../hooks/useHolidays";
import type { Holiday } from "../api/holidayApi";
import { Edit2, Trash2 } from "lucide-react";
import { holidayApi } from "../api/holidayApi";
import { toaster } from "@/components/ui/toaster";

interface HolidaysGridProps {
  trigger?: number;
  onEditHoliday?: (holiday: Holiday) => void;
}

export function HolidaysGrid({ trigger, onEditHoliday }: HolidaysGridProps) {
  const { t } = useTranslation();
  const { data, rowCount, isLoading, isFetching, fetchHolidays } = useHolidays();

  useEffect(() => {
    if (trigger && trigger > 0) {
      fetchHolidays({ page: 0, pageSize: 10, sorting: [], columnFilters: [], globalFilter: "" });
    }
  }, [trigger, fetchHolidays]);

  const handleDelete = async (id: string) => {
    if (window.confirm(t("global.confirm_delete", "Are you sure you want to delete this?"))) {
      try {
        await holidayApi.deleteHoliday(id);
        toaster.create({ title: t("global.deleted", "Deleted"), type: "success" });
        fetchHolidays({ page: 0, pageSize: 10, sorting: [], columnFilters: [], globalFilter: "" });
      } catch (err) {
        toaster.create({ title: t("global.delete_failed", "Failed to delete"), type: "error" });
      }
    }
  };

  const columns = useMemo<MRT_ColumnDef<Holiday>[]>(() => [
    {
      accessorKey: "name",
      header: t("labels.name", "Name"),
      size: 200,
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
      Cell: ({ cell }) => (
        <span style={{ fontWeight: 600, color: "#1E293B" }}>
          {cell.getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: "date",
      header: t("labels.date", "Date"),
      size: 120,
      Filter: DateColumnFilter,
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
      Cell: ({ cell }) => new Date(cell.getValue<string>()).toLocaleDateString(),
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
            onClick={(e) => { e.stopPropagation(); onEditHoliday?.(row.original); }}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title={t("global.edit", "Edit")}
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(row.original.id); }}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title={t("global.delete", "Delete")}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ], [t, onEditHoliday]);

  return (
    <DataTable<Holiday>
      columns={columns}
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
      rowCount={rowCount}
      onFetchData={fetchHolidays}
      initialPageSize={10}
      pageSizeOptions={[5, 10, 25, 50]}
      enableHiding
      enableColumnFilters
    />
  );
}
