/**
 * Скриптик для рендера таблиц.
 * 
 * Принимает в себя объект, где будет искать следующие ключи
 * {
 *      thead: {...},   // Объект с перечнем ключей и значений для заголовков таблицы 
 *      tbody: {...},   // Объект с перечнем ключей и значений для тела таблицы
 *      tfoot: {...},   // Объект с перечнем ключей и значений для нижней части таблицы
 * }
 * Остальное будет игнорироваться.
 * Подробнее по использованию смотри в описании к методам.
 * Если в объекте нет ключа tbody, то выводится "Нет результата"
 * 
 * @author    dfx-17
 * @link
 *
 * @version 1.0.0 Release - Релиз
 *
 * v1.0.0 (02.12.2024) Начато написание 
 */
 


/**
 * Основной класс, который будет рендерить таблицу.
 */
class TableRender {
    // Статичные заголовки для таблицы можно указать в виде массива
    headers = ['test'];

    /**
     * Конструктор
     * @param {object} base - Основа, которая будет использоваться для рендера таблицы. Формировать нужно вышеописанным правилам.
     * @param {string} divId - id тега <div> где будет отрисовываться таблица.
     * @param {string} tableId - id для таблицы. Если таблиц несколько, стоит позаботиться об уникальности этого значения.
     */
    constructor(base, divId = 'table', tableId = 'newTable') {
        this.base = base;
        this.divId = divId;
        this.tableId = tableId;
        this.parentDiv = document.getElementById(divId);
        this.table = null;
    }

    /**
     * Удаляет все дочерние элементы объекта html
     * @param {object} parent - Объект html
     */
    _removeAllChildren(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    /**
     * Cоздает и возвращает основной элемент таблицы
     * @param {string} name - Имя элемента (head, body или foot)
     * @param {ArrayLike} values - Итерируемый объект для строк таблицы.
     * @returns {Node}
     */
    _createMainElement(name, values) {
        let flag = false;
        const element = document.createElement(`t${name}`);
        element.id = `${this.tableId}-${name}`;
        for ( const row of values ) {
            if ( row ) {
                flag = true;
                element.appendChild(row);
            }   
        }
        if (flag) {
            return element;
        } 
    }

    /**
     * Генерирует массив из <tr>
     * @param {ArrayLike<ArrayLike>} values - Строки таблицы
     * @param {string} orderHandler - Имя функции обработчика строки таблицы
     * @returns {Generator}
     */
    *_createRows(values, rowHandler) {
        for ( const rawRow of values ) {
            yield this[rowHandler](rawRow);
        }
    }

    /**
     * Итерируется по values и присоединяет каждое значение к <tr>
     * @param {ArrayLike<Node>} values
     * @returns {Node}
     */
    _createRow(values) {
        let flag = false;
        const tr = document.createElement('tr');
        for ( const value of values ) {
            flag = true;
            tr.appendChild(value);
        }
        if (flag) {
            return tr;
        } 
    }

    /**
     * Оборачивает переданные значения values в cellType и возвращает их
     * @param {ArrayLike<string | number>} values
     * @returns {Generator}
     */
    *_createCells(values, cellType='td') {
        for ( const value of values ) {
            const cell = document.createElement(cellType);
            cell.innerHTML = value;
            yield cell;
        }
    }

    /**
     * Что не понятно? рендерит новую табличку взамен старой.
     */
    render() {
        this.clearTable();
        this.table = document.createElement('table');
        if ( this.base.tbody ) {
            const header = this.createHeader(); 
            header && this.table.appendChild(header);
            this.table.append(this.createBody());
            const footer = this.createFooter();
            footer && this.table.appendChild(footer);
        } else {
            this.table.appendChild(this.createNoResult());
        }
        this.parentDiv.appendChild(this.table);
        updateSorting();
    }

    /**
     * Создает и возвращает загаловок таблицы.
     * @return {Node}
     */
    createHeader() {
        const rawRows = this.getHeaderRows();
        const rows = this.createHeaderRows(rawRows);
        return this._createMainElement('head', rows);
    }

    /**
     * Создает и возвращает тело таблицы.
     * @return {Node}
     */
    createBody() {
        const rawRows = this.getBodyRows();
        const rows = this.createBodyRows(rawRows);
        return this._createMainElement('body', rows);
    }

    /**
     * Создает и возвращает Нижнюю часть таблицы.
     * @return {Node}
     */
    createFooter() {
        const rawRows = this.getFooterRows();
        const rows = this.createFooterRows(rawRows);
        return this._createMainElement('foot', rows);
    }

    /**
     * Метод возвращающий строки для заголовка таблицы в виде массива.
     * Целевое использование - переопределение порядка следования строк.
     * @returns {ArrayLike<ArrayLike>}
     */
    getHeaderRows() {
        const headers = this.base.thead || [];
        return Object.values(headers);
    }

    /**
     * Метод возвращающий строки для тела таблицы в виде массива.
     * Целевое использование - переопределение порядка следования строк.
     * @returns {ArrayLike<ArrayLike>}
     */
    getBodyRows() {
        return Object.values(this.base.tbody);
    }

    /**
     * Метод возвращающий строки для футера таблицы в виде массива.
     * Целевое использование - переопределение порядка следования строк.
     * @returns {ArrayLike<ArrayLike>}
     */
    getFooterRows() {
        const footers = this.base.tfoot || [];
        return Object.values(footers);
    }

    /**
     * Перебирает каждую строку и применяет к ней метод createHeaderRow
     * @param {ArrayLike<ArrayLike>} values - Массив строк таблицы
     * @returns {Array<Node>}
     */
    createHeaderRows(values) {
        if ( values.length === 0 ) {
            const rawCells = this.createHeaderCells(this.headers);
            return [this._createRow(rawCells)];
        }
        return this._createRows(values, 'createHeaderRow');
    }

    /**
     * Перебирает каждую строку и применяет к ней метод createBodyRow
     * @param {ArrayLike<ArrayLike>} values - Массив строк таблицы
     * @returns {Array<Node>}
     */
    createBodyRows(values) {
        return this._createRows(values, 'createBodyRow')
    }

    /**
     * Перебирает каждую строку и применяет к ней метод createFooterRow
     * @param {ArrayLike<ArrayLike>} values - Массив строк таблицы
     * @returns {Array<Node>}
     */
    createFooterRows(values) {
        return this._createRows(values, 'createFooterRow');
    }

    /**
     * Оборачивает значения в <tr>
     * @param {rawRow} - Сырая Строка таблицы, необработанные значения
     * @returns {Node}
     */
    createHeaderRow(rawRow) {
        const rawCells = this.getHeaderCells(rawRow);
        const cells = this.createHeaderCells(rawCells);
        return this._createRow(cells);
    }

    /**
     * Оборачивает значения в <tr>
     * @param {rawRow} - Сырая Строка таблицы, необработанные значения
     * @returns {Node}
     */
    createBodyRow(rawRow) {
        const rawCells = this.getBodyCells(rawRow);
        const cells = this.createBodyCells(rawCells);
        return this._createRow(cells);
    }

    /**
     * Оборачивает значения в <tr>
     * @param {rawRow} - Сырая Строка таблицы, необработанные значения
     * @returns {Node}
     */
    createFooterRow(rawRow) {
        const rawCells = this.getFooterCells(rawRow);
        const cells = this.createFooterCells(rawCells);
        return this._createRow(cells);
    }

    /**
     * Метод для получения значений ячеек для строки заголовка таблицы.
     * Целевое использование - определение порядка следования ячеек.
     * @param {ArrayLike} rawRow - Строка в таблице
     * @returns {ArrayLike} 
     */
    getHeaderCells(rawRow) {
        return [...this.headers, ...Object.values(rawRow)];
    }

    /**
     * Метод для получения значений ячеек для строки тела таблицы.
     * Целевое использование - определение порядка следования ячеек.
     * @param {ArrayLike} rawRow - Строка в таблице
     * @returns {ArrayLike} 
     */
    getBodyCells(rawRow) {
        return Object.values(rawRow);
    }

    /**
     * Метод для получения значений ячеек для строки футера таблицы.
     * Целевое использование - определение порядка следования ячеек.
     * @param {ArrayLike} rawRow - Строка в таблице
     * @returns {ArrayLike} 
     */
    getFooterCells(rawRow) {
        return Object.values(rawRow);
    }

    /**
     * Создает ячейки для строки футера таблицы
     * @param {ArrayLike} rawCells 
     * @returns {Generator<Node>}
     */
    *createHeaderCells(rawCells) {
        for ( const cell of this._createCells(rawCells, 'th') ) {
            cell.setAttribute("scope", "col");
            yield cell;
        }
    }

    /**
     * Создает ячейки для строки тела таблицы
     * @param {ArrayLike} rawCells 
     * @returns {Generator<Node>}
     */
    createBodyCells(rawCells) {
        return this._createCells(rawCells);
    }

    /**
     * Создает ячейки для строки футера таблицы
     * @param {ArrayLike} rawCells 
     * @returns {Generator<Node>}
     */
    createFooterCells(rawCells) {
        return this._createCells(rawCells);
    }

    /**
     * Очищает таблицу от старых значений
     */
    clearTable() {
        this._removeAllChildren(this.parentDiv);
    }

    /**
     * Очищает заголовки таблицы
     */
    clearHeader() {
        const header = document.getElementById(this.tableId).thead;
        this._removeAllChildren(header);
    };

    /**
     * Очищает тело таблицы
     */
    clearBody() {
        const body = document.getElementById(this.tableId).tbody;
        this._removeAllChildren(body);
    }

    /**
     * Очищает футер таблицы
     */
    clearFooter() {
        const footer = document.getElementById(this.tableId).tfoot;
        this._removeAllChildren(footer);
    }

    /**
     * Отрисовка нет результата
     */
    createNoResult() {
        this.base = {'tbody': {0: ['Нет результата']}};
        return this.createBody();
    }
}


const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;
const comparer = (idx, asc) => (a, b) => ((v1, v2) =>
      v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
  )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

// do the work...
function updateSorting() {
    document.querySelectorAll('th:not(.footer)').forEach(th => th.addEventListener('click', (() => {
        let currentDirection = th.lastChild;
        if (currentDirection.tagName) {
            currentDirection = currentDirection.data;
        } else {
            currentDirection = 'up';
        };
        let tableHead = document.querySelectorAll('th');
        tableHead.forEach(tableHead => {
            tableHead.removeAttribute("style");
            if (tableHead.childElementCount > 0) {              
                tableHead.removeChild(tableHead.lastChild);                
            };
        });
        if ( th.clientWidth < 150 ) {
            th.setAttribute("style", `min-width: ${th.clientWidth + 24}px`);
        };
        let direction = document.createElement('object');
        direction.data='src/arrow-up.svg';
        direction.width='15px';
        direction.height='15px';
        direction.className = 'arrow';
        //   let direction = document.createElement('span');
        if (currentDirection.includes('up')) {
            direction.data='src/arrow-down.svg';
            this.asc = false;
        } else {
            direction.data='src/arrow-up.svg';
                this.asc = true;
        };

        th.appendChild(direction);
        //   th.appendChild(icon);
        const table = th.closest('table');
        const tbody = table.querySelector('tbody');

        Array.from(tbody.querySelectorAll('tr:not(.total-row)'))
            .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = this.asc))
            .forEach(tr => tbody.appendChild(tr));
  })));
};