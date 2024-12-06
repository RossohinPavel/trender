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
 * @version 1.0.4
 * 
 * v1.0.4 (06.12.2024) Переписана та всратая фукнция сортировки результата. Реализовано адекватное отображение стрелочек сортировки.
 * v1.0.3 (05.12.2024) Дебаг для нет результата.
 * v1.0.2 (03.12.2024) Поправлена основная логика обработки данных. Причесан код.
 * v1.0.1 (02.12.2024) Добавлена сортировка
 * v1.0.0 (01.12.2024) Начато написание test
 */
 


/**
 * Основной класс, который будет рендерить таблицу.
 */
class TableRender {
    // Статичные заголовки для таблицы можно указать в виде массива
    headers = ['Table'];

    /**
     * Конструктор
     * @param {object} base - Основа, которая будет использоваться для рендера таблицы. Формировать нужно вышеописанным правилам.
     * @param {string} divId - id тега <div> где будет отрисовываться таблица.
     * @param {string} tableId - id для таблицы. Если таблиц несколько, стоит позаботиться об уникальности этого значения.
     */
    constructor(base, divId = 'table', tableId = 'new-table') {
        this.base = base;
        this.divId = divId;
        this.id = tableId;
        this.parentDiv = document.getElementById(divId);
        this.table = null;
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
        this.table.setAttribute('class', `table trender ${this.id}`);
        this.table.id = this.id;
        if ( this.base?.tbody && Object.keys(this.base.tbody).length ) {
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
        _removeAllChildren(this.parentDiv);
    }

    /**
     * Очищает заголовки таблицы
     */
    clearHeader() {
        const header = document.getElementById(this.id).thead;
        _removeAllChildren(header);
    };

    /**
     * Очищает тело таблицы
     */
    clearBody() {
        const body = document.getElementById(this.id).tbody;
        _removeAllChildren(body);
    }

    /**
     * Очищает футер таблицы
     */
    clearFooter() {
        const footer = document.getElementById(this.id).tfoot;
        _removeAllChildren(footer);
    }

    /**
     * Отрисовка нет результата
     */
    createNoResult() {
        const cell = this._createCell('td', 'Нет результата');
        const row = this._createAndAppend('tr', [cell]);
        return this._createAndAppend('tbody', [row]);
    }
}


function _sortTable(th) {
    return function() {
        let sortDirection;
        switch ( th.getAttribute('sort') ) {
            case 'asc':
                sortDirection = 'desc';
                break;
            case 'desc':
            default:
                sortDirection = 'asc';
        }
        th.setAttribute('sort', sortDirection);
        th.setAttribute('style', 'display:flex;justify-content:center');
        let currentText;
        let arrow = sortDirection == 'asc' ? UP : DOWN;
        if ( th.children.length < 2 ) {
            currentText = document.createElement('span');
            currentText.innerHTML = th.innerHTML;
        } else {
            currentText = th.firstChild;
        }
        _removeAllChildren(th);
        th.appendChild(currentText);
        th.appendChild(arrow);
        _clearHeaders(th);
        _initSort(th, sortDirection);
    }
}


// Чистит заголовки таблицы для функции sortTable
function _clearHeaders(th) {
    const headers = th.closest('thead');
    for ( const row of headers.children ) {
        for ( const otherHeader of row.children ) {
            if ( otherHeader != th ) {
                otherHeader.removeAttribute('sort');
                otherHeader.removeAttribute('style');
                if ( otherHeader.children.length > 0 ) {
                    otherHeader.innerHTML = otherHeader.firstChild.innerHTML;
                }
            }
        }
    }
}


// непосредственно, сама сортировОчка
function _initSort(th, direction) {
    const tbody = th.closest('table').querySelector('tbody');
    const collIndex = Array.from(th.parentNode.children).indexOf(th);
    const tableArray = Array.from(tbody.querySelectorAll('tr:not(.total-row)'));
    tableArray.sort(comparer(collIndex, direction == 'asc'));
    tableArray.forEach(tr => tbody.appendChild(tr));
}


function comparer(index, asc) {
    return function (a, b) {
        let left = getCellValue(a, index);
        let right = getCellValue(b, index);
        if ( asc ) {
            [left, right] = [right, left];
        }
        if (left !== '' && right !== '' && !isNaN(left) && !isNaN(right)) {
            return left - right;
        }
        return left.toString().localeCompare(right);
    }
}


// Получает текстовое значение tr
function getCellValue(tr, index) {
    return tr.children[index].innerText || tr.children[index].textContent;
}


// Удаляет все дочерние элементы
function _removeAllChildren(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


// Заного переназначает слушателя для начала сортировки.
function updateSorting() {
    document.querySelectorAll('th:not(.footer)')
    .forEach(th => th.addEventListener('click', _sortTable(th)));
};


const UP = document.createRange().createContextualFragment('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5"/></svg>').firstElementChild;
const DOWN = document.createRange().createContextualFragment('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1"/></svg>').firstElementChild;
