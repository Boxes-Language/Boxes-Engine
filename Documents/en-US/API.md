# API Document

* [VirtualMachine](#virtualmachine)
  * [start()](#start)
  * [stop()](#stop)
  * [listen()](#listen)
* [Compiler](#compiler)

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

# Compiler
