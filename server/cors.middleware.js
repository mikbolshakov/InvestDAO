/* CORS это механизм безопасности, который позволяет ресурсу с одного домена обращаться на другой.
Ниже разрешаем доступ к апи других доменов, 
создав middleware (это промежуточное звено, которое позволяет отправлять любые виды запросов с любых доменов) */

// function cors(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
//     res.header("Access-Control-Allow-Headers", "Content-Type");
//     next();
// }

// export default cors