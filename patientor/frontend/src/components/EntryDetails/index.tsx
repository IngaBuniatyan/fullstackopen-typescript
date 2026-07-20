import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";
import HealthRatingBar from "../HealthRatingBar";
import type { Diagnosis, Entry } from "../../types";

interface Props {
  entry: Entry;
  diagnoses: Record<string, Diagnosis>;
}

const assertNever = (value: never): never => {
  throw new Error(`Unhandled entry type: ${JSON.stringify(value)}`);
};

const EntryDetails = ({ entry, diagnoses }: Props) => {
  let details: ReactNode;

  switch (entry.type) {
    case "HealthCheck":
      details = (
        <HealthRatingBar rating={entry.healthCheckRating} showText={true} />
      );
      break;
    case "Hospital":
      details = (
        <p>
          discharge {entry.discharge.date}: {entry.discharge.criteria}
        </p>
      );
      break;
    case "OccupationalHealthcare":
      details = (
        <>
          <p>employer: {entry.employerName}</p>
          {entry.sickLeave && (
            <p>
              sick leave: {entry.sickLeave.startDate}–{entry.sickLeave.endDate}
            </p>
          )}
        </>
      );
      break;
    default:
      return assertNever(entry);
  }

  return (
    <Box
      component="article"
      sx={{ border: "1px solid #888", borderRadius: 1, p: 2, my: 1 }}
    >
      <Typography variant="h6">
        {entry.date} {entry.type}
      </Typography>
      <p>{entry.description}</p>
      {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
        <ul>
          {entry.diagnosisCodes.map((code) => (
            <li key={code}>
              {code} {diagnoses[code]?.name ?? "Unknown diagnosis"}
            </li>
          ))}
        </ul>
      )}
      {details}
      <p>diagnose by {entry.specialist}</p>
    </Box>
  );
};

export default EntryDetails;
