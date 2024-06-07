import { Router } from 'express';
import ContaBancariaController from 'controllers/ContaBController';
import { criandoNumConta, validandoContaBanc } from 'middlewares/ContaAuth';
import { autenticarAuth } from 'middlewares/autenticarUsuario';

const routes = Router();
const contaBController = new ContaBancariaController

routes.post('/create', autenticarAuth, validandoContaBanc, criandoNumConta, contaBController.create);
routes.get('/tudo', contaBController.getAll)
routes.get('/', autenticarAuth, contaBController.get);
routes.post('/numConta', autenticarAuth, contaBController.getNumConta);
routes.get('/saldo', autenticarAuth, contaBController.getSaldo);
routes.post('/saldo/validar', autenticarAuth, contaBController.getSaldoValidar);
routes.post('/senhaTrans/validar', autenticarAuth, contaBController.getSenhaTransValidar);
routes.put('/:id', autenticarAuth, contaBController.update);
routes.delete('/:id', autenticarAuth, contaBController.delete);

export default routes;