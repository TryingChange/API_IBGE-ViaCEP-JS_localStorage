
const cpf = document.getElementById("cpf");
const tel = document.getElementById("tel");
let cadastros = new Array();

/** IBGE */

const apiLinkIBGE = "https://servicodados.ibge.gov.br/api/v1/localidades/estados";
const uf = document.getElementById("uf");
const city = document.getElementById("cidade");

window.onload = function(){ //após baixar a página:
    fetch(apiLinkIBGE)      //baixa lista de estados
        .then(resp => resp.json())  //processa arquivo baixado como JSON
        .then(json => {             //manipula JSON
            json.forEach( function(estado){
                uf.innerHTML += "<option value="+ estado.id +">"+ estado.nome + "</option>";
            })
        })
        preencheTabela();

}

uf.addEventListener("change", function(){
    fetch(apiLinkIBGE + "/" + uf.value )
        .then(resp => resp.json())
        .then(json =>{
            document.getElementById("regiao").value = json.regiao.nome;
        })
    fetch(apiLinkIBGE + "/" + uf.value + "/municipios")
        .then(resp => resp.json())
        .then(json =>{
            document.getElementById("cidade").innerHTML = "<option value='0'>Selecione</option>";
            json.forEach( function(cidade){
                document.getElementById("cidade").innerHTML += 
                    "<option value="+cidade.id+">"+cidade.nome+"</option>";
            })
        })
})

city.addEventListener("change", function(){
    fetch(apiLinkIBGE + "/" + uf.value + "/regiao")
        .then(resp => resp.json())
        .then(json =>{
            document.getElementById("regiao").innerHTML = "<option value='0'>Selecione</option>";
            json.forEach( function(regiao){
                document.getElementById("regiao").innerHTML += 
                    "<option value="+regiao.regiao.id+">"+regiao+"</option>";
            })
        })
})




/* MASCARA DO CPF */

function pontilhaCpf(){
    let numCpf = cpf.value;
    if(numCpf.length === 3 || numCpf.length === 7){
        cpf.value += '.';
    } else if(numCpf.length === 11){
        cpf.value += '-';
    }
}

cpf.addEventListener('keyup', pontilhaCpf);

/* MASCARA DO NUMERO DE TELEFONE */

function pontilhaTel(){
    let numTel = tel.value;
    if(numTel.length == 2){
        tel.value = '('+numTel+') ';
    }
    if(numTel.length == 9){
        tel.value += '-';
    }
    if(numTel.length == 15 && numTel[9] == '-'){
        tel.value = numTel.substring(0,9)+numTel[10]+'-'+numTel.substring(11);
    }
}

tel.addEventListener('keyup', pontilhaTel);


/* CADASTRO  */

function cadastraNovo(){
    const formcad = document.getElementById("form");
    const formData = new FormData(formcad);/*{
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        genero: document.getElementById('gen').value,
        cpf: document.getElementById('cpf').value,
        tel: document.getElementById('tel').value,
        estado: document.getElementById('uf').value,
        regiao: document.getElementById('regiao').value,
        cidade: document.getElementById('cidade').value
    }  */         //cria novo objeto de formulário com dados do HTML
    console.log(formData)
    const formObj = Object.fromEntries(formData);   //cria pares chave/valor para formObj
                                //injeta valores do formulário no fim do array de cadastros na RAM
    console.log(cadastros);
    cadastros.push(formObj);
    localStorage.setItem("cadastro", JSON.stringify(cadastros) ); 
}

function preencheTabela(){
    if(localStorage != ""){    //se o cadastro existe no localStorage
        cadastros = JSON.parse(localStorage.getItem("cadastro"));   //copie cadastro de localStorage para array de cadastros na RAM
    }
	console.log(cadastros);
    
	console.log("wtf");

    document.getElementById("cadastros").innerHTML = "";    //esvazia HTML da tabela (incluir títulos aqui em vez disso)
    let index = 0;      //novo
    cadastros.forEach( function(cadastro){                  //para cada item do array cadastros, crie uma linha de tabela:
        document.getElementById("cadastros").innerHTML += `<tr>
        <td>${cadastro.nome}</td>
        <td>${cadastro.email}</td>
        <td>${cadastro.gen}</td>
        <td>${cadastro.cpf}</td>
        <td>${cadastro.tel}</td>
        <td>${cadastro.uf}</td>
        <td>${cadastro.regiao}</td>
        <td>${cadastro.cidade}</td>

        <td><button onclick="editaCadastro(${index})">Editar</button></td>
        </tr>`
        index++;        //novo
    })
}

document.getElementById("enviaBtn").addEventListener("click", function(event){ //ao clicar em novo cadastro:
    event.preventDefault();         //impeça evento padrão do botão de formulário
    cadastraNovo();                 //coleta dados do formulário e leva ao array de cadastros e localStorage
    preencheTabela();               //redesenha a tabela de cadastros existentes
})

window.onload = function(){ //após baixar a página:
    fetch(apiLinkIBGE)      //baixa lista de estados
        .then(resp => resp.json())  //processa arquivo baixado como JSON
        .then(json => {             //manipula JSON
            json.forEach( function(estado){
                uf.innerHTML += "<option value="+ estado.id +">"+ estado.nome + "</option>";
            })
        })
        preencheTabela();

}