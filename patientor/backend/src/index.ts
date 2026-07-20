import cors from 'cors';
import express from 'express';
import diagnosesRouter from './routes/diagnoses.ts';
import patientsRouter from './routes/patients.ts';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/ping', (_request, response) => {
  response.send('pong');
});

app.use('/api/diagnoses', diagnosesRouter);
app.use('/api/patients', patientsRouter);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
