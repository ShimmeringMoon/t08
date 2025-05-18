let rawData = [];
let headers = [];

document.getElementById('uploadForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const fileInput = document.getElementById('csvFile');
  const file = fileInput.files[0];

  const formData = new FormData();
  formData.append('csvFile', file);

  fetch('/upload', {
    method: 'POST',
    body: formData,
  })
    .then(res => res.json())
    .then(data => {
      rawData = data;
      headers = Object.keys(data[0]);
      document.getElementById('filters').style.display = 'block';
      createFilters();
      renderTable(rawData);
    })
    .catch(err => {
      console.error('Upload failed', err);
    });
});

function createFilters() {
  const container = document.getElementById('filters');
  container.innerHTML = '';  
 
  const label = document.createElement('strong');
  label.textContent = 'Filter: ';
  label.style.marginRight = '10px';
  container.appendChild(label);

  headers.forEach(header => {
    const select = document.createElement('select');
    select.setAttribute('data-header', header);

    const optionAll = document.createElement('option');
    optionAll.value = '';
    optionAll.textContent = `${header} (all)`;
    select.appendChild(optionAll);

    const values = [...new Set(rawData.map(row => row[header]))];
    values.forEach(val => {
      const option = document.createElement('option');
      option.value = val;
      option.textContent = val;
      select.appendChild(option);
    });

    container.appendChild(select);
  });

  const applyBtn = document.createElement('button');
  applyBtn.textContent = 'APPLY';
  applyBtn.style.marginLeft = '10px';
  applyBtn.addEventListener('click', function (e) {
    e.preventDefault();
    applyFilters();
  });

  container.appendChild(applyBtn);
}

function applyFilters() {
  const selects = document.querySelectorAll('#filters select');
  let filtered = [...rawData];

  selects.forEach(select => {
    const key = select.getAttribute('data-header');
    const val = select.value;
    if (val !== '') {
      filtered = filtered.filter(row => row[key] === val);
    }
  });

  renderTable(filtered);
}

function renderTable(data) {
  const table = document.getElementById('csvTable');
  table.innerHTML = '';

  if (data.length === 0) return;

  const thead = document.createElement('thead');
  const tr = document.createElement('tr');
  headers.forEach(h => {
    const th = document.createElement('th');
    th.textContent = h;
    tr.appendChild(th);
  });
  thead.appendChild(tr);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  data.forEach(row => {
    const tr = document.createElement('tr');
    headers.forEach(h => {
      const td = document.createElement('td');
      td.textContent = row[h];
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
}
