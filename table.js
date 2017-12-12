
var i = 0;
function generateId(){
	return i++;
}

function setTableRowsColor() {
	var table = document.getElementsByTagName('table').item(0);
	for (var i = 1, rows = table.getElementsByTagName('tr'); i < rows.length; ++i) {
		if (i % 2 == 0)
			rows[i].setAttribute("style", "background-color: yellow");
		else
			rows[i].setAttribute("style", "background-color: aqua;");
	}
}

function deleteRow(row) {
	var i = row.parentNode.parentNode.rowIndex;
	var table = document.getElementsByTagName('table').item(0);
	table.deleteRow(i);
	setTableRowsColor();
}

function addRow(editable) {
	var table = document.getElementsByTagName('table').item(0);
	rows = table.getElementsByTagName('tr');

	var row = table.insertRow(rows.length);
	var id = generateId();
	var rowId = 'row' + id;
	var cellId = 'cell' + id;
	row.setAttribute('id', rowId);
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
	var cell4 = row.insertCell(3);
	cell4.setAttribute('id', cellId);
	cell3.innerHTML = '<td><button onclick = "deleteRow(this)"> Usuń </button></td>';
	if (editable) {
		row.setAttribute('contenteditable', 'true');
		cell4.innerHTML = '<td><button onclick = "save(' + id + ')"> Zapisz </button></td>';
	} else {
		row.setAttribute('contenteditable', 'false');
		cell4.innerHTML = '<td><button onclick = "edit(' + id + ')"> Edytuj </button></td>';
		cell1.innerHTML = 'column A ' + rows.length;
		cell2.innerHTML = 'column B ' + rows.length;
	}
	setTableRowsColor();

}

function save(id) {
	var rowId = 'row' + id;
	var cellId = 'cell' + id;

	var row = document.getElementById(rowId);
	var cell = document.getElementById(cellId);

	row.setAttribute('contenteditable', 'false');
	cell.innerHTML = '<td><button onclick = "edit(' + id + ')"> Edytuj </button></td>';

}

function edit(id) {
	var rowId = 'row' + id;
	var cellId = 'cell' + id;

	var row = document.getElementById(rowId);
	var cell = document.getElementById(cellId);

	row.setAttribute('contenteditable', 'true');
	cell.innerHTML = '<td><button onclick = "save(' + id + ')"> Zapisz </button></td>';
}

window.onload = () => {
	for (let i = 0; i < 5; i++) {
		addRow(false);
	}
}