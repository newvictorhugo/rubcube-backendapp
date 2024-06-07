import { Router } from 'express';
import EnderecoController from 'controllers/EnderecoController';
import { validandoEndereco } from 'middlewares/EnderecoAuth';
import { autenticarAuth } from 'middlewares/autenticarUsuario';

const routes = Router();
const endController = new EnderecoController();

routes.post('/create/id', validandoEndereco, endController.create);
routes.post('/create', autenticarAuth, validandoEndereco, endController.create);
routes.get('/', autenticarAuth, endController.getAll);
routes.get('/:id', autenticarAuth, endController.get);
routes.put('/:id', autenticarAuth, endController.update);
routes.delete('/:id', autenticarAuth, endController.delete);

export default routes;