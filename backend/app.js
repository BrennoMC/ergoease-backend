
function BD(){
    this.getConexao = async function () {
        if (connection) return connection;  
        const mysql      = require('mysql'); 
       
            var connection = await mysql.createConnection({
            host     : 'us-cdbr-east-06.cleardb.net',
            user     : 'ba22761bd77f18',
            password : '843e35b3',
            database : 'heroku_3b513f8347c686c'
        }); 
        connection.connect(function(err){
            if (err) throw err;
            console.log("Connected")
        })
        return connection;
    }

    this.estrutureBD = async function (){
        try{
            const conexao = await this.getConexao()
            const sql =
            'CREATE TABLE TESTE (TESTE1 mediumint, TESTE2 date);'
            await conexao.query(sql);
      
            const commit = "COMMIT";
            await conexao.query(commit);
        }
        catch(erro){
            console.log("Erro ao criar tabela")
        }  
    }
}
function middleWareGlobal(req, res, next) {
    console.time("Requisição"); 
    console.log("Método: " + req.method + "; URL: " + req.url); 
    next(); 
  
    console.log("Finalizou"); 
  
    console.timeEnd("Requisição"); 
  }
  async function ativacaoBackend() {
    const bd = new BD();
    await bd.estrutureBD();
  
    const express = require("express");
    const app = express();
    const cors = require("cors");
  
    app.use(express.json()); 
    app.use(cors()); 
    app.use(middleWareGlobal); 
  
    //app.post("/rota", funcao);
  
    console.log("Servidor ativo na porta 3000...");
    app.listen(3000);
  } 
  
  ativacaoBackend();
