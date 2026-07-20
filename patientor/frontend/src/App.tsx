import { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import { Button, Container, Divider, Typography } from "@mui/material";

import { apiBaseUrl } from "./constants";
import type { Diagnosis, NonSensitivePatient } from "./types";
import diagnosisService from "./services/diagnoses";
import patientService from "./services/patients";
import PatientListPage from "./components/PatientListPage";
import PatientPage from "./components/PatientPage";

const App = () => {
  const [patients, setPatients] = useState<NonSensitivePatient[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);
    void patientService.getAll().then(setPatients);
    void diagnosisService.getAll().then(setDiagnoses);
  }, []);

  return (
    <Router>
      <Container>
        <Typography variant="h3" sx={{ marginBottom: "0.5em" }}>
          Patientor
        </Typography>
        <Button component={Link} to="/" variant="contained" color="primary">
          Home
        </Button>
        <Divider sx={{ marginY: 2 }} />
        <Routes>
          <Route
            path="/"
            element={
              <PatientListPage
                patients={patients}
                setPatients={setPatients}
              />
            }
          />
          <Route
            path="/patients/:id"
            element={<PatientPage diagnoses={diagnoses} />}
          />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
