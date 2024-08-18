import { sign } from 'jsonwebtoken';

class RefreshToken
{
  constructor ( init?: Partial<RefreshToken> )
  {
    Object.assign( this, init );
  }

  id: number;
  userId: number;
  roles: [ string ];
  schoolId: number;
  type: string;
  // Stage: string;
  //   userAgent: string;
  //   ipAddress: string;

  sign (): string
  {
    return sign( { ...this, signOptions: { expiresIn: '18h' } }, '22555BB344931F6EB4D6C6C3973F1' );
  }
}

export default RefreshToken;
