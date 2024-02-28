import wcwidth from 'wcwidth'
import ESlint from 'eslint'
import chalk from 'chalk'
import path from 'path'
import fs from 'fs'

// Check Files 
export default async (folderPath) => {
  const eslint = new ESlint.ESLint({
    //useEslintrc: false,
    //
    overrideConfig: {
      parser: '@babel/eslint-parser',

      plugins: ['@babel'],

      parserOptions: {
        requireConfigFile: false,

        babelOptions: {
          plugins: [
            '@babel/plugin-syntax-import-assertions'
          ]
        }
      },
    }
  })

  process.stdout.write(chalk.magenta(` 🔎 Checking Files 0% [0 / Waiting]`))

  const files = getAllJSFiles(folderPath)

  let messages = []

  process.stdout.clearLine(0)
  process.stdout.cursorTo(0)
  process.stdout.write(chalk.magenta(` 🔎 Checking Files 0% [0 / ${files.length}]`))

  for (let i = 0; i < files.length; i++) {
    const result = (await eslint.lintText(fs.readFileSync(files[i], 'utf8')))[0]
    
    result.messages.forEach((message) => {
      messages.push({
        type: ['warning', 'error'][message.severity - 1],

        content: message.message,

        filePath: files[i],
        line: message.line,
        start: message.column
      })
    })

    process.stdout.clearLine(0)
    process.stdout.cursorTo(0)
    process.stdout.write(chalk.magenta(` 🔎 Checking Files ${Math.round((100 / files.length) * i)}% [${i + 1} / ${files.length}]`))
  }

  if (messages.length > 0) {
    process.stdout.clearLine(0)
    process.stdout.cursorTo(0)
    process.stdout.write(chalk.yellow(` 🔎 Successfully Checked All Files (${messages.length} Problems Found)\n`))

    let lineBreak = chalk.gray(` ${'-'.repeat(process.stdout.columns - 2)} `)

    let files = []

    messages.forEach((message) => {
      let line = fs.readFileSync(message.filePath, 'utf8').split('\n')[message.line - 1]
      
      while (line[0] === ' ') line = line.substring(1, line.length)

      const pointer = `${' '.repeat(wcwidth(line.substring(0, message.start)))}^`

      if (message.type === 'warning') {
        files.push(`${chalk.yellow(` [Warning]: ${message.content}`)}\n${lineBreak}\n ${line}\n${pointer}\n${lineBreak}\n ${chalk.gray(`${message.filePath} ${message.line-1}:${message.start}`)}`)
      } else {
        files.push(`${chalk.red(` [Error]: ${message.content}`)}\n${lineBreak}\n ${line}\n${pointer}\n${lineBreak}\n ${chalk.gray(`${message.filePath} ${message.line-1}:${message.start}`)}`)
      }
    })

    console.log(`\n${files.join('\n\n')}`)
  } else {
    process.stdout.clearLine(0)
    process.stdout.cursorTo(0)
    process.stdout.write(chalk.green(' 🔎 Successfully Checked All Files (No Problems Found)\n'))
  }

  return messages.length > 0
}

// Get All Javascript Files
function getAllJSFiles (folderPath) {
  let files = []

  fs.readdirSync(folderPath).forEach((fileName) => {
    if (fs.statSync(path.join(folderPath, fileName)).isDirectory()) files = files.concat(getAllJSFiles(path.join(folderPath, fileName)))
    else if (path.extname(fileName) === '.js') files.push(path.join(folderPath, fileName))
  })

  return files
}
