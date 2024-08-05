import { useEffect, useMemo, useState } from "react";
import useApi from "../hooks/useApi";
import { API_ENDPOINTS } from "../api/apiEndpoints";
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ToggleFiltersButton,
  MRT_ShowHideColumnsButton,
} from "material-react-table";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  lighten,
} from "@mui/material";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { ORIGINS, PROGRAMS, BulkvsBag, MainvsMid } from "../utils/index";

const requiredColumns = {
  sloc: "Sloc",
  capacity: "Capacity",
  warehouse: "Warehouse",
  main_vs_mid: "Main vs Mid",
  bulk_vs_bag: "Bulk vs Bag",
  bean_type: "Bean Type",
  origin: "Origin",
  current_stock: "Current Stock",
  qual_cd_avg: "Qual Cd Avg",
  qual_ffa_avg: "Qual Ffa Avg",
  qual_phe_avg: "Qual Phe Avg",
  qual_cps_avg: "Qual Cps Avg",
};

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Existing-stocks",
  headers: Object.values(requiredColumns),
});

const filterDataForCSV = (data) => {
  return data.map((row) => {
    const filteredRow = {};
    Object.keys(requiredColumns).forEach((key) => {
      filteredRow[requiredColumns[key]] = row[key];
    });
    return filteredRow;
  });
};

const ExistingStock = ({ tabIndex }) => {
  const { get, post } = useApi();
  const [isUpdatingRecord, setIsUpdatingRecord] = useState(false);
  const [existingStock, setExistingStock] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editedRows, setEditedRows] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const loadExistingStock = async () => {
    setIsFetching(true);
    try {
      const data = await get(API_ENDPOINTS.GET_EXISTING_STOCK);
      const formattedData = data.map((row) => ({
        ...row,
        // Any necessary formatting can be done here
      }));
      setExistingStock(formattedData);
    } catch (error) {
      console.error("Error fetching existing stock:", error);
      setExistingStock([]); // Handle empty data gracefully
    } finally {
      setIsFetching(false);
    }
  };

  const handleFetchFromSnowflake = async () => {
    table.reset();
    setIsFetching(true);
    try {
      const response = await get(`${API_ENDPOINTS.GET_EXISTING_STOCK}?refresh=true`);
      const data = response.map((row) => ({
        ...row,
        // Any necessary formatting can be done here
      }));
      setExistingStock(data);
    } catch (error) {
      console.error("Error fetching Snowflake data:", error);
      setExistingStock([]); // Handle empty data gracefully
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (tabIndex === 1) {
      loadExistingStock();
    }
  }, [tabIndex]);

  const handleExportData = () => {
    const filteredData = filterDataForCSV(existingStock);
    const csv = generateCsv(csvConfig)(filteredData);
    download(csvConfig)(csv);
    table.setState((prevState) => ({
      ...prevState,
      rowSelection: {},
    }));
  };

  const handleSaveRecords = async () => {
    const updatedRows = Object.values(editedRows);
    console.log(updatedRows);

    const validationErrorsExist = updatedRows.some(row => {
      return Object.keys(requiredColumns).some(key => {
        if ((row[key] === undefined || row[key] === null || row[key] === '') && row[key] !== 0) {
          setValidationErrors(prev => ({ ...prev, [`${row.id}-${key}`]: 'Required' }));
          return true;
        }
        return false;
      });
    });

    if (validationErrorsExist) {
      alert("Please fill all required fields before saving.");
      return;
    }

    if (updatedRows.length === 0) return;

    setIsUpdatingRecord(true);
    try {
      await post(API_ENDPOINTS.UPDATE_RECORDS, updatedRows);
      loadExistingStock();
      setEditedRows({});
    } catch (error) {
      console.error("Error saving records:", error);
    } finally {
      setIsUpdatingRecord(false);
    }
  };

  const handleDelete = async () => {
    const idsToDelete = selectedRows.map((row) => row.id);
    try {
      await post(API_ENDPOINTS.DELETE_RECORDS, { ids: idsToDelete });
      loadExistingStock();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting records:", error);
    }
  };

  const handleCreateNew = async (newRow) => {
    try {
      await post(API_ENDPOINTS.ADD_NEW_RECORD, newRow);
      loadExistingStock();
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding new record:", error);
    }
  };

  const validateRequired = (value) => value !== undefined && value !== null && value !== '';

  const handleCellEdit = (cell, value, row) => {
    const columnId = cell.column.id;
    const rowId = row.id;
    let validationError;

    switch (columnId) {
      case 'sloc':
      case 'capacity':
      case 'warehouse':
      case 'main_vs_mid':
      case 'bulk_vs_bag':
      case 'bean_type':
      case 'origin':
      case 'current_stock':
      case 'qual_cd_avg':
      case 'qual_ffa_avg':
      case 'qual_phe_avg':
      case 'qual_cps_avg':
        validationError = !validateRequired(value) ? 'Required' : undefined;
        break;
      default:
        validationError = undefined;
    }

    setValidationErrors((prev) => ({
      ...prev,
      [`${rowId}-${columnId}`]: validationError,
    }));

    if (!validationError) {
      setEditedRows((prev) => ({
        ...prev,
        [rowId]: {
          ...row.original,  // Use original row values
          [columnId]: value,  // Update only the edited column
        },
      }));
    } else {
      setEditedRows((prev) => {
        const { [rowId]: editedRow, ...rest } = prev;
        return rest;
      });
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "sloc",
        header: "Sloc",
        size: 80,
        muiEditTextFieldProps: ({ cell, row }) => ({
          variant: "outlined",
          margin: "dense",
          required: true,
          error: !!validationErrors[`${row.id}-${cell.column.id}`],
          helperText: validationErrors[`${row.id}-${cell.column.id}`],
          onBlur: (event) => handleCellEdit(cell, event.target.value, row),
        }),
      },
      {
        accessorKey: "capacity",
        header: "Capacity",
        muiEditTextFieldProps: ({ cell, row }) => ({
          variant: "outlined",
          margin: "dense",
          required: true,
          error: !!validationErrors[`${row.id}-${cell.column.id}`],
          helperText: validationErrors[`${row.id}-${cell.column.id}`],
          onBlur: (event) => handleCellEdit(cell, event.target.value, row),
        }),
      },
      {
        accessorKey: "warehouse",
        header: "Warehouse",
        muiEditTextFieldProps: ({ cell, row }) => ({
          variant: "outlined",
          margin: "dense",
          required: true,
          error: !!validationErrors[`${row.id}-${cell.column.id}`],
          helperText: validationErrors[`${row.id}-${cell.column.id}`],
          onBlur: (event) => handleCellEdit(cell, event.target.value, row),
        }),
      },
      {
        accessorKey: "main_vs_mid",
        header: "Main vs Mid",
        editVariant: "select",
        editSelectOptions: MainvsMid,
        filterVariant: "select",
        filterSelectOptions: MainvsMid,
        muiEditTextFieldProps: ({ row }) => ({
          select: true,
          variant: "outlined",
          margin: "dense",
          required: true,
          error: !!validationErrors[`${row.id}-main_vs_mid`],
          helperText: validationErrors[`${row.id}-main_vs_mid`],
          children: MainvsMid.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          )),
          onChange: (event) => {
            const value = event.target.value;
            handleCellEdit({ column: { id: 'main_vs_mid' }, id: row.id }, value, row);
          },
        }),
      },
      {
        accessorKey: "bulk_vs_bag",
        header: "Bulk vs Bag",
        editVariant: "select",
        editSelectOptions: BulkvsBag,
        filterVariant: "select",
        filterSelectOptions: BulkvsBag,
        muiEditTextFieldProps: ({ row }) => ({
          select: true,
          variant: "outlined",
          margin: "dense",
          required: true,
          error: !!validationErrors[`${row.id}-bulk_vs_bag`],
          helperText: validationErrors[`${row.id}-bulk_vs_bag`],
          children: BulkvsBag.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          )),
          onChange: (event) => {
            const value = event.target.value;
            handleCellEdit({ column: { id: 'bulk_vs_bag' }, id: row.id }, value, row);
          },
        }),
      },
      {
        accessorKey: "bean_type",
        header: "Bean Type",
        editVariant: "select",
        editSelectOptions: PROGRAMS,
        filterVariant: "select",
        filterSelectOptions: PROGRAMS,
        muiEditTextFieldProps: ({ row }) => ({
          select: true,
          variant: "outlined",
          margin: "dense",
          required: true,
          error: !!validationErrors[`${row.id}-bean_type`],
          helperText: validationErrors[`${row.id}-bean_type`],
          children: PROGRAMS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          )),
          onChange: (event) => {
            const value = event.target.value;
            handleCellEdit({ column: { id: 'bean_type' }, id: row.id }, value, row);
          },
        }),
      },
      {
        accessorKey: "origin",
        header: "Origin",
        editVariant: "select",
        editSelectOptions: ORIGINS,
        filterVariant: "select",
        filterSelectOptions: ORIGINS,
        muiEditTextFieldProps: ({ row }) => ({
          select: true,
          variant: "outlined",
          margin: "dense",
          required: true,
          error: !!validationErrors[`${row.id}-origin`],
          helperText: validationErrors[`${row.id}-origin`],
          children: ORIGINS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          )),
          onChange: (event) => {
            const value = event.target.value;
            handleCellEdit({ column: { id: 'origin' }, id: row.id }, value, row);
          },
        }),
      },
      {
        accessorKey: "current_stock",
        header: "Current Stock",
        muiEditTextFieldProps: ({ cell, row }) => ({
          variant: "outlined",
          margin: "dense",
          required: true,
          error: !!validationErrors[`${row.id}-${cell.column.id}`],
          helperText: validationErrors[`${row.id}-${cell.column.id}`],
          onBlur: (event) => handleCellEdit(cell, event.target.value, row),
        }),
      },
      {
        accessorKey: "qual_cd_avg",
        header: "Qual Cd Avg",
        muiEditTextFieldProps: ({ cell, row }) => ({
          variant: "outlined",
          margin: "dense",
          required: true,
          error: !!validationErrors[`${row.id}-${cell.column.id}`],
          helperText: validationErrors[`${row.id}-${cell.column.id}`],
          onBlur: (event) => handleCellEdit(cell, event.target.value, row),
        }),
      },
      {
        accessorKey: "qual_ffa_avg",
        header: "Qual Ffa Avg",
        muiEditTextFieldProps: ({ cell, row }) => ({
          variant: "outlined",
          margin: "dense",
          required: true,
          error: !!validationErrors[`${row.id}-${cell.column.id}`],
          helperText: validationErrors[`${row.id}-${cell.column.id}`],
          onBlur: (event) => handleCellEdit(cell, event.target.value, row),
        }),
      },
      {
        accessorKey: "qual_phe_avg",
        header: "Qual Phe Avg",
        muiEditTextFieldProps: ({ cell, row }) => ({
          variant: "outlined",
          margin: "dense",
          required: true,
          error: !!validationErrors[`${row.id}-${cell.column.id}`],
          helperText: validationErrors[`${row.id}-${cell.column.id}`],
          onBlur: (event) => handleCellEdit(cell, event.target.value, row),
        }),
      },
      {
        accessorKey: "qual_cps_avg",
        header: "Qual Cps Avg",
        muiEditTextFieldProps: ({ cell, row }) => ({
          variant: "outlined",
          margin: "dense",
          required: true,
          error: !!validationErrors[`${row.id}-${cell.column.id}`],
          helperText: validationErrors[`${row.id}-${cell.column.id}`],
          onBlur: (event) => handleCellEdit(cell, event.target.value, row),
        }),
      },
    ],
    [editedRows, validationErrors]
  );

  const table = useMaterialReactTable({
    columns,
    data: existingStock,
    enableStickyHeader: true,
    positionActionsColumn: "last",
    paginationDisplayMode: "pages",
    createDisplayMode: "modal",
    editDisplayMode: "table",
    enableRowSelection: true,
    enableEditing: true,
    state: {
      isLoading: isFetching,
      showProgressBars: isFetching,
    },
    initialState: {
      showColumnFilters: true,
      showGlobalFilter: true,
      density: "compact",
      pagination: { pageSize: 20, pageIndex: 0 },
      columnPinning: {
        left: ["mrt-row-select"],
        right: ["mrt-row-actions"],
      },
    },
    muiCircularProgressProps: {
      color: "primary",
      thickness: 5,
      size: 55,
    },
    muiSkeletonProps: {
      animation: "wave",
      height: 28,
    },
    muiPaginationProps: {
      showFirstButton: true,
      showLastButton: true,
    },
    muiSearchTextFieldProps: {
      placeholder: "Enter keyword to search...",
      sx: { minWidth: "30rem" },
      variant: "outlined",
    },
    muiFilterTextFieldProps: {
      // variant: "outlined",
    },
    displayColumnDefOptions: {
      "mrt-row-actions": {
        enableHiding: false,
      },
    },
    getRowId: (row) => row.id,
    onCreatingRowSave: handleCreateNew,
    onEditingRowCancel: () => setEditedRows({}),
    onEditingRowSave: handleSaveRecords,
    renderTopToolbarCustomActions: () => (
      <>
        <Box sx={{ display: "flex", alignItems: "center", alignSelf: "center" }}>
          <MRT_ToggleFiltersButton table={table} />
          <MRT_ShowHideColumnsButton table={table} />
          <Tooltip title={"Download"}>
            <span>
              <IconButton onClick={handleExportData}>
                <SaveAltIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </>
    ),
    renderToolbarInternalActions: ({ table }) => (
      <>
        <Box
          sx={(theme) => ({
            backgroundColor: lighten(theme.palette.background.default, 0.05),
            display: "flex",
            gap: "1rem",
            p: "8px",
            justifyContent: "space-between",
            alignItems: "center",
          })}
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              table.setCreatingRow(true);
            }}
            startIcon={<AddIcon />}
            className="custom-btn"
          >
            Add New
          </Button>
          <Button
            color="success"
            variant="contained"
            size="large"
            startIcon={<SaveIcon />}
            onClick={handleSaveRecords}
            className="custom-btn"
            disabled={Object.keys(editedRows).length === 0}
          >
            {isUpdatingRecord ? <CircularProgress size={25} /> : "Save"}
          </Button>
          <Box>
            <Box sx={{ display: "flex", gap: "0.5rem" }}>
              <Button
                color="error"
                variant="contained"
                size="large"
                startIcon={<DeleteIcon />}
                disabled={!table.getIsSomeRowsSelected()}
                onClick={() => setIsDeleteDialogOpen(true)}
                className="custom-btn"
              >
                Delete
              </Button>
            </Box>
          </Box>
        </Box>
      </>
    ),
  });

  const handleAddDialogClose = (_, reason) => {
    if (reason && reason !== "backdropClick") {
      setIsAddDialogOpen(false);
    }
  };

  return (
    <>
      <Box>
        <Stack
          direction="row"
          spacing={10}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <Button
            variant="contained"
            size="large"
            className="custom-btn"
            onClick={handleFetchFromSnowflake}
          >
            Import Snowflake Data
          </Button>
          <Button
            variant="contained"
            size="large"
            className="custom-btn"
            onClick={handleExportData}
          >
            Import CSV File
          </Button>
        </Stack>
      </Box>
      <MaterialReactTable table={table} />
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the selected records?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)} color="primary" variant="outlined" className="custom-btn">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary" variant="contained" className="custom-btn">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ExistingStock;


===============

import { useEffect, useMemo, useState } from "react";
import useApi from "../hooks/useApi";
import { API_ENDPOINTS } from "../api/apiEndpoints";
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ToggleFiltersButton,
  MRT_ShowHideColumnsButton,
} from "material-react-table";
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  lighten,
  CircularProgress,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  MenuItem,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { mkConfig, generateCsv, download } from "export-to-csv";

const requiredColumns = {
  Plant: "Plant",
  Warehouse: "Warehouse",
  StorageLocation: "Storage Location",
  Capacity: "Capacity",
  Include: "Include",
};

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Warehouse-capacity",
  headers: Object.values(requiredColumns),
});

const filterDataForCSV = (data) => {
  return data.map((row) => {
    const filteredRow = {};
    Object.keys(requiredColumns).forEach((key) => {
      filteredRow[requiredColumns[key]] = row[key];
    });
    return filteredRow;
  });
};

const WarehouseCapacity = ({ tabIndex }) => {
  const { get, post } = useApi();
  const [isUpdatingRecord, setIsUpdatingRecord] = useState(false);
  const [warehouseCapacity, setWarehouseCapacity] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editedRows, setEditedRows] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const loadWarehouseCapacity = async () => {
    setIsFetching(true);
    try {
      const data = await get(API_ENDPOINTS.GET_WAREHOUSE_CAPACITY);
      const formattedData = data.map((row) => ({
        ...row,
      }));
      setWarehouseCapacity(formattedData);
    } catch (error) {
      console.error("Error fetching warehouse capacity:", error);
      setWarehouseCapacity([]);
    } finally {
      setIsFetching(false);
    }
  };

  const handleFetchFromSnowflake = async () => {
    table.reset();
    setIsFetching(true);
    try {
      const response = await get(`${API_ENDPOINTS.GET_WAREHOUSE_CAPACITY}?refresh=true`);
      const data = response.map((row) => ({
        ...row,
      }));
      setWarehouseCapacity(data);
    } catch (error) {
      console.error("Error fetching Snowflake data:", error);
      setWarehouseCapacity([]);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (tabIndex === 2) {
      loadWarehouseCapacity();
    }
  }, [tabIndex]);

  const handleExportData = () => {
    const filteredData = filterDataForCSV(warehouseCapacity);
    const csv = generateCsv(csvConfig)(filteredData);
    download(csvConfig)(csv);
    table.setState((prevState) => ({
      ...prevState,
      rowSelection: {},
    }));
  };

  const handleSaveRecords = async () => {
    const updatedRows = Object.values(editedRows);

    const validationErrorsExist = updatedRows.some(row => {
      return Object.keys(requiredColumns).some(key => {
        if ((row[key] === undefined || row[key] === null || row[key] === '') && row[key] !== 0) {
          setValidationErrors(prev => ({ ...prev, [`${row.id}-${key}`]: 'Required' }));
          return true;
        }
        return false;
      });
    });

    if (validationErrorsExist) {
      alert("Please fill all required fields before saving.");
      return;
    }

    if (updatedRows.length === 0) return;

    setIsUpdatingRecord(true);
    try {
      await post(API_ENDPOINTS.UPDATE_WAREHOUSE_CAPACITY, updatedRows);
      loadWarehouseCapacity();
      setEditedRows({});
    } catch (error) {
      console.error("Error saving records:", error);
    } finally {
      setIsUpdatingRecord(false);
    }
  };

  const handleDelete = async () => {
    const idsToDelete = selectedRows.map((row) => row.id);
    try {
      await post(API_ENDPOINTS.DELETE_WAREHOUSE_CAPACITY, { ids: idsToDelete });
      loadWarehouseCapacity();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting records:", error);
    }
  };

  const handleCreateNew = async (newRow) => {
    try {
      await post(API_ENDPOINTS.ADD_WAREHOUSE_CAPACITY, newRow);
      loadWarehouseCapacity();
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding new record:", error);
    }
  };

  const validateRequired = (value) => value !== undefined && value !== null && value !== '';

  const handleCellEdit = (cell, value, row) => {
    const columnId = cell.column.id;
    const rowId = row.id;
    let validationError;

    switch (columnId) {
      case 'Plant':
      case 'Warehouse':
      case 'StorageLocation':
      case 'Capacity':
      case 'Include':
        validationError = !validateRequired(value) ? 'Required' : undefined;
        break;
      default:
        validationError = undefined;
    }

    setValidationErrors((prev) => ({
      ...prev,
      [`${rowId}-${columnId}`]: validationError,
    }));

    if (!validationError) {
      setEditedRows((prev) => ({
        ...prev,
        [rowId]: {
          ...row.original,  // Use original row values
          [columnId]: value,  // Update only the edited column
        },
      }));
    } else {
      setEditedRows((prev) => {
        const { [rowId]: editedRow, ...rest } = prev;
        return rest;
      });
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "Plant",
        header: "Plant",
        size: 80,
        muiEditTextFieldProps: ({ cell, row }) => ({
          variant: "outlined",
          margin: "dense",
          required: true,
          error: !!validationErrors[`${row.id}-${cell.column.id}`],
          helperText: validationErrors[`${row.id}-${cell.column.id}`],
          onBlur: (event) => handleCellEdit(cell, event.target.value, row),
        }),
      },
      {
        accessorKey: "Warehouse",
        header: "Warehouse",
        muiEditTextFieldProps: ({ cell, row }) => ({
          variant: "outlined",
          margin: "dense",
          required: true,
          error: !!validationErrors[`${row.id}-${cell.column.id}`],
          helperText: validationErrors[`${row.id}-${cell.column.id}`],
          onBlur: (event) => handleCellEdit(cell, event.target.value, row),
        }),
      },
      {
        accessorKey: "StorageLocation",
        header: "Storage Location",
        muiEditTextFieldProps: ({ cell, row }) => ({
          variant: "outlined",
          margin: "dense",
          required: true,
          error: !!validationErrors[`${row.id}-${cell.column.id}`],
          helperText: validationErrors[`${row.id}-${cell.column.id}`],
          onBlur: (event) => handleCellEdit(cell, event.target.value, row),
        }),
      },
      {
        accessorKey: "Capacity",
        header: "Capacity",
        muiEditTextFieldProps: ({ cell, row }) => ({
          variant: "outlined",
          margin: "dense",
          required: true,
          error: !!validationErrors[`${row.id}-${cell.column.id}`],
          helperText: validationErrors[`${row.id}-${cell.column.id}`],
          onBlur: (event) => handleCellEdit(cell, event.target.value, row),
        }),
      },
      {
        accessorKey: "Include",
        header: "Include",
        editVariant: "select",
        editSelectOptions: ["Yes", "No"],
        filterVariant: "select",
        filterSelectOptions: ["Yes", "No"],
        muiEditTextFieldProps: ({ row }) => ({
          select: true,
          variant: "outlined",
          margin: "dense",
          required: true,
          error: !!validationErrors[`${row.id}-Include`],
          helperText: validationErrors[`${row.id}-Include`],
          children: ["Yes", "No"].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          )),
          onChange: (event) => {
            const value = event.target.value;
            handleCellEdit({ column: { id: 'Include' }, id: row.id }, value, row);
          },
        }),
      },
    ],
    [editedRows, validationErrors]
  );

  const table = useMaterialReactTable({
    columns,
    data: warehouseCapacity,
    enableStickyHeader: true,
    positionActionsColumn: "last",
    paginationDisplayMode: "pages",
    createDisplayMode: "modal",
    editDisplayMode: "table",
    enableRowSelection: true,
    enableEditing: true,
    state: {
      isLoading: isFetching,
      showProgressBars: isFetching,
    },
    initialState: {
      showColumnFilters: true,
      showGlobalFilter: true,
      density: "compact",
      pagination: { pageSize: 20, pageIndex: 0 },
      columnPinning: {
        left: ["mrt-row-select", "Plant"],
        right: ["mrt-row-actions"],
      },
    },
    muiCircularProgressProps: {
      color: "primary",
      thickness: 5,
      size: 55,
    },
    muiSkeletonProps: {
      animation: "wave",
      height: 28,
    },
    muiPaginationProps: {
      showFirstButton: true,
      showLastButton: true,
    },
    muiSearchTextFieldProps: {
      placeholder: "Enter keyword to search...",
      sx: { minWidth: "30rem" },
      variant: "outlined",
    },
    muiFilterTextFieldProps: {
      // variant: "outlined",
    },
    displayColumnDefOptions: {
      "mrt-row-actions": {
        enableHiding: false,
      },
    },
    getRowId: (row) => row.id,
    onCreatingRowSave: handleCreateNew,
    onEditingRowCancel: () => setEditedRows({}),
    onEditingRowSave: handleSaveRecords,
    renderTopToolbarCustomActions: () => (
      <>
        <Box sx={{ display: "flex", alignItems: "center", alignSelf: "center" }}>
          <MRT_ToggleFiltersButton table={table} />
          <MRT_ShowHideColumnsButton table={table} />
          <Tooltip title={"Download"}>
            <span>
              <IconButton onClick={handleExportData}>
                <SaveAltIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </>
    ),
    renderToolbarInternalActions: ({ table }) => (
      <>
        <Box
          sx={(theme) => ({
            backgroundColor: lighten(theme.palette.background.default, 0.05),
            display: "flex",
            gap: "1rem",
            p: "8px",
            justifyContent: "space-between",
            alignItems: "center",
          })}
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              table.setCreatingRow(true);
            }}
            startIcon={<AddIcon />}
            className="custom-btn"
          >
            Add New
          </Button>
          <Button
            color="success"
            variant="contained"
            size="large"
            startIcon={<SaveIcon />}
            onClick={handleSaveRecords}
            className="custom-btn"
            disabled={Object.keys(editedRows).length === 0}
          >
            {isUpdatingRecord ? <CircularProgress size={25} /> : "Save"}
          </Button>
          <Box>
            <Box sx={{ display: "flex", gap: "0.5rem" }}>
              <Button
                color="error"
                variant="contained"
                size="large"
                startIcon={<DeleteIcon />}
                disabled={!table.getIsSomeRowsSelected()}
                onClick={() => setIsDeleteDialogOpen(true)}
                className="custom-btn"
              >
                Delete
              </Button>
            </Box>
          </Box>
        </Box>
      </>
    ),
  });

  const handleAddDialogClose = (_, reason) => {
    if (reason && reason !== "backdropClick") {
      setIsAddDialogOpen(false);
    }
  };

  return (
    <>
      <Box>
        <Stack
          direction="row"
          spacing={10}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <Button
            variant="contained"
            size="large"
            className="custom-btn"
            onClick={handleFetchFromSnowflake}
          >
            Import Snowflake Data
          </Button>
          <Button
            variant="contained"
            size="large"
            className="custom-btn"
            onClick={handleExportData}
          >
            Import CSV File
          </Button>
        </Stack>
      </Box>
      <MaterialReactTable table={table} />
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the selected records?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)} color="primary" variant="outlined" className="custom-btn">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary" variant="contained" className="custom-btn">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default WarehouseCapacity;

