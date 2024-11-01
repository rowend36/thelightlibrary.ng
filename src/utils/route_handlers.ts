import { Request } from "express";
import reshape from "./reshape";
import s from "./safe_async_handler";
import { Knex } from "knex";
import { z, ZodSchema } from "zod";
import { validateRequest } from "../middleware/validate_request";
import { ModelService } from "./model_service";
import { getUser } from "./get_user";

export const supplyUser = s(async function (req, res, next) {
  const user = await getUser(req, res);
  req.body.user_id = user?.user_id ?? null;
  return next();
});

type Selector = (req: Request) => Knex.QueryBuilder;
export function simpleGetOne(
  query: Selector,
  transformer?: (data: unknown) => object
) {
  return s(async function (req, res) {
    let data = await query(req).first();
    console.log(query(req).toSQL());
    if (!data) {
      return res.status(404).send({
        code: "not-found",
        message: "Item with id " + req.params.id + " not found",
      });
    }
    if (transformer) data = transformer(data);
    return res.send(reshape([data])[0]);
  });
}

export function simpleUpdateOne<T extends ZodSchema>(
  query: Selector,
  schema: T
) {
  return s(async (req, res) => {
    return validateRequest(schema)(req, res, async function () {
      const data = req.validated_data as z.infer<typeof schema>;
      await query(req).update({
        ...data,
        updated_at: new Date(),
      });
      res.send({ success: true });
    });
  });
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function listAll(service: ModelService<any>) {
  return s(async (req, res) =>
    res.send(
      await service.list({
        limit: parseInt((req.query.limit as string) ?? "100") || 100,
        offset: parseInt((req.query.offset as string) ?? "0") || 0,
      })
    )
  );
}

export function getOne(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  service: ModelService<any>
) {
  return s(async function (req, res) {
    const data = await service.retrieve(parseInt(req.params.id));
    if (!data) {
      return res.status(404).send({
        code: "not-found",
        message: "Item with id " + req.params.id + " not found",
      });
    }
    return res.send(reshape([data])[0]);
  });
}

export function createOne(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  service: ModelService<any>,
  schema: ZodSchema
) {
  return s(async function (req, res) {
    return validateRequest(schema)(req, res, async () => {
      const data = req.validated_data as z.infer<typeof schema>;

      const id = await service.create(data);

      return res.send({
        message: "success",
        [service.pk]: id,
      });
    });
  });
}

export function updateOne(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  service: ModelService<any>,
  schema: ZodSchema
) {
  return s(async function (req, res) {
    return validateRequest(schema)(req, res, async function () {
      const data = req.validated_data as z.infer<typeof schema>;
      await service.update(parseInt(req.params.id), data);
      return res.send({
        message: "success",
      });
    });
  });
}

export function deleteOne(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  service: ModelService<any>
) {
  return s(async function (req, res) {
    await service.delete(parseInt(req.params.id));
    return res.send({
      message: "success",
    });
  });
}
