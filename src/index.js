if("serviceWorker" in navigator){
    navigator.serviceWorker.register("sw.js").then( registration => {
        console.log("SW Registred!")
    }).catch(error => {
        console.log("SW Registration failed")
        console.log(error)
    })
}