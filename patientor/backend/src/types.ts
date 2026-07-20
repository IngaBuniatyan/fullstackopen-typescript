import { z } from 'zod';

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export const Gender = {
  Male: 'male',
  Female: 'female',
  Other: 'other',
} as const;

export type Gender = typeof Gender[keyof typeof Gender];

export const isGender = (value: unknown): value is Gender =>
  typeof value === 'string'
  && Object.values(Gender).some((gender) => gender === value);

const GenderSchema = z.custom<Gender>(isGender, {
  message: 'Incorrect gender',
});

export const NewPatientSchema = z.object({
  name: z.string().trim().min(1),
  dateOfBirth: z.iso.date(),
  ssn: z.string().trim().min(1),
  gender: GenderSchema,
  occupation: z.string().trim().min(1),
});

export type NewPatient = z.infer<typeof NewPatientSchema>;

export interface Patient extends NewPatient {
  id: string;
}

export type NonSensitivePatient = Omit<Patient, 'ssn'>;
