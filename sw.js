// self.addEventListener('install', e => {
//     e.waitUntil(
//         caches.open("static").then(cache => {
//             return cache.addAll(
//                 [
//                     "./",
//                     "./assets/json/LianaLebanon.json",
//                     "./assets/css/style.css", 
//                     "./assets/js/main.js", 
//                     "./images/logo192.png"
//                 ]
//             )
//         })
//     )
// })

// self.addEventListener('fetch', e => {
//     e.respondWith(
//         caches.match(e.request).then(response => {
//            return response || fetch(e.request) 
//         })
//     )
// })