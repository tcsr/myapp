
import { useState } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button, CircularProgress } from "@mui/material";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import ReplayIcon from "@mui/icons-material/Replay";
import Divider from "@mui/material/Divider";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { API_ENDPOINTS } from "../api/apiEndpoints";
import useApi from "../hooks/useApi";
import { ORIGINS, PROGRAMS } from "../utils";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const BeanSelection = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [responseData, setResponseData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadLink, setDownloadLink] = useState("");

  const [selectedOrigins, setSelectedOrigins] = useState([]);
  const [volume, setVolume] = useState("");
  const [requiredProgram, setRequiredProgram] = useState(PROGRAMS[0]);
  const [recipe, setRecipe] = useState({});
  const [totalPerc, setTotalPerc] = useState(0);
  const [qualityLimits, setQualityLimits] = useState({
    ffa: 0.0175,
    cd: 0.2,
    phe: 0.25,
    cps: 0.035,
  });

  const [activeIndex, setActiveIndex] = useState(0);

  const [ffaInput, setFfaInput] = useState(
    (qualityLimits.ffa * 100).toFixed(3)
  );

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "selectedOrigins":
        if (selectedOrigins.length === 0) {
          error = "At least one origin must be selected";
        }
        break;
      case "volume":
        if (!value || value <= 0) {
          error = "Total quantity is required and should be greater than 0";
        }
        break;
      case "requiredProgram":
        if (!value) {
          error = "Bean Program is required";
        }
        break;
      case "ffaInput":
        if (!value || value <= 0) {
          error = "FFA limit is required and should be greater than 0";
        }
        break;
      case "cd":
        if (!value || value <= 0) {
          error = "Cadmium limit is required and should be greater than 0";
        }
        break;
      case "phe":
        if (!value || value <= 0) {
          error = "Phenolic components limit is required and should be greater than 0";
        }
        break;
      case "cps":
        if (!value || value <= 0) {
          error = "Chlorpyrifos limit is required and should be greater than 0";
        }
        break;
      default:
        if (!value || value <= 0) {
          error = `Value for ${name} is required and should be greater than 0`;
        }
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    return error === "";
  };

  const validateAllFields = () => {
    let isValid = true;

    // Validate static fields
    isValid = validateField("selectedOrigins", selectedOrigins) && isValid;
    isValid = validateField("volume", volume) && isValid;
    isValid = validateField("requiredProgram", requiredProgram) && isValid;
    isValid = validateField("ffaInput", ffaInput) && isValid;
    isValid = validateField("cd", qualityLimits.cd) && isValid;
    isValid = validateField("phe", qualityLimits.phe) && isValid;
    isValid = validateField("cps", qualityLimits.cps) && isValid;

    // Validate dynamically generated origin fields
    selectedOrigins.forEach((origin) => {
      isValid = validateField(origin, recipe[origin] * 100) && isValid;
    });

    // Check total percentage for selected origins
    if (totalPerc > 1) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        totalPerc: "Total percentage for origins cannot exceed 100%",
      }));
      isValid = false;
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        totalPerc: "",
      }));
    }

    return isValid;
  };

  const handleRunBeanSelection = async (event) => {
    event.preventDefault();

    // First, ensure all fields are valid before allowing the form to proceed
    const allFieldsValid = validateAllFields();

    if (!allFieldsValid) {
        // If validation fails, do not proceed
        return;
    }

    const formData = {
        selectedOrigins: selectedOrigins,
        requiredProgram: requiredProgram,
        recipe: recipe,
        totalPerc: totalPerc,
        qualityLimits: qualityLimits,
        volume: volume,
    };
    
    try {
        const response = await post(`${API_ENDPOINTS.SELECT_BEANS}`, formData);
        console.log(response);
        setResponseData(response.data);
        // Move to the next accordion tab only if the form is valid
        setActiveIndex(1);
    } catch (error) {
        console.error("Error:", error);
    }
};


  const handleOriginChange = (event, newValue) => {
    const newRecipe = { ...recipe };
    const removedOrigins = selectedOrigins.filter(
      (origin) => !newValue.includes(origin)
    );

    // Remove text fields for removed origins
    removedOrigins.forEach((origin) => {
      delete newRecipe[origin];
    });

    const newTotalPerc = Object.values(newRecipe).reduce(
      (sum, val) => sum + val,
      0
    );

    setSelectedOrigins(newValue);
    setRecipe(newRecipe);
    setTotalPerc(newTotalPerc);
    validateField("selectedOrigins", newValue);
    if (newTotalPerc <= 1) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        totalPerc: "",
      }));
    }
  };

  const handleOriginInputChange = (origin, value) => {
    // Check if the input is empty or not a valid number
    if (value === "" || isNaN(parseFloat(value))) {
        setErrors((prevErrors) => ({
            ...prevErrors,
            [origin]: `Value for ${origin} is required and should be greater than 0`,
        }));
        
        // Reset the value in the recipe to 0 for calculation purposes
        const newRecipe = { ...recipe, [origin]: 0 };
        const newTotalPerc = Object.values(newRecipe).reduce(
            (sum, val) => sum + val,
            0
        );
        setRecipe(newRecipe);
        setTotalPerc(newTotalPerc);
        
        return;
    }

    let numericValue = parseFloat(value);

    // Ensure the value is valid and greater than 0
    if (numericValue <= 0) {
        setErrors((prevErrors) => ({
            ...prevErrors,
            [origin]: `Value for ${origin} is required and should be greater than 0`,
        }));
        return;
    } else {
        setErrors((prevErrors) => ({
            ...prevErrors,
            [origin]: "",
        }));

        // Fix floating-point precision issues by rounding the value to a fixed number of decimal places
        numericValue = parseFloat(numericValue.toFixed(2));

        const newRecipe = { ...recipe, [origin]: numericValue / 100 };
        const newTotalPerc = Object.values(newRecipe).reduce(
            (sum, val) => sum + val,
            0
        );
        setRecipe(newRecipe);
        setTotalPerc(newTotalPerc);

        if (newTotalPerc <= 1) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                totalPerc: "",
            }));
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                totalPerc: "Total percentage for origins cannot exceed 100%",
            }));
        }
    }
};


  const handleFfaInputChange = (e) => {
    setFfaInput(e.target.value);
    validateField("ffaInput", e.target.value);
  };

  const handleFfaInputBlur = () => {
    const ffaValue = parseFloat(ffaInput) / 100;
    setQualityLimits({ ...qualityLimits, ffa: ffaValue });
    validateField("ffaInput", ffaInput);
  };

  const handleQualityChange = (quality, value) => {
    setQualityLimits({ ...qualityLimits, [quality]: parseFloat(value) });
    validateField(quality, value);
  };

  const handleProgramChange = (e) => {
    setRequiredProgram(e.target.value);
    validateField("requiredProgram", e.target.value);
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
    validateField("volume", e.target.value);
  };

  const handleReset = () => {
    setActiveIndex(0);
    setSelectedOrigins([]);
    setRecipe({});
    setTotalPerc(0);
    setVolume("");
    setErrors({});
  };

  return (
    <div>
      <Accordion
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      >
        <AccordionTab header="Bean Selection">
          <Box sx={{ width: "100%" }}>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ textAlign: "center", marginBottom: "0.5rem" }}
                      gutterBottom
                    >
                      Configure Optimizer
                    </Typography>
                    <Divider />
                    <Grid container spacing={2} sx={{ marginTop: "0.5rem" }}>
                      <Grid item xs={4}>
                        <Autocomplete
                          multiple
                          limitTags={1}
                          id="origin-selection"
                          size="large"
                          options={ORIGINS}
                          disableCloseOnSelect
                          getOptionLabel={(option) => option}
                          renderOption={(props, option, { selected }) => {
                            const { key, ...optionProps } = props;
                            return (
                              <li key={key} {...optionProps}>
                                <Checkbox
                                  icon={icon}
                                  checkedIcon={checkedIcon}
                                  style={{ marginRight: 8 }}
                                  checked={selected}
                                />
                                {option}
                              </li>
                            );
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Origins"
                              error={!!errors.selectedOrigins}
                              helperText={errors.selectedOrigins}
                            />
                          )}
                          value={selectedOrigins}
                          onChange={handleOriginChange}
                          onBlur={() =>
                            validateField("selectedOrigins", selectedOrigins)
                          }
                          style={{ marginBottom: "1rem" }}
                        />
                        {selectedOrigins.map((origin) => (
                          <div key={origin} style={{ marginBottom: "1rem" }}>
                            <label className="form-label">
                              Select % for {origin} :
                              <input
                                className="fs-large"
                                type="number"
                                min="0"
                                max="100"
                                step="5"
                                value={recipe[origin] * 100 || ""}
                                onChange={(e) =>
                                  handleOriginInputChange(
                                    origin,
                                    e.target.value
                                  )
                                }
                                onBlur={() =>
                                  validateField(origin, recipe[origin] * 100)
                                }
                                style={{ height: "45px", width: "100%" }}
                              />
                              {errors[origin] && (
                                <Typography color="error">
                                  {errors[origin]}
                                </Typography>
                              )}
                            </label>
                          </div>
                        ))}

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                            backgroundColor: "#f9f9f9",
                            padding: "1rem",
                            borderRadius: "0.5rem",
                          }}
                        >
                          <Typography sx={{ textAlign: "center" }}>
                            Total Selected Percentage :
                          </Typography>
                          <Typography
                            sx={{ textAlign: "center", marginBottom: "0.5rem" }}
                          >
                            <strong>{(totalPerc * 100).toFixed(2)}%</strong>
                          </Typography>
                          <Typography
                            sx={{ textAlign: "center", marginBottom: "0.5rem" }}
                          >
                            Remaining Percentage :
                          </Typography>
                          <Typography sx={{ textAlign: "center" }}>
                            <strong>
                              {((1 - totalPerc) * 100).toFixed(2)}%
                            </strong>
                          </Typography>
                          {errors.totalPerc && (
                            <Typography color="error" sx={{ textAlign: "center" }}>
                              {errors.totalPerc}
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <FormControl
                          sx={{ width: "100%", marginBottom: "1.5rem" }}
                        >
                          <InputLabel id="program-label">
                            Bean Program
                          </InputLabel>
                          <Select
                            labelId="program-label"
                            id="program-label"
                            value={requiredProgram}
                            label="Bean Program"
                            onChange={handleProgramChange}
                            onBlur={() =>
                              validateField("requiredProgram", requiredProgram)
                            }
                            error={!!errors.requiredProgram}
                          >
                            {PROGRAMS &&
                              PROGRAMS.map((program) => {
                                return (
                                  <MenuItem key={program} value={program}>
                                    {program}
                                  </MenuItem>
                                );
                              })}
                          </Select>
                          {errors.requiredProgram && (
                            <Typography color="error">
                              {errors.requiredProgram}
                            </Typography>
                          )}
                        </FormControl>
                        <TextField
                          name="volume"
                          inputProps={{ type: "number", step: "0.5" }}
                          label="Total Quantity (in MT)"
                          value={volume}
                          onChange={handleVolumeChange}
                          onBlur={() => validateField("volume", volume)}
                          sx={{ marginBottom: "1.5rem" }}
                          error={!!errors.volume}
                          helperText={errors.volume}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <div className="quality-column">
                          <TextField
                            name="qual_ffa"
                            inputProps={{ type: "number", step: "0.001" }}
                            label="FFA limit (%)"
                            value={ffaInput}
                            onChange={handleFfaInputChange}
                            onBlur={handleFfaInputBlur}
                            sx={{ marginBottom: "1.5rem" }}
                            error={!!errors.ffaInput}
                            helperText={errors.ffaInput}
                          />

                          <TextField
                            name="qual_cd"
                            inputProps={{ type: "number", step: "0.001" }}
                            label="Cadmium limit"
                            value={qualityLimits.cd}
                            onChange={(e) =>
                              handleQualityChange(
                                "cd",
                                parseFloat(e.target.value)
                              )
                            }
                            onBlur={() => validateField("cd", qualityLimits.cd)}
                            sx={{ marginBottom: "1.5rem" }}
                            error={!!errors.cd}
                            helperText={errors.cd}
                          />

                          <TextField
                            name="qual_phe"
                            inputProps={{ type: "number", step: "0.001" }}
                            label="Phenolic components limit"
                            value={qualityLimits.phe}
                            onChange={(e) =>
                              handleQualityChange(
                                "phe",
                                parseFloat(e.target.value)
                              )
                            }
                            onBlur={() => validateField("phe", qualityLimits.phe)}
                            sx={{ marginBottom: "1.5rem" }}
                            error={!!errors.phe}
                            helperText={errors.phe}
                          />
                          <TextField
                            name="qual_cps"
                            inputProps={{ type: "number", step: "0.001" }}
                            label="Chlorpyrifos limit"
                            value={qualityLimits.cps}
                            onChange={(e) =>
                              handleQualityChange(
                                "cps",
                                parseFloat(e.target.value)
                              )
                            }
                            onBlur={() => validateField("cps", qualityLimits.cps)}
                            sx={{ marginBottom: "1.5rem" }}
                            error={!!errors.cps}
                            helperText={errors.cps}
                          />
                        </div>
                      </Grid>
                    </Grid>
                    <Box sx={{ textAlign: "center" }}>
                      <Button
                        size="large"
                        variant="contained"
                        onClick={handleRunBeanSelection}
                        className="custom-btn"
                      >
                        Run Bean Selection
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card variant="outlined" sx={{ minHeight: "31.25rem" }}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ textAlign: "center" }}
                      gutterBottom
                    >
                      Data Status
                    </Typography>
                    <Divider sx={{ marginBottom: "0.5rem" }} />
                    <Box>
                      <table style={{ width: "100%" }}>
                        <thead>
                          <tr>
                            <th></th>
                            <th>Last Refreshed</th>
                            <th>Last Modified</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td colSpan={3}>
                              <Typography
                                variant="h6"
                                sx={{ marginBottom: "0.25rem" }}
                              >
                                Input
                              </Typography>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <Typography
                                variant="body1"
                                sx={{ marginBottom: "1rem" }}
                              >
                                Existing Stocks
                              </Typography>
                            </td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>
                              <Typography
                                variant="body1"
                                sx={{ marginBottom: "1rem" }}
                              >
                                Warehouse Capacity
                              </Typography>
                            </td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td colSpan={3}>
                              <Typography
                                variant="h6"
                                sx={{ marginBottom: "0.25rem" }}
                              >
                                Output
                              </Typography>
                            </td>
                          </tr>
                          <tr>
                            <td>Optimized Plan</td>
                            <td></td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </AccordionTab>
        <AccordionTab header="Bean Selection Output">
          {isLoading && (
            <>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "10rem",
                }}
              >
                <CircularProgress
                  size={45}
                  thickness={3}
                  sx={{
                    color: "#860063",
                    mb: 2,
                  }}
                />
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    color: "#860063",
                  }}
                >
                  <p className="loading-text">
                    Generating optimization results...
                  </p>
                </Typography>
              </Box>
            </>
          )}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                size="large"
                startIcon={<ReplayIcon />}
                className="custom-btn"
                onClick={handleReset}
              >
                Reset
              </Button>
              <Button
                variant="contained"
                size="large"
                startIcon={<CloudDownloadIcon />}
                className="custom-btn"
              >
                Download
              </Button>
            </Stack>
          </Box>
        </AccordionTab>
      </Accordion>
    </div>
  );
};

export default BeanSelection;
