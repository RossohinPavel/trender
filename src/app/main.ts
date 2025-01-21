import * as types from "./types";
import * as service from "./service";
import updateSorting from "./sorting/sorting";


/**
 * Класс для рендера таблицы.
 * Основной шаблон использования - переопределение атрибутов и методов в ООП-стиле.
 * ```js
 * // Определяем порядок следования столбцов и соответствующих значений.
 * class MyTrender extends Trender {
 *     headers = ["Second Column", "First Column"];
 * 
 *     *getBodyCells(row) {
 *         yield row.secondAttr;
 *         yield row.firstAttr;
 *     }
 * }
 * // После этого, создаем объект `MyTrender` и помещаем в него `data`.
 * const table = new MyTrender(data);
 * // Вызываем метод `render` для рендера таблицы. 
 * // В него нужно передать id тэга div, внутри которого будет рендериться таблица.
 * table.render('report');
 * ```
 * `data` - Объект, который должен удовлетворять следующему интерфейсу:
 * ```js
 * const data = {
 *     thead?: ...,
 *     tbody: ...,      // Обязательный атрибут для тела таблицы.
 *     tfoot?: ...
 * }
 * ```
 * Значения для `thead`, `tbody` и `tfoot` могут быть любые вложенные структуры. 
 * В стандартной реализации - любой объект к которому можно применить `Object.values(data.tbody)`.
 * Уровни вложенности должны соответствовать уровням таблицы. Разберем на примере массивов
 * Соответственно, 1 уровень вложенности (`data.tbody[1]`) будет расценен как вторая строка соответсвующего элемента таблицы.
 * 2 уровень (`data.tbody[1][4]`) - 5 ячейка второй строки.
 * Для определения порядка следования элементов таблицы можно собирать `data` нужным образом или пользоваться функционалом
 * класса и переопределять соответствующие методы и атрибуты.
 */
export class Trender {
    /**
     * Дата, на основе которой строится таблица.
     */
    data: types.tableData;

    /**
     * ИД, который будет присвоен таблице.
     */
    id = 'trender';

    /**
     * Классы, которые будут дабавлены таблице.
     */
    class = '';

    /**
     * Режим дебага. Если включен, то такие значения, как `undifined` будут отображаться как есть.
     */
    debug = false;

    /**
     * Заголовки таблицы как правило статичны, а данные изменяются. Их можно указать здесь как массив строк.
     */
    headers: string[] = [];


    /**
     * @param data Дата, на основе которой будет строиться таблица
     */
    constructor(data: types.tableData) {
        this.data = data;
    }

    /**
     * Рендерит новую табличку взамен старой.
     * @param parent Тег (div), внутри которого будет отрендерена атаблица.
     */
    render(parent: string) {
        const div = document.getElementById(parent);
        service.removeChildrens(div);
        const table = this.createTable();
        div.appendChild(table);
        updateSorting();
    }

    /**
     * Создает и возвращает таблицу.
     */
    createTable(): HTMLTableElement {
        const table = document.createElement('table');
        table.id = this.id;
        this.class && table.setAttribute('class', this.class);
        if ( this.data.tbody && Object.keys(this.data.tbody).length ) {
            // Рендерим заголовки таблицы
            const header = this.createHeader(); 
            header && table.appendChild(header);
            // Рендерим тело
            const body = this.createBody();
            table.appendChild(body);
            // Рендерим футер
            const footer = this.createFooter();
            footer && table.appendChild(footer);
        } else {
            const noResult = this.createNoResult();
            table.append(noResult);
        }
        return table;
    }

    /**
     * Создает единственную ячейку "Нет результата" в теле таблицы и возвращает этот элемент.
     */
    createNoResult() {
        const cell = service.createCell('td', 'Нет результата');
        const row = service.createAndAppend('tr', [cell]);
        return service.createAndAppend('tbody', [row]) as HTMLTableSectionElement;
    }

    /**
     * Создает и возвращает секцию заголовков таблицы.
     */
    createHeader(): HTMLTableSectionElement {
        let headerValues;
        if ( this.data.thead ) {
            headerValues = this.data.thead;
        } else if ( this.headers.length ) {
            headerValues = [this.headers];
        } else {
            return;
        }
        const rows = this.createHeaderRows(headerValues);
        return service.createAndAppend('thead', rows) as HTMLTableSectionElement;
    }

    /**
     * Создает и возвращает секцию основной части таблицы.
     */
    createBody(): HTMLTableSectionElement {
        const rows = this.createBodyRows(this.data.tbody);
        return service.createAndAppend('tbody', rows) as HTMLTableSectionElement;
    }

    /**
     * Создает и возвращает секцию нижней части таблицы.
     */
    createFooter(): HTMLTableSectionElement {
        const footerValues = this.data.tfoot || [];
        const rows = this.createFooterRows(footerValues);
        return service.createAndAppend('tfoot', rows) as HTMLTableSectionElement;
    }

    /**
     * Вызывает getHeaderRows и применяет к каждому значению createHeaderRow.
     * Должен возвращать массив из Node - html-элементов таблицы или быть соответствующим генератором.
     * @param headerValues Массив или объект содержащий заголовки таблицы
     */
    *createHeaderRows(headerValues: types.tableSection): Generator<HTMLTableRowElement> {
        const rows = this.getHeaderRows(headerValues);
        for ( const row of rows ) {
            yield this.createHeaderRow(row);
        }
    }

    /**
     * Вызывает getBodyRows и применяет к каждому значению createBodyRow.
     * Должен возвращать массив из Node - html-элементов таблицы или быть соответствующим генератором.
     * @param bodyValues Массив или объект содержащий значения для тела таблицы
     */
    *createBodyRows(bodyValues: types.tableSection): Generator<HTMLTableRowElement> {
        const rows = this.getBodyRows(bodyValues);
        for ( const row of rows ) {
            yield this.createBodyRow(row);
        }
    }

    /**
     * Вызывает getFooterRows и применяет к каждому значению createFooterRow.
     * Должен возвращать массив из Node - html-элементов таблицы или быть соответствующим генератором.
     * @param footerValues Массив или объект содержащий значения для футера таблицы
     */
    *createFooterRows(footerValues: types.tableSection): Generator<HTMLTableRowElement> {
        const rows = this.getFooterRows(footerValues);
        for ( const row of rows ) {
            yield this.createFooterRow(row);
        }
    }

    /**
     * Метод возвращающий строки для заголовков таблицы. Должен возвращать массив или быть соответствующим генератором.
     * Целевое использование - переопределение порядка следования строк.
     * @param headerValues Массив или объект содержащий заголовки таблицы
     */
    *getHeaderRows(headerValues: types.tableSection): Generator<types.row> {
        for ( const row of Object.values(headerValues) ) {
            yield row;
        }
    }

    /**
     * Метод возвращающий строки для тела таблицы. Должен возвращать массив или быть соответствующим генератором.
     * Целевое использование - переопределение порядка следования строк.
     * @param bodyValues Массив или объект содержащий значения для тела таблицы
     */
    *getBodyRows(bodyValues: types.tableSection): Generator<types.row> {
        for ( const row of Object.values(bodyValues) ) {
            yield row;
        }
    }

    /**
     * Метод возвращающий строки для футера таблицы. Должен возвращать массив или быть соответствующим генератором.
     * Целевое использование - переопределение порядка следования строк.
     * @param footerValues Массив или объект содержащий значения для футера таблицы
     */
    *getFooterRows(footerValues: types.tableSection): Generator<types.row> {
        for ( const row of Object.values(footerValues) ) {
            yield row;
        }
    }

    /**
     * На основе переданного headerValues создает tr-элемент для заголовков таблицы и возвращает его.
     * @param headerValues Строка со значениями для заголовков таблицы
     */
    createHeaderRow(headerValues: types.row): HTMLTableRowElement {
        const cells = this.createHeaderCells(headerValues);
        return service.createAndAppend('tr', cells) as HTMLTableRowElement;
    }

    /**
     * На основе переданного bodyValues создает tr-элемент для тела таблицы и возвращает его.
     * @param bodyValues Строка со значениями для тела таблицы
     */
    createBodyRow(bodyValues: types.row): HTMLTableRowElement {
        const cells = this.createBodyCells(bodyValues);
        return service.createAndAppend('tr', cells) as HTMLTableRowElement;;
    }

    /**
     * На основе переданного footerValues создает tr-элемент для футера таблицы и возвращает его.
     * @param footerValues Строка со значениями для футера таблицы
     */
    createFooterRow(footerValues: types.row): HTMLTableRowElement {
        const cells = this.createFooterCells(footerValues);
        return service.createAndAppend('tr', cells) as HTMLTableRowElement;;
    }

    /**
     * Вызывает getHeaderCells и применяет к каждому значению метод для создания ячеек _createCell.
     * Должен возвращать массив из Node - html-элементов таблицы или быть соответствующим генератором.
     * @param headerValues Массив строк заголовков таблицы
     */
    *createHeaderCells(headerValues: types.row): Generator<HTMLTableCellElement> {
        const cells = this.getHeaderCells(headerValues);
        for ( const cellValue of cells ) {
            yield this.createHeaderCell(cellValue);
        }
    }

    /**
     * Вызывает getBodyCells и применяет к каждому значению метод для создания ячеек _createCell.
     * Должен возвращать массив из Node - html-элементов таблицы или быть соответствующим генератором.
     * @param bodyValues Массив строк тела таблицы
     */
    *createBodyCells(bodyValues: types.row): Generator<HTMLTableCellElement> {
        const cells = this.getBodyCells(bodyValues);
        for ( const cellValue of cells ) {
            yield this.createBodyCell(cellValue);
        }
    }

    /**
     * Вызывает getFooterCells и применяет к каждому значению метод для создания ячеек _createCell.
     * Должен возвращать массив из Node - html-элементов таблицы или быть соответствующим генератором.
     * @param footerValues - Массив строк футера таблицы
     */
    *createFooterCells(footerValues: types.row): Generator<HTMLTableCellElement> {
        const cells = this.getFooterCells(footerValues);
        for ( const cellValue of cells ) {
            yield this.createFooterCell(cellValue);
        }
    }

    /**
     * Метод для получения значений ячеек для строки заголовка таблицы.
     * Целевое использование - определение порядка следования ячеек.
     * @param row Строка в таблице
     */
    *getHeaderCells(row: types.row): Generator<types.cell> {
        for ( const defaultHeader of this.headers ) {
            yield defaultHeader;
        }
        for ( const cell of Object.values(row) ) {
            yield cell;
        }
    }

    /**
     * Метод для получения значений ячеек для строки тела таблицы.
     * Целевое использование - определение порядка следования ячеек.
     * @param row Строка в таблице
     */
    *getBodyCells(row: types.row): Generator<types.cell> {
        for ( const cell of Object.values(row) ) {
            yield cell;
        }
    }

    /**
     * Метод для получения значений ячеек для строки футера таблицы.
     * Целевое использование - определение порядка следования ячеек.
     * @param row Строка в таблице
     */
    *getFooterCells(row: types.row): Generator<types.cell> {
        for ( const cell of Object.values(row) ) {
            yield cell;
        }
    }

    /**
     * Создает th-элемент ячейки для строки заголовка таблицы.
     * @param cellValue Значение, которое будет обернутов в th.
     */
    createHeaderCell(cellValue: types.cell): HTMLTableCellElement {
        if ( !this.debug ) {
            cellValue = service.getDefault(cellValue);
        }
        const cell = service.createCell('th', cellValue);
        cell.setAttribute('scope', 'col');
        return cell;
    }

    /**
     * Создает td-элемент ячейки для строки тела таблицы.
     * @param cellValue Значение, которое будет обернутов в td.
     */
    createBodyCell(cellValue: types.cell): HTMLTableCellElement {
        if ( !this.debug ) {
            cellValue = service.getDefault(cellValue);
        }
        return service.createCell('td', cellValue);
    }

    /**
     * Создает td-элемент ячейки для строки футера таблицы.
     * @param cellValue Значение, которое будет обернутов в td.
     */
    createFooterCell(cellValue: types.cell): HTMLTableCellElement {
        if ( !this.debug ) {
            cellValue = service.getDefault(cellValue);
        }
        return service.createCell('td', cellValue);
    }
}
