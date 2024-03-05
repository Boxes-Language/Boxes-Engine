import { fileURLToPath } from 'url'
import { build } from 'tsup'
import chalk from 'chalk'
import path from 'path'
import fs from 'fs'

import checkFiles from './CheckFiles.js'

console.log(' 🔎 Checking Files')

const hasProblems = await checkFiles(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../Boxes-Engine'))

if (!hasProblems) {
  console.log('')

  console.log(' 📌 Updating Build Info')

  const info = JSON.parse(fs.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../Boxes-Engine/Info.json')))

  const date = new Date()

  const dateString = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`

  fs.writeFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../Boxes-Engine/Buildinfo.json'), JSON.stringify({
    version: info.version,
    buildDate: dateString,

    github: info.github
  }, null, 2))

  console.log(chalk.green(' 📌 Successfully Updated Build Info'))

  console.log(chalk.magenta(`\n 📋 Build Info\n ┕  Version: ${info.version}\n ┕  Build Date: ${dateString}\n`))

  console.log(' 📦 Bundling')

  await build({
    entry: [path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../Boxes-Engine/API.js')],
    outDir: path.join(path.dirname(fileURLToPath(import.meta.url)), 'Cache'),

    minify: 'terser',
    format: 'esm',

    silent: true
  })

  fs.renameSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'Cache', 'API.js'), path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../Assets/Boxes-Engine.js'))

  console.log(chalk.green(' 📦 Successfully Bundled'))
}

console.log('')
