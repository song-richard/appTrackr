console.log("adddFunc.js loaded!");

const addBtn = document.querySelector('#addBtn');

function getFormData() {
    const jobTitleVal = document.querySelector('#jobTitle').value;
    const compamyVal = document.querySelector('#company').value;
    const applicationDateVal = document.querySelector('#applicationDate').value;
    const statusVal = document.querySelector('#status').value;
    const notesVal = document.querySelector('#notes').value;

    try {
        return {
            jobTitleVal: jobTitleVal,
            compamyVal: compamyVal,
            applicationDateVal: applicationDateVal,
            statusVal: statusVal,
            notesVal: notesVal
        };
    } finally {
        resetFields();
    };

    function resetFields() {
        document.querySelector('#jobTitle').value = '';
        document.querySelector('#company').value = '';
        document.querySelector('#applicationDate').value = '';
        document.querySelector('#status').value = '';
        document.querySelector('#notes').value = '';
    };
};

document.addEventListener('DOMContentLoaded', function() {
    addBtn.addEventListener('click', addApp);
})

async function addApp() {
    try {
        const formData = getFormData();
        console.log(formData);

        // await axios.post('/add-app', { formData })

    } catch (err) {
        console.error(err);
    };
};
