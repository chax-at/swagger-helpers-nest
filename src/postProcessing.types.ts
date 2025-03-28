import type { ReferenceObject, SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

export type SchemaVisitor = (propSchema: SchemaObject | ReferenceObject, propName: string) => void;
