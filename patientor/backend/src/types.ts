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

export const HealthCheckRating = {
  Healthy: 0,
  LowRisk: 1,
  HighRisk: 2,
  CriticalRisk: 3,
} as const;

export type HealthCheckRating =
  typeof HealthCheckRating[keyof typeof HealthCheckRating];

const GenderSchema = z.custom<Gender>(isGender, {
  message: 'Incorrect gender',
});

const BaseEntrySchema = z.object({
  description: z.string().trim().min(1),
  date: z.iso.date(),
  specialist: z.string().trim().min(1),
  diagnosisCodes: z.array(z.string().trim().min(1)).optional(),
});

export const HealthCheckEntrySchema = BaseEntrySchema.extend({
  type: z.literal('HealthCheck'),
  healthCheckRating: z.union([
    z.literal(HealthCheckRating.Healthy),
    z.literal(HealthCheckRating.LowRisk),
    z.literal(HealthCheckRating.HighRisk),
    z.literal(HealthCheckRating.CriticalRisk),
  ]),
});

export const HospitalEntrySchema = BaseEntrySchema.extend({
  type: z.literal('Hospital'),
  discharge: z.object({
    date: z.iso.date(),
    criteria: z.string().trim().min(1),
  }),
});

export const OccupationalHealthcareEntrySchema = BaseEntrySchema.extend({
  type: z.literal('OccupationalHealthcare'),
  employerName: z.string().trim().min(1),
  sickLeave: z
    .object({
      startDate: z.iso.date(),
      endDate: z.iso.date(),
    })
    .optional(),
});

export const NewEntrySchema = z.discriminatedUnion('type', [
  HealthCheckEntrySchema,
  HospitalEntrySchema,
  OccupationalHealthcareEntrySchema,
]);

export type NewHealthCheckEntry = z.infer<typeof HealthCheckEntrySchema>;
export type NewHospitalEntry = z.infer<typeof HospitalEntrySchema>;
export type NewOccupationalHealthcareEntry = z.infer<
  typeof OccupationalHealthcareEntrySchema
>;

export type NewEntry =
  | NewHealthCheckEntry
  | NewHospitalEntry
  | NewOccupationalHealthcareEntry;

export type HealthCheckEntry = NewHealthCheckEntry & { id: string };
export type HospitalEntry = NewHospitalEntry & { id: string };
export type OccupationalHealthcareEntry =
  NewOccupationalHealthcareEntry & { id: string };

export type Entry =
  | HealthCheckEntry
  | HospitalEntry
  | OccupationalHealthcareEntry;

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
  entries: Entry[];
}

export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;
