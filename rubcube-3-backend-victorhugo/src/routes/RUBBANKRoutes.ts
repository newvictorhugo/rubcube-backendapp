import { Router } from 'express';
import { autenticarAuth } from 'middlewares/autenticarUsuario';
import RUBBANKController from 'controllers/RUBBANKController';
import { validandoEndereco } from 'middlewares/EnderecoAuth';
import { validandoContaBanc, validandoSenhaTrans } from 'middlewares/ContaAuth';
import { validandoSenhaApp, validandoUsuarioUpdate } from 'middlewares/UsuarioAuth';

const routes = Router();
const rubbankController = new RUBBANKController()


routes.get('/dadosBancarios', autenticarAuth, rubbankController.getDadoBanc);
routes.get('/dadosEndereco', autenticarAuth, rubbankController.getDadoEnd);
routes.put('/alterar/endereco/:id', autenticarAuth, validandoEndereco, rubbankController.putDadoEnd);
routes.put('/alterar/senhaApp', autenticarAuth, validandoSenhaApp, rubbankController.putSenhaApp)
routes.put('/alterar/senhaTransacional', autenticarAuth, validandoSenhaTrans, rubbankController.putSenhaTrans)
routes.put('/alterar/usuario', autenticarAuth, validandoUsuarioUpdate, rubbankController.putUsuario)
routes.post('/dadosBancarios/cpf', autenticarAuth, rubbankController.getDadoUsu)


export default routes;