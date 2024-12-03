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
 * @version 1.0.2 Release
 * 
 * v1.0.2 (03.12.2024) Поправлена основная логика обработки данных. Причесан код.
 * v1.0.1 (02.12.2024) Добавлена сортировка
 * v1.0.0 (01.12.2024) Начато написание test
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
     * Создает html-элемент <name>, наделяет его дочерними
     * элементами values и возвращает его. 
     * Если нет ни одного элемента в <values>, то вернет false
     * @param {string} tagName - Тип html-элемента
     * @param {ArrayLike} values - Массив из html-элемнтов для вставки.
     * @returns {Node}
     */
    _createAndAppend(tagName, values) {
        let flag = false;
        const element = document.createElement(tagName);
        for ( const value of values ) {
            flag = true;
            element.appendChild(value);
        }
        return flag && element;
    }

    /**
     * Создает и возвращает ячейку таблицы
     * @param {string} tagName - Тип ячейки
     * @param {*} value - Значение, которое нужно вставить в ячейку
     * @returns {Node}
     */
    _createCell(tagName, value) {
        const cell = document.createElement(tagName);
        cell.innerHTML = value;
        return cell;
    }

    /**
     * Что не понятно? рендерит новую табличку взамен старой.
     */
    render() {
        this.clearTable();
        this.table = document.createElement('table');
        this.table.id = this.tableId;
        if ( this.base.tbody ) {
            const header = this.createHeader(this.base.thead); 
            header && this.table.appendChild(header);
            this.table.append(this.createBody(this.base.tbody));
            const footer = this.createFooter(this.base.tfoot);
            footer && this.table.appendChild(footer);
        } else {
            this.table.appendChild(this.createNoResult());
        }
        this.parentDiv.appendChild(this.table);
        updateSorting();
    }

    /**
     * Создает и возвращает Заголовки таблицы.
     * @param {ArrayLike<ArrayLike>} values - Массив строк заголовков таблицы
     * @return {Node}
     */
    createHeader(values) {
        const headerValues = values || [[]];
        const rows = this.createHeaderRows(headerValues);
        return this._createAndAppend('thead', rows);
    }

    /**
     * Создает и возвращает тело таблицы.
     * @param {ArrayLike<ArrayLike>} values - Массив строк тела таблицы
     * @return {Node}
     */
    createBody(values) {
        const rows = this.createBodyRows(values);
        return this._createAndAppend('tbody', rows);
    }

    /**
     * Создает и возвращает Нижнюю часть таблицы.
     * @param {ArrayLike<ArrayLike>} values - Массив строк  футера таблицы
     * @return {Node}
     */
    createFooter(values) {
        const footerValues = values || [];
        const rows = this.createFooterRows(footerValues);
        return this._createAndAppend('tfoot', rows);
    }

    /**
     * Вызывает getHeaderRows и применяет к каждому значению createHeaderRow.
     * Должен возвращать массив из Node - html-элементов таблицы или быть соответствующим генератором.
     * @param {ArrayLike<ArrayLike>} values - Массив строк заголовков таблицы
     * @returns {Array<Node>}
     */
    *createHeaderRows(values) {
        const rawRows = this.getHeaderRows(values);
        for ( const row of rawRows ) {
            yield this.createHeaderRow(row);
        }
    }

    /**
     * Вызывает getBodyRows и применяет к каждому значению createBodyRow.
     * Должен возвращать массив из Node - html-элементов таблицы или быть соответствующим генератором.
     * @param {ArrayLike<ArrayLike>} values - Массив строк тела таблицы
     * @returns {Array<Node>}
     */
    *createBodyRows(values) {
        const rawRows = this.getBodyRows(values);
        for ( const row of rawRows ) {
            yield this.createBodyRow(row);
        }
    }

    /**
     * Вызывает getFooterRows и применяет к каждому значению createFooterRow.
     * Должен возвращать массив из Node - html-элементов таблицы или быть соответствующим генератором.
     * @param {ArrayLike<ArrayLike>} values - Массив строк нижней части таблицы
     * @returns {Array<Node>}
     */
    *createFooterRows(values) {
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
    getHeaderRows(values) {
        return Object.values(values);
    }

    /**
     * Метод возвращающий строки для тела таблицы в виде массива.
     * Целевое использование - переопределение порядка следования строк.
     * @param {ArrayLike<ArrayLike>} values - Массив строк тела таблицы
     * @returns {ArrayLike<ArrayLike>}
     */
    getBodyRows(values) {
        return Object.values(values);
    }

    /**
     * Метод возвращающий строки для футера таблицы в виде массива.
     * Целевое использование - переопределение порядка следования строк.
     * @param {ArrayLike<ArrayLike>} values - Массив строк футера таблицы
     * @returns {ArrayLike<ArrayLike>}
     */
    getFooterRows(values) {
        return Object.values(values);
    }

    /**
     * На основе переданного <values> создает <tr> элемент для заголовков таблицы и возвращает его.
     * @param {ArrayLike} values - Строка со значениями для заголовков таблицы
     * @returns {Node}
     */
    createHeaderRow(values) {
        const cells = this.createHeaderCells(values);
        return this._createAndAppend('tr', cells);
    }

    /**
     * На основе переданного <values> создает <tr> элемент для тела таблицы и возвращает его.
     * @param {ArrayLike} values - Строка со значениями для тела таблицы
     * @returns {Node}
     */
    createBodyRow(values) {
        const cells = this.createBodyCells(values);
        return this._createAndAppend('tr', cells);
    }

    /**
     * На основе переданного <values> создает <tr> элемент для футера таблицы и возвращает его.
     * @param {ArrayLike} values - Строка со значениями для футера таблицы
     * @returns {Node}
     */
    createFooterRow(values) {
        const cells = this.createFooterCells(values);
        return this._createAndAppend('tr', cells);
    }

    /**
     * Вызывает getHeaderCells и применяет к каждому значению метод для создания ячеек _createCell.
     * Должен возвращать массив из Node - html-элементов таблицы или быть соответствующим генератором.
     * @param {ArrayLike<ArrayLike>} values - Массив строк заголовков таблицы
     * @returns {Array<Node>}
     */
    *createHeaderCells(values) {
        const rawCells = this.getHeaderCells(values);
        for ( const rawCell of rawCells ) {
            const cell = this._createCell('th', rawCell);
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
    *createBodyCells(values) {
        const rawCells = this.getBodyCells(values);
        for ( const cell of rawCells ) {
            yield this._createCell('td', cell);
        }
    }

    /**
     * Вызывает getFooterCells и применяет к каждому значению метод для создания ячеек _createCell.
     * Должен возвращать массив из Node - html-элементов таблицы или быть соответствующим генератором.
     * @param {ArrayLike<ArrayLike>} values - Массив строк футера таблицы
     * @returns {Array<Node>}
     */
    *createFooterCells(values) {
        const rawCells = this.getFooterCells(values);
        for ( const cell of rawCells ) {
            yield this._createCell('td', cell);
        }
    }

    /**
     * Метод для получения значений ячеек для строки заголовка таблицы.
     * Целевое использование - определение порядка следования ячеек.
     * @param {ArrayLike} values - Строка в таблице
     * @returns {ArrayLike} 
     */
    getHeaderCells(values) {
        return [...this.headers, ...Object.values(values)];
    }

    /**
     * Метод для получения значений ячеек для строки тела таблицы.
     * Целевое использование - определение порядка следования ячеек.
     * @param {ArrayLike} values - Строка в таблице
     * @returns {ArrayLike} 
     */
    getBodyCells(values) {
        return Object.values(values);
    }

    /**
     * Метод для получения значений ячеек для строки футера таблицы.
     * Целевое использование - определение порядка следования ячеек.
     * @param {ArrayLike} values - Строка в таблице
     * @returns {ArrayLike} 
     */
    getFooterCells(values) {
        return Object.values(values);
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