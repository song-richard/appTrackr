console.log('listApps.js loaded!');

async function retrieveApps() {
    const listUL = document.querySelector('#appListUL');
    const interviewingUL = document.querySelector('#interviewingUL');
    const interviewedUL = document.querySelector('#interviewedUL');
    const rejectedUL = document.querySelector('#rejectedUL');

    try {
        const response = await axios.get('/get-app');
        const applications = response.data['application'];

        applications.forEach((app) => {
            let newLi = document.createElement('li');
            let editBtn = document.createElement('button');
            let deleteBtn = document.createElement('button');

            editBtn.innerHTML = 'Edit';
            deleteBtn.innerHTML = 'Delete';

            newLi.innerHTML = `
                <strong>Job Title:</strong> ${app.job}<br>
                <strong>Company:</strong> ${app.company}<br> 
                <strong>Application Date:</strong> ${
                    app.applicationDate
                        ? new Date(app.applicationDate).toLocaleDateString()
                        : 'N/A'
                }<br>
                <strong>Status:</strong> ${app.status}<br>
                <strong>Notes:</strong> ${app.notes ? app.notes : 'N/A'}<br><br>
            `;
            newLi.dataset.appId = app._id;

            console.log(app);

            switch (app.status) {
                case 'Applied':
                    listUL.appendChild(newLi);
                    break;
                case 'In Progress':
                    interviewingUL.appendChild(newLi);
                    break;
                case 'Interviewed':
                    interviewedUL.appendChild(newLi);
                    break;
                case 'Rejected':
                    rejectedUL.appendChild(newLi);
                    break;
                default:
                    listUL.appendChild(newLi);
            }

            editBtn.innerHTML = 'Edit';
            editBtn.classList.add(
                'mr-2',
                'py-1',
                'px-2',
                'bg-blue-500',
                'text-white',
                'rounded-md',
                'hover:bg-blue-600',
                'transition',
                'duration-300'
            );
            newLi.appendChild(editBtn);

            deleteBtn.innerHTML = 'Delete';
            deleteBtn.classList.add(
                'py-1',
                'px-2',
                'bg-red-500',
                'text-white',
                'rounded-md',
                'hover:bg-red-600',
                'transition',
                'duration-300'
            );
            newLi.appendChild(deleteBtn);

            editBtn.style.marginBottom = '20px';
            deleteBtn.style.marginBottom = '20px';

            newLi.style.marginBottom = '1px';

            editBtn.addEventListener('click', function () {
                const editOption = window.prompt(
                    'What would you like to edit? (job, company, applicationDate, status, notes)'
                );
                if (editOption) {
                    updateField(editOption.toLowerCase());
                }
            });

            deleteBtn.addEventListener('click', function () {
                const deleteOption = window.confirm('Are you sure you want to delete this?');
                if (deleteOption) {
                    axios.delete(`/delete-app/${app._id}`);
                    newLi.remove();
                }
            });

            async function updateField(field) {
                const newValue = window.prompt(
                    `Enter the new ${field.charAt(0).toUpperCase() + field.slice(1)}:`
                );
                if (newValue) {
                    try {
                        const url = `/update-app/${app._id}`;
                        console.log('PUT URL:', url);

                        await axios.put(
                            `/update-app/${app._id}`,
                            { [field]: newValue },
                            { headers: { 'Content-Type': 'application/json' } }
                        );
                        app[field] = newValue;
                        updateUI();
                    } catch (err) {
                        console.error(err);
                    }
                }
            }

            function updateUI() {
                newLi.innerHTML = `
                    <strong>Job Title:</strong> ${app.job}<br>
                    <strong>Company:</strong> ${app.company}<br>
                    <strong>Application Date:</strong> ${
                        app.applicationDate
                            ? new Date(app.applicationDate).toLocaleDateString()
                            : 'N/A'
                    }<br>
                    <strong>Status:</strong> ${app.status}<br>
                    <strong>Notes:</strong> ${app.notes ? app.notes : 'N/A'}<br><br>
                `;

                newLi.style.marginBottom = '1px';

                const listId = getListIdForStatus(app.status);
                const listUL = document.querySelector(`#${listId}`);
                listUL.appendChild(newLi);

                editBtn.innerHTML = 'Edit';
                editBtn.className = 'mr-2 py-1 px-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300';
                newLi.appendChild(editBtn);

                deleteBtn.innerHTML = 'Delete';
                deleteBtn.className = 'py-1 px-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300';
                newLi.appendChild(deleteBtn);

                editBtn.style.marginBottom = '20x';
                deleteBtn.style.marginBottom = '20px';
            }
        });
    } catch (err) {
        console.log(err);
    }
}

retrieveApps();
