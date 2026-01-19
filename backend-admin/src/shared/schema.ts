import { Type, type Static } from "@sinclair/typebox";

export const signinReq = Type.Object({
    idToken: Type.String()
});

export type SigninReq = Static<typeof signinReq>;

// export const signinReq = Type.Object({
//   email: Type.String({
//     pattern: "^[A-Za-z0-9._%+-]+@gmail\\.com$"
//   }),
//   password: Type.String({
//     minLength: 8,
//     maxLength: 50,
//     pattern: "^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-={}\\[\\]|:;\"'<>,.?/]).+$"
//   })
// });

// export type SigninReq = Static<typeof signinReq>;

export const createAdminAccountSchema = Type.Object({
  firstName: Type.Optional(
    Type.String({
      minLength: 2,
      maxLength: 64,
      pattern: "^[A-Za-z]+$"
    })
  ),
  lastName: Type.Optional(
    Type.String({
      minLength: 2,
      maxLength: 64,
      pattern: "^[A-Za-z]+$" 
    })
  ),
  middleName: Type.Optional(
    Type.String({
      minLength: 2,
      maxLength: 64,
      pattern: "^[A-Za-z]+$"
    })
  ),
  email: Type.String({
    format: "email"
  }),
  password: Type.String({
    minLength: 8,
    maxLength: 50,
    pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\-={}\\[\\]|:;\"'<>,.?/]).+$"
  }),
  confirmPassword: Type.String({
    minLength: 8,
    maxLength: 50
  })
});

export type createAdminAccountType = Static<typeof createAdminAccountSchema>;