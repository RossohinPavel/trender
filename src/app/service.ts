/**
 * Удаляет все дочерние элементы.
 * @param parent DOM-элемент, дочерние элементы которого нужно удалить.
 */
export function removeAllChildren(parent: HTMLElement) {
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
export function createElement(tagName: string, value: value): HTMLElement {
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
    };
    return element;
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
