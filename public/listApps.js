const listUL = document.querySelector('appListUL');

async function retrieveApps() {
    try {
        const response = axios.get('/get-app')
        
    } catch (err) {
        console.log(err)
    }
}