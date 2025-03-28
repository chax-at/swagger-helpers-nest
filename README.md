# @chax-at/swagger-helpers-nest

This package provides additional tools to make generating <a href="https://swagger.io/specification/">OpenAPI</a> documentations with <a href="https://github.com/nestjs/swagger">NestJS/Swagger</a> easier.

## Usage

### Prerequisites

First, install the package by running

```
npm i @chax-at/swagger-helpers-nest
```

### Decorators

To have a better time generating useful OpenAPI (swagger) doc files, this package provides a set of decorators that combine @nestjs/swagger decorators.

Here are some examples.

#### DTO properties

```ts
class MugResponse {
  // if a property can have one of multiple types, use
  @ApiPropertyOneOf(TeaDto, CoffeeDto)
  public contents!: TeaDto | CoffeeDto;
}

class CarResponse {
  // if a property is an array of one or more non-primitive types, use
  @ApiPropertyArrayOf(WheelDto)
  public wheels!: WheelDto[];
}

class SuccessResponse {
  // if a property must be one specific value rather than a type, use
  @ApiPropertyOfValue(true)
  public success!: true;
}

class StatusResponse {
  // if a property's value is an enum, use the following to export the enum itself into the docs too
  @ApiPropertyEnum({ Status })
  public status!: Status;
}
```

#### Responses

```ts
class DrinksController {
  @Get()
  // if a route can have one of multiple response types, use
  @ApiResponseOneOf([TeaResponse, CoffeeResponse])
  public getDrink(): Promise<TeaResponse | CoffeeResponse> {
    return this.drinkService.getDrinkResponse();
  }

  @Post()
  // if a route can have one of multiple response types and the status should be 201, use
  @ApiCreatedResponseOneOf([TeaResponse, CoffeeResponse])
  public createDrink(): Promise<TeaResponse | CoffeeResponse> {
    return this.drinkService.createDrink();
  }
}
```

### Post processing

Sometimes decorators just don't cut it and you want to make alterations after `@nestjs/swagger`'s
`buildSwaggerDocument()` is done.

For this, this package provides a traversal utility `traverseDocument` which can be configured with visitors.

Example:
```ts

const MyVisitor: SchemaVisitor = (schema) => {
  if (matchesSomeCondition(schema)) {
    // modify schema in place
  }
}

const document = buildSwaggerDocument(app);
traverseDocument(document, {
  propertyVisitors: [
    Length1AllOfToOneOf, // convert allOf's with one entry to oneOf's
    MoveNullableToOneof, // move a nullable:true into a sibling oneOf
    MyVisitor            // your own
  ]
})
```
