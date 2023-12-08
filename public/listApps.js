
async function retrieveApps() {
    const listUL = document.querySelector('appListUL');
    try {
        const response = await axios.get('/get-app');
        const applications = response.data["application"];
        applications.forEach(app => {
            let newLi = document.createElement('li');
            newLi.textContent = app.textContent;
            newLi.dataset.appId = app._id;
            listUL.appendChild(newLi);
        });
    } catch (err) {
        console.log(err)
    };
};