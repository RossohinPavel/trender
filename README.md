# Trender - Класс для рендера таблицы

Небольшой скриптик облегчающий создание таблиц.

## Использование

Для инициализации библиотеке достаточно скормить вида `dataSample`, передать id блока, где будет отрисована таблица и вызвать метод `render`:
```js
const dataSample = {
    thead: ...,
    tbody: ...,
    tfoot: ...
}
const table = new Trender({
    data: dataSample,
    divId: 'trender',
})
table.render()
```
`thead`, `tbody` и `tfoot` должны быть массивам или объектами которые содержат строки для соответствующей части таблицы.
Строки, в свою очередь, также должны быть массивами или объектами, которые содержать в себе ячейки для текущей строки.
Другими словами, начиная от этих частей должны быть структуры, к которым можно применить `Object.values()` в стандартной реализации.
Рекомендуется использовать объекты. Пример объекта для теста.

Дополнительные нюансы:
- Атрибуты `thead` и `tfoot` - необязательные.
- Если будет передан объект, в котором нет атрибута `tbody` или он пустой - будет отрендерена таблица с одной ячейкой - Нет результата.
- В конструктор можно передать `id` - id, который будет добавлен в тэг `<table>`. По умолчанию - `trender`.

### Трендим на максимум

Библиотечка задумывалась как настраиваемая. Предполагалось, что будет возможность повлиять, практически, на любой внутренний процесс.
Это реализовано в объектно-ориентированном стиле. Все как обычно, налседуемся от `Trender`, переопределяем нужный метод или атрибут и радуемся жизни.

Заголовки в таблицах как правило статичные. Их можно определить следующим образом:
```js
class MyTrender extends Trender {
    headers = ['header-1', 'header-2']
}
```

Реализуем частую задачу определить порядок следования ячеек в теле таблице. За это поведение отвечает метод `getBodyCells`.
```js
class MyTrender extends Trender {
    // Этот метод можно сделать генератором. Совсем не обязательно, чтобы он отдавал массив.
    *getBodyCells(row) {
        yield row.second;
        yield row.first;
        yield ...
    }
}
```

## TODO

- рефактор updatesorting на основе передачи туда тэга из метода render

## License:

<a href="https://github.com/RossohinPavel/trender/blob/main/LICENSE">MIT</a>

Copyright (c) 2024-present, <a href="https://github.com/RossohinPavel">Rossohin Pavel</a>