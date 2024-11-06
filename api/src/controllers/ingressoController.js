const connect = require("../db/connect");

function checarDecimal(res, preco){
    if(isNaN(preco)){
        return res.status(400).json({error:"O preço deve ser um número decimal"});
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

        const values = {preco, tipo, fk_id_evento};

        const query = `INSERT INTO ingresso (preco, tipo, fk_id_evento) VALUES (?, ?, ?);`;
        try{
            if(checarDecimal(res, preco)){
                return null;
            };

            connect.query(query, values, (err, results) => {
                if(err){
                    console.log(err);
                    return res.status(500).json({error: "Erro ao criar o ingresso"});
                }
                return res.status(201).json({message: "Ingresso criado com sucesso", ingresso: results});
            });
        } catch(error){
            if(error){
                console.log("Erro ao executar consulta", error);
                return res.status(500).json({erro: "Erro interno do servidor"});
            }
        }
    }
}