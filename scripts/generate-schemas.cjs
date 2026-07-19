const fs = require('fs')
const path = require('path')
const { createGenerator } = require('ts-json-schema-generator')

const ROOT = path.join(__dirname, '..')

const generator = createGenerator({
  path: path.join(ROOT, 'src/data/types.ts'),
  tsconfig: path.join(ROOT, 'tsconfig.app.json'),
  expose: 'export',
})

function generate(typeName, outFile) {
  const schema = generator.createSchema(typeName)
  const rootDefinition = schema.definitions?.[typeName]

  // Allow the "$schema" property VS Code/other editors use to pick this
  // schema, so it isn't rejected by additionalProperties: false.
  if (rootDefinition && rootDefinition.type === 'object') {
    rootDefinition.properties = { $schema: { type: 'string' }, ...rootDefinition.properties }
  }

  fs.writeFileSync(path.join(ROOT, 'schemas', outFile), JSON.stringify(schema, null, 2) + '\n')
  console.log(`Wrote schemas/${outFile}`)
}

generate('Talk', 'talk.schema.json')
generate('DefaultSlides', 'default-slides.schema.json')
