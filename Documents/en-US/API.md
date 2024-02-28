# API Document
* [Compiler](#compiler)
  * [compile()](#compile)
* [VirtualMachine](#virtualmachine)
  * [start()](#start)
  * [stop()](#stop)
  * [listen()](#listen)
* [Info](#info)
  * [version](#version)
  * [buildDate](#builddate)
  * [github](#github)
* [Data Structures](#data-structures)

# Compiler
```js
import { Compiler } from './Boxes-Engine.js'

new Compiler(<options>) // Create A Compiler
```
* `options <undefined || object>` | Options For The Compiler.
  * `loopInterval <number>` | The interval for loop (this can make the compiler "lazy"). `Default: 0`

> [!NOTE]
> You can set `loopInterval` to `0` to make it not lazy.

## compile()
```js
await .compile(<string>) // Compile Boxes code
```
* `string <string>` | The code that you want to compile.

> return `<object>`

```js
// When there's an error
{ error: true, errors: <array> }

// errors | The errors

{ content: <string>, line: <number>, start: <number> }

// content | The content of the error
// line | The line which the error occur
// index | The index which the error occur

// When it executed successfully
{ error: false, data: <Boxes Executable> }

// data
```
[[Boxes Executable](#boxes-executable)]

# VirtualMachine
```js
import { VirtualMachine } from './Boxes-Engine.js'

new VirtualMachine(<options>) // Create A Virtual Machine
```
* `options <undefined || object>` | Options For The Virtual Machine.
  * `chunkPerExecution <number>` | The amount of chunks that will be execute in a execution. `Default: 100`
  * `executionInterval <number>` | The interval between execution (ms). `Default: 0`
  * `maxMemory <number>` |  The limitation for the virtual memory (bytes). `Default: Infinity`
  * `maxChunks <number>` | The limitation for the amount of chunks. `Default: Infinity`
  * `addressLength <number>` | The length of memory address, chunk address. `Default: 5`
 
## start()
```js
await .start(<executable>, <location>) // Start The Virtual Machine
```
* `executable <object>` | A [Boxes Executable](#boxesexecutable).
* `location <string>` | The location of the workspace.

> return `<object>`

```js
// When there's an error
{ error: true, content: <string>, line: <number>, start: <number> }

// content | The content of the error
// line | The line which the error occur
// index | The index which the error occur

// When it executed successfully
{ error: false, data: <Boxes Data> }

// data
```
[[Boxes Data](#boxes-data)]

## stop()
```js
.stop () // Stop The Virtual Machine
```

> return `<undefined>`

# Info
```js
import { Info } from './Boxes-Engine.js'
```

## version
```
.version // Get The Version Of Boxes Engine
```

return `<string>`

## buildDate
```
.buildDate // Get The Build Date Of Boxes Engine
```

> return `<string>`

## github
```
.github // Get The Github Repository Link Of Boxes Engine
```

> return `<string>`

# Data Structures

## Boxes Executable
```js
{ operations, imports }
```
* `operations <array>` | Operations.
* `imports <array>` | Imports.

## Boxes Data
```js
{ type, value }
```
* `type <string>` | The type of the data.
* `value <any>` | The value of the data.
