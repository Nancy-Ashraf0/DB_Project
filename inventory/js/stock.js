const inventory = [
  { id:'1001', name:'باكيت ورق ملون لصف', unit:'عدد', counted:320, beginning:274, added:46, state:'جديد', price:18 },
  { id:'1002', name:'ورق تصوير a3', unit:'عدد', counted:65, beginning:59, added:6, state:'جديد', price:67.7 },
  { id:'1003', name:'دوسية دبلکس ورق', unit:'عدد', counted:350, beginning:350, added:0, state:'جديد', price:0.57 },
  { id:'1010', name:'حافظة اسطوانه 120 جيب', unit:'عدد', counted:50, beginning:50, added:0, state:'جديد', price:75 },
  { id:'1011', name:'حافظة شفاف', unit:'عدد', counted:2700, beginning:1600, added:1100, state:'جديد', price:4 },
  { id:'1012', name:'ورق مسطر مفرد', unit:'رزمة', counted:110, beginning:110, added:0, state:'جديد', price:4 },
];

const types = [
  { key:'all', label:'كل الجرد' },
  { key:'stationery', label:'الأدوات الكتابية' },
  { key:'electronics', label:'الإلكترونيات' },
  { key:'consumables', label:'المستهلكات' },
];

const tableBody = document.querySelector("#stockTable tbody");

function init() {
  const typeSelect = document.getElementById("typeFilter");
  types.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t.key;
    opt.textContent = t.label;
    typeSelect.appendChild(opt);
  });

  const today = new Date().toISOString().slice(0,10);
  document.getElementById("dateInput").value = today;
  document.getElementById("dateLabel").textContent = today;
  document.getElementById("printDate").textContent = "التاريخ: " + today;

  document.querySelectorAll("select,input").forEach(el =>
    el.addEventListener("input", render)
  );

  render();
}

function render() {
  tableBody.innerHTML = "";

  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const includeZeros = document.getElementById("includeZeros").checked;

  let filtered = inventory.filter(i =>
    (!keyword || i.name.toLowerCase().includes(keyword) || i.id.includes(keyword)) &&
    (includeZeros || i.counted !== 0 || i.beginning !== 0)
  );

  let totals = { counted:0, beginning:0, added:0, value:0 };

  filtered.forEach(item => {
    const value = item.counted * item.price;
    const deficit = Math.max(0, item.beginning - item.counted);

    totals.counted += item.counted;
    totals.beginning += item.beginning;
    totals.added += item.added;
    totals.value += value;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${value.toFixed(2)}</td>
      <td>${item.price}</td>
      <td>${item.added}</td>
      <td class="${deficit ? 'deficit' : ''}">${deficit}</td>
      <td>${item.state}</td>
      <td>${item.beginning}</td>
      <td>${item.counted}</td>
      <td>${item.unit}</td>
      <td>${item.name}</td>
      <td>${item.id}</td>
    `;
    tableBody.appendChild(tr);
  });

  document.getElementById("totalValue").textContent = "إجمالي القيمة: " + totals.value.toFixed(2);
  document.getElementById("totalAdded").textContent = "الزيادة: " + totals.added;
  document.getElementById("totalBeginning").textContent = "الرصيد: " + totals.beginning;
  document.getElementById("totalCounted").textContent = "الموجود: " + totals.counted;
}

function printPage() {
  window.print();
}

function downloadCSV() {
  let csv = "رقم,اسم,وحدة,موجود,رصيد,زيادة,سعر,قيمة\n";
  inventory.forEach(i => {
    csv += `${i.id},${i.name},${i.unit},${i.counted},${i.beginning},${i.added},${i.price},${(i.counted*i.price)}\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "inventory.csv";
  a.click();
}

function goBack() {
  history.back();
}

init();
