import express from 'express';
import controller from '../controllers/accountController.js';

export const route = express();

route.put('/account/fixbalance/:agencia/:conta', controller.fixbalance);

route.patch('/account/deposit/', controller.deposit);
route.patch('/account/withdraw/', controller.withdraw);
route.patch('/account/transfer/', controller.transfer);

route.delete('/account/remove/', controller.remove);

route.get('/account/checkbalance/:agencia/:conta', controller.checkbalance);
route.get('/account/avgbalance/:agencia', controller.avgbalance);
route.get('/account/topbybalancelowest/:limit', controller.topbybalancelowest);
route.get('/account/topbybalancehighest/:limit', controller.topbybalancehighest);
route.get('/account/transfertoprivate/', controller.transfertoprivate);