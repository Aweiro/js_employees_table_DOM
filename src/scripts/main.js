'use strict';

const table = document.querySelector('table');
const title = table.querySelectorAll('thead>tr>th');
const tbody = table.querySelector('tbody');

let lastIndex = null;
let isAsc = true;

function sortTable(index) {
  const tableSort = [...table.querySelectorAll('tbody>tr')];
  const tbodyOld = table.querySelector('tbody');

  const cleanNumber = (str) => Number(str.replace(/[^\d.-]+/g, ''));

  if (lastIndex === index) {
    isAsc = !isAsc;
  } else {
    isAsc = true;
    lastIndex = index;
  }

  tableSort.sort((a, b) => {
    let aText = a.cells[index].textContent;
    let bText = b.cells[index].textContent;

    if (!isAsc) {
      bText = a.cells[index].textContent;
      aText = b.cells[index].textContent;
    }

    const isValid = !isNaN(cleanNumber(bText));
    const isNumber = cleanNumber(aText) && cleanNumber(bText);

    if (isValid && isNumber) {
      return cleanNumber(aText) - cleanNumber(bText);
    }

    return aText.localeCompare(bText);
  });

  tbodyOld.innerHTML = '';

  for (const key of tableSort) {
    tbodyOld.appendChild(key);
  }
}

title.forEach((element, index) => {
  element.addEventListener('click', (e) => {
    const link = e.target.closest('th');

    if (!link) {
      return;
    }

    sortTable(index);
  });
});

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  [...tbody.rows].forEach((r) => r.classList.remove('active'));
  row.classList.add('active');
});

const form = document.createElement('form');

form.className = 'new-employee-form';

const formInpuns = ['Name', 'Position', 'Office', 'Age', 'Salary'];

for (const key of formInpuns) {
  let input = document.createElement('input');
  let type = 'text';
  const label = document.createElement('label');

  if (key === 'Office') {
    input = document.createElement('select');

    const selectOptions = [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ];

    for (const option of selectOptions) {
      const newOption = document.createElement('option');

      newOption.textContent = option;

      newOption.setAttribute('value', option);

      input.appendChild(newOption);
    }
  }

  if (key === 'Age' || key === 'Salary') {
    type = 'number';
  }

  input.setAttribute('name', key.toLocaleLowerCase());
  input.setAttribute('data-qa', key.toLocaleLowerCase());
  input.setAttribute('type', type);
  input.setAttribute('required', '');
  label.textContent = key + ': ';
  form.appendChild(label);
  label.appendChild(input);
}

const button = document.createElement('button');

button.type = 'submit';
button.textContent = 'Save to table';

form.appendChild(button);

table.insertAdjacentElement('afterend', form);

const pushNotification = (notTitle, description, type) => {
  const notification = document.createElement('div');
  const notificationTitle = document.createElement('h2');
  const notificationDescription = document.createElement('p');

  if (document.querySelector('.notification')) {
    document.querySelector('.notification').remove();
  }

  notification.classList.add('notification', type);
  notificationTitle.className = 'title';
  notificationTitle.textContent = notTitle;
  notificationDescription.textContent = description;
  notification.setAttribute('data-qa', 'notification');

  notification.style.top = '10px';
  notification.style.right = '10px';
  notification.style.position = 'fixed';

  notification.append(notificationTitle, notificationDescription);
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.visibility = 'hidden';
  }, 10000);
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const newRow = document.createElement('tr');
  const obj = {};

  for (const key of [...formData]) {
    obj[key[0]] = key[1];
  }

  if (obj.name.length < 4) {
    pushNotification(
      'name',
      'Message example.\n ' +
        'Notification should contain title and description.',
      'error',
    );

    return;
  }

  if (obj.age < 18 || obj.age > 90) {
    pushNotification(
      'age',
      'Message example.\n ' +
        'Notification should contain title and description.',
      'error',
    );

    return;
  }

  if (obj.position.trim().length === 0) {
    pushNotification(
      'position',
      'Message example.\n ' +
        'Notification should contain title and description.',
      'error',
    );

    return;
  }

  for (const [key, value] of formData) {
    const newTd = document.createElement('td');
    let newValue = value;

    if (key === 'salary') {
      newValue = '$' + Number(value).toLocaleString('en-US');
    }

    if (key === 'age') {
      newValue = Number(value);
    }

    newTd.textContent = newValue;
    newRow.appendChild(newTd);
  }
  tbody.appendChild(newRow);

  form.reset();

  pushNotification(
    'Done!',
    'Message example.\n ' +
      'Notification should contain title and description.',
    'success',
  );
});

tbody.addEventListener('dblclick', (e) => {
  const link = e.target.closest('tr>td');

  if (!link) {
    return;
  }

  const text = link.textContent;

  link.textContent = '';

  const input = document.createElement('input');

  input.className = 'cell-input';
  input.value = text;

  link.appendChild(input);
  input.focus();

  input.addEventListener('keypress', (ev) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      saveContent(input, text);
    }
  });

  input.addEventListener('blur', () => {
    saveContent(input, text);
  });
});

function saveContent(input, text) {
  if (!input.value.trim()) {
    input.parentElement.textContent = text;
  } else {
    input.parentElement.textContent = input.value;
  }
}
