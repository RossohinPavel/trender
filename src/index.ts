import sample from "./mock";


function main(event: MouseEvent): void {
    event.preventDefault();
    showTable();
};


function showTable(): void {
    console.log(sample);
    // const table = new TableRender(sample, 'report');
    // table.render();
};


const form = document.getElementById('form-filters');
form.addEventListener('submit', main);
