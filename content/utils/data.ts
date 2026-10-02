import { z } from "zod";

const textSchema = z
  .string()
  .regex(
    /^(?! )(?!.* $)(?!.* {2})[^\p{Cc}\p{Cf}\p{Cs}\p{Co}\p{Cn}\p{Extended_Pictographic}\r\n\t]+$/u,
  );

const emailSchema = z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

const usernameSchema = z
  .string()
  .regex(/^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/);

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const languageCodeSchema = z.string().regex(/^[a-z]{2}$/);

const languageLevelSchema = z
  .string()
  .regex(/^[ABC][12]$/)
  .or(z.literal("native"));

const phoneSchema = z
  .strictObject({
    prefix: z
      .string()
      .regex(/^\+\d{1,3}$/)
      .nullable()
      .optional(),
    number: z.string().regex(/^\d+(?: \d+)*$/),
  })
  .readonly();

const contactsSchema = z
  .strictObject({
    phone: phoneSchema.nullable().optional(),
    location: textSchema.nullable().optional(),
    email: emailSchema.nullable().optional(),
    github: usernameSchema.nullable().optional(),
    linkedin: usernameSchema.nullable().optional(),
  })
  .strict()
  .readonly();

const languageSchema = z
  .strictObject({
    language: languageCodeSchema,
    level: languageLevelSchema.nullable().optional(),
  })
  .strict()
  .readonly();

const profileSchema = z
  .strictObject({
    firstName: textSchema.nullable().optional(),
    lastName: textSchema.nullable().optional(),
    birthDate: dateSchema.nullable().optional(),
    contacts: contactsSchema.nullable().optional(),
    drivingLicense: z.boolean().nullable().optional(),
    languages: z.array(languageSchema).nullable().optional().readonly(),
  })
  .readonly();

export const descriptorSchema = z
  .strictObject({
    profile: profileSchema.nullable().optional(),
  })
  .readonly();
