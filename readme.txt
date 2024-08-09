
import React, { useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { Box, TextField, Button, CircularProgress } from "@mui/material";
import { Edit, Save, Cancel } from "@mui/icons-material";

// Utility function to convert keys to readable headers
const convertToReadableHeader = (key) => {
  // Replace underscores or camelCase with spaces, then capitalize each word
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const DynamicTable = ({ data }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(() =>
    JSON.parse(JSON.stringify(data))
  ); // Store the original data
  const [editedData, setEditedData] = useState(() =>
    JSON.parse(JSON.stringify(data))
  ); // Store the edited data
  const [loading, setLoading] = useState(false); // Loading state for the edit mode

  // Define the columns using useMemo for performance optimization
  const columns = useMemo(() => {
    return (
      data.length > 0 &&
      Object.keys(data[0]).map((key) => ({
        accessorKey: key,
        header: convertToReadableHeader(key), // Convert key to readable header
        enableEditing: true, // Allow inline editing
        Cell: ({ cell, row }) => {
          return isEditing ? (
            <TextField
              value={editedData[row.index][key] || ""}
              onChange={(e) => handleEditChange(e, row.index, key)}
              variant="standard"
              fullWidth
            />
          ) : (
            <span>{cell.getValue()}</span>
          );
        },
      }))
    );
  }, [data, isEditing, editedData]);

  // Handle the change of editable cell
  const handleEditChange = (event, rowIndex, columnKey) => {
    const newData = [...editedData];
    newData[rowIndex][columnKey] = event.target.value;
    setEditedData(newData);
  };

  // Handle the save button click
  const handleSaveClick = () => {
    console.log("Saving data:", editedData);
    setOriginalData(JSON.parse(JSON.stringify(editedData))); // Update the original data with the edited data
    setIsEditing(false);
  };

  // Handle the cancel button click
  const handleCancelClick = () => {
    setEditedData(JSON.parse(JSON.stringify(originalData))); // Revert to the original data
    setIsEditing(false);
  };

  // Handle the edit button click
  const handleEditClick = () => {
    setLoading(true); // Show loader
    setTimeout(() => {
      setIsEditing(true);
      setLoading(false); // Hide loader after setting edit mode
    }, 500); // Simulate loading delay (adjust as needed)
  };

  return (
    <Box position="relative">
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        {!isEditing ? (
          <Button
            startIcon={<Edit />}
            variant="contained"
            onClick={handleEditClick}
            disabled={loading} // Disable button while loading
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
              disabled={loading} // Disable button while loading
            >
              Save
            </Button>
            <Button
              startIcon={<Cancel />}
              variant="contained"
              color="secondary"
              onClick={handleCancelClick}
              disabled={loading} // Disable button while loading
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
      />
    </Box>
  );
};

export default DynamicTable;
