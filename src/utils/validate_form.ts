import { ZodEffects, ZodType, ZodTypeDef } from "zod";
import reshape from "./reshape";
export default function validateForm<T extends any, V extends ZodTypeDef, W>(
  formdata: FormData,
  schema: ZodType<T, V, W>
) {
  return schema.parse(reshape([Object.fromEntries(formdata.entries())])[0]);
}
