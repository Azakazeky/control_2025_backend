import { sign } from 'jsonwebtoken';

class RefreshToken {
  constructor(init?: Partial<RefreshToken>) {
    Object.assign(this, init);
  }

  id: number;
  userId: number;
  roles: [string];
  schoolId: number;
  type: string
  // Stage: string;
  //   userAgent: string;
  //   ipAddress: string;

  sign(): string {
    return sign({ ...this }, process.env.REFRESH_SECRET);
  }
}

export default RefreshToken;
