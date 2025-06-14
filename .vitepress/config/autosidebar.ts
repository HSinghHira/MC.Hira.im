import { readdirSync, statSync, existsSync } from 'fs'
import { join, basename } from 'path'
import { textMappings } from '../config.mts'

// Function to convert kebab-case to Title Case with custom mappings
function toTitleCase(str: string): string {
  const lowerStr = str.toLowerCase()
  
  // Check if we have a custom mapping for this string
  if (textMappings[lowerStr]) {
    return textMappings[lowerStr]
  }
  
  // Default title case conversion
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Function to check if a directory contains markdown files
function hasMarkdownFiles(dirPath: string): boolean {
  try {
    if (!existsSync(dirPath)) return false
    const files = readdirSync(dirPath)
    return files.some(file => file.endsWith('.md') && file !== 'index.md')
  } catch {
    return false
  }
}

// Function to get markdown files in a directory
function getMarkdownFiles(dirPath: string): Array<{ text: string; link: string }> {
  try {
    if (!existsSync(dirPath)) return []
    
    const files = readdirSync(dirPath)
    const mdFiles = files
      .filter(file => file.endsWith('.md') && file !== 'index.md')
      .map(file => {
        const name = basename(file, '.md')
        return {
          text: toTitleCase(name),
          link: dirPath.replace('./en', '/en').replace('./pb', '/pb').replace(/\\/g, '/') + '/' + name
        }
      })
    
    return mdFiles
  } catch {
    return []
  }
}

// Function to generate sidebar for a content root
export function generateSidebar(contentRoot: string): any[] {
  const sidebar: any[] = []
  
  try {
    if (!existsSync(contentRoot)) {
      console.warn(`Content root does not exist: ${contentRoot}`)
      return sidebar
    }

    const baseDirs = ['tutorials', 'meteor']
    
    for (const baseDir of baseDirs) {
      const basePath = join(contentRoot, baseDir)
      
      if (!existsSync(basePath)) {
        console.warn(`Base directory does not exist: ${basePath}`)
        continue
      }

      const sidebarGroup: any = {
        text: toTitleCase(baseDir),
        collapsed: true,
        items: []
      }

      // Get subdirectories
      const items = readdirSync(basePath, { withFileTypes: true })
      const subdirs = items
        .filter(item => item.isDirectory())
        .map(item => item.name)
        .filter(name => !name.startsWith('.') && name !== 'assets')

      for (const subdir of subdirs) {
        const subdirPath = join(basePath, subdir)
        
        // Check if this subdirectory has markdown files
        const markdownFiles = getMarkdownFiles(subdirPath)
        
        if (markdownFiles.length > 0) {
          // If it has markdown files, create a subgroup
          sidebarGroup.items.push({
            text: toTitleCase(subdir),
            collapsed: true,
            items: markdownFiles
          })
        } else {
          // If no markdown files, just link to the directory (assuming it has an index.md)
          sidebarGroup.items.push({
            text: toTitleCase(subdir),
            link: `/${contentRoot.replace('./', '')}/${baseDir}/${subdir}/`
          })
        }
      }

      // Check if base directory itself has markdown files (not subdirectories)
      const baseMarkdownFiles = getMarkdownFiles(basePath)
      if (baseMarkdownFiles.length > 0) {
        sidebarGroup.items.push(...baseMarkdownFiles)
      }

      // Only add the group if it has items
      if (sidebarGroup.items.length > 0) {
        sidebar.push(sidebarGroup)
      }
    }

    console.log(`Generated sidebar for ${contentRoot}:`, JSON.stringify(sidebar, null, 2))
    return sidebar
    
  } catch (error) {
    console.error(`Error generating sidebar for ${contentRoot}:`, error)
    return sidebar
  }
}