import { removeAllChildren } from "../service";
import { UP, DOWN } from './assets';


/**
 * Заново переназначает слушателя для сортировки. 
 * Это необходимо при рендере таблицы.
 */
export default function updateSorting() {
    const ths = document.querySelectorAll('th:not(.footer)');
    ths.forEach(th => th.addEventListener( 'click', () => sortTable(th as HTMLTableColElement) ));
}


/**
 * Основная функция, которая организует логику сортировки.
 * @param th Заголовок, к столбцу которого будет применена сортировка.
 */
function sortTable(th: HTMLTableColElement) {
    const sortDirection = getSortDirection(th);
    th.setAttribute('sort', sortDirection);
    // Манипуляции с содержимым заголовка. Необходимо для корректной работы стрелочек направлений.
    let currentText;
    if ( th.children.length < 2 ) {
        currentText = document.createElement('span');
        currentText.innerHTML = th.innerHTML;
    } else {
        currentText = th.firstChild;
    }
    removeAllChildren(th);
    th.appendChild(currentText);
    th.appendChild(sortDirection == 'asc' ? UP : DOWN);
    initSort(th, sortDirection);
    clearHeaders(th);
}


/**
 * Возвращает направление сортировки.
 * @param th Заголовок, к столбцу которого будет применена сортировка.
 * @returns Строка с направлением сортировки.
 */
function getSortDirection(th: HTMLTableColElement): string {
    switch ( th.getAttribute('sort') ) {
        case 'asc':
            return 'desc';
        case 'desc':
        default:
            return 'asc';
    }
}


/**
 * Непосредственно, сама сортировка.
 * @param th Заголовок, к столбцу которого будет применена сортировка.
 * @param direction Направление сортировки
 */
function initSort(th: HTMLTableColElement, direction: string) {
    const tbody = th.closest('table').querySelector('tbody');
    const collIndex = Array.from(th.parentNode.children).indexOf(th);
    const tableArray = Array.from(tbody.querySelectorAll('tr:not(.total-row)'));
    tableArray.sort(comparer(collIndex, direction == 'asc'));
    tableArray.forEach(tr => tbody.appendChild(tr));
}


/**
 * Замыкание возвращающая функцию, которая реализует сравнение значений при сортировке.
 * @param index Индекс ячейки
 * @param isAscDirection Соответствие на направление сортировки по возростанию
 * @returns Функцию, которая по семантике подходит под требования Array.sort
 */
function comparer(index: number, isAscDirection: boolean): (a: Element, b: Element) => number {
    return function (a: Element, b: Element): number {
        let left = getCellValue(a, index);
        let right = getCellValue(b, index);
        if ( !isAscDirection ) {
            [left, right] = [right, left];
        }
        const [leftNum, rightNum] = [Number(left), Number(right)];
        if (left !== '' && right !== '' && !isNaN(leftNum) && !isNaN(rightNum)) {
            return leftNum - rightNum;
        }
        return left.toString().localeCompare(right);
    }
}


// Получает текстовое значение tr
function getCellValue(tr: Element, index: number) {
    return (tr.children[index] as HTMLElement).innerText || tr.children[index].textContent.trim();
}


/**
 * Возвращает заголовки к первоначальному состоянию
 * @param th Заголовок, к столбцу которого была применена сортировка.
 */
function clearHeaders(th: HTMLTableColElement) {
    const headers = th.closest('thead');
    const table = headers.closest('table');
    for ( const row of headers.children ) {
        Array(...row.children).forEach((otherHeader, index) => {
            if ( otherHeader != th && otherHeader.children.length > 0) {
                // Очистка измененного элемента
                otherHeader.innerHTML = (otherHeader.firstChild as HTMLElement).innerHTML;
                otherHeader.removeAttribute('sort');
                otherHeader.removeAttribute('style');
            }
            if (otherHeader == th) {
                const thRect = (th.firstChild as Element).getBoundingClientRect();
                const bCellRect = (table.children[1] as HTMLTableSectionElement).rows[0].cells[index].getBoundingClientRect();
                if ( thRect.width + 10 > bCellRect.width ) {
                    th.setAttribute('style', `width:${Math.round(thRect.width) + 20}px`);
                }
            }
        });
    }
}
