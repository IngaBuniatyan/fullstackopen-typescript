import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, Button, Typography } from "@mui/material";
import AddEntryForm from "../AddEntryForm";
import EntryDetails from "../EntryDetails";
import patientService from "../../services/patients";
import type { Diagnosis, NewEntry, Patient } from "../../types";
import { getErrorMessage } from "../../utils";

interface Props {
  diagnoses: Diagnosis[];
}

const PatientPage = ({ diagnoses }: Props) => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient>();
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [entryError, setEntryError] = useState<string>();
  const [loadError, setLoadError] = useState<string>();

  useEffect(() => {
    if (!id) {
      return;
    }

    void patientService
      .getById(id)
      .then(setPatient)
      .catch((error: unknown) => setLoadError(getErrorMessage(error)));
  }, [id]);

  const diagnosisMap = useMemo(
    () =>
      Object.fromEntries(
        diagnoses.map((diagnosis) => [diagnosis.code, diagnosis]),
      ),
    [diagnoses],
  );

  if (loadError) {
    return <Alert severity="error">{loadError}</Alert>;
  }

  if (!patient || !id) {
    return <p>Loading patient...</p>;
  }

  const submitEntry = async (entry: NewEntry): Promise<void> => {
    try {
      const createdEntry = await patientService.createEntry(id, entry);
      setPatient((currentPatient) =>
        currentPatient
          ? {
              ...currentPatient,
              entries: currentPatient.entries.concat(createdEntry),
            }
          : currentPatient,
      );
      setEntryError(undefined);
      setShowEntryForm(false);
    } catch (error: unknown) {
      setEntryError(getErrorMessage(error));
    }
  };

  return (
    <section>
      <Typography variant="h4">{patient.name}</Typography>
      <p>ssn: {patient.ssn}</p>
      <p>occupation: {patient.occupation}</p>
      <p>date of birth: {patient.dateOfBirth}</p>
      <p>gender: {patient.gender}</p>

      <Typography variant="h5">entries</Typography>
      {patient.entries.map((entry) => (
        <EntryDetails
          key={entry.id}
          entry={entry}
          diagnoses={diagnosisMap}
        />
      ))}

      {showEntryForm ? (
        <AddEntryForm
          diagnoses={diagnoses}
          error={entryError}
          onSubmit={submitEntry}
          onCancel={() => {
            setShowEntryForm(false);
            setEntryError(undefined);
          }}
        />
      ) : (
        <Button variant="contained" onClick={() => setShowEntryForm(true)}>
          Add New Entry
        </Button>
      )}
    </section>
  );
};

export default PatientPage;
