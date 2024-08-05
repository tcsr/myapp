
ADD_CAPACITY_RECORDS: `${API_BASE_URL}/add_capacity_records`,
  UPDATE_WAREHOUSE_CAPACITY: `${API_BASE_URL}/update_capacity_records`,
  DELETE_WAREHOUSE_CAPACITY: `${API_BASE_URL}/delete_capacity_records`,


import { useEffect, useMemo, useState } from "react";
import useApi from "../hooks/useApi";
import { API_ENDPOINTS } from "../api/apiEndpoints";
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ToggleFiltersButton,
  MRT_ShowHideColumnsButton,
  MRT_EditActionButtons,
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

    const payload = {
      records: updatedRows
    };

    try {
      await post(API_ENDPOINTS.UPDATE_WAREHOUSE_CAPACITY, payload);
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
      await post(API_ENDPOINTS.DELETE_WAREHOUSE_CAPACITY, { Sloc: idsToDelete });
      loadWarehouseCapacity();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting records:", error);
    }
  };

  const handleCreateNew = async (newRow) => {
    const formattedRow = newRow?.values;
    const payload = {
      records: [formattedRow]
    }
    try {
      await post(API_ENDPOINTS.ADD_CAPACITY_RECORDS, payload);
      loadWarehouseCapacity();
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding new record:", error);
    }
  };

  const validateRequired = (value) => !!value?.length;

  const validateWarehouseCapacity = (row) => {
    return {
      Plant: !validateRequired(row.Plant) ? 'Plant is Required' : '',
      Warehouse: !validateRequired(row.Warehouse) ? 'Warehouse is Required' : '',
      StorageLocation: !validateRequired(row.StorageLocation) ? 'Storage Location is Required' : '',
      Capacity: !validateRequired(row.Capacity) ? 'Capacity is Required' : '',
      Include: !validateRequired(row.Include) ? 'Include is Required' : '',
    };
  };

  const handleCellEdit = (cell, value, row) => {
    const columnId = cell.column.id;
    const rowId = row.id;

    let errors = validateWarehouseCapacity({ ...row.original, [columnId]: value });
    const validationError = errors[columnId];

    setValidationErrors((prev) => ({
      ...prev,
      [`${rowId}-${columnId}`]: validationError,
    }));

    if (!validationError) {
      setEditedRows((prev) => ({
        ...prev,
        [rowId]: {
          ...row.original,
          [columnId]: value,
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
        muiEditTextFieldProps: ({ cell, row }) => ({
          select: true,
          variant: "outlined",
          margin: "dense",
          error: !!validationErrors[`${row.id}-${cell.column.id}`],
          helperText: validationErrors[`${row.id}-${cell.column.id}`],
          onChange: (event) => handleCellEdit(cell, event.target.value, row),
          children: ["Yes", "No"].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          )),
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
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h6">Add New</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
  });


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
