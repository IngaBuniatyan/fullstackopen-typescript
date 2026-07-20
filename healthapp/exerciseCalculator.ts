import { pathToFileURL } from 'node:url';

export interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: 1 | 2 | 3;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercises = (
  dailyExercises: number[],
  target: number,
): Result => {
  const periodLength = dailyExercises.length;
  const trainingDays = dailyExercises.filter((hours) => hours > 0).length;
  const totalHours = dailyExercises.reduce((sum, hours) => sum + hours, 0);
  const average = totalHours / periodLength;
  const success = average >= target;

  let rating: Result['rating'];
  let ratingDescription: string;

  if (success) {
    rating = 3;
    ratingDescription = 'great work, target reached';
  } else if (average >= target * 0.5) {
    rating = 2;
    ratingDescription = 'not too bad but could be better';
  } else {
    rating = 1;
    ratingDescription = 'more exercise is needed';
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

const parseArguments = (args: string[]): { target: number; exercises: number[] } => {
  if (args.length < 2) {
    throw new Error('parameters missing');
  }

  const values = args.map(Number);

  if (values.some((value) => !Number.isFinite(value) || value < 0)) {
    throw new Error('malformatted parameters');
  }

  const [target, ...exercises] = values;

  if (target === undefined || target <= 0 || exercises.length === 0) {
    throw new Error('malformatted parameters');
  }

  return { target, exercises };
};

const isMainModule = (): boolean =>
  process.argv[1] !== undefined
  && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule()) {
  try {
    const { target, exercises } = parseArguments(process.argv.slice(2));
    console.log(calculateExercises(exercises, target));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'malformatted parameters';
    console.error(message);
    process.exitCode = 1;
  }
}
