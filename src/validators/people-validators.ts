import Ajv from "ajv";
import addFormats from "ajv-formats";
import { Request, Response, NextFunction } from "express";
import { PersonType } from "../models/people";

const ajv = new Ajv();
addFormats(ajv);

const createPeopleSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      type: { type: "string", enum: Object.values(PersonType) },
      count: {
        anyOf: [
          { type: "integer", minimum: 0 },
          { type: "string", pattern: "^[0-9]+$" },
        ],
      },
    },
    required: ["type", "count"],
    additionalProperties: false,
  },
  minItems: 4,
  uniqueItems: true,
  contains: {
    type: "object",
    properties: {
      type: { type: "string", enum: Object.values(PersonType) },
    },
    required: ["type"],
  },
};

const validate =
  (schema: object) => (req: Request, res: Response, next: NextFunction) => {
    const validate = ajv.compile(schema);
    const valid = validate(req.body);
    if (!valid) {
      const errorMessages = validate.errors?.map((error) => {
        if (error.keyword === "minItems") {
          return "Must contain all the personas: Man, Woman, Boy, Girl";
        }
        if (error.keyword === "enum") {
          return "Must be only allowed personas: Man, Woman, Boy, Girl";
        }
        return error.message;
      });
      return res.status(400).json({ errors: errorMessages });
    }
    next();
  };

export const createPeopleValidator = validate(createPeopleSchema);
