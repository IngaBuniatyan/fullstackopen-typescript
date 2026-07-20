import express from 'express';
import patientService from '../services/patientService.ts';
import { NewPatientSchema } from '../types.ts';

const router = express.Router();

router.get('/', (_request, response) => {
  response.json(patientService.getNonSensitivePatients());
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

export default router;
