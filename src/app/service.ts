// Удаляет все дочерние элементы
export function removeAllChildren(parent: HTMLElement) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

type cellValue = HTMLElement | string | number | object;

export function createElement(tagName: string, value: cellValue): HTMLElement {
    const element = document.createElement(tagName);
    switch (typeof value) {
        case 'object':
        case 'number' :
            element.innerText = value.toString();
            break;
        case 'string':
            element.innerText = value;
            break;
        default:
            element.appendChild(value);
    }
    return element;
}

export function createAndAppend(tagName: string, values: Iterable<any>): HTMLElement | null {
        let flag = false;
        const element = document.createElement(tagName);
        for ( const value of values ) {
            flag = true;
            element.appendChild(value);
        }
        return flag ? element : null;
}
    // /**
    //  * Создает и возвращает ячейку таблицы
    //  * @param {string} tagName - Тип ячейки
    //  * @param {*} value - Значение, которое нужно вставить в ячейку
    //  * @returns {Node}
    //  */
    // _createCell(tagName, value) {
    //     const cell = document.createElement(tagName);
    //     cell.innerHTML = value;
    //     return cell;
    // }

// /**
    //  * Создает html-элемент <name>, наделяет его дочерними
    //  * элементами values и возвращает его. 
    //  * Если нет ни одного элемента в <values>, то вернет false
    //  * @param {string} tagName - Тип html-элемента
    //  * @param {ArrayLike} values - Массив из html-элемнтов для вставки.
    //  * @returns {Node}
    //  */
    // _createAndAppend(tagName, values) {
    //     let flag = false;
    //     const element = document.createElement(tagName);
    //     for ( const value of values ) {
    //         flag = true;
    //         element.appendChild(value);
    //     }
    //     return flag && element;
    // }



// function _sortTable(th) {
//     return function() {
//         let sortDirection;
//         switch ( th.getAttribute('sort') ) {
//             case 'asc':
//                 sortDirection = 'desc';
//                 break;
//             case 'desc':
//             default:
//                 sortDirection = 'asc';
//         }
//         th.setAttribute('sort', sortDirection);
//         let currentText;
//         if ( th.children.length < 2 ) {
//             currentText = document.createElement('span');
//             currentText.innerHTML = th.innerHTML;
//         } else {
//             currentText = th.firstChild;
//         }
//         _removeAllChildren(th);
//         th.appendChild(currentText);
//         th.appendChild(sortDirection == 'asc' ? UP : DOWN);
//         _initSort(th, sortDirection);
//         _clearHeaders(th);
//     }
// }


// // Чистит заголовки таблицы для функции sortTable
// function _clearHeaders(th) {
//     const headers = th.closest('thead');
//     const table = headers.closest('table');
//     for ( const row of headers.children ) {
//         Array(...row.children).forEach((otherHeader, index) => {
//             if ( otherHeader != th && otherHeader.children.length > 0) {
//                 // Очистка измененного элемента
//                 otherHeader.innerHTML = otherHeader.firstChild.innerHTML;
//                 otherHeader.removeAttribute('sort');
//                 otherHeader.removeAttribute('style');
//             }
//             if (otherHeader == th) {
//                 const thRect = th.firstChild.getBoundingClientRect();
//                 const bCellRect = table.children[1].rows[0].cells[index].getBoundingClientRect();
//                 if ( thRect.width + 10 > bCellRect.width ) {
//                     th.setAttribute('style', `width:${parseInt(thRect.width) + 20}px`);
//                 }
//             }
//         });
//     }
// }


// // непосредственно, сама сортировОчка
// function _initSort(th, direction) {
//     const tbody = th.closest('table').querySelector('tbody');
//     const collIndex = Array.from(th.parentNode.children).indexOf(th);
//     const tableArray = Array.from(tbody.querySelectorAll('tr:not(.total-row)'));
//     tableArray.sort(comparer(collIndex, direction == 'asc'));
//     tableArray.forEach(tr => tbody.appendChild(tr));
// }


// function comparer(index, asc) {
//     return function (a, b) {
//         let left = getCellValue(a, index);
//         let right = getCellValue(b, index);
//         if ( !asc ) {
//             [left, right] = [right, left];
//         }
//         if (left !== '' && right !== '' && !isNaN(left) && !isNaN(right)) {
//             return left - right;
//         }
//         return left.toString().localeCompare(right);
//     }
// }


// // Получает текстовое значение tr
// function getCellValue(tr, index) {
//     return tr.children[index].innerText || tr.children[index].textContent.trim();
// }


// // Заново переназначает слушателя для начала сортировки.
// function updateSorting() {
//     document.querySelectorAll('th:not(.footer)')
//     .forEach(th => th.addEventListener('click', _sortTable(th)));
// }


// const UP = document.createRange().createContextualFragment('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5"/></svg>').firstElementChild;
// const DOWN = document.createRange().createContextualFragment('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1"/></svg>').firstElementChild;