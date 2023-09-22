function moveRow(direction, btn) {
  var row = btn.parentElement.parentElement;
  var sibling;
  if (direction > 0) {
    sibling = row.nextElementSibling;
  } else {
    sibling = row.previousElementSibling;
  }
  if (sibling) {
    var parent = row.parentElement;
    parent.removeChild(row);
    if (direction > 0) {
      sibling.after(row);
    } else {
      sibling.before(row);
    }
    updatePriorities();
  }
}

function copyTable() {
  let originalTable = document.querySelector('table');
  let copyTable = originalTable.cloneNode(true);
  Array.from(copyTable.rows).forEach(row => row.deleteCell(-1));

  Array.from(copyTable.rows).forEach(row => {
    let priorityCell = row.cells[0];
    let iconClass = priorityCell.querySelector('i').className;
    let status;
    switch(iconClass) {
      case 'fas fa-exclamation-triangle text-warning':
        status = 'KRITISCH';
        break;
      case 'fas fa-arrow-up text-primary':
        status = 'HOCH';
        break;
      default:
        status = 'NORMAL';
    }
    priorityCell.textContent = status;
  });

  let range = document.createRange();
  range.selectNode(copyTable);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  document.execCommand('copy');
  window.getSelection().removeAllRanges();
  alert('Tabelle kopiert!');
}

function toggleStrike(event) {
  let target = event.target;

  while (target && target.nodeName !== 'BUTTON') {

    target = target.parentElement;
  }
  let row;
  if (!target && event.nodeName != "TR") {
    return;
  } else if(event.nodeName == "TR") {
    row = event;
  } else {
    row = target.parentElement.parentElement;
  }
  var cells = row.getElementsByTagName('td');
  for (var i = 0; i < cells.length - 1; i++) {
    cells[i].classList.toggle('strike');
  }
  var icon = target.getElementsByTagName('i')[0];
  icon.classList.toggle('text-secondary');
  icon.classList.toggle('text-danger');
}



function updatePriorities() {
  var tableBody = document.getElementById('tableBody');
  var rows = tableBody.getElementsByTagName('tr');

  var criticalCount = 1;
  var highCount = 2;
  var normalCount = 4;

  for (var i = 0; i < rows.length; i++) {
    var priorityCell = rows[i].getElementsByTagName('td')[0];
    var iconClass;

    if (i < criticalCount) {
      iconClass = 'fa-exclamation-triangle text-warning';
    } else if (i < criticalCount + highCount) {
      iconClass = 'fa-arrow-up text-primary';
    } else if (i < criticalCount + highCount + normalCount) {
      iconClass = 'fa-arrow-right text-primary';
    } else {
      iconClass = 'fa-arrow-down text-secondary';
    }

    var icon = document.createElement('i');
    icon.className = 'fas ' + iconClass;
    priorityCell.innerHTML = '';
    priorityCell.appendChild(icon);
  }
}

function openDeleteModal(event) {
  $('#deleteModal').modal('show');
  let rowToDelete = event;
  if(event?.target?.closest('tr')) {
    rowToDelete = event.target.closest('tr');
  }
  document.getElementById('confirmDelete').onclick = function() {
    rowToDelete.remove();
    $('#deleteModal').modal('hide');

    if(document.getElementById('doNotAskAgain').checked) {
      document.cookie = "doNotAskDelete=true; expires=Fri, 31 Dec 9999 23:59:59 GMT";
    }
    saveTable();
  }
}

function addRow() {
  var tableBody = document.getElementById('tableBody');
  var newRow = document.createElement('tr');

  var priorityCell = document.createElement('td');
  newRow.appendChild(priorityCell);

  for (var i = 0; i < 4; i++) {
    var newCell = document.createElement('td');
    newCell.contentEditable = 'true';
    newRow.appendChild(newCell);

    if (i === 3) {
      newCell.addEventListener('input', onCellInput);
      newCell.addEventListener('click', onCellClick);
    }
  }

  var actionCell = document.createElement('td');

  var upButton = createButton('fa-arrow-up', function() { moveRow(-1, this); });
  actionCell.appendChild(upButton);

  var downButton = createButton('fa-arrow-down', function() { moveRow(1, this); });
  actionCell.appendChild(downButton);

  var deleteRowButton = createButton('fa-times  text-secondary', toggleStrike);
  actionCell.appendChild(deleteRowButton);

  var deleteButton = createButton('fa-trash-alt text-danger', openDeleteModal);
  actionCell.appendChild(deleteButton);

  var dragDropButton = createButton('fa-grip-vertical', null);
  dragDropButton.setAttribute('draggable', true);
  actionCell.appendChild(dragDropButton);

  newRow.appendChild(actionCell);
  tableBody.appendChild(newRow);

  updatePriorities();
}

function createButton(iconClass, onClick) {
  var button = document.createElement('button');
  button.className = 'btn btn-light';
  button.style.marginRight = '4px';
  button.onclick = onClick;

  var icon = document.createElement('i');
  icon.className = 'fas ' + iconClass;
  button.appendChild(icon);

  return button;
}

function onCellClick(event) {
  var cell = event.target;

  if (event.ctrlKey) {
    event.preventDefault();
    var link = cell.querySelector('a');
    console.log(link);
    if (link) {
      window.open(link.href, '_blank');
    }
  }
}

function setCellsEditable(editable) {
  document.querySelectorAll('td[contenteditable]').forEach(function(cell) {
    cell.contentEditable = editable.toString();
  });
}

window.addEventListener('keydown', function(event) {
  if (event.key === 'Control') {
    setCellsEditable(false);
  }
});

window.addEventListener('keyup', function(event) {
  if (event.key === 'Control') {
    setCellsEditable(true);
  }
});

function onCellInput(event) {
  var cell = event.target;
  var row = cell.parentElement;
  var table = row.parentElement.parentElement;
  var columnIndex = Array.from(row.children).indexOf(cell);

  if (table.rows[0].cells[columnIndex].textContent === 'Ticket-ID / Epic') {
    var match = cell.textContent.match(/https:\/\/[^\s]+\/browse\/([A-Z0-9-]+)/);
    if (match) {
      var ticketId = match[1];
      cell.innerHTML = '<a href="' + match[0] + '" target="_blank">' + ticketId + '</a>';
    }
  }
}

function saveTable() {
  var tableBody = document.getElementById('tableBody');
  var rows = Array.from(tableBody.rows);
  var tableData = rows.map(row => {
    var cells = Array.from(row.cells);
    return cells.slice(0, -1).map(cell => cell.innerHTML);
  });
  localStorage.setItem('tableData', JSON.stringify(tableData));
}

function loadTable() {
  var tableData = JSON.parse(localStorage.getItem('tableData') || '[]');
  var tableBody = document.getElementById('tableBody');
  tableBody.innerHTML = '';

  tableData.forEach(rowData => {
    var row = document.createElement('tr');
    rowData.forEach((cellData, i) => {
      var cell = document.createElement('td');
      cell.innerHTML = cellData;
      cell.contentEditable = 'true';
      if (i === 3) {
        cell.addEventListener('input', onCellInput);
        cell.addEventListener('click', onCellClick);
      }
      row.appendChild(cell);
    });

    var actionCell = document.createElement('td');

    actionCell.appendChild(createButton('fa-arrow-up', function() { moveRow(-1, this); }));
    actionCell.appendChild(createButton('fa-arrow-down', function() { moveRow(1, this); }));
    actionCell.appendChild(createButton('fa-times text-secondary', toggleStrike)); // Beispiel für das Öffnen eines Modal
    actionCell.appendChild(createButton('fa-trash-alt text-danger', openDeleteModal));

    var dragDropButton = createButton('fa-grip-vertical', null);
    dragDropButton.setAttribute('draggable', true);
    actionCell.appendChild(dragDropButton);

    row.appendChild(actionCell);

    tableBody.appendChild(row);
  });

  updatePriorities();
}

window.addEventListener('DOMContentLoaded', (event) => {
  loadTable();
});

document.getElementById('tableBody').addEventListener('input', (event) => {
  if (event.target.tagName === 'TD') {
    saveTable();
  }
});

function addRowAbove() {
  let contextMenu = document.getElementById('contextMenu');
  let targetRow = contextMenu.targetRow;
  if(targetRow) {
    let newRow = createNewRow();
    targetRow.before(newRow);
    updatePriorities();
    saveTable();
  }
}

function addRowBelow() {
  let contextMenu = document.getElementById('contextMenu');
  let targetRow = contextMenu.targetRow;
  if(targetRow) {
    let newRow = createNewRow();
    targetRow.after(newRow);
    updatePriorities();
    saveTable();
  }
}

function addColumnLeft() {
  let contextMenu = document.getElementById('contextMenu');
  let targetCell = contextMenu.targetCell;
  if (!targetCell || targetCell.cellIndex === 0) return;

  let table = document.querySelector('table');
  Array.from(table.rows).forEach(row => {
    let newCell;
    if (row.sectionRowIndex === 0) {
      newCell = document.createElement('th');
    } else {
      newCell = document.createElement('td');
      newCell.contentEditable = 'true';
    }
    row.insertBefore(newCell, row.cells[targetCell.cellIndex]);
  });
}


function addColumnRight() {
  let contextMenu = document.getElementById('contextMenu');
  let targetCell = contextMenu.targetCell;
  let table = document.querySelector('table');
  if (!targetCell || targetCell.cellIndex === table.rows[0].cells.length - 2) return;

  Array.from(table.rows).forEach(row => {
    let newCell;
    if (row.sectionRowIndex === 0) {
      newCell = document.createElement('th');
    } else {
      newCell = document.createElement('td');
      newCell.contentEditable = 'true';
    }
    row.insertBefore(newCell, row.cells[targetCell.cellIndex + 1]);
  });
}

function deleteColumn() {
  let contextMenu = document.getElementById('contextMenu');
  let targetCell = contextMenu.targetCell;
  let table = document.querySelector('table');

  if (confirm('Möchten Sie diese Spalte wirklich löschen?')) {
    let table = document.querySelector('table');
    Array.from(table.rows).forEach(row => {
      row.deleteCell(targetCell.cellIndex);
    });
  }
}

function deleteRow() {
  let contextMenu = document.getElementById('contextMenu');
  let targetRow = contextMenu.targetRow;
  openDeleteModal(targetRow);
}

function toggleStrikeRow() {
  let contextMenu = document.getElementById('contextMenu');
  let targetRow = contextMenu.targetRow;
  toggleStrike(targetRow);
}


function moveRowToTop() {
  let contextMenu = document.getElementById('contextMenu');
  let targetRow = contextMenu.targetRow;
  if(targetRow) {
    let parent = targetRow.parentElement;
    parent.prepend(targetRow);
    updatePriorities();
    saveTable();
  }
}

function moveRowToBottom() {
  let contextMenu = document.getElementById('contextMenu');
  let targetRow = contextMenu.targetRow;
  if(targetRow) {
    let parent = targetRow.parentElement;
    parent.append(targetRow);
    updatePriorities();
    saveTable();
  }
}

function setOnHold() {
  let contextMenu = document.getElementById('contextMenu');
  let targetRow = contextMenu.targetRow;
  if(targetRow) {
    let priorityCell = targetRow.cells[0];
    let icon = priorityCell.querySelector('i');
    let onHoldMenuItem = contextMenu.querySelector('[onclick="setOnHold()"]');
    let onHoldMenuIcon = onHoldMenuItem.querySelector('i');
    if(icon.classList.contains('fa-pause')) {

      let previousClass = priorityCell.dataset.previousClass || 'fa-arrow-right text-primary';
      icon.className = 'fas ' + previousClass;
      onHoldMenuItem.textContent = ' On Hold setzen';
      onHoldMenuIcon.className = 'fas fa-pause';
      onHoldMenuItem.prepend(onHoldMenuIcon);
    } else {

      priorityCell.dataset.previousClass = icon.className.split(' ').slice(1).join(' ');
      icon.className = 'fas fa-pause text-secondary';
      onHoldMenuItem.textContent = ' Fortsetzen';
      onHoldMenuIcon.className = 'fas fa-play';
      onHoldMenuItem.prepend(onHoldMenuIcon);
    }
  }
}

function createNewRow() {
  let newRow = document.createElement('tr');

  let priorityCell = document.createElement('td');
  newRow.appendChild(priorityCell);

  for (let i = 0; i < 4; i++) {
    let newCell = document.createElement('td');
    newCell.contentEditable = 'true';
    newRow.appendChild(newCell);

    if (i === 3) {
      newCell.addEventListener('input', onCellInput);
      newCell.addEventListener('click', onCellClick);
    }
  }

  let actionCell = document.createElement('td');

  actionCell.appendChild(createButton('fa-arrow-up', function() { moveRow(-1, this); }));
  actionCell.appendChild(createButton('fa-arrow-down', function() { moveRow(1, this); }));
  actionCell.appendChild(createButton('fa-times text-secondary', toggleStrike));
  actionCell.appendChild(createButton('fa-trash-alt text-danger', openDeleteModal));

  let dragDropButton = createButton('fa-grip-vertical', null);
  dragDropButton.setAttribute('draggable', true);
  actionCell.appendChild(dragDropButton);

  newRow.appendChild(actionCell);

  return newRow;
}
document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
  let target = e.target;
  let contextMenu = document.getElementById('contextMenu');
  let rowMenu = document.getElementById('rowMenu');
  let columnMenu = document.getElementById('columnMenu');
  let onHoldMenuItem = contextMenu.querySelector('[onclick="setOnHold()"]');
  let onHoldMenuIcon = onHoldMenuItem.querySelector('i');
  let targetCell = target.closest('td') || target.closest('th');
  contextMenu.targetCell = targetCell;

  contextMenu.style.top = e.pageY + 'px';
  contextMenu.style.left = e.pageX + 'px';

  if (target.closest('td')) {
    rowMenu.style.display = 'block';
    columnMenu.style.display = 'none';

    let targetRow = target.closest('tr');
    contextMenu.targetRow = targetRow;
    let priorityCell = targetRow.cells[0];
    let icon = priorityCell.querySelector('i');

    if(icon.classList.contains('fa-pause')) {
      onHoldMenuItem.textContent = ' Fortsetzen';
      onHoldMenuIcon.className = 'fas fa-play';
    } else {
      onHoldMenuItem.textContent = ' On Hold setzen';
      onHoldMenuIcon.className = 'fas fa-pause';
    }
    onHoldMenuItem.prepend(onHoldMenuIcon);
  } else if (target.closest('th')) {
    rowMenu.style.display = 'none';
    columnMenu.style.display = 'block';
  }

  contextMenu.style.display = 'block';
});


document.getElementById('contextMenu').addEventListener('mouseleave', function() {
  this.style.display = 'none';
});

document.addEventListener('mouseover', function(e) {
  let target = e.target;
  if (target.closest('.context-menu')) {
    let row = contextMenu.targetRow;
    let cell = contextMenu.targetCell;
    if (row) row.style.backgroundColor = 'rgba(255,255,255,0.3)';
    if (cell) cell.style.backgroundColor = 'rgba(255,255,255,0.5)';
  }
});

document.addEventListener('mouseout', function(e) {
  let target = e.target;
  if (target.closest('.context-menu')) {
    let row = contextMenu.targetRow;
    let cell = contextMenu.targetCell;
    if (row) row.style.backgroundColor = '';
    if (cell) cell.style.backgroundColor = '';
  }
});

document.getElementById('contextMenu').addEventListener('mouseleave', function() {
  this.style.display = 'none';
});

document.addEventListener("dragstart", function(event) {
  if(event.target.className.includes('fa-grip-vertical')) {
    dragged = event.target.closest('tr');
    event.dataTransfer.setData('text/plain', null);
  }
}, false);

document.addEventListener("dragover", function(event) {
  event.preventDefault();
}, false);

document.addEventListener("drop", function(event) {
  event.preventDefault();
  if (event.target.tagName === "TD" && dragged) {
    let targetRow = event.target.closest('tr');
    let parent = targetRow.parentNode;
    parent.insertBefore(dragged, targetRow.nextSibling);
    updatePriorities();
  }
}, false);

document.getElementById('tableBody').addEventListener('DOMNodeInserted', saveTable);
document.getElementById('tableBody').addEventListener('DOMNodeRemoved', saveTable);
document.querySelectorAll('td[contenteditable="true"]').forEach(function(cell) {
  cell.addEventListener('input', onCellInput);
  cell.addEventListener('click', onCellClick);
});
