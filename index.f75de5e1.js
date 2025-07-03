"use strict";
const table = document.querySelector("table");
const title = table.querySelectorAll("thead>tr>th");
const tbody = table.querySelector("tbody");
let lastIndex = null;
let isAsc = true;
function sortTable(index) {
    const tableSort = [
        ...table.querySelectorAll("tbody > tr")
    ];
    const tbodyOld = table.querySelector("tbody");
    const cleanNumber = (str)=>parseFloat(str.replace(/[^0-9.-]+/g, "").replace(",", ""));
    if (lastIndex === index) isAsc = !isAsc;
    else {
        isAsc = true;
        lastIndex = index;
    }
    tableSort.sort((a, b)=>{
        const aText = a.cells[index].textContent.trim();
        const bText = b.cells[index].textContent.trim();
        const aNum = cleanNumber(aText);
        const bNum = cleanNumber(bText);
        const isNumber = !isNaN(aNum) && !isNaN(bNum);
        if (isNumber) return (aNum - bNum) * (isAsc ? 1 : -1);
        return aText.localeCompare(bText) * (isAsc ? 1 : -1);
    });
    tbodyOld.innerHTML = "";
    tableSort.forEach((row)=>tbodyOld.appendChild(row));
}
title.forEach((element, index)=>{
    element.addEventListener("click", (e)=>{
        const link = e.target.closest("th");
        if (!link) return;
        sortTable(index);
    });
});
tbody.addEventListener("click", (e)=>{
    const row = e.target.closest("tr");
    if (!row) return;
    [
        ...tbody.rows
    ].forEach((r)=>r.classList.remove("active"));
    row.classList.add("active");
});
const form = document.createElement("form");
form.className = "new-employee-form";
const formInputs = [
    "Name",
    "Position",
    "Office",
    "Age",
    "Salary"
];
for (const key of formInputs){
    let input;
    let type = "text";
    const label = document.createElement("label");
    if (key === "Office") {
        input = document.createElement("select");
        const selectOptions = [
            "Tokyo",
            "Singapore",
            "London",
            "New York",
            "Edinburgh",
            "San Francisco"
        ];
        for (const option of selectOptions){
            const newOption = document.createElement("option");
            newOption.textContent = option;
            newOption.setAttribute("value", option);
            input.appendChild(newOption);
        }
    } else {
        input = document.createElement("input");
        if (key === "Age" || key === "Salary") type = "number";
        input.setAttribute("type", type);
    }
    input.setAttribute("name", key.toLocaleLowerCase());
    input.setAttribute("data-qa", key.toLocaleLowerCase());
    input.setAttribute("required", "");
    label.textContent = key + ": ";
    form.appendChild(label);
    label.appendChild(input);
}
const button = document.createElement("button");
button.type = "submit";
button.textContent = "Save to table";
form.appendChild(button);
table.insertAdjacentElement("afterend", form);
const pushNotification = (notTitle, description, type)=>{
    const notification = document.createElement("div");
    const notificationTitle = document.createElement("h2");
    const notificationDescription = document.createElement("p");
    if (document.querySelector(".notification")) document.querySelector(".notification").remove();
    notification.classList.add("notification", type);
    notificationTitle.className = "title";
    notificationTitle.textContent = notTitle;
    notificationDescription.textContent = description;
    notification.setAttribute("data-qa", "notification");
    notification.style.top = "10px";
    notification.style.right = "10px";
    notification.style.position = "fixed";
    notification.append(notificationTitle, notificationDescription);
    document.body.appendChild(notification);
    setTimeout(()=>{
        notification.style.visibility = "hidden";
    }, 10000);
};
form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const formData = new FormData(form);
    const newRow = document.createElement("tr");
    const obj = {};
    for (const key of [
        ...formData
    ])obj[key[0]] = key[1];
    if (obj.name.length < 4) {
        pushNotification("\u041F\u043E\u043C\u0438\u043B\u043A\u0430", "\u041A\u043E\u0440\u043E\u0442\u043A\u0435 \u0456\u043C'\u044F.\n \u0406\u043C'\u044F \u043F\u043E\u0432\u0438\u043D\u043D\u043E \u043C\u0456\u0441\u0442\u0438\u0442\u0438 \u0445\u043E\u0447\u0430\u0431 4 \u0441\u0438\u043C\u0432\u043E\u043B\u0438.", "error");
        return;
    }
    if (obj.age < 18 || obj.age > 90) {
        pushNotification("\u041F\u043E\u043C\u0438\u043B\u043A\u0430", "\u041D\u0435\u043A\u043E\u0440\u0435\u043A\u0442\u043D\u0438\u0439 \u0432\u0456\u043A.\n \u0412\u0432\u0435\u0434\u0456\u0442\u044C \u0447\u0438\u0441\u043B\u043E \u0432\u0456\u0434 18 \u0434\u043E 90 \u0440\u043E\u043A\u0456\u0432.", "error");
        return;
    }
    if (obj.position.trim().length === 0) {
        pushNotification("\u041F\u043E\u043C\u0438\u043B\u043A\u0430", "\u041D\u0435\u043A\u043E\u0440\u0435\u043A\u0442\u043D\u0430 \u043F\u043E\u0441\u0430\u0434\u0430.\n \u0412\u0432\u0435\u0434\u0456\u0442\u044C \u043F\u043E\u0441\u0430\u0434\u0443.", "error");
        return;
    }
    for (const [key, value] of formData){
        const newTd = document.createElement("td");
        let newValue = value;
        if (key === "salary") newValue = "$" + Number(value).toLocaleString("en-US");
        if (key === "age") newValue = Number(value);
        newTd.textContent = newValue;
        newRow.appendChild(newTd);
    }
    tbody.appendChild(newRow);
    form.reset();
    pushNotification("\u0423\u0441\u043F\u0456\u0445!", "\u0423\u0441\u043F\u0456\u0448\u043D\u043E.\n \u041F\u0440\u0430\u0446\u0456\u0432\u043D\u0438\u043A\u0430 \u0434\u043E\u0434\u0430\u043D\u043E \u0432 \u0441\u043F\u0438\u0441\u043E\u043A.", "success");
});
tbody.addEventListener("dblclick", (e)=>{
    const link = e.target.closest("td");
    if (!link) return;
    const text = link.textContent;
    link.textContent = "";
    const input = document.createElement("input");
    input.className = "cell-input";
    input.value = text;
    link.appendChild(input);
    input.focus();
    input.addEventListener("keypress", (ev)=>{
        if (ev.key === "Enter") {
            ev.preventDefault();
            saveContent(input, text);
        }
    });
    input.addEventListener("blur", ()=>{
        saveContent(input, text);
    });
});
function saveContent(input, text) {
    if (!input.value.trim()) input.parentElement.textContent = text;
    else input.parentElement.textContent = input.value;
}

//# sourceMappingURL=index.f75de5e1.js.map
