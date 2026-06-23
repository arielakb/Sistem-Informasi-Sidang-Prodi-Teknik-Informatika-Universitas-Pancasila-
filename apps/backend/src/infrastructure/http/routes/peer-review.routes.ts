import { Router, IRouter } from 'express';
import { PeerReviewController } from '../controllers/PeerReviewController';

const router: IRouter = Router();

router.get('/', PeerReviewController.list);
router.post('/', PeerReviewController.submit);

export default router;
