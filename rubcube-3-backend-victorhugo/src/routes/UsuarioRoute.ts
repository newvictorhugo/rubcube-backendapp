import { Router } from 'express';
import UsuarioController from 'controllers/UsuarioController';
import { validandoUsuario } from 'middlewares/UsuarioAuth';
import { autenticarAuth } from 'middlewares/autenticarUsuario';


const routes = Router();
const userController = new UsuarioController();

routes.post('/create', validandoUsuario, userController.create);
routes.get('/tudo', userController.getAll)
routes.post('/cpf', autenticarAuth, userController.getCPF)
routes.get('/', autenticarAuth, userController.get);
routes.put('/:id', userController.update);
routes.delete('/:id', userController.delete);//autenticarAuth //*COLOCAR DEPOIS
routes.post('/login', userController.login)

export default routes;

