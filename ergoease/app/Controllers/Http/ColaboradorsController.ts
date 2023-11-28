import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
import Database from '@ioc:Adonis/Lucid/Database'
import Env from '@ioc:Adonis/Core/Env'
import jwt from 'jsonwebtoken' 

const axios = require('axios');


export default class ColaboradorsController {

    //Usuário Adm solicita todos os colaboradores (não retorna aqueles que estão desativados)
    public async SelecionaColaboradores({response}:HttpContextContract){
       try {
        const users = await Database
        .from('colaboradores')
        .where('deletado',false) 
        .select('nome_completo','email','departamento','matricula')
        
        response.ok({
            response: users}) 
       } catch (error) {
        response.unauthorized({
            response:'Erro ao pesquisar'})
       }
        
    }

    //Usuário Adm Insere um novo colaborador no sistema
    public async InsereColaborador({request, response}:HttpContextContract) {
        const data = request.body()
        try {
            await Database
            .table('colaboradores') 
            .insert({ 
                nome_completo : data.nome_completo,
                senha: await Hash.make(data.senha),
                email: data.email,
                deletado: false,
                departamento: data.departamento 
            })

            response.ok({
                response : data })
        } catch (error) {
            response.unauthorized({
                response:'Erro ao inserir colaborador'})
        }
    }

    //Usuário Adm altera dados do colaborador
    public async AlteraDadosDoColaborador({request,response}:HttpContextContract){
        const data = request.body()
        try {
            await Database
            .query()
            .from('colaboradores')
            .where('matricula', data.matricula)
            .update({ 
                nome_completo : data.nome_completo,
                email: data.email,
                departamento: data.departamento 
            })
            response.ok({
                response : "Dados alterados"
            })
        } catch (error) {
            response.unauthorized({
                response: 'Erro ao atualizar dados'})
        }
        
    }

    //Usuário Adm desativa colaborador
    public async DesativaColaborador({request, response}:HttpContextContract){
        const data = request.body()
        try {
            await Database
            .query()
            .from('colaboradores')
            .where('matricula', data.matricula)
            .update({ 
                deletado: true,
            })
            response.ok({
                response: 'Colaborador deletado'
            })
        } catch (error) {
            response.unauthorized({
                response: 'Erro ao excluir'})
        }
        
    }

    //Login Colaborador e usuário Adm
    public async Login({request,response}:HttpContextContract){
        const data = request.body()
        try{
            var dados = await Database
                .query()
                .from('colaboradores')
                .where('email', data.email)
                .select('senha','matricula','nome_completo')

            if (await Hash.verify(String(dados[0].senha),data.senha)){
                const token = jwt.sign({
                        userId: dados[0].matricula,
                        userName: dados[0].nome_completo
                       }, Env.get('JWT_PASSWORD'));
                return { token: token }
            }
        }catch(error){
            response.unauthorized()
        }
    }

    //Colaborador logado solicita a troca de senha
    public async AlteraSenha({request, response, params}:HttpContextContract){
        const data = request.body()
        const dadosUsuario = params.userData //Aqui retorna o payload

        var hashSenha = await Database
        .query()
        .from('colaboradores')
        .where('matricula', dadosUsuario.userId)
        .select('senha')
        console.log(hashSenha)
        try {
            if (await Hash.verify(hashSenha[0].senha,data.senha)){
                response.forbidden({response:'Senha igual a atual'})
            }else{
                await Database
                .query()
                .from('colaboradores')
                .where('matricula', dadosUsuario.userId)
                .update({ 
                    senha: await Hash.make(data.senha),
                })  
                response.ok({response:'Senha alterada'})
            }
        } catch (error) {
            console.log(error)
            response.unauthorized({
                response: 'Erro ao alterar senha'})
        }
    }

    //Colaborador solicita seus dados de cadastro
    public async CadastroColaborador({params, response}:HttpContextContract){
        const data = params.userData        
        try{
            const user = await Database
                .query()
                .from('colaboradores')
                .where('matricula', data.userId)
                .select('nome_completo','email','departamento','criado_em')
            response.ok({
                response: user
            }) 
        } catch (error){
            response.unauthorized({
                response:'Erro ao obter cadastro'})
        }
    }

    //Usuario esqueceu a senha
    public async EsqueciSenha({request,response}:HttpContextContract){
        const data = request.body()
        try{
            var dados = await Database
                .query()
                .from('colaboradores')
                .where('email', data.email)
                .select('email', 'nome_completo')

            //return dados

            if (data.email == dados[0].email){
                const token = jwt.sign({
                        userId: dados[0].matricula,
                        userName: dados[0].nome_completo
                       }, Env.get('JWT_PASSWORD'))

                axios.post('http://localhost:8000/recuperarSenha', {nome: dados[0].nome_completo, email: dados[0].email, token: token})
                      .then(function (response) {

                        console.log(response.data)
                        //return response.data
                        return JSON.stringify(response.data)

                      })
                      .catch(function (error) {
                        console.error(error)
                        return error
                      });
                //return {email: dados[0].email, token: token }
            }
        }catch(error){
            response.unauthorized()
        }
    }

    //Login empresa
    public async LoginEmpresa({request,response}:HttpContextContract){
        const data = request.body()
        try{
            var dados = await Database
                .query()
                .from('empresas')
                .where('email', data.email)
                .select('senha','nome_empresa', 'cnpj')

            if (await Hash.verify(String(dados[0].senha),data.senha)){
                const token = jwt.sign({
                        userId: dados[0].cnpj,
                        userName: dados[0].nome_empresa
                       }, Env.get('JWT_PASSWORD'));
                return { dados, token: token }
            }
        }catch(error){
            response.unauthorized()
        }
    }

    //Usuário Adm solicita todos os colaboradores da empresa (não retorna aqueles que estão desativados)
    public async SelecionaColaboradoresDaEmpresa({response, params}:HttpContextContract){

        const dadosEmpresa = params.userData //Aqui retorna o payload

        try {
            const users = await Database
            .from('colaboradores')
            //.where('deletado',false) 
            .whereIn(['deletado', 'cnpj_empresa'], [[false, dadosEmpresa.userId]])
            .select('nome_completo','email','departamento','matricula')
            
            response.ok({
                response: users}) 
        } catch (error) {
            response.unauthorized({
                response:'Erro ao pesquisar'})
        }
            
        }


    //Empresa altera seus proprios dados
    public async AlteraDadosEmpresa({request, response, params}:HttpContextContract){
        const data = request.body()
        const dadosEmpresa = params.userData //Aqui retorna o payload

        try {
            await Database
            .query()
            .from('empresas')
            .where('cnpj', dadosEmpresa.userId)
            .update({ 
                senha: data.senha,
                telefone: data.telefone
            })  
            response.ok({response:'Dados alterados'})
        }
        catch (error) {
            console.log(error)
            response.unauthorized({
                response: 'Erro ao alterar dados'})
        }
    }

    //Colaborador escreve o feedback
    public async Feedback({params, response, request}:HttpContextContract){
        const dados = request.body()
        const data = params.userData        
        try{
            const feedback = await Database
                .table('feedback')
                .insert({
                    matricula_colaborador: data.userId,
                    comentario: dados.comentario
                })
            response.ok({
                response: feedback
            }) 
        } catch (error){
            response.unauthorized({
                response:'Erro ao cadastrar feedback'})
        }
    }

    //Empresa consulta todos os feedbacks
    public async ConsultaFeedback({response, params}: HttpContextContract){
        const dadosEmpresa = params.userData

        try{
            const feedback = await Database
                .from('feedback')
                .innerJoin('colaboradores', 'feedback.matricula_colaborador', '=', 'colaboradores.matricula')
                .join('empresas', 'colaboradores.cnpj_empresa', '=', 'empresas.cnpj')
                .where('empresas.cnpj', dadosEmpresa.userId)
                .select('colaboradores.nome_completo', 'feedback.comentario', 'empresas.nome_empresa')
            response.ok({
                response: feedback
            }) 
        } catch (error){
            response.unauthorized({
                response:'Erro ao obter feedback'})
        }

    }

    //Envia email para empresa que solicitou orçamento
    public async Orcamento({request,response}:HttpContextContract){
        const data = request.body()

        console.log(data)
        
        try{

            axios.post('http://localhost:8000/orcamento', {nome: data.name, email: data.email})
                    .then(function (response) {

                    console.log("Retorno servidor: " + response.data)
                    console.log("Tipo: " + typeof(response.data))

                    let retorno = "Sucesso"

                    return retorno
                    return JSON.stringify(response.data)

                    })
                    .catch(function (error) {
                    console.error(error)
                    return error
                    });
            //return {email: dados[0].email, token: token }
            
        }catch(error){
            response.unauthorized()
        }
    }

    //Cadastro da empresa
    public async CadastroEmpresa({request, response}:HttpContextContract) {
        const data = request.body()

        console.log(data)

        try {
            await Database
            .table('empresas') 
            .insert({ 
                cnpj : data.cnpj,
                senha: await Hash.make(data.password),
                email: data.email,
                nome_empresa: data.fantasyName,
                telefone: data.phoneNumber,
                cidade: data.city,
                rua: data.street,
                cep: data.cep,
                numero: data.number,
                estado: data.state, 
                bairro: data.neighborhood
            })

            response.ok({
                response : 'Empresa cadastrada' + data })
        } catch (error) {
            response.unauthorized({
                response:'Erro ao inserir colaborador' + error})
        }
    }

    //Esqueci senha empresa
    public async EsqueciSenhaEmpresa({request,response}:HttpContextContract){
        const data = request.body()

        try{
            var dados = await Database
                .query()
                .from('empresas')
                .where('email', data.email)
                .select('email', 'nome_empresa')

            if (data.email == dados[0].email){
                const token = jwt.sign({
                        userId: dados[0].matricula,
                        userName: dados[0].nome_empresa
                       }, Env.get('JWT_PASSWORD'))

                axios.post('http://localhost:8000/recuperarSenha', {nome: dados[0].nome_empresa, email: dados[0].email, token: token})
                      .then(function (response) {

                        console.log(response.data)
                        //return response.data
                        return JSON.stringify(response.data)

                      })
                      .catch(function (error) {
                        console.error(error)
                        return error
                      });
                return {email: dados[0].email, token: token }
            }
        }catch(error){
            response.unauthorized()
        }
    }

}
