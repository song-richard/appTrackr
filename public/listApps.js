console.log("listApps.js loaded!")

async function retrieveApps() {
    const listUL = document.querySelector('#appListUL');
    try {
        const response = await axios.get('/get-app');
        const applications = response.data["application"];
        applications.forEach(app => {
            let newLi = document.createElement('li');
            newLi.innerHTML = `
                <strong>Job Title:</strong> ${app.jobTitle}<br>
                <strong>Company:</strong> ${app.company}<br>
                <strong>Application Date:</strong> ${app.applicationDate ? new Date(app.applicationDate).toLocaleDateString() : 'N/A'}<br>
                <strong>Status:</strong> ${app.status}<br>
                <strong>Notes:</strong> ${app.notes ? app.notes : 'N/A'}
            `;            newLi.dataset.appId = app._id;
            listUL.appendChild(newLi);
        });
    } catch (err) {
        console.log(err)
    };
};

retrieveApps()