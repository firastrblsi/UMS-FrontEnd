import { useMemo, useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import type { MRT_ColumnDef } from "material-react-table";
import { DataTable } from "@/shared/ui/DataTable";
import type { Curriculum, Program } from "../types/university.types";
import { Edit2, Trash2 } from "lucide-react";
import { curriculumApi } from "../api/curriculumApi";
import { programApi } from "../api/programApi";
import { toaster } from "@/components/ui/toaster";

import { useCurriculums } from "../hooks/useCurriculums";

interface CurriculumsGridProps {
  trigger?: number;
  onEditCurriculum?: (curriculum: Curriculum) => void;
}

export function CurriculumsGrid({ trigger, onEditCurriculum }: CurriculumsGridProps) {
  const { t } = useTranslation();
  const { data, rowCount, isLoading, isFetching, fetchCurriculums } = useCurriculums();
  const [programs, setPrograms] = useState<Program[]>([]);

  const fetchPrograms = useCallback(async () => {
    try {
      const res = await programApi.getPrograms({ skip: 0, take: 500 });
      setPrograms(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  useEffect(() => {
    if (trigger && trigger > 0) {
      fetchCurriculums({
        page: 0,
        pageSize: 10,
        sorting: [],
        columnFilters: [],
        globalFilter: "",
      });
    }
  }, [trigger, fetchCurriculums]);

  const handleDelete = async (id: string) => {
    if (window.confirm(t("global.confirm_delete", "Are you sure you want to delete this?"))) {
      try {
        await curriculumApi.deleteCurriculum(id);
        toaster.create({ title: t("global.deleted", "Deleted"), type: "success" });
        fetchCurriculums({
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

  const columns = useMemo<MRT_ColumnDef<Curriculum>[]>(
    () => [
      {
        accessorFn: (row) => row.program?.name || "-",
        id: "program",
        header: t("labels.program_name", "Program Name"),
        minSize: 200,
        filterVariant: 'autocomplete',
        filterSelectOptions: programs.map(p => ({ value: p.name, label: p.name })),
      },
      {
        accessorKey: "yearNumber",
        header: t("labels.year_number", "Year"),
        size: 90,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ cell }) => (
          <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
            L{cell.getValue<number>()}
          </span>
        ),
      },
      {
        accessorKey: "termNumber",
        header: t("labels.term_number", "Term/Semester"),
        size: 130,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ cell }) => (
          <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
            S{cell.getValue<number>()}
          </span>
        ),
      },
      {
        accessorFn: (row) => row.modules?.length || 0,
        id: "moduleCount",
        header: t("labels.modules_count", "Total Modules"),
        size: 130,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
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
                onEditCurriculum?.(row.original);
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
    [t, onEditCurriculum, programs]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
      rowCount={rowCount}
      onFetchData={fetchCurriculums}
    />
  );
}
