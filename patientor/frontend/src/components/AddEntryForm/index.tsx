import { useState, type FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  type SelectChangeEvent,
} from "@mui/material";
import {
  EntryType,
  HealthCheckRating,
  type Diagnosis,
  type NewEntry,
} from "../../types";

interface Props {
  diagnoses: Diagnosis[];
  error?: string;
  onCancel: () => void;
  onSubmit: (entry: NewEntry) => Promise<void>;
}

const assertNever = (value: never): never => {
  throw new Error(`Unhandled entry type: ${value}`);
};

const AddEntryForm = ({ diagnoses, error, onCancel, onSubmit }: Props) => {
  const [entryType, setEntryType] = useState<EntryType>(EntryType.HealthCheck);
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [healthCheckRating, setHealthCheckRating] = useState(
    HealthCheckRating.Healthy,
  );
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");
  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStart, setSickLeaveStart] = useState("");
  const [sickLeaveEnd, setSickLeaveEnd] = useState("");

  const changeEntryType = (event: SelectChangeEvent<EntryType>) => {
    setEntryType(event.target.value as EntryType);
  };

  const changeDiagnosisCodes = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setDiagnosisCodes(typeof value === "string" ? value.split(",") : value);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const baseEntry = {
      date,
      description,
      specialist,
      diagnosisCodes,
    };

    let entry: NewEntry;

    switch (entryType) {
      case EntryType.HealthCheck:
        entry = {
          ...baseEntry,
          type: EntryType.HealthCheck,
          healthCheckRating,
        };
        break;
      case EntryType.Hospital:
        entry = {
          ...baseEntry,
          type: EntryType.Hospital,
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria,
          },
        };
        break;
      case EntryType.OccupationalHealthcare:
        entry = {
          ...baseEntry,
          type: EntryType.OccupationalHealthcare,
          employerName,
          ...(sickLeaveStart && sickLeaveEnd
            ? {
                sickLeave: {
                  startDate: sickLeaveStart,
                  endDate: sickLeaveEnd,
                },
              }
            : {}),
        };
        break;
      default:
        return assertNever(entryType);
    }

    await onSubmit(entry);
  };

  return (
    <Box
      component="form"
      onSubmit={submit}
      sx={{ border: "1px dashed #777", p: 2, my: 2 }}
    >
      {error && <Alert severity="error">{error}</Alert>}

      <FormControl fullWidth margin="normal">
        <InputLabel id="entry-type-label">Entry type</InputLabel>
        <Select
          labelId="entry-type-label"
          label="Entry type"
          value={entryType}
          onChange={changeEntryType}
        >
          {Object.values(EntryType).map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Date"
        type="date"
        value={date}
        onChange={({ target }) => setDate(target.value)}
        slotProps={{ inputLabel: { shrink: true } }}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Description"
        value={description}
        onChange={({ target }) => setDescription(target.value)}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Specialist"
        value={specialist}
        onChange={({ target }) => setSpecialist(target.value)}
        required
        fullWidth
        margin="normal"
      />

      <FormControl fullWidth margin="normal">
        <InputLabel id="diagnosis-codes-label">Diagnosis codes</InputLabel>
        <Select
          labelId="diagnosis-codes-label"
          label="Diagnosis codes"
          multiple
          value={diagnosisCodes}
          onChange={changeDiagnosisCodes}
        >
          {diagnoses.map((diagnosis) => (
            <MenuItem key={diagnosis.code} value={diagnosis.code}>
              {diagnosis.code} {diagnosis.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {entryType === EntryType.HealthCheck && (
        <FormControl fullWidth margin="normal">
          <InputLabel id="health-rating-label">Health check rating</InputLabel>
          <Select
            labelId="health-rating-label"
            label="Health check rating"
            value={healthCheckRating}
            onChange={(event) =>
              setHealthCheckRating(
                Number(event.target.value) as HealthCheckRating,
              )
            }
          >
            <MenuItem value={HealthCheckRating.Healthy}>Healthy</MenuItem>
            <MenuItem value={HealthCheckRating.LowRisk}>Low risk</MenuItem>
            <MenuItem value={HealthCheckRating.HighRisk}>High risk</MenuItem>
            <MenuItem value={HealthCheckRating.CriticalRisk}>
              Critical risk
            </MenuItem>
          </Select>
        </FormControl>
      )}

      {entryType === EntryType.Hospital && (
        <>
          <TextField
            label="Discharge date"
            type="date"
            value={dischargeDate}
            onChange={({ target }) => setDischargeDate(target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Discharge criteria"
            value={dischargeCriteria}
            onChange={({ target }) => setDischargeCriteria(target.value)}
            required
            fullWidth
            margin="normal"
          />
        </>
      )}

      {entryType === EntryType.OccupationalHealthcare && (
        <>
          <TextField
            label="Employer name"
            value={employerName}
            onChange={({ target }) => setEmployerName(target.value)}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Sick leave start"
            type="date"
            value={sickLeaveStart}
            onChange={({ target }) => setSickLeaveStart(target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Sick leave end"
            type="date"
            value={sickLeaveEnd}
            onChange={({ target }) => setSickLeaveEnd(target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
            margin="normal"
          />
        </>
      )}

      <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
        <Button type="button" color="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="contained">
          Add
        </Button>
      </Box>
    </Box>
  );
};

export default AddEntryForm;
