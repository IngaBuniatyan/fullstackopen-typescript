import express from 'express';
import { calculateBmi } from './bmiCalculator.ts';
import { calculateExercises } from './exerciseCalculator.ts';

const app = express();
app.use(express.json());

const PORT = 3000;

const isPositiveNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;

const isExerciseArray = (value: unknown): value is number[] =>
  Array.isArray(value)
  && value.length > 0
  && value.every(
    (item: unknown) =>
      typeof item === 'number' && Number.isFinite(item) && item >= 0,
  );

app.get('/hello', (_request, response) => {
  response.send('Hello Full Stack!');
});

app.get('/bmi', (request, response) => {
  const { height: heightQuery, weight: weightQuery } = request.query;
  const height = Number(heightQuery);
  const weight = Number(weightQuery);

  if (
    typeof heightQuery !== 'string'
    || typeof weightQuery !== 'string'
    || !isPositiveNumber(height)
    || !isPositiveNumber(weight)
  ) {
    response.status(400).json({ error: 'malformatted parameters' });
    return;
  }

  response.json({
    height,
    weight,
    bmi: calculateBmi(height, weight),
  });
});

app.post('/exercises', (request, response) => {
  const body: unknown = request.body;

  if (typeof body !== 'object' || body === null) {
    response.status(400).json({ error: 'parameters missing' });
    return;
  }

  const input = body as Record<string, unknown>;

  if (input.daily_exercises === undefined || input.target === undefined) {
    response.status(400).json({ error: 'parameters missing' });
    return;
  }

  if (!isExerciseArray(input.daily_exercises) || !isPositiveNumber(input.target)) {
    response.status(400).json({ error: 'malformatted parameters' });
    return;
  }

  response.json(calculateExercises(input.daily_exercises, input.target));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
