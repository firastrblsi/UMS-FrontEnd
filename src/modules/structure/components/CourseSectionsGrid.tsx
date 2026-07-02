import { useMemo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { MRT_ColumnDef } from "material-react-table";
import { DataTable } from "@/shared/ui/DataTable";
import { useCourseSections } from "../hooks/useCourseSections";
import type { CourseSection } from "../types/university.types";
import type { CourseSectionListParams } from "../api/courseSectionApi";
import { Edit2, Trash2, Users, Calendar } from "lucide-react";
import { courseSectionApi } from "../api/courseSectionApi";
import { toaster } from "@/components/ui/toaster";

interface CourseSectionsGridProps {
  externalFilters?: CourseSectionListParams;
  trigger?: number;
  onEditSection?: (section: CourseSection) => void;
  onManageStudents?: (section: CourseSection) => void;
  onScheduleSection?: (section: CourseSection) => void;
}

export function CourseSectionsGrid({ externalFilters, trigger, onEditSection, onManageStudents, onScheduleSection }: CourseSectionsGridProps) {
  const { t } = useTranslation();
  const { data, rowCount, isLoading, isFetching, fetchCourseSections } = useCourseSections(externalFilters || {});
  
  const [courses, setCourses] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [classGroups, setClassGroups] = useState<any[]>([]);

  useEffect(() => {
    import("../api/courseApi").then(({ courseApi }) => {
      courseApi.getCourses({ skip: 0, take: 500 }).then(res => setCourses(res.data)).catch(console.error);
    });
    import("../api/semesterApi").then(({ semesterApi }) => {
      semesterApi.getSemesters({ skip: 0, take: 500 }).then(res => setSemesters(res.data)).catch(console.error);
    });
    import("../api/classGroupApi").then(({ classGroupApi }) => {
      classGroupApi.getClassGroups({ skip: 0, take: 500 }).then(res => setClassGroups(res.data)).catch(console.error);
    });
  }, []);

  useEffect(() => {
    if (trigger && trigger > 0) {
      fetchCourseSections({
        page: 0,
        pageSize: 10,
        sorting: [],
        columnFilters: [],
        globalFilter: "",
      });
    }
  }, [trigger, fetchCourseSections]);

  const handleDelete = async (id: string) => {
    if (window.confirm(t("global.confirm_delete", "Are you sure you want to delete this?"))) {
      try {
        await courseSectionApi.deleteCourseSection(id);
        toaster.create({ title: t("global.deleted", "Deleted"), type: "success" });
        fetchCourseSections({
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

  const columns = useMemo<MRT_ColumnDef<CourseSection>[]>(
    () => [
      {
        accessorFn: (row) => row.course ? `${row.course.code} - ${row.course.name}` : "-",
        id: "course.code",
        header: t("routes.courses", "Course"),
        size: 200,
        filterVariant: 'autocomplete',
        filterSelectOptions: courses.map(c => ({ value: c.code, label: `${c.code} - ${c.name}` })),
        muiTableHeadCellProps: { align: "left" },
        muiTableBodyCellProps: { align: "left" },
      },
      {
        accessorFn: (row) => row.semester ? row.semester.name : "-",
        id: "semester.name",
        header: t("routes.semesters", "Semester"),
        size: 150,
        filterVariant: 'autocomplete',
        filterSelectOptions: semesters.map(s => ({ value: s.name, label: s.name })),
        muiTableHeadCellProps: { align: "left" },
        muiTableBodyCellProps: { align: "left" },
      },
      {
        accessorFn: (row) => row.classGroup ? row.classGroup.name : "-",
        id: "classGroup.name",
        header: t("routes.class_groups", "Class Group"),
        size: 150,
        filterVariant: 'autocomplete',
        filterSelectOptions: classGroups.map(cg => ({ value: cg.name, label: cg.name })),
        muiTableHeadCellProps: { align: "left" },
        muiTableBodyCellProps: { align: "left" },
      },
      {
        accessorFn: (row) => row.teacher ? `${row.teacher.user.firstName} ${row.teacher.user.lastName}` : "-",
        id: "teacher.user.lastName",
        header: t("roles.teacher", "Teacher"),
        size: 150,
        muiTableHeadCellProps: { align: "left" },
        muiTableBodyCellProps: { align: "left" },
      },
      {
        id: "actions",
        header: "",
        size: 100,
        muiTableHeadCellProps: { align: "right" },
        muiTableBodyCellProps: { align: "right" },
        Cell: ({ row }) => (
          <div className="flex justify-end items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onScheduleSection?.(row.original);
              }}
              className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
              title={t("global.schedule_class", "Schedule Class")}
            >
              <Calendar size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onManageStudents?.(row.original);
              }}
              className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
              title={t("enrollments.manage_students", "Manage Students")}
            >
              <Users size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditSection?.(row.original);
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
          </div>
        ),
      },
    ],
    [t, onEditSection, onManageStudents, onScheduleSection, courses, semesters, classGroups]
  );

  return (
    <DataTable<CourseSection>
      key={JSON.stringify(externalFilters)}
      columns={columns}
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
      rowCount={rowCount}
      onFetchData={fetchCourseSections}
      initialPageSize={10}
      pageSizeOptions={[5, 10, 25, 50]}
      enableHiding
      enableColumnFilters
    />
  );
}
