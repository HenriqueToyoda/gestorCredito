let draggedItem = null;

const zone1 = document.getElementById('zone1');
const zone2 = document.getElementById('zone2');

function createItem(text) {
  const div = document.createElement('div');
  div.className = 'dragItem';
  div.textContent = text;
  div.setAttribute('draggable', 'true');

  div.addEventListener('dragstart', () => {
    draggedItem = div;
    setTimeout(() => (div.style.display = 'none'), 0);
  });

  div.addEventListener('dragend', () => {
    setTimeout(() => {
      div.style.display = 'block';
      draggedItem = null;
    }, 0);
  });

  return div;
}

function initDefault() {
  zone1.innerHTML = '';
  zone2.innerHTML = '';
  ['Pedido      ',
'Cod Ped Ori ',
'Cod. Cliente',
'Nome cliente',
'Nome Ori emp',
'Emissao Ori ',
'Cond Pg Ori ',
'Forma PGTO  ',
'Prazo Medio ',
'Prz Med Clie',
'Cod Regional',
'Regional    ',
'Valor Ped Or',
'Status      ',
'CNPJ        ',
'Cod Ori clie',
'Cod Motivo  ',
'Descr Motivo',
'Data Inclusa',
'Hora Inclusa',
'Vendedor    ',
'Data SF     ',
'Hora SF     ',
'Data/Hora SF'].forEach(text => zone1.appendChild(createItem(text)));
  [].forEach(text => zone2.appendChild(createItem(text)));
}

document.querySelectorAll('.dropZone').forEach(zone => {
  zone.addEventListener('dragover', e => {
    e.preventDefault();
    zone.classList.add('hovered');
  });

  zone.addEventListener('dragleave', () => {
    zone.classList.remove('hovered');
  });

  zone.addEventListener('drop', e => {
    e.preventDefault();
    if (draggedItem) {
      const afterElement = getDragAfterElement(zone, e.clientY);
      if (afterElement == null) {
        zone.appendChild(draggedItem);
      } else {
        zone.insertBefore(draggedItem, afterElement);
      }
      zone.classList.remove('hovered');
    }
  });
});

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.dragItem:not(:last-child)')];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function saveState() {
  const state = {
    zone1: [...zone1.children].map(el => el.textContent),
    zone2: [...zone2.children].map(el => el.textContent)
  };
  localStorage.setItem('dragDropState', JSON.stringify(state));
  alert('Estado salvo!');
}

function resetState() {
  localStorage.removeItem('dragDropState');
  initDefault();
}

function exportState() {
  const state = {
    zone1: [...zone1.children].map(el => el.textContent),
    zone2: [...zone2.children].map(el => el.textContent)
  };
  document.getElementById('exportOutput').textContent = JSON.stringify(state, null, 2);
}

function loadState() {
  const saved = localStorage.getItem('dragDropState');
  if (saved) {
    const state = JSON.parse(saved);
    zone1.innerHTML = '';
    zone2.innerHTML = '';
    state.zone1.forEach(text => zone1.appendChild(createItem(text)));
    state.zone2.forEach(text => zone2.appendChild(createItem(text)));
  } else {
    initDefault();
  }
}

loadState();
