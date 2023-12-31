/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/pesquisa', 'ColaboradorsController.SelecionaColaboradores').middleware('Auth')
Route.post('/inserecolaborador', 'ColaboradorsController.InsereColaborador').middleware('Auth')
Route.post('/alteracolaborador', 'ColaboradorsController.AlteraDadosDoColaborador').middleware('Auth')
Route.post('/excluicolaborador', 'ColaboradorsController.DesativaColaborador').middleware('Auth')
Route.post('/colaborador/alterarsenha', 'ColaboradorsController.AlteraSenha').middleware('Auth')
Route.post('/colaborador/cadastro','ColaboradorsController.CadastroColaborador').middleware('Auth')
Route.post('/colaborador/EsqueciSenha', 'ColaboradorsController.EsqueciSenha')
Route.post('/login','ColaboradorsController.Login')
Route.post('/loginEmpresa', 'ColaboradorsController.LoginEmpresa')
Route.post('/consultaColaboradores', 'ColaboradorsController.SelecionaColaboradoresDaEmpresa').middleware('Auth')
Route.post('/alteraDadosEmpresa', 'ColaboradorsController.AlteraDadosEmpresa').middleware('Auth')
Route.post('/colaborador/feedback', 'ColaboradorsController.Feedback').middleware('Auth')
Route.post('/feedback', 'ColaboradorsController.ConsultaFeedback').middleware('Auth')
Route.post('/orcamento', 'ColaboradorsController.Orcamento')
Route.post('/cadastroEmpresa', 'ColaboradorsController.CadastroEmpresa')
