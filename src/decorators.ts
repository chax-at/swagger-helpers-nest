import type { Type } from '@nestjs/common';
import { ApiCreatedResponse, ApiExtraModels, ApiOkResponse, ApiProperty, refs } from '@nestjs/swagger';

/**
 * Decorated property can be one of the given DTO types.
 * Automatically registers the types for documentation.
 * 
 * @example
 * class MugResponse {
 *   ＠ApiPropertyOneOf(TeaDto, CoffeeDto)
 *   public contents!: TeaDto | CoffeeDto;
 * }
 */
export function ApiPropertyOneOf(...types: Type<any>[]): PropertyDecorator {
  return (target, propertyKey) => {
    ApiExtraModels(...types)(target.constructor);
    ApiProperty({ oneOf: refs(...types) })(target, propertyKey);
  };
}

/**
 * Decorated property is an array of the given DTO types.
 * Automatically registers the types for documentation.
 * 
 * @example
 * class CarResponse {
 *   ＠ApiPropertyArrayOf(WheelDto)
 *   public wheels!: WheelDto[];
 * }
 */
export function ApiPropertyArrayOf(...types: Type<any>[]): PropertyDecorator {
  return (target, propertyKey) => {
    ApiExtraModels(...types)(target.constructor);
    if (types.length === 1) {
      ApiProperty({ type: 'array', items: refs(...types)[0] })(target, propertyKey)
    } else {
      ApiProperty({ type: 'array', items: { oneOf: refs(...types) } })(target, propertyKey);
    }
  };
}

/**
 * Decorated property is exactly the given value.
 * Declares the property as an enum with a single value.
 * 
 * @example
 * class SuccessResponse {
 *   ＠ApiPropertyOfValue(true)
 *   public success!: true;
 * }
 */
export function ApiPropertyOfValue<T>(value: T): PropertyDecorator {
  return (target, propertyKey) => {
    ApiProperty({ enum: [value], enumName: '' })(target, propertyKey);
  };
}

/**
 * Decorated property is a value from an Enum.
 * The enum's name is automatically inferred and registered into the documentation.
 * 
 * @example
 * class StatusResponse {
 *   ＠ApiPropertyEnum({ Status })
 *   public status!: Status;
 * }
 * 
 * class PermissionResponse {
 *   ＠ApiPropertyEnum({ Permission }, { isArray: true })
 *   public permissions!: Permission[];
 * }
 */
export function ApiPropertyEnum(
  enumDictionary: { [P in string]?: Record<string, any> },
  options?: {
    isArray?: boolean
  }
): PropertyDecorator {
  return (target, propertyKey) => {
    const entries = Object.entries(enumDictionary);
    if (entries.length === 1) {
      ApiProperty({ enum: entries[0]?.[1], enumName: entries[0]?.[0], isArray: options?.isArray })(target, propertyKey);
    } else {
      throw new Error('ApiPropertyEnum must have exactly one entry');
    }
  };
}

/**
 * Decorated property is a file.
 * 
 * @example
 * class UploadDto {
 *   ApiPropertyFile()
 *   public file!: Express.Multer.File;
 * }
 */
export function ApiPropertyFile(): PropertyDecorator {
  return (...params) => {
    ApiProperty({ type: 'string', format: 'binary' })(...params);
  };
}

/**
 * Decorated controller method returns one of the given response DTO types.
 * The DTO types are automatically registered into the documentation.
 * 
 * @example
 * ＠ApiResponseOneOf([TeaResponse, CoffeeResponse])
 * public getDrink(): Promise<TeaResponse | CoffeeResponse> {
 *   return this.drinkService.getDrinkResponse();
 * }
 */
export function ApiResponseOneOf(...types: Type<any>[]): MethodDecorator {
  return (target, ...rest) => {
    ApiExtraModels(...types)(target.constructor);
    ApiOkResponse({ schema: { oneOf: refs(...types) } })(target, ...rest);
  };
}

/**
 * Decorated controller method returns one of the given response DTO types.
 * Also returns status 201 (Created)
 * The DTO types are automatically registered into the documentation.
 * 
 * @example
 * ＠ApiCreatedResponseOneOf([TeaResponse, CoffeeResponse])
 * public createDrink(): Promise<TeaResponse | CoffeeResponse> {
 *   return this.drinkService.createDrink();
 * }
 */
export function ApiCreatedResponseOneOf(...types: Type<any>[]): MethodDecorator {
  return (target, ...rest) => {
    ApiExtraModels(...types)(target.constructor);
    ApiCreatedResponse({ schema: { oneOf: refs(...types) } })(target, ...rest);
  };
}

/**
 * Decorated controller method returns a file.
 * 
 * @example
 * ＠ApiResponseFile()
 * public download(): Promise<void> {
 *   const buffer = this.fileService.getFileBuffer();
 *   response.status(200).send(buffer);
 * }
 */
export function ApiResponseFile(): MethodDecorator {
  return (...params) => {
    ApiOkResponse({
      content: {
        'application/octet-stream': {
          schema: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })(...params);
  };
}
