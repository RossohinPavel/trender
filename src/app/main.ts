import * as t from "./types";
import * as s from "./service";

/**
 * Основной класс, который будет рендерить таблицу.
 */
class Trender {
    // Аргументы конструктора
    data: t.ITable;
    divId: string;
    id: string;
    // Атрибуты объекта
    parentDiv: HTMLElement;
    table: HTMLTableElement;
    // Статичные заголовки для таблицы можно указать в виде массива
    headers = ['Trender'];

    /**
     * Конструктор
     * @param {Object} config
     * @param {t.ITable} config.data Дата, на основе которой будет строиться таблица
     * @param {string} config.divId Id тэга <div>, где будет отрисовываться таблица
     * @param {string} config.id Можно задать свой id для идентификации таблицы.
     */
    constructor({data, divId='table', id='trender'}: t.ITrenderArgs) {
        this.data = data;
        this.divId = divId;
        this.id = id;
        this.parentDiv = document.getElementById(divId);
    }

    /**
     * Очищает <div> связанный с таблицей от всех дочерних элементов.
     */
    clear(): void {
        s.removeAllChildren(this.parentDiv);
    }

    /**
     * Рендерит новую табличку взамен старой.
     */
    render() {
        this.clear();
        this.table = this.createTable();
        this.parentDiv.appendChild(this.table);
        // updateSorting();
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
            const header = this.createHeader(this.data.thead); 
            header && table.appendChild(header);
            // Рендерим тело
            const body = this.createBody(this.data.tbody);
            this.table.append(body);
            // Рендерим футер
            const footer = this.createFooter(this.data.tfoot);
            footer && table.appendChild(footer);
        } else {
            const noResult = this.createNoResult();
            table.append(noResult);
        }
        return table;
    }

    /**
     * Создает и возвращает Заголовки таблицы.
     * @param {t.tablePart} values - Массив строк заголовков таблицы
     * @returns {HTMLElement}
     */
    createHeader(values: ArrayLike<any>): HTMLElement {
        const headerValues = values || [[]];
        const rows = this.createHeaderRows(headerValues);
        return s.createAndAppend('thead', rows);
    }

    /**
     * Создает и возвращает тело таблицы.
     * @param {t.tablePart} values - Массив строк тела таблицы
     * @return {HTMLElement}
     */
    createBody(values: ArrayLike<any>): HTMLElement {
        const rows = this.createBodyRows(values);
        return s.createAndAppend('tbody', rows);
    }

    /**
     * Создает и возвращает Нижнюю часть таблицы.
     * @param {t.tablePart} values - Массив строк  футера таблицы
     * @return {HTMLElement}
     */
    createFooter(values: ArrayLike<any>): HTMLElement {
        const footerValues = values || [];
        const rows = this.createFooterRows(footerValues);
        return s.createAndAppend('tfoot', rows);
    }

    /**
     * Вызывает getHeaderRows и применяет к каждому значению createHeaderRow.
     * Должен возвращать массив из Node - html-элементов таблицы или быть соответствующим генератором.
     * @param {t.tablePart} values - Массив строк заголовков таблицы
     */
    *createHeaderRows(values: ArrayLike<any>): Generator<HTMLElement> {
        const rawRows = this.getHeaderRows(values);
        for ( const row of rawRows ) {
            yield this.createHeaderRow(row);
        }
    }

    /**
     * Вызывает getBodyRows и применяет к каждому значению createBodyRow.
     * Должен возвращать массив из Node - html-элементов таблицы или быть соответствующим генератором.
     * @param {t.tablePart} values - Массив строк тела таблицы
     */
    *createBodyRows(values: ArrayLike<any>) {
        const rawRows = this.getBodyRows(values);
        for ( const row of rawRows ) {
            yield this.createBodyRow(row);
        }
    }

    /**
     * Вызывает getFooterRows и применяет к каждому значению createFooterRow.
     * Должен возвращать массив из Node - html-элементов таблицы или быть соответствующим генератором.
     * @param {t.tablePart} values - Массив строк нижней части таблицы
     */
    *createFooterRows(values: ArrayLike<any>) {
        const rawRows = this.getFooterRows(values);
        for ( const row of rawRows ) {
            yield this.createFooterRow(row);
        }
    }

    /**
     * Метод возвращающий строки для заголовка таблицы в виде массива.
     * Целевое использование - переопределение порядка следования строк.
     * @param {ArrayLike<ArrayLike>} values - Массив строк заголовков таблицы
     * @returns {ArrayLike<ArrayLike>}
     */
    getHeaderRows(values: ArrayLike<any>) {
        return Object.values(values);
    }

    /**
     * Метод возвращающий строки для тела таблицы в виде массива.
     * Целевое использование - переопределение порядка следования строк.
     * @param {ArrayLike<ArrayLike>} values - Массив строк тела таблицы
     * @returns {ArrayLike<ArrayLike>}
     */
    getBodyRows(values: ArrayLike<any>) {
        return Object.values(values);
    }

    /**
     * Метод возвращающий строки для футера таблицы в виде массива.
     * Целевое использование - переопределение порядка следования строк.
     * @param {ArrayLike<ArrayLike>} values - Массив строк футера таблицы
     * @returns {ArrayLike<ArrayLike>}
     */
    getFooterRows(values: ArrayLike<any>) {
        return Object.values(values);
    }

    /**
     * На основе переданного <values> создает <tr> элемент для заголовков таблицы и возвращает его.
     * @param {ArrayLike} values - Строка со значениями для заголовков таблицы
     * @returns {Node}
     */
    createHeaderRow(values: ArrayLike<any>) {
        const cells = this.createHeaderCells(values);
        return s.createAndAppend('tr', cells);
    }

    /**
     * На основе переданного <values> создает <tr> элемент для тела таблицы и возвращает его.
     * @param {ArrayLike} values - Строка со значениями для тела таблицы
     * @returns {Node}
     */
    createBodyRow(values: ArrayLike<any>) {
        const cells = this.createBodyCells(values);
        return s.createAndAppend('tr', cells);
    }

    /**
     * На основе переданного <values> создает <tr> элемент для футера таблицы и возвращает его.
     * @param {ArrayLike} values - Строка со значениями для футера таблицы
     * @returns {Node}
     */
    createFooterRow(values: ArrayLike<any>) {
        const cells = this.createFooterCells(values);
        return s.createAndAppend('tr', cells);
    }

    /**
     * Вызывает getHeaderCells и применяет к каждому значению метод для создания ячеек _createCell.
     * Должен возвращать массив из Node - html-элементов таблицы или быть соответствующим генератором.
     * @param {ArrayLike<ArrayLike>} values - Массив строк заголовков таблицы
     * @returns {Array<Node>}
     */
    *createHeaderCells(values: ArrayLike<any>) {
        const rawCells = this.getHeaderCells(values);
        for ( const rawCell of rawCells ) {
            const cell = s.createElement('th', rawCell);
            cell.setAttribute('scope', 'col');
            yield cell;
        }
    }

    /**
     * Вызывает getBodyCells и применяет к каждому значению метод для создания ячеек _createCell.
     * Должен возвращать массив из Node - html-элементов таблицы или быть соответствующим генератором.
     * @param {ArrayLike<ArrayLike>} values - Массив строк тела таблицы
     * @returns {Array<Node>}
     */
    *createBodyCells(values: ArrayLike<any>) {
        const rawCells = this.getBodyCells(values);
        for ( const cell of rawCells ) {
            yield s.createElement('td', cell);
        }
    }

    /**
     * Вызывает getFooterCells и применяет к каждому значению метод для создания ячеек _createCell.
     * Должен возвращать массив из Node - html-элементов таблицы или быть соответствующим генератором.
     * @param {ArrayLike<ArrayLike>} values - Массив строк футера таблицы
     * @returns {Array<Node>}
     */
    *createFooterCells(values: ArrayLike<any>) {
        const rawCells = this.getFooterCells(values);
        for ( const cell of rawCells ) {
            yield s.createElement('td', cell);
        }
    }

    /**
     * Метод для получения значений ячеек для строки заголовка таблицы.
     * Целевое использование - определение порядка следования ячеек.
     * @param {ArrayLike} values - Строка в таблице
     * @returns {ArrayLike} 
     */
    getHeaderCells(values: ArrayLike<any>) {
        return [...this.headers, ...Object.values(values)];
    }

    /**
     * Метод для получения значений ячеек для строки тела таблицы.
     * Целевое использование - определение порядка следования ячеек.
     * @param {ArrayLike} values - Строка в таблице
     * @returns {ArrayLike} 
     */
    getBodyCells(values: ArrayLike<any>) {
        return Object.values(values);
    }

    /**
     * Метод для получения значений ячеек для строки футера таблицы.
     * Целевое использование - определение порядка следования ячеек.
     * @param {ArrayLike} values - Строка в таблице
     * @returns {ArrayLike} 
     */
    getFooterCells(values: ArrayLike<any>) {
        return Object.values(values);
    }

    /**
     * Отрисовка нет результата
     */
    createNoResult() {
        const cell = s.createElement('td', 'Нет результата');
        const row = s.createAndAppend('tr', [cell]);
        return s.createAndAppend('tbody', [row]);
    }
}
