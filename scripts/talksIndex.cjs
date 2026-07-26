const fs = require('fs')
const path = require('path')

/**
 * Scans `talksDir` for talk folders (any subdirectory containing a
 * `talk.md`) and writes `index.json` from what it finds, so the file never
 * needs to be hand-maintained. Returns the sorted list of ids.
 */
function generateTalksIndex(talksDir) {
  const ids = fs
    .readdirSync(talksDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((id) => fs.existsSync(path.join(talksDir, id, 'talk.md')))
    .sort((a, b) => a.localeCompare(b))

  fs.writeFileSync(path.join(talksDir, 'index.json'), JSON.stringify(ids, null, 2) + '\n')
  return ids
}

module.exports = { generateTalksIndex }
