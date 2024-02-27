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
* `options <undefined || object>`
  * `chunkPerExecution <number>`
  * `executionInterval <number>` | The interval between execution (ms)
  * `maxMemory <number>` |  The limitations of the virtual memory (bytes)
  * `maxChunks <number>` | The 

# Compiler
