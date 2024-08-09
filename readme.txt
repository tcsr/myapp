
import React, { useMemo, useState, useCallback } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ToggleFiltersButton,
  MRT_ShowHideColumnsButton,
  MRT_EditActionButtons,
} from "material-react-table";
import { Box, TextField, Button, CircularProgress, MenuItem, Select } from "@mui/material";
import { Edit, Save, Cancel } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// Utility function to debounce
function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

const convertToReadableHeader = (key) => {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const DynamicTable = ({ data }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(() =>
    JSON.parse(JSON.stringify(data))
  );
  const [editedData, setEditedData] = useState(() =>
    JSON.parse(JSON.stringify(data))
  );
  const [updatedRows, setUpdatedRows] = useState({});
  const [loading, setLoading] = useState(false);

  const dropdownOptions = ["Option 1", "Option 2", "Option 3"];

  // Handle the change of editable cell with debouncing
  const handleEditChange = useCallback(
    debounce((value, rowIndex, columnKey) => {
      setEditedData((prevData) => {
        const newData = [...prevData];
        newData[rowIndex][columnKey] = value;
        return newData;
      });

      setUpdatedRows((prev) => {
        const updated = { ...prev };
        if (!updated[rowIndex]) {
          updated[rowIndex] = { ...editedData[rowIndex], [columnKey]: value };
        } else {
          updated[rowIndex][columnKey] = value;
        }
        return updated;
      });
    }, 300),
    [editedData]
  );

  const handleDateChange = (newValue, rowIndex, columnKey) => {
    setEditedData((prevData) => {
      const newData = [...prevData];
      newData[rowIndex][columnKey] = newValue;
      return newData;
    });

    setUpdatedRows((prev) => {
      const updated = { ...prev };
      if (!updated[rowIndex]) {
        updated[rowIndex] = { ...editedData[rowIndex], [columnKey]: newValue };
      } else {
        updated[rowIndex][columnKey] = newValue;
      }
      return updated;
    });
  };

  const columns = useMemo(() => {
    return (
      data.length > 0 &&
      Object.keys(data[0]).map((key) => {
        return {
          accessorKey: key,
          header: convertToReadableHeader(key),
          enableEditing: true,
          Cell: ({ cell, row }) => {
            if (!isEditing) {
              return <span>{cell.getValue()}</span>;
            }

            if (key === "status") {
              return (
                <Select
                  value={editedData[row.index][key] || ""}
                  onChange={(e) => handleEditChange(e.target.value, row.index, key)}
                  variant="standard"
                  fullWidth
                >
                  {dropdownOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              );
            } else if (key === "date") {
              return (
                <DatePicker
                  value={editedData[row.index][key] || null}
                  onChange={(newValue) => handleDateChange(newValue, row.index, key)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              );
            } else {
              return (
                <TextField
                  value={editedData[row.index][key] || ""}
                  onChange={(e) => handleEditChange(e.target.value, row.index, key)}
                  variant="standard"
                  fullWidth
                />
              );
            }
          },
        };
      })
    );
  }, [data, isEditing, editedData, handleEditChange]);

  const handleSaveClick = () => {
    console.log("Updated rows:", updatedRows);
    setOriginalData(JSON.parse(JSON.stringify(editedData)));
    setUpdatedRows({});
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setEditedData(JSON.parse(JSON.stringify(originalData)));
    setUpdatedRows({});
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setLoading(true);
    setTimeout(() => {
      setIsEditing(true);
      setLoading(false);
    }, 500);
  };

  return (
    <Box position="relative">
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        {!isEditing ? (
          <Button
            startIcon={<Edit />}
            variant="contained"
            onClick={handleEditClick}
            disabled={loading}
          >
            Edit
          </Button>
        ) : (
          <>
            <Button
              startIcon={<Save />}
              variant="contained"
              color="primary"
              onClick={handleSaveClick}
              sx={{ mr: 1 }}
              disabled={loading}
            >
              Save
            </Button>
            <Button
              startIcon={<Cancel />}
              variant="contained"
              color="secondary"
              onClick={handleCancelClick}
              disabled={loading}
            >
              Cancel
            </Button>
          </>
        )}
      </Box>
      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            zIndex: 10,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <MaterialReactTable
        columns={columns}
        data={editedData}
        enableEditing={isEditing}
        editDisplayMode="table"
      />
    </Box>
  );
};

export default DynamicTable;
