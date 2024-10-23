// //Acessa o objeto"document" que representa a página html
// //Seleciona o elemento com o id indicado do formulário


// Chamada da função "createUser" para associação ao evento de envio do formulário
document
  .getElementById("formulario-registro")
  .addEventListener("submit", createUser);

//adiciona o ouvinte de evento (submit) para capturar o envio do formulário
document.addEventListener("DOMContentLoaded", getAllUsers);



function createUser(event) {
  //previne o comportamento padrão do formulário, ou seja, impede que ele seja enviado e recarreguea página.
  event.preventDefault();

  //captura os valores dos campos do formulário

  const name = document.getElementById("nome").value;
  const cpf = document.getElementById("cpf").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("senha").value;

  //requisição HTTP para o endpoint de cadastro de usuário.
  fetch("http://10.89.240.105:5000/api/v1/user", {
    //realiza uma chamada http para o servidor (a rota definida)
    method: "POST",
    headers: {
      //a requisição será em formato JSON
      "Content-Type": "application/json",
    },
    //transforma os dados do formulário em uma string JSON para serem enviados no corpo da requisição
    body: JSON.stringify({ name, cpf, password, email }),
  })
    .then((response) => {
      //tratamento da resposta do servidor / API
      if (response.ok) {
        //verifica se a resposta foi bem sucedida (status 2xx {200 alguma coisa})
        return response.json();
      }
      //convertendo o erro em formato json
      return response.json().then((err) => {
        //Mensagem retornada do servidor, acessada pela chave "error"
        throw new Error(err.error);
      });
    }) //fechamento da then(response)
    .then((data) => {
      //Executa a resposta de sucesso - retorna ao usuário final
      //exibe um alerta para o usuário final(front) com o nome do usuário que acabou de ser cadastrado
      alert(data.message);
      console.log(data.message);

      //Exibe o log no terminal
      console.log("Usuario criado: ", data.user);

      //reseta os campos do formulário após o sucesso do cadastro
      document.getElementById("formulario-registro").reset();
    })
    .catch((error) => {
      //captura qualquer erro que ocorra duante o processo de requisição / resposta
      //Exibe alerta (front) com o erro processado
      alert("erro no cadastro: " + error.message);

      console.error("Erro:", error.message);
    });
} //fechamento do createUser

function getAllUsers() {
  fetch("http://10.89.240.105:5000/api/v1/user", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      return response.json().then((err) => {
        throw new Error(err.error);
      });
    })
    .then((data) => {
      const userList = document.getElementById("user-list");
      userList.innerHTML = ""; // Limpa a lista existente

      data.users
        .forEach((user) => {
          const listItem = document.createElement("li");
          listItem.textContent = `Nome: ${user.name}, CPF: ${user.cpf}, Email:${user.email}`;
          userList.appendChild(listItem);
        })
    })
    .catch((error) => {
      alert("Erro ao obter usuários " + error.message);
      console.error("Erro: ", error.message);
    });
}
