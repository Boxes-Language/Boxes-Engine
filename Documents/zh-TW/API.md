# API 文檔
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

new Compiler(<options>) // 創建一個編譯器
```
* `options <undefined || object>` | 編譯器的選項>。
  * `loopInterval <number>` | 迴圈的間隔 (這可以讓編譯器變得 "懶惰")。 `預設: 0`

> [!NOTE]
> 你可以將 `loopInterval` 設至 `0` 來讓它不 "懶惰"。

## compile()
```js
await .compile(<string>) // 編譯 Boxes 的代碼
```
* `string <string>` | 你想要編譯的代碼。

> 返回 `<object>`

```js
// 當發生了錯誤
{ error: true, errors: <array> }

// errors | 發生的錯誤

{ content: <string>, line: <number>, start: <number> }

// content | 錯誤的內容
// line | 發生錯誤的行
// index | 發生錯誤的索引 (index)

// 當執行成功
{ error: false, data: <Boxes 資料> }
```
[[Boxes 資料](#boxes-資料)]

# VirtualMachine
```js
import { VirtualMachine } from './Boxes-Engine.js'

new VirtualMachine(<options>) // 創建一個虛擬機
```
* `options <undefined || object>` | 虛擬機的選項。
  * `chunkPerExecution <number>` | 每次執行的區塊數。 `預設: 100`
  * `executionInterval <number>` | 每次執行的間隔 (毫秒)。 `預設: 0`
  * `maxMemory <number>` | 虛擬記憶體的使用上限 (bytes)。 `預設: Infinity`
  * `maxChunks <number>` | 區塊數的上限。 `預設: Infinity`
  * `addressLength <number>` | 虛擬記憶體地址、區塊地址的長度。 `預設: 5`
 
## start()
```js
await .start(<executable>, <location>) // 啟動虛擬機
```
* `executable <object>` | 一個[Boxes 執行物件](#boxes-執行物件)。
* `location <string>` | 工作空間的位置。

> 返回 `<object>`

```js
// When there's an error
{ error: true, content: <string>, line: <number>, start: <number> }

// content | The content of the error
// line | The line which the error occur
// index | The index which the error occur

// When it executed successfully
{ error: false, data: <Boxes 資料> }
```
[[Boxes 資料](#boxes-資料)]

## stop()
```js
.stop () // 停止虛擬機
```

> 返回 `<undefined>`

# Info
```js
import { Info } from './Boxes-Engine.js'
```

## version
```
.version // 取得 Boxes-Engine 的版本
```

返回 `<string>`

## buildDate
```
.buildDate // 取得 Boxes-Engine 的建構日期
```

> 返回 `<string>`

## github
```
.github // 取得 Boxes-Engine 的 Github 儲存庫連結
```

> 返回 `<string>`

# Data Structures

## Boxes 執行物件
```js
{ operations, imports }
```
* `operations <array>` | 操作。
* `imports <array>` | 導入。

## Boxes 資料
```js
{ type, value }
```
* `type <string>` | 資料的類型。
* `value <any>` | 資料的值
