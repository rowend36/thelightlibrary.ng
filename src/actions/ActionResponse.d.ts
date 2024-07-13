import { ZodError } from "zod";

export interface ActionResponse<T = void> {
  errors?: ZodError["errors"];
  success: boolean;
  message?: string;
  data?: T;
}
