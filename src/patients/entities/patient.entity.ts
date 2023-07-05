import { Patient } from '@prisma/client';

export class PatientEntity implements Patient {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
}
