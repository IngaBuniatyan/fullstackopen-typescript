import { pathToFileURL } from 'node:url';

export const calculateBmi = (heightCm: number, weightKg: number): string => {
  const heightInMeters = heightCm / 100;
  const bmi = weightKg / heightInMeters ** 2;

  if (bmi < 18.5) {
    return 'Underweight';
  }

  if (bmi < 25) {
    return 'Normal range';
  }

  if (bmi < 30) {
    return 'Overweight';
  }

  return 'Obese';
};

const parseArguments = (args: string[]): [number, number] => {
  if (args.length < 2) {
    throw new Error('parameters missing');
  }

  if (args.length > 2) {
    throw new Error('malformatted parameters');
  }

  const height = Number(args[0]);
  const weight = Number(args[1]);

  if (
    !Number.isFinite(height)
    || !Number.isFinite(weight)
    || height <= 0
    || weight <= 0
  ) {
    throw new Error('malformatted parameters');
  }

  return [height, weight];
};

const isMainModule = (): boolean =>
  process.argv[1] !== undefined
  && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule()) {
  try {
    const [height, weight] = parseArguments(process.argv.slice(2));
    console.log(calculateBmi(height, weight));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'malformatted parameters';
    console.error(message);
    process.exitCode = 1;
  }
}
