import express from 'express';
import diagnosisService from '../services/diagnosisService.ts';

const router = express.Router();

router.get('/', (_request, response) => {
  response.json(diagnosisService.getDiagnoses());
});

export default router;
