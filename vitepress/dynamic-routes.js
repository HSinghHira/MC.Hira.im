import { load } from 'js-yaml'
import { readFileSync } from 'fs'
import { resolve } from 'path'

export async function getDynamicRoutes() {
  const samplePath = resolve(__dirname, '../meteor/sample.md')
  const fileContent = readFileSync(samplePath, 'utf-8')
  const frontmatterMatch = fileContent.match(/^---\n([\s\S]*?)\n---/)
  if (!frontmatterMatch) return []
  
  const frontmatter = load(frontmatterMatch[1])
  return frontmatter.features || []
}