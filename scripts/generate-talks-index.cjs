const path = require('path')
const { generateTalksIndex } = require('./talksIndex.cjs')

const talksDir = path.join(__dirname, '..', 'public', 'talks')
const ids = generateTalksIndex(talksDir)

console.log(`Wrote public/talks/index.json with ${ids.length} talk(s):`)
for (const id of ids) {
  console.log(`  - ${id}`)
}
