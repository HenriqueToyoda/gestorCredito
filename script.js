let draggedItem = null;

document.querySelectorAll('.dragItem').forEach(item => {
  item.addEventListener('dragstart', () => {
    draggedItem = item;
    setTimeout(() => {
      item.style.display = 'none';
    }, 0);
  });

  item.addEventListener('dragend', () => {
    setTimeout(() => {
      item.style.display = 'block';
      draggedItem = null;
    }, 0);
  });
});

document.querySelectorAll('.dropZone').forEach(zone => {
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('hovered');
  });

  zone.addEventListener('dragleave', () => {
    zone.classList.remove('hovered');
  });

  zone.addEventListener('drop', (e) => {
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

// Função para calcular a posição do drop (reordenamento)
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
