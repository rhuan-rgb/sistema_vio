const connect = require("../db/connect");

module.exports = async function validateCPF(cpf) {
  const query = "SELECT id_usuario FROM usuario WHERE cpf=?";
  const values = [cpf];

  await connect.query(query, values, (err, results) => {
    if (err) {
      //Fazer algo



    } else if (results.length > 0) {
      const cpfCadastrado = results[0].id_usuario;

      if (userId && cpfCadastrado !== userId) {
        return { error: "CPF já cadastrado para outro usuário" };
      } else if (!userId) {
        return { error: "CPF já cadastrado" };
      }
    } else {
      return null;
    }
  });
};
