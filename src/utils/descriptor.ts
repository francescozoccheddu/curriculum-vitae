import { z } from "zod";
import { readTextFile } from "@/utils/file";

const textSchema = z
  .string()
  .regex(
    /^(?! )(?!.* $)(?!.* {2})[^\p{Cc}\p{Cf}\p{Cs}\p{Co}\p{Cn}\p{Extended_Pictographic}\r\n\t]+$/u,
  );

const urlSchema = z.string();

const colorHexSchema = z.string().regex(/^#[0-9A-F]{6}$/);

const emailSchema = z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

const usernameSchema = z
  .string()
  .regex(/^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/);

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const yearSchema = z.number().min(1900).max(2100);

const languageCodeSchema = z.string().regex(/^[a-z]{2}$/);

const idSchema = z.string().regex(/^[a-z0-9-]+$/);

const phonePrefixSchema = z.string().regex(/^\+\d{1,3}$/);

const phoneNumberWithoutPrefixSchema = z.string().regex(/^\d+(?: \d+)*$/);

const languageLevelSchema = z
  .string()
  .regex(/^[ABC][12]$/)
  .or(z.literal("native"));

const phoneSchema = z
  .strictObject({
    prefix: phonePrefixSchema.nullable().optional(),
    number: phoneNumberWithoutPrefixSchema,
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
  .readonly();

const languageSchema = z
  .strictObject({
    language: languageCodeSchema,
    level: languageLevelSchema.nullable().optional(),
  })
  .readonly();

const profileSchema = z
  .strictObject({
    firstName: textSchema.nullable().optional(),
    lastName: textSchema.nullable().optional(),
    birthDate: dateSchema.nullable().optional(),
    contacts: contactsSchema.nullable().optional(),
    drivingLicense: z.boolean().nullable().optional(),
    languages: z.array(languageSchema).nullable().optional().readonly(),
    bio: textSchema.nullable().optional(),
    picture: urlSchema.nullable().optional(),
  })
  .readonly();

const gradeSchema = z
  .strictObject({
    value: textSchema,
    over: textSchema.nullable().optional(),
  })
  .readonly();

const pointSchema = z
  .strictObject({
    title: textSchema,
    at: textSchema.nullable().optional(),
    year: yearSchema.nullable().optional(),
    description: textSchema.nullable().optional(),
    tags: z.array(idSchema).nullable().optional().readonly(),
    grade: gradeSchema.nullable().optional(),
    url: urlSchema.nullable().optional(),
  })
  .readonly();

const firstLevelPoint = pointSchema
  .unwrap()
  .extend({
    children: z.array(pointSchema).nullable().optional().readonly(),
  })
  .strict()
  .readonly();

const tagSchema = z
  .strictObject({
    id: idSchema,
    title: textSchema,
    logo: urlSchema.nullable().optional(),
    color: idSchema.nullable().optional(),
  })
  .readonly();

const colorSchema = z
  .strictObject({
    id: idSchema,
    color: colorHexSchema,
  })
  .readonly();

export const descriptorSchema = z
  .strictObject({
    profile: profileSchema.nullable().optional(),
    history: z.array(firstLevelPoint).nullable().optional().readonly(),
    moreHistory: z.array(pointSchema).nullable().optional().readonly(),
    tags: z.array(tagSchema).nullable().optional().readonly(),
    colors: z.array(colorSchema).nullable().optional().readonly(),
  })
  .readonly();

export type Phone = z.infer<typeof phoneSchema>;

export type Contacts = z.infer<typeof contactsSchema>;

export type Language = z.infer<typeof languageSchema>;

export type Profile = z.infer<typeof profileSchema>;

export type Grade = z.infer<typeof gradeSchema>;

export type Point = z.infer<typeof pointSchema>;

export type FirstLevelPoint = z.infer<typeof firstLevelPoint>;

export type Tag = z.infer<typeof tagSchema>;

export type Color = z.infer<typeof colorSchema>;

export type Descriptor = z.infer<typeof descriptorSchema>;

export async function loadDescriptorFile(file: string): Promise<Descriptor> {
  const json = await readTextFile(file);
  const data = JSON.parse(json);
  if (data && typeof data === "object" && "$schema" in data) {
    delete data.$schema;
  }
  return descriptorSchema.parse(data);
}

export const descriptorJsonSchema = descriptorSchema
  .unwrap()
  .extend({
    $schema: z.string(),
  })
  .strict()
  .readonly()
  .toJSONSchema();
