
import { clientKey } from '../client/playgroundQueryVariables';

interface PatientQueryVaraiables {
  patientKey: string;
  clientKey: string;
  createPatientInput: any;
  updatePatientInput: any;
  createPatientNoteInput: any;
  updatePatientNoteInput: any;
  deletePatientNoteInput: any;
  searchPatientNoteInput: any;
}

const patientKey = 'fec887a4-b640-4424-9530-ab7c42125561';
const practiceKey = 'someKey';
const primaryVetKey = 'someKey';
const noteKey = '';

const queryVariables: PatientQueryVaraiables = {
  patientKey,
  clientKey,
  createPatientInput: {
    practiceKey,
    clientKey,
    name: 'floofers',
    sexCode: 'Male',
    dateOfBirth: '1983-01-11',
    speciesCode: 'DOG',
    isAltered: false,
    weightUnitCode: 'LBS',
    weight: '1000',
    primaryVetKey,
  },
  updatePatientInput: {
    patientKey,
    name: 'snoofer',
  },
  searchPatientNoteInput: {
    patientKey,
    pageSize: 5,
    page: 0,
  },
  createPatientNoteInput: {
    patientKey,
    note: 'some notes',
    contextCode: 'NONE',
  },
  updatePatientNoteInput: {
    noteKey,
    patientKey,
    note: 'note has been updated, bruhv',
    contextCode: 'NONE',
  },
  deletePatientNoteInput: {
    patientKey,
    noteKey,
  },
};

export default queryVariables;
