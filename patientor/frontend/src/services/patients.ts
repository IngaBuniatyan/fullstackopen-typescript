import axios from "axios";
import type {
  Entry,
  NewEntry,
  NonSensitivePatient,
  Patient,
  PatientFormValues,
} from "../types";
import { apiBaseUrl } from "../constants";

const getAll = async (): Promise<NonSensitivePatient[]> => {
  const { data } = await axios.get<NonSensitivePatient[]>(
    `${apiBaseUrl}/patients`,
  );
  return data;
};

const getById = async (id: string): Promise<Patient> => {
  const { data } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
  return data;
};

const create = async (patient: PatientFormValues): Promise<Patient> => {
  const { data } = await axios.post<Patient>(
    `${apiBaseUrl}/patients`,
    patient,
  );
  return data;
};

const createEntry = async (
  patientId: string,
  entry: NewEntry,
): Promise<Entry> => {
  const { data } = await axios.post<Entry>(
    `${apiBaseUrl}/patients/${patientId}/entries`,
    entry,
  );
  return data;
};

export default {
  getAll,
  getById,
  create,
  createEntry,
};
