const API_URL = "http://127.0.0.1:5000";
let telaAtual = "ultimos";

async function registrarFilme() {
    const titulo = document.getElementById("titulo").value;
    const diretor = document.getElementById("diretor").value;
    const ano = parseInt(document.getElementById("ano").value);
    const nota = document.querySelector('input[name="nota"]:checked')?.value;

    const filme = { titulo, diretor, ano };
    if (nota !== undefined) filme.nota = parseInt(nota);

    const response = await fetch(API_URL + "/filme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filme)
    });

    if (response.ok) {
        alert("Filme registrado com sucesso!");
        document.getElementById("titulo").value = "";
        document.getElementById("diretor").value = "";
        document.getElementById("ano").value = "";

        if (telaAtual == "todos") {
            listarTodos();
        } else {
            listarUltimos();
        }
    } else {
        const erro = await response.json();
        alert(erro.erro || erro.message || "Erro ao registrar filme.");
    }
}

async function listarUltimos() {
    telaAtual = "ultimos";
    const response = await fetch(API_URL + "/filmes");
    const filmes = await response.json();
    const ultimos = filmes.slice(-3).reverse();
    const container = document.getElementById("ultimos-filmes");
    container.innerHTML = "";
    ultimos.forEach(filme => {
        const div = document.createElement("div");
        div.className = "filme";
        div.innerHTML = `<strong>${filme.titulo}</strong> (${filme.ano})<br>${filme.diretor} - Nota: ${filme.nota ?? 'N/A'}`;
        container.appendChild(div);
    });
}

async function listarTodos() {
    document.getElementById("btn-listar-todos").style.display = "none";
    document.getElementById("h-ultimos-filmes").style.display = "none";
    document.getElementById("h-filmes-registrados").style.display = "block"; 
    document.getElementById("btn-voltar").style.display = "inline"; 
    document.getElementById("ultimos-filmes").style.display = "none";
    document.getElementById("todos-filmes").style.display = "block";
    telaAtual = "todos";



    const response = await fetch(API_URL + "/filmes");
    const filmes= await response.json();
    const container = document.getElementById("todos-filmes");
    container.innerHTML = "";
    filmes.forEach(filme => {
        const div = document.createElement("div");
        div.className = "filme";
        div.innerHTML = `
        <strong>${filme.titulo}</strong> (${filme.ano})<br>
        ${filme.diretor}<br>Nota: ${filme.nota ?? 'N/A'}<br><br>
        <button class="btn-editar" onclick="editarFilme('${filme.titulo}', '${filme.diretor}', ${filme.ano})">Editar</button>
        <button class="btn-deletar" onclick="deletarFilme('${filme.titulo}')">Deletar</button>
`;
        container.appendChild(div);
    });
}

async function listarFilme() {
    document.getElementById("btn-listar-todos").style.display = "none";
    document.getElementById("h-ultimos-filmes").style.display = "none";
    document.getElementById("btn-voltar").style.display = "inline"; 
    document.getElementById("ultimos-filmes").style.display = "none";
    document.getElementById("todos-filmes").style.display = "block";
    telaAtual = "ultimos";

    const titulo = document.getElementById("informar-titulo").value;

    const url = `${API_URL}/filme?titulo=${encodeURIComponent(titulo)}`;
    const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
        alert("Filme não encontrado!");
        return;
    }
    document.getElementById("informar-titulo").value = "";
    const filme = await response.json();
    const container = document.getElementById("todos-filmes");
    container.innerHTML = "";

    const div = document.createElement("div");
    div.className = "filme";
    div.innerHTML = `
        <strong>${filme[0].titulo}</strong> (${filme[0].ano})<br>
        ${filme[0].diretor}<br>Nota: ${filme[0].nota ?? 'N/A'}<br><br>
        <button class="btn-editar" onclick="editarFilme('${filme[0].titulo}', '${filme[0].diretor}', '${filme[0].ano}')">Editar</button>
        <button class="btn-deletar" onclick="deletarFilme('${filme[0].titulo}')">Deletar</button>
    `;
    container.appendChild(div);
}



async function deletarFilme(titulo) {
    if (!confirm(`Deseja realmente deletar o filme: ${titulo}?`)) return;
    const response = await fetch(API_URL + "/filme/" + encodeURIComponent(titulo), { method: "DELETE" });
    if (response.ok) {
        alert("Filme deletado.");
        listarTodos();
        listarUltimos();
    } else {
        const erro = await response.json();
        alert(erro.erro || "Erro ao deletar filme.");
    }
}

function voltarParaUltimos() {
    document.getElementById("btn-voltar").style.display = "none";
    document.getElementById("btn-pesquisar").style.display = "inline";
    document.getElementById("btn-listar-todos").style.display = "inline";
    document.getElementById("h-filmes-registrados").style.display = "none"; 
    document.getElementById("h-ultimos-filmes").style.display = "inline";

    document.getElementById("todos-filmes").style.display = "none";
    document.getElementById("ultimos-filmes").style.display = "block";
    telaAtual = "ultimos";
}

function editarFilme(titulo, diretor, ano) {
    const container = document.getElementById("todos-filmes");
    container.innerHTML = "";

    const div = document.createElement("div");
    div.className = "filme"; 
    div.innerHTML = `
        <strong>${titulo}</strong> (${ano})<br>
        ${diretor}<br><br>
        <div class="checkbox-nova-nota">
        <label>Nota:</label>
            <div id="novas-notas">
                <label><input type="radio" name="nota" value="0">0</label>
                <label><input type="radio" name="nota" value="1">1</label>
                <label><input type="radio" name="nota" value="2">2</label>
                <label><input type="radio" name="nota" value="3">3</label>
                <label><input type="radio" name="nota" value="4">4</label>
                <label><input type="radio" name="nota" value="5">5</label>
                    </div>
                    </div><br>
        
        <button class="btn-salvar" onclick="salvarFilme('${titulo}')">Salvar</button>
        <button class="btn-deletar" onclick="deletarFilme('${titulo}')">Deletar</button>
    `;
    container.appendChild(div);
}

async function salvarFilme(titulo) {
    const notanova = document.querySelector('input[name="nota"]:checked')?.value;
    const response = await fetch(API_URL + "/filme/" + encodeURIComponent(titulo), {
            method: "PATCH",
            headers: {
            "Content-Type": "application/json"
        },
  body: JSON.stringify({ nota: notanova }) 
});
    if (response.ok) {
        alert("Nota registrada com sucesso!.");
        listarTodos();
        listarUltimos();
    } else {
        const erro = await response.json();
        alert(erro.erro || "Erro ao atualizar filme.");
        listarTodos();
        listarUltimos();
    }
}

listarUltimos();
