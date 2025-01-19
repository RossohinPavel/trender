/**
 * Удаляет все дочерние элементы.
 * @param parent DOM-элемент, дочерние элементы которого нужно удалить.
 */
export function removeChildrens(parent: HTMLElement) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


type value = HTMLElement | string | number | object;

/**
 * Создает элемент <tagName> и добавляет в него <value> в качестве дочерней структуры.
 * @param tagName Тип элемента, который нужно создать.
 * @param value Значение, которое будет добавлено в элемент.
 * @returns HTMLElement
 */
export function createCell(tagName: string, value: value): HTMLTableCellElement {
    const element = document.createElement(tagName);
    if ( value instanceof HTMLElement ) {
        element.appendChild(value);
    } else {
        element.innerText = value.toString();
    }
    return element as HTMLTableCellElement;
}

/**
 * Функция для создания элемнтов высокого уровня, таких как tr, tbody. 
 * Возвращает элемент со вложенными структурами, если в <values> был хотябы 1 элемент.
 * @param tagName Тип элемента, который нужно создать.
 * @param values Iterable-объект, значения которого будут добавлены.
 * @returns HTMLElement | null
 */
export function createAndAppend(tagName: string, values: Iterable<HTMLElement>): HTMLElement | null {
        let flag = false;
        const element = document.createElement(tagName);
        for ( const value of values ) {
            flag = true;
            element.appendChild(value);
        }
        return flag ? element : null;
}


/**
 * Функция для преобразования значений, таких как undefined, NaN, null к пустой строке.
 * @param value Значение, которое нужно проверить.
 */
export function getDefault(value: any): any {
    if ( value === undefined || value === null ) {
        return '';
    }
    if ( typeof value === 'number' && isNaN(value) ) {
        return '';
    }
    return value;
}