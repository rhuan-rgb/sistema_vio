const connect = require("../db/connect");

module.exports = class eventoController {
    //criação de um evento
    static async createEvento(req, res){
        const {nome, descricao, data_hora, local, fk_id_organizador} = req.body;

        //validação genérica de todos os atributos
        if(!nome || !descricao || !data_hora || !local || !fk_id_organizador){
            return res.status(400).json({error: "Todos os campos devem ser preenchidos"}); 
        }

        const query = `INSERT INTO evento (nome, descricao, data_hora, local, fk_id_organizador) VALUES (?, ?, ?, ?, ?);`;

        const values = [nome, descricao, data_hora, local, fk_id_organizador];
        try{
            connect.query(query, values, (err) => {
                if(err){
                    console.log(err);
                    return res.status(500).json({error: "Erro ao criar o evento"});
                }
                return res.status(201).json({message: "Evento criado com sucesso"});
            });
        } catch(error){
            console.log("Erro ao executar consulta");
            return res.status(500).json({erro: "Erro interno do servidor"});
        }
    }

    //VIsualizar todos os eventos cadastrados
    static async getAllEventos(req, res){
        const query = `SELECT * FROM evento;`;
        try{
            connect.query(query, (err, results) => {
                if(err){
                    console.log(err);
                    return res.status(500).json({error: "Erro ao buscar os eventos"});
                }
                return res.status(200).json({message: "Todos os eventos a seguir ", events: results});
            });
        } catch(error){
            if(error){
                console.log("Erro ao executar a query: ", error);
                return res.status(500).json({erro: "Erro interno do servidor"});
            }
        }
    }

    static async updateEvento(req, res){
        const {nome, descricao, data_hora, local, fk_id_organizador, id_evento} = req.body;

        //validação genérica de todos os atributos
        if(!nome || !descricao || !data_hora || !local || !fk_id_organizador || !id_evento){
            return res.status(400).json({error: "Todos os campos devem ser preenchidos"}); 
        }

        const query = `UPDATE evento SET nome=?, descricao=?, data_hora=?, local=?, fk_id_organizador=? WHERE id_evento=?;`;

        const values = [nome, descricao, data_hora, local, fk_id_organizador, id_evento];
        try{
            connect.query(query, values, (err, results) => {
                if(err){
                    console.log(err);
                    return res.status(500).json({error: "Erro ao atualizar o evento"});
                }
                if(results.affectedRows === 0){
                    return res.status(400).json({error: "Evento não encontrado"});
                }
                return res.status(200).json({message: "Evento atualizado com sucesso"});
            });
        } catch(error){
            console.log("Erro ao executar consulta", error);
            return res.status(500).json({erro: "Erro interno do servidor"});
        }
    }

    static async deleteEvento(req, res){
        const idEvento = req.params.id;
        const query = `DELETE FROM evento WHERE id_evento = ?;`

        try{
            connect.query(query, idEvento, (err, results) =>{
                if(err){
                    console.log(err);
                    return res.status(500).json({error: "Erro ao deletar o evento"});
                }
                if(results.affectedRows === 0){
                    return res.status(404).json({error:"Evento não encontrado"});
                }
                return res.status(200).json({message: "Evento excluído com sucesso"});
            });
        } catch(error){
            if(error){
                console.log("Erro ao executar a consulta", error);
                res.status(500).json({error: "Erro interno do servidor"});
            }
        }
    }

    static async getEventosPorData(req, res){
        const query = `SELECT * FROM evento;`;

        try{
            connect.query(query, (err, results) => {
                if(err){
                    console.log(err);
                    return res.status(500).json({error: "erro ao buscar eventos"});
                }
                const dataEvento = new Date(results[0].data_hora);
                const dia = dataEvento.getDate();
                const mes = dataEvento.getMonth()+1;
                const ano = dataEvento.getFullYear();
                console.log(dia+'/'+mes+'/'+ano);

                const dataEvento2 = new Date(results[1].data_hora);
                const dia2 = dataEvento2.getDate();
                const mes2 = dataEvento2.getMonth()+1;
                const ano2 = dataEvento2.getFullYear();
                console.log(dia2+'/'+mes2+'/'+ano2);

                const dataEvento3 = new Date(results[2].data_hora);
                const dia3 = dataEvento3.getDate();
                const mes3 = dataEvento3.getMonth()+1;
                const ano3 = dataEvento3.getFullYear();
                console.log(dia3+'/'+mes3+'/'+ano3);

                const now = new Date();
                const eventosPassados = results.filter(evento => new Date(evento.data_hora) < now);
                const eventosFuturos = results.filter(evento => new Date(evento.data_hora) >= now);

                const diferencaMs = eventosFuturos[0].data_hora.getTime() - now.getTime();
                const dias = Math.floor(diferencaMs/(1000*60*60*24));
                const horas = Math.floor((diferencaMs%(1000*60*60*24))/(1000*60*60));
                console.log(diferencaMs,'Falta:'+dias+'dias e '+horas+'horas');

                //comparando datas
                const dataFiltro = new Date('2024-12-15').toISOString().split('T');

                const eventosDia = results.filter(evento => new Date (evento.data_hora).toISOString().split('T')[0] === dataFiltro[0]);

                console.log("Eventos: ", eventosDia);
                

                console.log(diferencaMs);
                
                return res.status(200).json({message: 'ok', eventosFuturos, eventosPassados});

                
            });
        } catch(error){
            console.log(err);
            return res.status(500).json({error: "erro ao buscar eventos"});
        }
        
        
    }

    static async evento7dias(req, res){
        const data = req.params.data
        const query = `SELECT data_hora FROM evento`;

        try{
            connect.query(query, (err, results) => {
                if(err){
                    console.log(err);
                    return res.status(500).json({error: "erro ao buscar eventos"});
                }
                let data_evento = new Date(results);
                // console.log(results, typeof(results));
                data_evento = results.toISOString().split('T');
                const dia = data_evento.getDate();
                
            });
        } catch {

        }
    }
}