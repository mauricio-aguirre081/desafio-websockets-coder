const socket = io.connect();

socket.on('messages', (data) =>{
    render(data)
});



function render(data) {
	const fechayhora= new Date();
	const ahora = fechayhora.toLocaleString();
	const html = data
		.map((elemento) => {
			return `<div>
                <p><strong style="color: blue;">${elemento.email}</strong>:
				<span style="color: brown;">${ahora}</span>
                <span style=" color: green; font-style: italic;">${elemento.mensaje}</span></p>
				</div> `;
		})
		.join(" ");
	document.getElementById("mensajes").innerHTML = html;
}

function addMessage(e) {
	const mensaje = {
		author: document.getElementById("username").value,
		text: document.getElementById("texto").value,
	};

	socket.emit("new-message", mensaje);
	return false;
}

function addLista() {

}