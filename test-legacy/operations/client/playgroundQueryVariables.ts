import type {
  ClientCreateInput,
  ClientEmailAvailableInput,
  ClientUpdateInput,
} from '../../modules/client/dto/client.input';
import type {
  ClientAddressCreateInput,
  ClientAddressDeleteInput,
  ClientAddressUpdateInput,
} from '../../modules/client/dto/address.input';
import type {
  ClientPhoneCreateInput,
  ClientPhoneDeleteInput,
  ClientPhoneUpdateInput,
} from '../../modules/client/dto/phone.input';
import type {
  ClientNoteCreateInput,
  ClientNoteDeleteInput,
  ClientNoteSearchInput,
  ClientNoteUpdateInput,
} from '../../modules/client/dto/note.input';
import { hardcodedPracticeKey } from '../../util/mocking';
import {
  ContactMethodCode,
  CountryCode,
  GovernmentIdTypeCode,
  NoteContextCode,
} from '@covetrus/reference-data';

interface ClientQueryVariables {
  clientKey: string;
  createClientInput: ClientCreateInput;
  createClientAddressInput: ClientAddressCreateInput;
  updateClientAddressInput: ClientAddressUpdateInput;
  updateClientInput: ClientUpdateInput;
  deleteClientAddressInput: ClientAddressDeleteInput;
  createClientPhoneInput: ClientPhoneCreateInput;
  updateClientPhoneInput: ClientPhoneUpdateInput;
  deleteClientPhoneInput: ClientPhoneDeleteInput;
  searchClientNoteInput: ClientNoteSearchInput;
  createClientNoteInput: ClientNoteCreateInput;
  updateClientNoteInput: ClientNoteUpdateInput;
  deleteClientNoteInput: ClientNoteDeleteInput;
  emailAvailableInput: ClientEmailAvailableInput;
}

// Vars reused across inputs
const emailAddress = 'el@cov.com';
const practiceKey = hardcodedPracticeKey;
export const clientKey = '6b7f7da6-7a2c-456c-8d00-48b31d17173f';
const noteKey = '';
const phoneKey = '853e6dc5-3284-43e8-b4e5-8e296f97ff13';
const addressKey = '67c1ae73-441a-46c3-a0b1-d404ecab6c03';

const queryVariables: ClientQueryVariables = {
  clientKey,
  createClientInput: {
    practiceKey,
    title: 'Mr.',
    prefix: 'Dr.',
    givenName: 'John',
    middleName: 'J',
    familyName: 'Johnsonson',
    email: { address: emailAddress },
    isActive: true,
    acceptsGenerics: true,
    dateOfBirth: '2001-01-01',
    governmentIssuedIDType: 'PASSPORT_NUMBER',
    governmentIssuedIDNumber: '12345',
    preferredContactMethod: 'EMAIL',
  },
  emailAvailableInput: {
    practiceKey,
    emailAddress,
  },
  createClientAddressInput: {
    clientKey,
    isPrimary: true,
    line1: '28 Granite Lane',
    city: 'Peterborough',
    stateOrProvince: 'ME',
    postalCode: '03458',
    country: 'US',
  },
  updateClientAddressInput: {
    clientKey,
    addressKey,
    line1: 'Line One has Been uPdAtEd',
  },
  updateClientInput: {
    clientKey,
    title: 'Dr.',
    prefix: 'Professor.',
  },
  deleteClientAddressInput: {
    clientKey,
    addressKey,
  },
  createClientPhoneInput: {
    number: '6039249609',
    ituNumber: '+1',
    hasMessaging: true,
    isPrimary: true,
    clientKey,
  },
  updateClientPhoneInput: {
    clientKey,
    phoneKey,
    number: '1111111111111',
  },
  deleteClientPhoneInput: {
    clientKey,
    phoneKey,
  },
  searchClientNoteInput: {
    clientKey,
    page: 1,
    pageSize: 10,
  },
  createClientNoteInput: {
    clientKey,
    note: 'some notes',
    contextCode: 'NONE',
  },
  updateClientNoteInput: {
    noteKey,
    clientKey,
    note: 'note has been updated, bruhv',
  },
  deleteClientNoteInput: {
    clientKey,
    noteKey,
  },
};

export default queryVariables;
