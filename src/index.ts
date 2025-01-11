import sample from "./mock";
import Trender from "./app/main";


function main(event: MouseEvent): void {
    event.preventDefault();
    showTable();
};


function showTable(): void {
    const table = new Trender({data: sample});
    table.render();
};


const form = document.getElementById('form-filters');
form.addEventListener('submit', main);

document.addEventListener("DOMContentLoaded", showTable);
