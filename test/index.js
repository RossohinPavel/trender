class CustomTrender extends Trender {
    headers = ['CustomTrender'];
}

function main(event) {
    event.preventDefault();
    showTable();
};


function showTable() {
    fetch('data.json')
    .then(response => response.json())
    .then(sample => {
        const table = new CustomTrender({data: sample});
        table.render();
    })
};
showTable();

const form = document.getElementById('form-filters');
form.addEventListener('submit', main);
