import { Therapist } from '@prisma/client';

export class TherapistEntity implements Therapist {
  id: string;
  email: string;
  name: string;
  patientId: string;
}
