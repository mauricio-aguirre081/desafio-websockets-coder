const express = require('express')

const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

const handlebars = require("express-handlebars");

const fs = require('fs');

//----------------RUTAS-----------------------
const Productos = require('./api/productos.js');


let productos = new Productos();

/* app.listen(port, () => {
    console.log(`Handlebars app escuchando en puerto ${port}`)
}) */

app.engine(
    "hbs",
    handlebars.engine({
        extname: ".hbs",
        defaultLayout: "index.hbs"
    })
);
app.set("view engine", "hbs");
app.set("views", "public/views");

app.use(express.static("public"));

const router = express.Router();
app.use("/api", router);

router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.get("/productos/listar", (req, res) => {
    res.json(productos.listarAll());
})

router.get("productos/listar/:id", (req, res) => {
    let { id } = req.params;
    res.json(productos.listar(id));
})

router.post("/productos/guardar", (req, res) => {
    let producto = req.body;
    productos.guardar(producto);
    //res.json(producto);
    res.redirect("/");
})

router.put("/productos/actualizar/:id", (req, res) => {
    let { id } = req.params;
    let producto = req.body;
    productos.actualizar(producto, id);
    res.json(producto);
})

router.delete("/productos/borrar/:id", (req, res) => {
    let { id } = req.params;
    let producto = productos.borrar(id);
    res.json(producto);
})

router.get("/productos/vista", (req, res) => {
    let prods = productos.listarAll();

    res.render("vista", {
        productos: prods,
        hayProductos: prods.length,
    });
})


app.use(express.static("public"))
app.get("/", (req, res) => {
    res.sendFile("index.hmtl");
});


const messages = [
    {
        email: "rico@yahoo.com",
        mensaje: "Hola Que tal"
    },
    {
        email: "marria@gmail.com",
        mensaje: "Hola todo bien"
    }
];

io.on('connection', (socket) => {
    console.log("Se conecto un usuario");

    socket.emit('messages', messages);

    socket.on("new-message", (data) =>{
        messages.push(data);
        io.sockets.emit("messages", messages)
    })
})

const connectedServer = httpServer.listen(8080, () => {
    console.log('Servidor en puerto 8080')
})