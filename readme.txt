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
  lighten,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { mkConfig, generateCsv, download } from "export-to-csv";

import { ORIGINS, PROGRAMS, BulkvsBag, MainvsMid } from "../utils/index";

// Utility Functions
const requiredColumns = {
  BatchNumber: "Batch Number",
  BatchDate: "Batch Date",
  MaterialName: "Material Name",
  ConsolidatedUnits: "Consolidated Units",
  Origin: "Origin",
  BulkvsBag: "BulkvsBag",
  MainvsMid: "MainvsMid",
  SpecialTypeOfBean: "Special Type Of Bean",
};

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Incoming-stocks",
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

// API Fetch Functions
const fetchIncomingStock = async (get) => {
  try {
    const data = await get(API_ENDPOINTS.GET_INCOMING_STOCK);
    if (data) {
      return JSON.parse(data);
    } else {
      throw new Error("Received undefined data");
    }
  } catch (error) {
    console.error("Error parsing incoming stock data:", error);
    return [];
  }
};

const fetchFromSnowflake = async (get) => {
  try {
    const response = await get(`${API_ENDPOINTS.GET_INCOMING_STOCK}?refresh=true`);
    if (response) {
      return JSON.parse(response);
    } else {
      throw new Error("Received undefined data from Snowflake");
    }
  } catch (error) {
    console.error("Error parsing Snowflake data:", error);
    return [];
  }
};

const addNewRecord = async (post, newRow) => {
  const response = await post(API_ENDPOINTS.ADD_NEW_RECORD, newRow);
  return response.data;
};

const updateRecords = async (post, updatedRows) => {
  const response = await post(API_ENDPOINTS.UPDATE_RECORDS, updatedRows);
  return response.data;
};

const deleteRecords = async (post, ids) => {
  const response = await post(API_ENDPOINTS.DELETE_RECORDS, { ids });
  return response.data;
};

const IncomingStock = ({ tabIndex }) => {
  // Component State
  const [isUpdatingRecord, setIsUpdatingRecord] = useState(false);
  const [incomingStock, setIncomingStock] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editedRows, setEditedRows] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { get, post } = useApi();

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date)) return '';
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const loadIncomingStock = async () => {
    setIsFetching(true);
    try {
      const data = await fetchIncomingStock(get);
      const formattedData = data.map((row) => ({
        ...row,
        BatchDate: formatDate(row.BatchDate),
      }));
      setIncomingStock(formattedData);
    } catch (error) {
      console.error("Error fetching incoming stock:", error);
      setIncomingStock([]); // Handle empty data gracefully
    } finally {
      setIsFetching(false);
    }
  };

  const handleFetchFromSnowflake = async () => {
    table.reset();
    setIsFetching(true);
    try {
      const data = await fetchFromSnowflake(get);
      const formattedData = data.map((row) => ({
        ...row,
        BatchDate: formatDate(row.BatchDate),
      }));
      setIncomingStock(formattedData);
    } catch (error) {
      console.error("Error fetching Snowflake data:", error);
      setIncomingStock([]); // Handle empty data gracefully
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (tabIndex === 0) {
      loadIncomingStock();
    }
  }, [tabIndex]);

  const handleExportData = () => {
    const filteredData = filterDataForCSV(incomingStock);
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
        if (!row[key] || validationErrors[`${row.id}-${key}`]) {
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
      await updateRecords(post, updatedRows);
      loadIncomingStock();
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
      await deleteRecords(post, idsToDelete);
      loadIncomingStock();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting records:", error);
    }
  };

  const handleCreateNew = async (newRow) => {
    try {
      await addNewRecord(post, newRow);
      loadIncomingStock();
    } catch (error) {
      console.error("Error adding new record:", error);
    }
  };

  const handleSave = () => { };
  const handleCancel = () => { };
  const validateRequired = (value) => !!value.length;

  const handleCellEdit = (cell, value, row) => {
    const columnId = cell.column.id;
    const rowId = row.id;
    let validationError;

    switch (columnId) {
      case 'BatchNumber':
      case 'BatchDate':
      case 'MaterialName':
      case 'ConsolidatedUnits':
      case 'Origin':
      case 'BulkvsBag':
      case 'MainvsMid':
      case 'SpecialTypeOfBean':
      case 'qual_cd':
      case 'qual_ffa':
      case 'qual_cps':
      case 'qual_phe':
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
          ...row.original,
          [columnId]: value,
        },
      }));
    }
  };

  // Table Configuration and Column Definitions
  const columns = useMemo(
    () => [
      {
        accessorKey: "BatchNumber",
        header: "Batch Number",
        size: 80,
        muiEditTextFieldProps: ({ cell, row }) => ({
          variant: "outlined",
          margin: "dense",
          error: !!validationErrors[cell.id],
          helperText: validationErrors[cell.id],
          onBlur: (event) => handleCellEdit(cell, event.target.value, row),
        }),
      },
      {
        accessorKey: "BatchDate",
        header: "Batch Date",
        type: "date",
        muiEditTextFieldProps: ({ cell, row }) => ({
          type: "date",
          variant: "outlined",
          margin: "dense",
          error: !!validationErrors[cell.id],
          helperText: validationErrors[cell.id],
          onBlur: (event) => handleCellEdit(cell, event.target.value, row),
        }),
      },
      {
        accessorKey: "MaterialName",
        header: "Material Name",
        muiEditTextFieldProps: ({ cell, row }) => ({
          variant: "outlined",
          margin: "dense",
          error: !!validationErrors[cell.id],
          helperText: validationErrors[cell.id],
          onBlur: (event) => handleCellEdit(cell, event.target.value, row),
        }),
      },
      {
        accessorKey: "ConsolidatedUnits",
        header: "Consolidated Units",
        muiEditTextFieldProps: ({ cell, row }) => ({
          variant: "outlined",
          margin: "dense",
          error: !!validationErrors[cell.id],
          helperText: validationErrors[cell.id],
          onBlur: (event) => handleCellEdit(cell, event.target.value, row),
        }),
      },
      {
        accessorKey: "Origin",
        header: "Origin",
        editVariant: "select",
        editSelectOptions: ORIGINS,
        filterVariant: "select",
        filterSelectOptions: ORIGINS,
        muiEditTextFieldProps: ({ row }) => ({
          select: true,
          variant: "outlined",
          margin: "dense",
          children: ORIGINS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          )),
          onChange: (event) => {
            setEditedRows((prev) => ({
              ...prev,
              [row.id]: {
                ...row.original,
                Origin: event.target.value,
              },
            }));
          },
        }),
      },
      {
        accessorKey: "BulkvsBag",
        header: "BulkvsBag",
        editVariant: "select",
        editSelectOptions: BulkvsBag,
        filterVariant: "select",
        filterSelectOptions: BulkvsBag,
        muiEditTextFieldProps: ({ row }) => ({
          select: true,
          variant: "outlined",
          margin: "dense",
          children: BulkvsBag.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          )),
          onChange: (event) => {
            setEditedRows((prev) => ({
              ...prev,
              [row.id]: {
                ...row.original,
                BulkvsBag: event.target.value,
              },
            }));
          },
        }),
      },
      {
        accessorKey: "MainvsMid",
        header: "MainvsMid",
        editVariant: "select",
        editSelectOptions: MainvsMid,
        filterVariant: "select",
        filterSelectOptions: MainvsMid,
        muiEditTextFieldProps: ({ row }) => ({
          select: true,
          variant: "outlined",
          margin: "dense",
          children: MainvsMid.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          )),
          onChange: (event) => {
            setEditedRows((prev) => ({
              ...prev,
              [row.id]: {
                ...row.original,
                MainvsMid: event.target.value,
              },
            }));
          },
        }),
      },
      {
        accessorKey: "SpecialTypeOfBean",
        header: "Special Type Of Bean",
        editVariant: "select",
        editSelectOptions: PROGRAMS,
        filterVariant: "select",
        filterSelectOptions: PROGRAMS,
        muiEditTextFieldProps: ({ row }) => ({
          select: true,
          variant: "outlined",
          margin: "dense",
          children: PROGRAMS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          )),
          onChange: (event) => {
            setEditedRows((prev) => ({
              ...prev,
              [row.id]: {
                ...row.original,
                SpecialTypeOfBean: event.target.value,
              },
            }));
          },
        }),
      },
      {
        accessorKey: "qual_cd",
        header: "Qual Cd",
        muiEditTextFieldProps: ({ cell, row }) => ({
          variant: "outlined",
          margin: "dense",
          onBlur: (event) => handleCellEdit(cell, event.target.value, row),
        }),
      },
      {
        accessorKey: "qual_ffa",
        header: "Qual ffa",
        muiEditTextFieldProps: ({ cell, row }) => ({
          variant: "outlined",
          margin: "dense",
          onBlur: (event) => handleCellEdit(cell, event.target.value, row),
        }),
      },
      {
        accessorKey: "qual_cps",
        header: "Qual cps",
        muiEditTextFieldProps: ({ cell, row }) => ({
          variant: "outlined",
          margin: "dense",
          onBlur: (event) => handleCellEdit(cell, event.target.value, row),
        }),
      },
      {
        accessorKey: "qual_phe",
        header: "Qual phe",
        muiEditTextFieldProps: ({ cell, row }) => ({
          variant: "outlined",
          margin: "dense",
          onBlur: (event) => handleCellEdit(cell, event.target.value, row),
        }),
      },
    ],
    [editedRows, validationErrors]
  );

  const table = useMaterialReactTable({
    columns,
    data: incomingStock,
    enableStickyHeader: true,
    positionActionsColumn: "last",
    paginationDisplayMode: "pages",
    createDisplayMode: "modal",
    editDisplayMode: "table",
    // editDisplayMode: "row",
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
    onEditingRowCancel: handleCancel,
    onEditingRowSave: handleSave,
    renderTopToolbarCustomActions: () => (
      <>
        <Box
          sx={{ display: "flex", alignItems: "center", alignSelf: "center" }}
        >
          <MRT_ToggleFiltersButton table={table} />
          <MRT_ShowHideColumnsButton table={table} />
          <Tooltip title={"Download"}>
            <span>
              <IconButton
                onClick={() => {
                  // if (rowsSelected) {
                  handleExportData();
                  // }
                }}
              >
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
          <Button onClick={() => setIsDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default IncomingStock;
