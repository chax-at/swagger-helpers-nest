import type { OpenAPIObject } from "@nestjs/swagger";
import { SchemaVisitor } from "./postProcessing.types";

/**
 * a generic and configurable traversal function
 * the defined visitors edit this schema in place.
 * vistors are applied in order
 * 
 * @example
 * ```ts
 * const document = buildSwaggerDocument(app);
 * traverseDocument(document, {
 *   propertyVisitors: [
 *     Length1AllOfToOneOfVisitor,
 *     MoveNullableToOneOfVisitor
 *   ]
 * })
 * ```
 */
export function traverseDocument(swaggerDocument: OpenAPIObject, {
  propertyVisitors = [],
}: {
  propertyVisitors?: SchemaVisitor[],
} = {}): void {
  if (propertyVisitors.length) {
    for (const schema of Object.values(swaggerDocument.components?.schemas ?? {})) {
      if ('properties' in schema) {
        for (const [propName, propSchema] of Object.entries(schema.properties ?? {})) {
          for (const visitor of propertyVisitors) visitor(propSchema, propName);
        }
      }
    }
  }
}

/**
 * Sometimes nestjs/swagger wraps single $ref's in `allOf`, but since `oneOf`
 * is equivalent for one entry and might be preferred.
 * This visitor converts an `allOf` to `oneOf` if it contains exactly
 * one schema definition.
 *
 * @example
 * 
 * ```json
 * {
 *   "allOf": [{ "$ref": "#/components/schemas/CatDto" }]
 * }
 * ```
 * 
 * becomes
 * 
 * ```json
 * {
 *   "oneOf": [{ "$ref": "#/components/schemas/CatDto" }]
 * }
 * ```
 */
export const Length1AllOfToOneOfVisitor: SchemaVisitor = (propSchema) => {
  if ('allOf' in propSchema && propSchema.allOf?.length === 1 && !propSchema.oneOf) {
    propSchema.oneOf = propSchema.allOf;
    delete propSchema.allOf;
  }
};

/**
 * For some client generators, `oneOf` + `nullable` don't mix well
 * If a nullable + oneOf combination is found, this visitor removes
 * the nullable property and pushes `{nullable:true}` into the `oneOf`
 * 
 * @example
 * ```json
 * {
 *   "nullable": true,
 *   "oneOf": [
 *     { "$ref": "#/components/schemas/CatDto" }
 *   ]
 * }
 * ```
 * becomes
 * ```json
 * {
 *   "oneOf": [
 *     { "$ref": "#/components/schemas/CatDto" },
 *     { nullable: true }
 *   ]
 * }
 * ```
 */
export const MoveNullableToOneOfVisitor: SchemaVisitor = (propSchema) => {
  if ('oneOf' in propSchema && propSchema.oneOf && propSchema.nullable) {
    delete propSchema.nullable;
    propSchema.oneOf.push({ nullable: true });
  }
};
