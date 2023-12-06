console.log("adddFunc.js loaded!")

const addBtn = document.querySelector('#addBtn');

function getFormData() {
    const employerVal = document.querySelector('#employerVal').value;
    const dateTimeVal = document.querySelector('#dateTimeVal').value;
    const appOptionsVal = document.querySelector('#appOptionsVal').value;

    return {
        employerVal: employerVal,
        dateTimeVal: dateTimeVal,
        appOptionsVal: appOptionsVal
    };
}

document.addEventListener('DOMContentLoaded', function() {
    addBtn.addEventListener('click', addApp)
})

async function addApp() {
    try {
        const formData = getFormData();
        console.log(formData);

        await axios.post('')

    } catch (err) {
        console.error(err)
    }
}