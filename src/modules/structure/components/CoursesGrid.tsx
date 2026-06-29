import { useMemo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { MRT_ColumnDef } from "material-react-table";
import { DataTable } from "@/shared/ui/DataTable";
import { useCourses } from "../hooks/useCourses";
import type { Course } from "../types/university.types";
import type { CourseListParams } from "../api/courseApi";
import { Edit2, Trash2, Ban, CheckCircle } from "lucide-react";
import { courseApi } from "../api/courseApi";
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
      {isActive ? t("labels.active", "Active") : t("labels.inactive", "Inactive")}
    </span>
  );
}

interface CoursesGridProps {
  externalFilters?: CourseListParams;
  trigger?: number;
  onEditCourse?: (course: Course) => void;
}

export function CoursesGrid({ externalFilters, trigger, onEditCourse }: CoursesGridProps) {
  const { t } = useTranslation();
  const { data, rowCount, isLoading, isFetching, fetchCourses } = useCourses(externalFilters || {});
  const [teachingModules, setTeachingModules] = useState<any[]>([]);

  useEffect(() => {
    // Fetch teaching modules for the filter
    import("../api/teachingModuleApi").then(({ teachingModuleApi }) => {
      teachingModuleApi.getTeachingModules({ skip: 0, take: 500 }).then(res => setTeachingModules(res.data)).catch(console.error);
    });
  }, []);

  useEffect(() => {
    if (trigger && trigger > 0) {
      fetchCourses({
        page: 0,
        pageSize: 10,
        sorting: [],
        columnFilters: [],
        globalFilter: "",
      });
    }
  }, [trigger, fetchCourses]);

  const handleToggleActivation = async (course: Course) => {
    try {
      await courseApi.updateCourse(course.id, { isActive: !course.isActive });
      toaster.create({ title: t("global.updated", "Updated"), type: "success" });
      fetchCourses({
        page: 0,
        pageSize: 10,
        sorting: [],
        columnFilters: [],
        globalFilter: "",
      });
    } catch (err) {
      toaster.create({ title: t("global.update_failed", "Failed to update"), type: "error" });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t("global.confirm_delete", "Are you sure you want to delete this?"))) {
      try {
        await courseApi.deleteCourse(id);
        toaster.create({ title: t("global.deleted", "Deleted"), type: "success" });
        fetchCourses({
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

  const columns = useMemo<MRT_ColumnDef<Course>[]>(
    () => [
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
        header: t("labels.course_name", "Course Name"),
        minSize: 200,
        muiTableHeadCellProps: { align: "left" },
        muiTableBodyCellProps: { align: "left" },
        Cell: ({ cell }) => (
          <span style={{ fontWeight: 600, color: "#1E293B" }}>
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        accessorFn: (row) => row.teachingModule?.name ? `${row.teachingModule.code} - ${row.teachingModule.name}` : "-",
        id: "teachingModule.name",
        header: t("routes.teaching_modules", "Teaching Module"),
        size: 150,
        filterVariant: 'autocomplete',
        filterSelectOptions: teachingModules.map(m => ({ value: m.name, label: `${m.code} - ${m.name}` })),
        muiTableHeadCellProps: { align: "left" },
        muiTableBodyCellProps: { align: "left" },
      },
      {
        accessorKey: "coefficient",
        header: t("labels.coefficient", "Coefficient"),
        size: 110,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "credits",
        header: t("labels.credits", "Credits"),
        size: 110,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "lectureHours",
        header: t("labels.lecture_hours", "Lecture (H)"),
        size: 110,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "tutorialHours",
        header: t("labels.tutorial_hours", "Tutorial (H)"),
        size: 110,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "isActive",
        header: t("global.status", "Status"),
        size: 120,
        filterVariant: 'select',
        filterSelectOptions: [
          { value: 'true', label: 'Active' },
          { value: 'false', label: 'Inactive' }
        ],
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ cell }) => <StatusBadge isActive={cell.getValue<boolean>()} />,
      },
      {
        id: "actions",
        header: "",
        size: 120,
        muiTableHeadCellProps: { align: "right" },
        muiTableBodyCellProps: { align: "right" },
        Cell: ({ row }) => (
          <div className="flex justify-end items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditCourse?.(row.original);
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
              title={row.original.isActive ? t("global.deactivate", "Deactivate") : t("global.activate", "Activate")}
            >
              {row.original.isActive ? <Ban size={16} /> : <CheckCircle size={16} />}
            </button>
          </div>
        ),
      },
    ],
    [t, onEditCourse]
  );

  return (
    <DataTable<Course>
      key={JSON.stringify(externalFilters)}
      columns={columns}
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
      rowCount={rowCount}
      onFetchData={fetchCourses}
      initialPageSize={10}
      pageSizeOptions={[5, 10, 25, 50]}
      enableHiding
      enableColumnFilters
    />
  );
}
