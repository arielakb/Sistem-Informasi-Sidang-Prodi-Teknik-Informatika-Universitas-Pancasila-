import { Router, IRouter } from 'express';
import { MKSpesialController } from '../controllers/MKSpesialController';

const router: IRouter = Router();

router.get('/', MKSpesialController.index);
router.post('/', MKSpesialController.create);

export default router;
