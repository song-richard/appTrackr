console.log("listApps.js loaded!")

async function retrieveApps() {
    const listUL = document.querySelector('#appListUL');
    try {
        const response = await axios.get('/get-app');
        const applications = response.data["application"];
        applications.forEach(app => {
            let newLi = document.createElement('li');
            let editBtn = document.createElement('button');
            let deleteBtn = document.createElement('button');

            editBtn.innerHTML = 'Edit';
            deleteBtn.innerHTML = 'Delete';

            newLi.innerHTML = `
                <strong>Job Title:</strong> ${app.jobTitle}<br>
                <strong>Company:</strong> ${app.company}<br> 
                <strong>Application Date:</strong> ${app.applicationDate ? new Date(app.applicationDate).toLocaleDateString() : 'N/A'}<br>
                <strong>Status:</strong> ${app.status}<br>
                <strong>Notes:</strong> ${app.notes ? app.notes : 'N/A'}<br><br>
            `;            newLi.dataset.appId = app._id;

            listUL.appendChild(newLi);
            newLi.appendChild(editBtn);
            newLi.appendChild(deleteBtn);

            editBtn.addEventListener('click', function() {
                const editOption = window.prompt('What would you like to edit? (jobTitle, company, applicationDate, status, notes)')
                if (editOption) {
                    updateField(editOption.toLowerCase());
                };
            });

            async function updateField(field) {
                const newValue = window.prompt(`Enter the new ${field.charAt(0).toUpperCase() + field.slice(1)}:`);
                if (newValue) {
                    try {
                        const url = `/update-app/${app._id}`;
                        console.log('PUT URL:', url);
                        
                        await axios.put(`/update-app/${app._id}`, { [`${field}`]: newValue });
                        app[field] = newValue;
                        updateUI();
                    } catch (err) {
                        console.error(err);
                    };
                };
            };

        function updateUI() {
            newLi.innerHTML = `
                <strong>Job Title:</strong> ${app.jobTitle}<br>
                <strong>Company:</strong> ${app.company}<br>
                <strong>Application Date:</strong> ${app.applicationDate ? new Date(app.applicationDate).toLocaleDateString() : 'N/A'}<br>
                <strong>Status:</strong> ${app.status}<br>
                <strong>Notes:</strong> ${app.notes ? app.notes : 'N/A'}<br><br>
            `;
        };

        });
    } catch (err) {
        console.log(err)
    };
};

retrieveApps()