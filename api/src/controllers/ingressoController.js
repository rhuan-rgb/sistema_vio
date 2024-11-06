const connect = require("../db/connect");

function checarDecimal(res, preco){
    if(isNaN(preco)){
        return res.status(400).json({error:"O preço deve ser um número"});
    }
    let precoString = preco.toString();
    precoString = precoString.replace(",", ".")
    if(!(precoString.includes("."))){
        return res.status(400).json({error: "O preço deve ser informado com 2 casas decimais."});
    } else{ 
    const arrayPreco = precoString.split(".");
    if(!(arrayPreco[1].length === 2)){
        return res.status(400).json({error: "O preço deve ser informado com 2 casas decimais."});
    }
    return true;
    }
}

module.exports = class ingressoController {
    static async createIngresso(req, res){
        const {preco, tipo, fk_id_evento} = req.body;

        if(!preco || !tipo || !fk_id_evento){
            return res.status(400).json({error: "Todos os campos devem ser preenchidos", resultados: {preco, tipo, fk_id_evento}}); 
        }

        const query = `INSERT INTO ingresso (preco, tipo, fk_id_evento) VALUES (?, ?, ?);`;

        const values = [preco, tipo, fk_id_evento];

        try{
            // if(checarDecimal(res, preco)){
            //     return null;
            // };

            connect.query(query, values, (err) => {
                if(err){
                    console.log(err);
                    return res.status(500).json({error: "Erro ao criar o ingresso"});
                }
                return res.status(201).json({message: "Ingresso criado com sucesso"});
            });
        } catch(error){
            if(error){
                console.log("Erro ao executar consulta", error);
                return res.status(500).json({erro: "Erro interno do servidor"});
            }
        }
    }

    static async getAllIngresso(req, res){
        const query = `SELECT * FROM ingresso;`;
        try{
            connect.query(query, (err, results) => {
                if(err){
                    console.log(err);
                    return res.status(500).json({error: "Erro ao buscar os ingressos"});
                }
                return res.status(200).json({message: "Todos os ingressos a seguir ", events: results});
            });
        } catch(error){
            if(error){
                console.log("Erro ao executar a query: ", error);
                return res.status(500).json({erro: "Erro interno do servidor"});
            }
        }
    }
    static async updateIngresso(req, res){
        const {id_ingresso, preco, tipo, fk_id_evento} = req.body;

        //validação genérica de todos os atributos
        if(!id_ingresso || !preco || !tipo || !fk_id_evento){
            return res.status(400).json({error: "Todos os campos devem ser preenchidos"}); 
        }

        const query = `UPDATE ingresso SET tipo=?, preco=?, fk_id_evento=? WHERE id_ingresso=?;`;

        const values = [tipo, preco, fk_id_evento, id_ingresso];
        try{
            connect.query(query, values, (err, results) => {
                if(err){
                    console.log(err);
                    return res.status(500).json({error: "Erro ao atualizar o ingresso"});
                }
                if(results.affectedRows === 0){
                    return res.status(400).json({error: "Ingresso não encontrado"});
                }
                return res.status(200).json({message: "Ingresso atualizado com sucesso"});
            });
        } catch(error){
            console.log("Erro ao executar consulta", error);
            return res.status(500).json({erro: "Erro interno do servidor"});
        }
    }

    static async deleteIngresso(req, res){
        const id = req.params.id;
        const query = `DELETE FROM ingresso WHERE id_ingresso = ?;`

        try{
            connect.query(query, id, (err, results) =>{
                if(err){
                    console.log(err);
                    return res.status(500).json({error: "Erro ao deletar o ingresso"});
                }
                if(results.affectedRows === 0){
                    return res.status(404).json({error:"Ingresso não encontrado"});
                }
                return res.status(200).json({message: "Ingresso excluído com sucesso"});
            });
        } catch(error){
            if(error){
                console.log("Erro ao executar a consulta", error);
                res.status(500).json({error: "Erro interno do servidor"});
            }
        }
    }
    
}