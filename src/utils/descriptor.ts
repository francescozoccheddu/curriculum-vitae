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
    prefix: phonePrefixSchema.nullish(),
    number: phoneNumberWithoutPrefixSchema,
  })
  .readonly();

const contactsSchema = z
  .strictObject({
    phone: phoneSchema.nullish(),
    location: textSchema.nullish(),
    email: emailSchema.nullish(),
    github: usernameSchema.nullish(),
    linkedin: usernameSchema.nullish(),
  })
  .readonly();

const languageSchema = z
  .strictObject({
    language: languageCodeSchema,
    level: languageLevelSchema.nullish(),
  })
  .readonly();

const profileSchema = z
  .strictObject({
    firstName: textSchema.nullish(),
    lastName: textSchema.nullish(),
    birthDate: dateSchema.nullish(),
    contacts: contactsSchema.nullish(),
    drivingLicense: z.boolean().nullish(),
    languages: z.array(languageSchema).nullish().readonly(),
    bio: textSchema.nullish(),
    picture: urlSchema.nullish(),
  })
  .readonly();

const gradeSchema = z
  .strictObject({
    value: textSchema,
    over: textSchema.nullish(),
  })
  .readonly();

const pointSchema = z
  .strictObject({
    title: textSchema,
    at: textSchema.nullish(),
    year: yearSchema.nullish(),
    toYear: yearSchema.or(z.literal("now")).nullish(),
    description: textSchema.nullish(),
    tags: z.array(idSchema).nullish().readonly(),
    grade: gradeSchema.nullish(),
    url: urlSchema.nullish(),
  })
  .readonly();

const firstLevelPoint = pointSchema
  .unwrap()
  .extend({
    ongoing: z.boolean().nullish(),
    children: z.array(pointSchema).nullish().readonly(),
  })
  .strict()
  .readonly();

const tagSchema = z
  .strictObject({
    id: idSchema,
    title: textSchema,
    logo: urlSchema.nullish(),
    color: idSchema.nullish(),
  })
  .readonly();

const skillSchema = z
  .strictObject({
    description: textSchema.nullish(),
    tags: z.array(idSchema).nullish().readonly(),
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
    profile: profileSchema.nullish(),
    history: z.array(firstLevelPoint).nullish().readonly(),
    moreHistory: z.array(pointSchema).nullish().readonly(),
    skills: z.array(skillSchema).nullish().readonly(),
    tags: z.array(tagSchema).nullish().readonly(),
    colors: z.array(colorSchema).nullish().readonly(),
  })
  .readonly();

export type Phone = z.infer<typeof phoneSchema>;

export type Contacts = z.infer<typeof contactsSchema>;

export type Language = z.infer<typeof languageSchema>;

export type Profile = z.infer<typeof profileSchema>;

export type Grade = z.infer<typeof gradeSchema>;

export type Point = z.infer<typeof pointSchema>;

export type FirstLevelPoint = z.infer<typeof firstLevelPoint>;

export type Skill = z.infer<typeof skillSchema>;

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
