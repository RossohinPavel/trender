## :factory: Trender

Класс для рендера таблицы.
Основной шаблон использования - переопределение атрибутов и методов в ООП-стиле.
```js
// Определяем порядок следования столбцов и соответствующих значений.
class MyTrender extends Trender {
    headers = ["Second Column", "First Column"];

    *getBodyCells(row) {
        yield row.secondAttr;
        yield row.firstAttr;
    }
}
// После этого, создаем объект `MyTrender` и помещаем в него `data`.
const table = new MyTrender(data);
// Вызываем метод `render` для рендера таблицы. 
// В него нужно передать id тэга div, внутри которого будет рендериться таблица.
table.render('report');
```
`data` - Объект, который должен удовлетворять следующему интерфейсу:
```js
const data = {
    thead?: ...,
    tbody: ...,      // Обязательный атрибут для тела таблицы.
    tfoot?: ...
}
```
Значения для `thead`, `tbody` и `tfoot` могут быть любые вложенные структуры. 
В стандартной реализации - любой объект к которому можно применить `Object.values(data.tbody)`.
Уровни вложенности должны соответствовать уровням таблицы. Разберем на примере массивов
Соответственно, 1 уровень вложенности (`data.tbody[1]`) будет расценен как вторая строка соответсвующего элемента таблицы.
2 уровень (`data.tbody[1][4]`) - 5 ячейка второй строки.
Для определения порядка следования элементов таблицы можно собирать `data` нужным образом или пользоваться функционалом
класса и переопределять соответствующие методы и атрибуты.

[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L41)

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


[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L79)

#### :gear: createTable

Создает и возвращает таблицу.

| Method | Type |
| ---------- | ---------- |
| `createTable` | `() => HTMLTableElement` |

[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L90)

#### :gear: createNoResult

Создает единственную ячейку "Нет результата" в теле таблицы и возвращает этот элемент.

| Method | Type |
| ---------- | ---------- |
| `createNoResult` | `() => HTMLTableSectionElement` |

[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L114)

#### :gear: createHeader

Создает и возвращает секцию заголовков таблицы.

| Method | Type |
| ---------- | ---------- |
| `createHeader` | `() => HTMLTableSectionElement` |

[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L123)

#### :gear: createBody

Создает и возвращает секцию основной части таблицы.

| Method | Type |
| ---------- | ---------- |
| `createBody` | `() => HTMLTableSectionElement` |

[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L139)

#### :gear: createFooter

Создает и возвращает секцию нижней части таблицы.

| Method | Type |
| ---------- | ---------- |
| `createFooter` | `() => HTMLTableSectionElement` |

[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L147)

#### :gear: createHeaderRows

Вызывает getHeaderRows и применяет к каждому значению createHeaderRow.
Должен возвращать массив из Node - html-элементов таблицы или быть соответствующим генератором.

| Method | Type |
| ---------- | ---------- |
| `createHeaderRows` | `(headerValues: tableSection) => Generator<HTMLTableRowElement, any, any>` |

Parameters:

* `headerValues`: Массив или объект содержащий заголовки таблицы


[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L158)

#### :gear: createBodyRows

Вызывает getBodyRows и применяет к каждому значению createBodyRow.
Должен возвращать массив из Node - html-элементов таблицы или быть соответствующим генератором.

| Method | Type |
| ---------- | ---------- |
| `createBodyRows` | `(bodyValues: tableSection) => Generator<HTMLTableRowElement, any, any>` |

Parameters:

* `bodyValues`: Массив или объект содержащий значения для тела таблицы


[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L170)

#### :gear: createFooterRows

Вызывает getFooterRows и применяет к каждому значению createFooterRow.
Должен возвращать массив из Node - html-элементов таблицы или быть соответствующим генератором.

| Method | Type |
| ---------- | ---------- |
| `createFooterRows` | `(footerValues: tableSection) => Generator<HTMLTableRowElement, any, any>` |

Parameters:

* `footerValues`: Массив или объект содержащий значения для футера таблицы


[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L182)

#### :gear: getHeaderRows

Метод возвращающий строки для заголовков таблицы. Должен возвращать массив или быть соответствующим генератором.
Целевое использование - переопределение порядка следования строк.

| Method | Type |
| ---------- | ---------- |
| `getHeaderRows` | `(headerValues: tableSection) => Generator<row, any, any>` |

Parameters:

* `headerValues`: Массив или объект содержащий заголовки таблицы


[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L194)

#### :gear: getBodyRows

Метод возвращающий строки для тела таблицы. Должен возвращать массив или быть соответствующим генератором.
Целевое использование - переопределение порядка следования строк.

| Method | Type |
| ---------- | ---------- |
| `getBodyRows` | `(bodyValues: tableSection) => Generator<row, any, any>` |

Parameters:

* `bodyValues`: Массив или объект содержащий значения для тела таблицы


[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L205)

#### :gear: getFooterRows

Метод возвращающий строки для футера таблицы. Должен возвращать массив или быть соответствующим генератором.
Целевое использование - переопределение порядка следования строк.

| Method | Type |
| ---------- | ---------- |
| `getFooterRows` | `(footerValues: tableSection) => Generator<row, any, any>` |

Parameters:

* `footerValues`: Массив или объект содержащий значения для футера таблицы


[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L216)

#### :gear: createHeaderRow

На основе переданного headerValues создает tr-элемент для заголовков таблицы и возвращает его.

| Method | Type |
| ---------- | ---------- |
| `createHeaderRow` | `(headerValues: row) => HTMLTableRowElement` |

Parameters:

* `headerValues`: Строка со значениями для заголовков таблицы


[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L226)

#### :gear: createBodyRow

На основе переданного bodyValues создает tr-элемент для тела таблицы и возвращает его.

| Method | Type |
| ---------- | ---------- |
| `createBodyRow` | `(bodyValues: row) => HTMLTableRowElement` |

Parameters:

* `bodyValues`: Строка со значениями для тела таблицы


[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L235)

#### :gear: createFooterRow

На основе переданного footerValues создает tr-элемент для футера таблицы и возвращает его.

| Method | Type |
| ---------- | ---------- |
| `createFooterRow` | `(footerValues: row) => HTMLTableRowElement` |

Parameters:

* `footerValues`: Строка со значениями для футера таблицы


[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L244)

#### :gear: createHeaderCells

Вызывает getHeaderCells и применяет к каждому значению метод для создания ячеек _createCell.
Должен возвращать массив из Node - html-элементов таблицы или быть соответствующим генератором.

| Method | Type |
| ---------- | ---------- |
| `createHeaderCells` | `(headerValues: row) => Generator<HTMLTableCellElement, any, any>` |

Parameters:

* `headerValues`: Массив строк заголовков таблицы


[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L254)

#### :gear: createBodyCells

Вызывает getBodyCells и применяет к каждому значению метод для создания ячеек _createCell.
Должен возвращать массив из Node - html-элементов таблицы или быть соответствующим генератором.

| Method | Type |
| ---------- | ---------- |
| `createBodyCells` | `(bodyValues: row) => Generator<HTMLTableCellElement, any, any>` |

Parameters:

* `bodyValues`: Массив строк тела таблицы


[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L266)

#### :gear: createFooterCells

Вызывает getFooterCells и применяет к каждому значению метод для создания ячеек _createCell.
Должен возвращать массив из Node - html-элементов таблицы или быть соответствующим генератором.

| Method | Type |
| ---------- | ---------- |
| `createFooterCells` | `(footerValues: row) => Generator<HTMLTableCellElement, any, any>` |

Parameters:

* `footerValues`: - Массив строк футера таблицы


[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L278)

#### :gear: getHeaderCells

Метод для получения значений ячеек для строки заголовка таблицы.
Целевое использование - определение порядка следования ячеек.

| Method | Type |
| ---------- | ---------- |
| `getHeaderCells` | `(row: row) => Generator<cell, any, any>` |

Parameters:

* `row`: Строка в таблице


[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L290)

#### :gear: getBodyCells

Метод для получения значений ячеек для строки тела таблицы.
Целевое использование - определение порядка следования ячеек.

| Method | Type |
| ---------- | ---------- |
| `getBodyCells` | `(row: row) => Generator<cell, any, any>` |

Parameters:

* `row`: Строка в таблице


[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L304)

#### :gear: getFooterCells

Метод для получения значений ячеек для строки футера таблицы.
Целевое использование - определение порядка следования ячеек.

| Method | Type |
| ---------- | ---------- |
| `getFooterCells` | `(row: row) => Generator<cell, any, any>` |

Parameters:

* `row`: Строка в таблице


[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L315)

#### :gear: createHeaderCell

Создает th-элемент ячейки для строки заголовка таблицы.

| Method | Type |
| ---------- | ---------- |
| `createHeaderCell` | `(cellValue: cell) => HTMLTableCellElement` |

Parameters:

* `cellValue`: Значение, которое будет обернутов в th.


[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L325)

#### :gear: createBodyCell

Создает td-элемент ячейки для строки тела таблицы.

| Method | Type |
| ---------- | ---------- |
| `createBodyCell` | `(cellValue: cell) => HTMLTableCellElement` |

Parameters:

* `cellValue`: Значение, которое будет обернутов в td.


[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L338)

#### :gear: createFooterCell

Создает td-элемент ячейки для строки футера таблицы.

| Method | Type |
| ---------- | ---------- |
| `createFooterCell` | `(cellValue: cell) => HTMLTableCellElement` |

Parameters:

* `cellValue`: Значение, которое будет обернутов в td.


[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L349)

### Properties

- [data](#gear-data)
- [id](#gear-id)
- [class](#gear-class)
- [debug](#gear-debug)
- [headers](#gear-headers)

#### :gear: data

Дата, на основе которой строится таблица.

| Property | Type |
| ---------- | ---------- |
| `data` | `tableData` |

[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L45)

#### :gear: id

ИД, который будет присвоен таблице.

| Property | Type |
| ---------- | ---------- |
| `id` | `string` |

[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L50)

#### :gear: class

Классы, которые будут дабавлены таблице.

| Property | Type |
| ---------- | ---------- |
| `class` | `string` |

[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L55)

#### :gear: debug

Режим дебага. Если включен, то такие значения, как `undifined` будут отображаться как есть.

| Property | Type |
| ---------- | ---------- |
| `debug` | `boolean` |

[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L60)

#### :gear: headers

Заголовки таблицы как правило статичны, а данные изменяются. Их можно указать здесь как массив строк.

| Property | Type |
| ---------- | ---------- |
| `headers` | `string[]` |

[:link: Source](https://github.com/RossohinPavel/trender/tree/main/src/app/main.ts#L65)
