import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
  type MRT_TableOptions,
} from "material-react-table";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState, useEffect, useRef } from "react";

// ─── Public types ────────────────────────────────────────────────────────────

export interface FetchDataParams {
  page: number;
  pageSize: number;
  sorting: MRT_SortingState;
  globalFilter: string;
  columnFilters: MRT_ColumnFiltersState;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface DataTableProps<TData extends Record<string, any>> {
  columns: MRT_ColumnDef<TData>[];
  data: TData[];
  isLoading?: boolean;
  isFetching?: boolean;
  rowCount?: number;
  onFetchData?: (params: FetchDataParams) => void;
  initialPageSize?: number;
  pageSizeOptions?: number[];
  enableGlobalFilter?: boolean;
  enableColumnFilters?: boolean;
  enableTopToolbar?: boolean;
  enableHiding?: boolean;
  initialState?: MRT_TableOptions<TData>["initialState"];
  refetchTrigger?: number;
}

// ─── MUI theme matching the app design ───────────────────────────────────────

const muiTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#004371",
      light: "#4888BF",
      dark: "#003258",
      contrastText: "#fff",
    },
    secondary: {
      main: "#21BFC2",
      light: "#57D9DB",
      dark: "#1A979A",
      contrastText: "#fff",
    },
    background: { default: "#F8FAFC", paper: "#FFFFFF" },
    text: { primary: "#1E293B", secondary: "#64748B", disabled: "#94A3B8" },
    divider: "#E2E8F0",
    action: { hover: "#F8FAFC", selected: "#E6EEF4" },
  },
  typography: {
    fontFamily: "'Poppins', system-ui, sans-serif",
    fontSize: 12,
    body1: { fontSize: "13px", lineHeight: 1.5 },
    body2: { fontSize: "12px", lineHeight: 1.5 },
    button: {
      fontFamily: "'Poppins', system-ui, sans-serif",
      fontWeight: 500,
      fontSize: "13px",
      textTransform: "none",
    },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow:
            "0 1px 3px rgba(0,67,113,.08), 0 1px 2px rgba(0,67,113,.04)",
          borderRadius: "12px !important",
          border: "1px solid #E2E8F0",
          overflow: "hidden",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: "#F8FAFC",
          color: "#475569",
          fontWeight: 600,
          fontSize: "12px",
          letterSpacing: "0.01em",
          borderBottomColor: "#E2E8F0",
          padding: "10px 16px",
          fontFamily: "'Poppins', system-ui, sans-serif",
        },
        body: {
          color: "#1E293B",
          fontSize: "13px",
          borderBottomColor: "#F1F5F9",
          padding: "12px 16px",
          fontFamily: "'Poppins', system-ui, sans-serif",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: "background-color 0.12s ease",
          "&:last-child td": { borderBottom: "none" },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { backgroundColor: "#C0D5E7", height: "2px" },
        bar: { backgroundColor: "#004371" },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#64748B",
          "&:hover": { backgroundColor: "#F1F5F9", color: "#004371" },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          fontFamily: "'Poppins', system-ui, sans-serif",
          fontSize: "13px",
          "& fieldset": { borderColor: "#E2E8F0" },
          "&:hover fieldset": { borderColor: "#CBD5E1" },
          "&.Mui-focused fieldset": {
            borderColor: "#004371",
            borderWidth: "1.5px",
          },
        },
        input: { padding: "7px 12px" },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          fontFamily: "'Poppins', system-ui, sans-serif",
          fontSize: "13px",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: "'Poppins', system-ui, sans-serif",
          fontSize: "13px",
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          fontFamily: "'Poppins', system-ui, sans-serif",
          fontSize: "13px",
          color: "#475569",
          borderTop: "1px solid #E2E8F0",
        },
        selectLabel: {
          fontFamily: "'Poppins', system-ui, sans-serif",
          fontSize: "13px",
        },
        displayedRows: {
          fontFamily: "'Poppins', system-ui, sans-serif",
          fontSize: "13px",
        },
        select: {
          fontFamily: "'Poppins', system-ui, sans-serif",
          fontSize: "13px",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#1E293B",
          fontFamily: "'Poppins', system-ui, sans-serif",
          fontSize: "11px",
          borderRadius: "6px",
        },
        arrow: { color: "#1E293B" },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: "'Poppins', system-ui, sans-serif",
          fontWeight: 500,
          textTransform: "none",
          borderRadius: "8px",
          fontSize: "13px",
        },
      },
    },
  },
});

// ─── Component ───────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DataTable<TData extends Record<string, any>>({
  columns,
  data,
  isLoading = false,
  isFetching = false,
  rowCount = 0,
  onFetchData,
  initialPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  enableGlobalFilter = true,
  enableColumnFilters = false,
  enableTopToolbar = true,
  enableHiding = false,
  initialState,
  refetchTrigger = 0,
}: DataTableProps<TData>) {
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    [],
  );
  // Raw input value — shown immediately in the search box
  const [globalFilter, setGlobalFilter] = useState("");
  // Debounced value — used for the actual API call
  const [debouncedGlobalFilter, setDebouncedGlobalFilter] = useState("");

  // Keep the callback ref-stable so it doesn't belong in effect deps
  const onFetchDataRef = useRef(onFetchData);
  useEffect(() => {
    onFetchDataRef.current = onFetchData;
  });

  // Debounce text search and reset to first page
  useEffect(() => {
    const timer = setTimeout(() => {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      setDebouncedGlobalFilter(globalFilter);
    }, 300);
    return () => clearTimeout(timer);
  }, [globalFilter]);

  // Trigger fetch whenever any server-side param or external trigger changes
  useEffect(() => {
    onFetchDataRef.current?.({
      page: pagination.pageIndex,
      pageSize: pagination.pageSize,
      sorting,
      globalFilter: debouncedGlobalFilter,
      columnFilters,
    });
  }, [pagination, sorting, debouncedGlobalFilter, columnFilters, refetchTrigger]);

  const table = useMaterialReactTable<TData>({
    columns,
    data,
    initialState,
    // Server-side mode
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    rowCount,

    // Controlled state
    state: {
      pagination,
      sorting,
      columnFilters,
      globalFilter,
      isLoading,
      showProgressBars: isFetching && !isLoading,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,

    // Feature flags
    enableGlobalFilter,
    enableColumnFilters,
    enableTopToolbar,
    enableHiding,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableColumnActions: false,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    layoutMode: "grid",
    // Pagination display
    paginationDisplayMode: "default",
    muiPaginationProps: {
      rowsPerPageOptions: pageSizeOptions,
      showFirstButton: true,
      showLastButton: true,
    },

    // Paper wraps the whole table — must never grow past its parent.
    // Horizontal scroll lives on the TableContainer inside, not on the Paper.
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: "12px",
        border: "1px solid #E2E8F0",
        overflow: "hidden",
        maxWidth: "100%",
        boxShadow: "0 1px 3px rgba(0,67,113,.08), 0 1px 2px rgba(0,67,113,.04)",
      },
    },

    // Horizontal scroll when resized columns exceed the Paper width
    muiTableContainerProps: {
      sx: { overflowX: "auto", maxWidth: "100%" },
    },

    // Toolbar
    muiTopToolbarProps: {
      sx: {
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E2E8F0",
        padding: "6px 12px",
        minHeight: "52px",
      },
    },
    muiBottomToolbarProps: {
      sx: { backgroundColor: "#FFFFFF" },
    },

    // Header cells
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "#F8FAFC",
        color: "#475569",
        fontWeight: 600,
        fontSize: "12px",
        letterSpacing: "0.01em",
        borderBottomColor: "#E2E8F0 !important",
        "&:hover": { color: "#004371" },
        // Push sort icon to the far-right of the header text
        "& .Mui-TableHeadCell-Content-Labels": {
          gap: "4px",
          overflow: "visible",
        },
        "& .Mui-TableHeadCell-Content-Wrapper": {
          flex: "1 1 auto",
          minWidth: 0,
        },
        // Sort icon always fully visible (MRT default dims unsorted to 0.3)
        "& .MuiTableSortLabel-root": {
          opacity: "1 !important",
        },
        // Resize handle
        "& .MuiDivider-root": {
          borderColor: "#CBD5E1",
          borderRightWidth: "2px",
          "&:hover": { borderColor: "#004371" },
        },
      },
    },

    // Body cells
    muiTableBodyCellProps: {
      sx: {
        color: "#1E293B",
        fontSize: "13px",
        borderBottomColor: "#F1F5F9",
      },
    },

    // Body rows
    muiTableBodyRowProps: {
      sx: {
        transition: "background-color 0.12s ease",
        "&:hover td": { backgroundColor: "#F8FAFC" },
        "&:last-child td": { borderBottom: "none" },
      },
    },

    // Search field
    muiSearchTextFieldProps: {
      placeholder: "Search…",
      size: "small",
      variant: "outlined",
      sx: {
        "& .MuiOutlinedInput-root": { minHeight: "36px", fontSize: "13px" },
      },
    },

    // Loading skeleton rows
    muiSkeletonProps: { animation: "wave" },
  });

  return (
    <ThemeProvider theme={muiTheme}>
      <MaterialReactTable table={table} />
    </ThemeProvider>
  );
}
