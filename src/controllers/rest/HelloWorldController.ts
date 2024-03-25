import {Controller} from "@tsed/di";
import {array, from, Get, In, map, number, object, oneOf, Property, Returns, string} from "@tsed/schema";
import {QueryParams} from "@tsed/platform-params";
import {ValidationError} from "ajv";

const AjvErrorSchema = object({
  keyword: string().required(),
  instancePath: string().required(),
  schemaPath: string().required().description("An error message"),
  params: map().items(string()).description("A list of related errors"),
  parentSchema: object(),
  schema: object()
})
  .label("AjvErrorSchema")
  .unknown();

/**
 * @ignore
 */
const GenericErrorSchema = object({
  name: string().required().description("The error name"),
  message: string().required().description("An error message")
})
  .label("GenericError")
  .unknown();

from(ValidationError).properties({
  name: string().required().description("The error name"),
  message: string().required().description("An error message"),
  status: number().required().description("The status code of the exception"),
  errors: array().items({oneOf: [AjvErrorSchema, GenericErrorSchema]}).description("A list of related errors"),
  stack: string().description("The stack trace (only in development mode)")
});

export class HelloModel {
  @Property()
  test: string;

  @Property()
  kind: string;
}

@Controller("/hello-world")
export class HelloWorldController {
  @Get("/")
  @In("kind").Schema({
    examples: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      ["test"]: {description: "test", value: "test"}
    }
  })
  @Returns(400, ValidationError)
  get(@QueryParams() test: HelloModel) {
    return "hello " + test.kind + " " + test.test;
  }
}
