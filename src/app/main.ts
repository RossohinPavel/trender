import * as types from "./types";
import * as service from "./service";
import updateSorting from "./sorting/sorting";


/**
 * Основной класс, который будет рендерить таблицу.
 */
export class Trender {
    // Типизация для входящей даты
    data: types.tableData;

    // Предустановленные атрибуты
    id = 'trender';
    class = '';
    debug = false;
    headers: string[] = [];

    /**
     * Конструктор
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
     * Отрисовка нет результата
     */
    createNoResult() {
        const cell = service.createElement('td', 'Нет результата');
        const row = service.createAndAppend('tr', [cell]);
        return service.createAndAppend('tbody', [row]);
    }

    /**
     * Создает и возвращает Заголовки таблицы.
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
     * Создает и возвращает тело таблицы.
     */
    createBody(): HTMLTableSectionElement {
        const rows = this.createBodyRows(this.data.tbody);
        return service.createAndAppend('tbody', rows) as HTMLTableSectionElement;
    }

    /**
     * Создает и возвращает Нижнюю часть таблицы.
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
     * Метод возвращающий строки для заголовка таблицы в виде массива.
     * Целевое использование - переопределение порядка следования строк.
     * @param headerValues Массив или объект содержащий заголовки таблицы
     */
    *getHeaderRows(headerValues: types.tableSection): Generator<types.row> {
        for ( const row of Object.values(headerValues) ) {
            yield row;
        }
    }

    /**
     * Метод возвращающий строки для тела таблицы в виде массива.
     * Целевое использование - переопределение порядка следования строк.
     * @param bodyValues Массив или объект содержащий значения для тела таблицы
     */
    *getBodyRows(bodyValues: types.tableSection): Generator<types.row> {
        for ( const row of Object.values(bodyValues) ) {
            yield row;
        }
    }

    /**
     * Метод возвращающий строки для футера таблицы в виде массива.
     * Целевое использование - переопределение порядка следования строк.
     * @param footerValues Массив или объект содержащий значения для футера таблицы
     */
    *getFooterRows(footerValues: types.tableSection): Generator<types.row> {
        for ( const row of Object.values(footerValues) ) {
            yield row;
        }
    }

    /**
     * На основе переданного rowValues создает <tr> элемент для заголовков таблицы и возвращает его.
     * @param rowValues Строка со значениями для заголовков таблицы
     */
    createHeaderRow(rowValues: types.row): HTMLTableRowElement {
        const cells = this.createHeaderCells(rowValues);
        return service.createAndAppend('tr', cells) as HTMLTableRowElement;
    }

    /**
     * На основе переданного raw создает <tr> элемент для тела таблицы и возвращает его.
     * @param rowValues Строка со значениями для тела таблицы
     */
    createBodyRow(rowValues: types.row): HTMLTableRowElement {
        const cells = this.createBodyCells(rowValues);
        return service.createAndAppend('tr', cells) as HTMLTableRowElement;;
    }

    /**
     * На основе переданного raw создает <tr> элемент для футера таблицы и возвращает его.
     * @param rowValues Строка со значениями для футера таблицы
     */
    createFooterRow(rowValues: types.row): HTMLTableRowElement {
        const cells = this.createFooterCells(rowValues);
        return service.createAndAppend('tr', cells) as HTMLTableRowElement;;
    }

    /**
     * Вызывает getHeaderCells и применяет к каждому значению метод для создания ячеек _createCell.
     * Должен возвращать массив из Node - html-элементов таблицы или быть соответствующим генератором.
     * @param rowValues Массив строк заголовков таблицы
     */
    *createHeaderCells(rowValues: types.row): Generator<HTMLTableCellElement> {
        const cells = this.getHeaderCells(rowValues);
        for ( const cellValue of cells ) {
            yield this.createHeaderCell(cellValue);
        }
    }

    /**
     * Вызывает getBodyCells и применяет к каждому значению метод для создания ячеек _createCell.
     * Должен возвращать массив из Node - html-элементов таблицы или быть соответствующим генератором.
     * @param rowValues Массив строк тела таблицы
     */
    *createBodyCells(rowValues: types.row): Generator<HTMLTableCellElement> {
        const cells = this.getBodyCells(rowValues);
        for ( const cellValue of cells ) {
            yield this.createBodyCell(cellValue);
        }
    }

    /**
     * Вызывает getFooterCells и применяет к каждому значению метод для создания ячеек _createCell.
     * Должен возвращать массив из Node - html-элементов таблицы или быть соответствующим генератором.
     * @param rowValues - Массив строк футера таблицы
     */
    *createFooterCells(rowValues: types.row): Generator<HTMLTableCellElement> {
        const cells = this.getFooterCells(rowValues);
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

    createHeaderCell(cellValue: types.cell): HTMLTableCellElement {
        const cell = service.createElement('th', cellValue);
        cell.setAttribute('scope', 'col');
        return cell as HTMLTableCellElement;
    }

    createBodyCell(cellValue: types.cell): HTMLTableCellElement {
        return service.createElement('td', cellValue) as HTMLTableCellElement
    }

    createFooterCell(cellValue: types.cell): HTMLTableCellElement {
        return service.createElement('td', cellValue) as HTMLTableCellElement
    }

}
