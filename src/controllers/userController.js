const connect = require("../db/connect");
const validateUser = require("../services/validateUser");
const validateCPF = require("../services/validateCPF");

module.exports = class userController {
  static async createUser(req, res) {
    const { cpf, email, password, name, data_nascimento } = req.body;

    const validationError = validateUser(req.body);

    if(validationError){
      return res.status(400).json(validationError);
    }
    
    const cpfValidation = await validateCPF(cpf, null);
    if(cpfValidation){
      return res.status(400).json(cpfValidation)
    }

    // Construção da query INSERT
    const query = `INSERT INTO usuario (cpf, password, email, name, data_nascimento) VALUES ('${cpf}', '${password}', '${email}', '${name}', '${data_nascimento}')`;
    //executando a query criada
    try {
      connect.query(query, function (err, results) {
        if (err) {
          console.log(err);
          console.log(err.code);
          if (err.code === "ER_DUP_ENTRY") {
            return res
              .status(400)
              .json({ error: "O email já está vinculado a outro usuário" });
          } else {
            return res.status(500).json({
              error: "erro interno do servidor :(",
            });
          }
        } else {
          return res
            .status(201)
            .json({ message: "Usuário cadastrado com sucesso" });
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getAllUsers(req, res) {
    const query = `SELECT * FROM usuario`;
    try {
      connect.query(query, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }
        return res
          .status(200)
          .json({ message: "Lista de usuários", users: results });
      });
    } catch (error) {
      console.error("Erro ao executar consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async updateUser(req, res) {
    //Desestrutura e recupera os dados enviados via corpo da requisição
    const { id, cpf, email, password, name, data_nascimento } = req.body;

    const validation = validateUser(req.body);
    if(validation){
      return res.status(400).json(validation);
    }

    const cpfValidation = await validateCPF(cpf, id);
    if(cpfValidation){
      return res.status(400).json(cpfValidation)
    }

    const query = `UPDATE usuario SET name=?,password=?,email=?,cpf=?, data_nascimento=? WHERE id_usuario=?`;
    const values = [name, password, email, cpf, data_nascimento, id];
    try {
      connect.query(query, values, function (err, results) {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res
              .status(400)
              .json({ error: "Email já cadastrado por outro usuário" });
          } else {
            console.error(err);
            return res.status(500).json({ error: "Erro interno do servidor" });
          }
        }
        if (results.affectedRows === 0) {
          return res.status(400).json({
            message: "Usuário não encontrado",
          });
        }
        return res
          .status(200)
          .json({ message: "Usuário atualizado com sucesso" });
      });
    } catch (error) {
      console.error("Erro ao executar consulta", error);
    }
  }

  static async deleteUser(req, res) {
    //Obtém o parametro 'id' da requisição, que é o cpf de user a ser deletado
    const userId = req.params.id;
    const query = `DELETE FROM usuario WHERE id_usuario = ?`;
    const values = [userId];
    try {
      connect.query(query, values, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({
            error: "Erro interno do servidor",
          });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({
            error: "Usuário não encontrado",
          });
        }
        return res.status(200).json({
          message: "Usuário excluído com sucesso",
        });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
  static async loginUser(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    const query = `SELECT * FROM usuario WHERE email = ?`;

    try {
      connect.query(query, [email], (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }
        if (results.length === 0) {
          return res.status(404).json({ error: "Usuário não encontrado" });
        }

        const user = results[0];

        if (user.password != password) {
          return res.status(403).json({ error: "Senha incorreta" });
        }

        return res.status(200).json({ message: "Login bem sucedido", user });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
};
