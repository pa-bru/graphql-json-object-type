import { graphql, GraphQLObjectType, GraphQLSchema } from 'graphql'
import GraphQLJsonObject from './'

let schema
beforeAll(() => {
  schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: {
        value: {
          type: GraphQLJsonObject,
          args: {
            arg: {
              type: GraphQLJsonObject
            }
          },
          resolve: (obj, { arg }) => arg
        }
      }
    })
  })
})

describe('Test JSON Object scalar type', () => {
  const value = {chuck: 'norris'}

  test('should parse values', () => {
    graphql(
      schema,
      `query ($arg: JSON_OBJECT){ value(arg: $arg) }`,
      null,
      null,
      {arg: value}
    ).then(({data}) => {
      expect(data.value).toBe(value)
    })
  })

  test('should parse literals', () => {
    graphql(
      schema,
      `{
          value(arg: { foo: "bar" })
        }`
    ).then(({data}) => {
      expect(data.value).toEqual({ foo: 'bar' })
    })
  })
})
