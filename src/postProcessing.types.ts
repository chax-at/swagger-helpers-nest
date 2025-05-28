import type { OperationObject, PathItemObject, ReferenceObject, SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import type { KeysOfType } from "./util.types";

export type Method = KeysOfType<Required<PathItemObject>, OperationObject>;

export type SchemaVisitor = (propSchema: SchemaObject | ReferenceObject, propName: string) => void;

/**
 * return 'delete' to remove the operation from the documentation
 */
export type OperationVisitor = (operation: OperationObject, operationMethod: Method, path: string) => void | 'delete';
