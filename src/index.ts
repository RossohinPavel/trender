import sample from "./data.json";
import { Trender } from "./app/main";


class CustomTrender extends Trender {
    // headers: string[] = ['NewHeader'];
}


function main(event: MouseEvent): void {
    event.preventDefault();
    showTable();
};


function showTable(): void {
    const table = new CustomTrender(sample);
    table.render('trender');
};


const form = document.getElementById('form-filters');
form.addEventListener('submit', main);

document.addEventListener("DOMContentLoaded", showTable);
