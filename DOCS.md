## :factory: Trender

Основной класс, который будет рендерить таблицу.

[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L9)

### Constructors

`public`: Конструктор

Parameters:

* `data`: Дата, на основе которой будет строиться таблица


### Methods

- [render](#gear-render)
- [createTable](#gear-createtable)
- [createNoResult](#gear-createnoresult)
- [createHeader](#gear-createheader)
- [createBody](#gear-createbody)
- [createFooter](#gear-createfooter)
- [createHeaderRows](#gear-createheaderrows)
- [createBodyRows](#gear-createbodyrows)
- [createFooterRows](#gear-createfooterrows)
- [getHeaderRows](#gear-getheaderrows)
- [getBodyRows](#gear-getbodyrows)
- [getFooterRows](#gear-getfooterrows)
- [createHeaderRow](#gear-createheaderrow)
- [createBodyRow](#gear-createbodyrow)
- [createFooterRow](#gear-createfooterrow)
- [createHeaderCells](#gear-createheadercells)
- [createBodyCells](#gear-createbodycells)
- [createFooterCells](#gear-createfootercells)
- [getHeaderCells](#gear-getheadercells)
- [getBodyCells](#gear-getbodycells)
- [getFooterCells](#gear-getfootercells)
- [createHeaderCell](#gear-createheadercell)
- [createBodyCell](#gear-createbodycell)
- [createFooterCell](#gear-createfootercell)

#### :gear: render

Рендерит новую табличку взамен старой.

| Method | Type |
| ---------- | ---------- |
| `render` | `(parent: string) => void` |

Parameters:

* `parent`: Тег (div), внутри которого будет отрендерена атаблица.


[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L30)

#### :gear: createTable

Создает и возвращает таблицу.

| Method | Type |
| ---------- | ---------- |
| `createTable` | `() => HTMLTableElement` |

[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L41)

#### :gear: createNoResult

Отрисовка нет результата

| Method | Type |
| ---------- | ---------- |
| `createNoResult` | `() => HTMLElement or null` |

[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L65)

#### :gear: createHeader

Создает и возвращает Заголовки таблицы.

| Method | Type |
| ---------- | ---------- |
| `createHeader` | `() => HTMLTableSectionElement` |

[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L74)

#### :gear: createBody

Создает и возвращает тело таблицы.

| Method | Type |
| ---------- | ---------- |
| `createBody` | `() => HTMLTableSectionElement` |

[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L90)

#### :gear: createFooter

Создает и возвращает Нижнюю часть таблицы.

| Method | Type |
| ---------- | ---------- |
| `createFooter` | `() => HTMLTableSectionElement` |

[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L98)

#### :gear: createHeaderRows

Вызывает getHeaderRows и применяет к каждому значению createHeaderRow.
Должен возвращать массив из Node - html-элементов таблицы или быть соответствующим генератором.

| Method | Type |
| ---------- | ---------- |
| `createHeaderRows` | `(headerValues: tableSection) => Generator<HTMLTableRowElement, any, any>` |

Parameters:

* `headerValues`: Массив или объект содержащий заголовки таблицы


[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L109)

#### :gear: createBodyRows

Вызывает getBodyRows и применяет к каждому значению createBodyRow.
Должен возвращать массив из Node - html-элементов таблицы или быть соответствующим генератором.

| Method | Type |
| ---------- | ---------- |
| `createBodyRows` | `(bodyValues: tableSection) => Generator<HTMLTableRowElement, any, any>` |

Parameters:

* `bodyValues`: Массив или объект содержащий значения для тела таблицы


[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L121)

#### :gear: createFooterRows

Вызывает getFooterRows и применяет к каждому значению createFooterRow.
Должен возвращать массив из Node - html-элементов таблицы или быть соответствующим генератором.

| Method | Type |
| ---------- | ---------- |
| `createFooterRows` | `(footerValues: tableSection) => Generator<HTMLTableRowElement, any, any>` |

Parameters:

* `footerValues`: Массив или объект содержащий значения для футера таблицы


[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L133)

#### :gear: getHeaderRows

Метод возвращающий строки для заголовка таблицы в виде массива.
Целевое использование - переопределение порядка следования строк.

| Method | Type |
| ---------- | ---------- |
| `getHeaderRows` | `(headerValues: tableSection) => Generator<row, any, any>` |

Parameters:

* `headerValues`: Массив или объект содержащий заголовки таблицы


[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L145)

#### :gear: getBodyRows

Метод возвращающий строки для тела таблицы в виде массива.
Целевое использование - переопределение порядка следования строк.

| Method | Type |
| ---------- | ---------- |
| `getBodyRows` | `(bodyValues: tableSection) => Generator<row, any, any>` |

Parameters:

* `bodyValues`: Массив или объект содержащий значения для тела таблицы


[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L156)

#### :gear: getFooterRows

Метод возвращающий строки для футера таблицы в виде массива.
Целевое использование - переопределение порядка следования строк.

| Method | Type |
| ---------- | ---------- |
| `getFooterRows` | `(footerValues: tableSection) => Generator<row, any, any>` |

Parameters:

* `footerValues`: Массив или объект содержащий значения для футера таблицы


[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L167)

#### :gear: createHeaderRow

На основе переданного rowValues создает <tr> элемент для заголовков таблицы и возвращает его.

| Method | Type |
| ---------- | ---------- |
| `createHeaderRow` | `(rowValues: row) => HTMLTableRowElement` |

Parameters:

* `rowValues`: Строка со значениями для заголовков таблицы


[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L177)

#### :gear: createBodyRow

На основе переданного raw создает <tr> элемент для тела таблицы и возвращает его.

| Method | Type |
| ---------- | ---------- |
| `createBodyRow` | `(rowValues: row) => HTMLTableRowElement` |

Parameters:

* `rowValues`: Строка со значениями для тела таблицы


[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L186)

#### :gear: createFooterRow

На основе переданного raw создает <tr> элемент для футера таблицы и возвращает его.

| Method | Type |
| ---------- | ---------- |
| `createFooterRow` | `(rowValues: row) => HTMLTableRowElement` |

Parameters:

* `rowValues`: Строка со значениями для футера таблицы


[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L195)

#### :gear: createHeaderCells

Вызывает getHeaderCells и применяет к каждому значению метод для создания ячеек _createCell.
Должен возвращать массив из Node - html-элементов таблицы или быть соответствующим генератором.

| Method | Type |
| ---------- | ---------- |
| `createHeaderCells` | `(rowValues: row) => Generator<HTMLTableCellElement, any, any>` |

Parameters:

* `rowValues`: Массив строк заголовков таблицы


[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L205)

#### :gear: createBodyCells

Вызывает getBodyCells и применяет к каждому значению метод для создания ячеек _createCell.
Должен возвращать массив из Node - html-элементов таблицы или быть соответствующим генератором.

| Method | Type |
| ---------- | ---------- |
| `createBodyCells` | `(rowValues: row) => Generator<HTMLTableCellElement, any, any>` |

Parameters:

* `rowValues`: Массив строк тела таблицы


[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L217)

#### :gear: createFooterCells

Вызывает getFooterCells и применяет к каждому значению метод для создания ячеек _createCell.
Должен возвращать массив из Node - html-элементов таблицы или быть соответствующим генератором.

| Method | Type |
| ---------- | ---------- |
| `createFooterCells` | `(rowValues: row) => Generator<HTMLTableCellElement, any, any>` |

Parameters:

* `rowValues`: - Массив строк футера таблицы


[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L229)

#### :gear: getHeaderCells

Метод для получения значений ячеек для строки заголовка таблицы.
Целевое использование - определение порядка следования ячеек.

| Method | Type |
| ---------- | ---------- |
| `getHeaderCells` | `(row: row) => Generator<cell, any, any>` |

Parameters:

* `row`: Строка в таблице


[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L241)

#### :gear: getBodyCells

Метод для получения значений ячеек для строки тела таблицы.
Целевое использование - определение порядка следования ячеек.

| Method | Type |
| ---------- | ---------- |
| `getBodyCells` | `(row: row) => Generator<cell, any, any>` |

Parameters:

* `row`: Строка в таблице


[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L255)

#### :gear: getFooterCells

Метод для получения значений ячеек для строки футера таблицы.
Целевое использование - определение порядка следования ячеек.

| Method | Type |
| ---------- | ---------- |
| `getFooterCells` | `(row: row) => Generator<cell, any, any>` |

Parameters:

* `row`: Строка в таблице


[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L266)

#### :gear: createHeaderCell

| Method | Type |
| ---------- | ---------- |
| `createHeaderCell` | `(cellValue: cell) => HTMLTableCellElement` |

[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L272)

#### :gear: createBodyCell

| Method | Type |
| ---------- | ---------- |
| `createBodyCell` | `(cellValue: cell) => HTMLTableCellElement` |

[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L281)

#### :gear: createFooterCell

| Method | Type |
| ---------- | ---------- |
| `createFooterCell` | `(cellValue: cell) => HTMLTableCellElement` |

[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L288)

### Properties

- [id](#gear-id)
- [class](#gear-class)
- [debug](#gear-debug)
- [headers](#gear-headers)
- [data](#gear-data)

#### :gear: id

| Property | Type |
| ---------- | ---------- |
| `id` | `string` |

[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L11)

#### :gear: class

| Property | Type |
| ---------- | ---------- |
| `class` | `string` |

[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L12)

#### :gear: debug

| Property | Type |
| ---------- | ---------- |
| `debug` | `boolean` |

[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L13)

#### :gear: headers

| Property | Type |
| ---------- | ---------- |
| `headers` | `string[]` |

[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L14)

#### :gear: data

| Property | Type |
| ---------- | ---------- |
| `data` | `tableData` |

[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L17)
