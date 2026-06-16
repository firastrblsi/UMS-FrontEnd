import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { MRT_ColumnDef } from "material-react-table";
import { DataTable } from "@/shared/ui/DataTable";
import { useRooms } from "../hooks/useRooms";
import type { Room } from "../types/university.types";
import type { RoomFilterParams } from "../api/roomApi";

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
  externalFilters: RoomFilterParams;
}

export function RoomsGrid({ externalFilters }: RoomsGridProps) {
  const { t } = useTranslation();
  const { data, rowCount, isLoading, isFetching, fetchRooms } = useRooms(externalFilters);

  const columns = useMemo<MRT_ColumnDef<Room>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Room Name",
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
        header: "Type",
        size: 140,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "capacity",
        header: "Capacity",
        size: 100,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "building",
        header: "Building",
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
        header: "Floor",
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
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ cell }) => <StatusBadge isActive={cell.getValue<boolean>()} />,
      },
    ],
    [t]
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
    />
  );
}
