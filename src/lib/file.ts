import { promises as fs } from 'node:fs'
import path from 'node:path'

export async function readFile<T>(jsonPath: string) {
  const filePath = path.join(process.cwd(), `/public/data/${jsonPath}`)

  const fileContents = await fs.readFile(filePath, 'utf8')
  return JSON.parse(fileContents) as T
}

export async function findFile(name: string, directoryName: string) {
  const directoryPath = path.join(
    process.cwd(),
    `/public/data/${directoryName}`,
  )
  const files = await fs.readdir(directoryPath)
  const matchedFile = files.find((file) => {
    const pName = file.split('-')[1]
    return pName.startsWith(decodeURIComponent(name))
  })

  return matchedFile
}
