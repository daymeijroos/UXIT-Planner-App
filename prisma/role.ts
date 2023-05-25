export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  RETIRED = "RETIRED"
}

export type RoleType = keyof typeof Role