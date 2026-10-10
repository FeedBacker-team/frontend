import { z } from 'zod';

const uuidSchema = z.uuid();

function isUuid(value: string) {
  return uuidSchema.safeParse(value).success;
}

export { isUuid, uuidSchema };
