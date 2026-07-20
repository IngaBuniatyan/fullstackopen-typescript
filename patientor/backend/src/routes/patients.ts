import express from 'express';
import patientService from '../services/patientService.ts';
import { NewEntrySchema, NewPatientSchema } from '../types.ts';

const router = express.Router();

router.get('/', (_request, response) => {
  response.json(patientService.getNonSensitivePatients());
});

router.get('/:id', (request, response) => {
  const patient = patientService.getPatient(request.params.id);

  if (!patient) {
    response.sendStatus(404);
    return;
  }

  response.json(patient);
});

router.post('/', (request, response) => {
  const body: unknown = request.body;
  const parsedPatient = NewPatientSchema.safeParse(body);

  if (!parsedPatient.success) {
    response.status(400).json({
      error: parsedPatient.error.issues,
    });
    return;
  }

  response.json(patientService.addPatient(parsedPatient.data));
});

router.post('/:id/entries', (request, response) => {
  const body: unknown = request.body;
  const parsedEntry = NewEntrySchema.safeParse(body);

  if (!parsedEntry.success) {
    response.status(400).json({
      error: parsedEntry.error.issues,
    });
    return;
  }

  const entry = patientService.addEntry(request.params.id, parsedEntry.data);

  if (!entry) {
    response.sendStatus(404);
    return;
  }

  response.json(entry);
});

export default router;
