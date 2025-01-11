import * as types from "./types";
import * as service from "./service";
import updateSorting from "./sorting/sorting";

/**
 * Основной класс, который будет рендерить таблицу.
 */
class Trender {
    // Аргументы конструктора
    data: types.tableData;
    divId: string;
    id: string;
    // Атрибуты объекта
    parentDiv: HTMLElement;
    table: HTMLTableElement;
    // Статичные заголовки для таблицы можно указать в виде массива
    headers = ['Trender'];

    /**
     * Конструктор
     * @param config
     * @param config.data Дата, на основе которой будет строиться таблица
     * @param config.divId Id тэга <div>, где будет отрисовываться таблица
     * @param config.id Можно задать свой id для идентификации таблицы.
     */
    constructor({data, divId='trender', id='trender'}: types.trenderArgs) {
        this.data = data;
        this.divId = divId;
        this.id = id;
        this.parentDiv = document.getElementById(divId);
    }

    /**
     * Очищает <div> связанный с таблицей от всех дочерних элементов.
     */
    clear() {
        service.removeAllChildren(this.parentDiv);
    }

    /**
     * Рендерит новую табличку взамен старой.
     */
    render() {
        this.clear();
        this.table = this.createTable();
        this.parentDiv.appendChild(this.table);
        updateSorting();
    }

    /**
     * Создает и возвращает таблицу.
     */
    createTable(): HTMLTableElement {
        const table = document.createElement('table');
        table.setAttribute('class', 'trender');
        table.id = this.id;
        if ( Object.keys(this.data.tbody).length ) {
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
     * Создает и возвращает Заголовки таблицы.
     */
    createHeader(): HTMLTableSectionElement {
        const headerValues = this.data.thead || [[]];
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
     * @param rawRows Массив или объект содержащий заголовки таблицы
     */
    *createHeaderRows(rawRows: types.tableSection): Generator<HTMLTableRowElement> {
        const rows = this.getHeaderRows(rawRows);
        for ( const row of rows ) {
            yield this.createHeaderRow(row);
        }
    }

    /**
     * Вызывает getBodyRows и применяет к каждому значению createBodyRow.
     * Должен возвращать массив из Node - html-элементов таблицы или быть соответствующим генератором.
     * @param rawRows Массив или объект содержащий значения для тела таблицы
     */
    *createBodyRows(rawRows: types.tableSection): Generator<HTMLTableRowElement> {
        const rows = this.getBodyRows(rawRows);
        for ( const row of rows ) {
            yield this.createBodyRow(row);
        }
    }

    /**
     * Вызывает getFooterRows и применяет к каждому значению createFooterRow.
     * Должен возвращать массив из Node - html-элементов таблицы или быть соответствующим генератором.
     * @param rawRows Массив или объект содержащий значения для футера таблицы
     */
    *createFooterRows(rawRows: types.tableSection): Generator<HTMLTableRowElement> {
        const rows = this.getFooterRows(rawRows);
        for ( const row of rows ) {
            yield this.createFooterRow(row);
        }
    }

    /**
     * Метод возвращающий строки для заголовка таблицы в виде массива.
     * Целевое использование - переопределение порядка следования строк.
     * @param rawRows Массив или объект содержащий заголовки таблицы
     */
    getHeaderRows(rawRows: types.tableSection): types.row[] {
        return Object.values(rawRows);
    }

    /**
     * Метод возвращающий строки для тела таблицы в виде массива.
     * Целевое использование - переопределение порядка следования строк.
     * @param rawRows Массив или объект содержащий значения для тела таблицы
     */
    getBodyRows(rawRows: types.tableSection): types.row[] {
        return Object.values(rawRows);
    }

    /**
     * Метод возвращающий строки для футера таблицы в виде массива.
     * Целевое использование - переопределение порядка следования строк.
     * @param rawRows Массив или объект содержащий значения для футера таблицы
     */
    getFooterRows(rawRows: types.tableSection): types.row[] {
        return Object.values(rawRows);
    }

    /**
     * На основе переданного <raw> создает <tr> элемент для заголовков таблицы и возвращает его.
     * @param row Строка со значениями для заголовков таблицы
     */
    createHeaderRow(row: types.row): HTMLTableRowElement {
        const cells = this.createHeaderCells(row);
        return service.createAndAppend('tr', cells) as HTMLTableRowElement;
    }

    /**
     * На основе переданного <raw> создает <tr> элемент для тела таблицы и возвращает его.
     * @param row Строка со значениями для тела таблицы
     */
    createBodyRow(row: types.row): HTMLTableRowElement {
        const cells = this.createBodyCells(row);
        return service.createAndAppend('tr', cells) as HTMLTableRowElement;;
    }

    /**
     * На основе переданного <raw> создает <tr> элемент для футера таблицы и возвращает его.
     * @param row Строка со значениями для футера таблицы
     */
    createFooterRow(row: types.row): HTMLTableRowElement {
        const cells = this.createFooterCells(row);
        return service.createAndAppend('tr', cells) as HTMLTableRowElement;;
    }

    /**
     * Вызывает getHeaderCells и применяет к каждому значению метод для создания ячеек _createCell.
     * Должен возвращать массив из Node - html-элементов таблицы или быть соответствующим генератором.
     * @param row Массив строк заголовков таблицы
     */
    *createHeaderCells(row: types.row): Generator<HTMLTableCellElement> {
        const cells = this.getHeaderCells(row);
        for ( const rawCell of cells ) {
            const cell = service.createElement('th', rawCell);
            cell.setAttribute('scope', 'col');
            yield cell as HTMLTableCellElement;
        }
    }

    /**
     * Вызывает getBodyCells и применяет к каждому значению метод для создания ячеек _createCell.
     * Должен возвращать массив из Node - html-элементов таблицы или быть соответствующим генератором.
     * @param row Массив строк тела таблицы
     */
    *createBodyCells(row: types.row): Generator<HTMLTableCellElement> {
        const cells = this.getBodyCells(row);
        for ( const cell of cells ) {
            yield service.createElement('td', cell) as HTMLTableCellElement;
        }
    }

    /**
     * Вызывает getFooterCells и применяет к каждому значению метод для создания ячеек _createCell.
     * Должен возвращать массив из Node - html-элементов таблицы или быть соответствующим генератором.
     * @param row - Массив строк футера таблицы
     */
    *createFooterCells(row: types.row): Generator<HTMLTableCellElement> {
        const cells = this.getFooterCells(row);
        for ( const cell of cells ) {
            yield service.createElement('td', cell) as HTMLTableCellElement;
        }
    }

    /**
     * Метод для получения значений ячеек для строки заголовка таблицы.
     * Целевое использование - определение порядка следования ячеек.
     * @param row Строка в таблице
     */
    getHeaderCells(row: types.row): types.cell[] {
        return [...this.headers, ...Object.values(row)];
    }

    /**
     * Метод для получения значений ячеек для строки тела таблицы.
     * Целевое использование - определение порядка следования ячеек.
     * @param row Строка в таблице
     */
    getBodyCells(row: types.row): types.cell[] {
        return Object.values(row);
    }

    /**
     * Метод для получения значений ячеек для строки футера таблицы.
     * Целевое использование - определение порядка следования ячеек.
     * @param row Строка в таблице
     */
    getFooterCells(row: types.row): types.cell[] {
        return Object.values(row);
    }

    /**
     * Отрисовка нет результата
     */
    createNoResult() {
        const cell = service.createElement('td', 'Нет результата');
        const row = service.createAndAppend('tr', [cell]);
        return service.createAndAppend('tbody', [row]);
    }
}
export default Trender;