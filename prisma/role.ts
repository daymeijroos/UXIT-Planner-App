export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  EMPLOYEE = "EMPLOYEE",
  RETIRED = "RETIRED"
}

export type RoleType = keyof typeof Role
