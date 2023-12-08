
async function retrieveApps() {
    const listUL = document.querySelector('appListUL');
    try {
        const response = axios.get('/get-app')
        const responseData = response.data
        responseData.forEach(app => {
            let newLi = document.createElement('li');
            newLi.textContent = app.textContent
            listUL.appendChild(newLi);
        })
    } catch (err) {
        console.log(err)
    }
}