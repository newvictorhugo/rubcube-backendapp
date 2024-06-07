import { Router } from 'express';
import TransferenciaController from 'controllers/TransferenciaController';
import { validandoIdTransferencia, validandoSaldoTransferencia, validandoSenhaTransferencia, validandoTransferencia } from 'middlewares/TransferenciaAuth';
import { autenticarAuth } from 'middlewares/autenticarUsuario';
import ContaBancariaController from 'controllers/ContaBController';

const routes = Router();
const transferenciaController = new TransferenciaController()
const contaBancariaController = new ContaBancariaController()

routes.post('/create/', autenticarAuth, validandoTransferencia, validandoSenhaTransferencia, validandoIdTransferencia, validandoSaldoTransferencia, contaBancariaController.updateSaldoDestinatario, contaBancariaController.updateSaldoRemetente, transferenciaController.create);
routes.get('/', autenticarAuth, transferenciaController.getAllIdConta, transferenciaController.getEachTrans);
routes.get('/detalhado/:id', autenticarAuth, transferenciaController.get);
// routes.delete('/:id', transferenciaController.delete);
routes.get('/entrada/', autenticarAuth, transferenciaController.getEveryEntrada, transferenciaController.getAllEntrada)
routes.get('/saida/', autenticarAuth, transferenciaController.getEverySaida, transferenciaController.getAllSaida)
routes.get('/tudo', transferenciaController.getAll);
routes.put('/:id', transferenciaController.update);

export default routes;