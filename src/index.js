import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'

function getObject (value) {
  return typeof value === 'object' ? value : null
}

function parseObject (ast) {
  switch (ast.kind) {
    case Kind.STRING:
    case Kind.BOOLEAN:
      return ast.value
    case Kind.INT:
    case Kind.FLOAT:
      return parseFloat(ast.value)
    case Kind.OBJECT: {
      const value = Object.create(null)
      ast.fields.forEach(field => {
        value[field.name.value] = parseObject(field.value)
      })
      return value
    }
    case Kind.LIST:
      return ast.values.map(parseObject)
    default:
      return null
  }
}

export default new GraphQLScalarType({
  name: 'JSON_OBJECT',
  description: 'The `JSON_OBJECT` scalar type represents a JSON Object',
  serialize: getObject,
  parseValue: getObject,
  parseLiteral (ast) {
    return ast.kind === Kind.OBJECT ? parseObject(ast) : null
  }
})
