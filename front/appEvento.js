document
  .getElementById("form-selecao-data")
  .addEventListener("submit", testeCalendario);

  function testeCalendario(event){
    //Previne o comportamento padrao do formulário, ou seja, impede que ele seja enviado e recarregue a página
    event.preventDefault();

    const data_recebida = document.getElementById('data').value;

    if(data_recebida){
      console.log("Data recebida:", data_recebida);
      data_array = data_recebida.split("-");
      alert("A data selecionada é: " + data_array[2] + "-" + data_array[1] + "-" + data_array[0]);
    }
    else {
      alert("Por favor, selecione uma data!")
    }

    
  }