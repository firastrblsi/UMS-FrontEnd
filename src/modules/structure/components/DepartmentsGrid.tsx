import { useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { MRT_ColumnDef } from "material-react-table";
import { DataTable } from "@/shared/ui/DataTable";
import { DateColumnFilter } from "@/shared/ui/DateColumnFilter";
import { useDepartments } from "../hooks/useDepartments";
import type { Department } from "../types/department.types";
import { Edit2, Trash2, Ban, CheckCircle } from "lucide-react";
import { departmentApi } from "../api/departmentApi";
import { toaster } from "@/components/ui/toaster";

const STATUS_STYLES = {
  active: { bg: "#F0FDF4", color: "#15803D", label: "Active" },
  inactive: { bg: "#FFF1F2", color: "#BE123C", label: "Inactive" },
};

function StatusBadge({ isActive }: { isActive: boolean }) {
  const { t } = useTranslation();
  const style = isActive ? STATUS_STYLES.active : STATUS_STYLES.inactive;
  return (
    <span
      style={{
        display: "inline-block",
        backgroundColor: style.bg,
        color: style.color,
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

interface DepartmentsGridProps {
  trigger?: number;
  onEditDepartment?: (department: Department) => void;
}

export function DepartmentsGrid({ trigger, onEditDepartment }: DepartmentsGridProps) {
  const { t } = useTranslation();
  const { data, rowCount, isLoading, isFetching, fetchDepartments } = useDepartments();

  useEffect(() => {
    if (trigger && trigger > 0) {
      fetchDepartments({
        page: 0,
        pageSize: 10,
        sorting: [],
        columnFilters: [],
        globalFilter: "",
      });
    }
  }, [trigger, fetchDepartments]);

  const handleToggleActivation = async (department: Department) => {
    try {
      await departmentApi.updateDepartment(department.id, { isActive: !department.isActive });
      toaster.create({ title: t("global.updated", "Updated"), type: "success" });
      fetchDepartments({ page: 0, pageSize: 10, sorting: [], columnFilters: [], globalFilter: "" });
    } catch (err) {
      toaster.create({ title: t("global.update_failed", "Failed to update"), type: "error" });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t("global.confirm_delete", "Are you sure you want to delete this?"))) {
      try {
        await departmentApi.deleteDepartment(id);
        toaster.create({ title: t("global.deleted", "Deleted"), type: "success" });
        fetchDepartments({
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

  const columns = useMemo<MRT_ColumnDef<Department>[]>(() => [
    {
      accessorKey: "code",
      header: t("global.code", "Code"),
      size: 90,
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
      Cell: ({ cell }) => (
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "12px",
            color: "#004371",
            fontWeight: 600,
            backgroundColor: "#E6EEF4",
            padding: "2px 8px",
            borderRadius: "6px",
          }}
        >
          {cell.getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: t("global.department_name", "Department Name"),
      minSize: 200,
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
      Cell: ({ cell }) => (
        <span style={{ fontWeight: 500, color: "#1E293B" }}>
          {cell.getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: "description",
      header: t("global.description", "Description"),
      size: 200,
      muiTableHeadCellProps: { align: "left" },
      muiTableBodyCellProps: { align: "left" },
      Cell: ({ cell }) => (
        <span style={{ color: "#64748b", fontSize: "13px" }}>
          {cell.getValue<string>() || "—"}
        </span>
      ),
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
      Cell: ({ cell }) => (
        <StatusBadge isActive={cell.getValue<boolean>()} />
      ),
    },
    {
      accessorKey: "createdAt",
      header: t("labels.created", "Created"),
      size: 120,
      Filter: DateColumnFilter,
      Cell: ({ cell }) =>
        new Date(cell.getValue<string>()).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "short",
          day: "2-digit",
        }),
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
              onEditDepartment?.(row.original);
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
  ], [t, onEditDepartment]);

  return (
    <DataTable<Department>
      columns={columns}
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
      rowCount={rowCount}
      onFetchData={fetchDepartments}
      initialPageSize={10}
      pageSizeOptions={[5, 10, 25, 50]}
      enableHiding
      enableColumnFilters
    />
  );
}
