# API Document

* [VirtualMachine](#virtualmachine)
  * [start()](#start)
  * [stop()](#stop)
  * [listen()](#listen)
* [Compiler](#compiler)
  * [compile()](#compile)
* [Data Structures](datastructures)

# VirtualMachine
```js
const { VirtualMachine } = require('./Boxes-Engine/API.js')

new VirtualMachine(<options>) // Create A Virtual Machine
```
* `options <undefined || object>` | Options For The Virtual Machine
  * `chunkPerExecution <number>` | `Default: 100`
  * `executionInterval <number>` | The interval between execution (ms) `Default: 0`
  * `maxMemory <number>` |  The limitation for the virtual memory (bytes) `Default: Infinity`
  * `maxChunks <number>` | The limitation for the amount of chunks `Default: Infinity`
  * `addressLength <number>` | The length of memory address, chunk address `Default: 5`
 
## start()
```js
await .start(<executable>, <location>) // Start The Virtual Machine
```
* `executable <object>` | A [Boxes Executable](#boxesexecutable)
* `location <string>` | The location of the workspace

> return `<object>`

```js
// When there's an error
{ error: true, content: <string>, line: <number>, start: <number> }

// content | The content of the error
// line | The line which the error occur
// index | The index which the error occur

// When it executed successfully
{ error: false, data: <object> }

// data
```

## stop()
```js
.stop () // Stop The Virtual Machine
```

> return `<undefined>`

# Compiler
```js
const { Compiler } = require('./Boxes-Engine/API.js')

new Compiler(<options>) // Create A Compiler
```
* `options <undefined || object>` | Options For The Compiler
  * `loopInterval <number>` | The interval for loop (this can make the compiler "lazy") `Default: 0`

## compile()
```js
await .compile(<string>) // Compile Boxes code
```
* `string <string>` | The code that you want to compile

> return `<object> (Boxes executable)`

# Data Structures

## Boxes Executable
```js
{ operations, imports }
```
* `operations <array>` | Operations
* `imports <array>` | Imports

## Boxes Data
```js
{ type, value }
```
* `type <string>` | The type of the data
* `value <any>` | The value of the data
