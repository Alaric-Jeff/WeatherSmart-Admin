import { Type } from '@sinclair/typebox';

export const userLoginSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 })
});
