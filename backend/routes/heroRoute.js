import express from 'express';
import multer from 'multer';
import { addHeroSlide, getHeroSlides, deleteHeroSlide, updateHeroSlide } from '../controllers/heroController.js';

const router = express.Router();

const storage = multer({ dest: 'uploads/' });
const upload = storage.single('image');

router.post('/add', upload, addHeroSlide);
router.get('/all', getHeroSlides);
router.delete('/delete/:id', deleteHeroSlide);
router.put('/update/:id', upload, updateHeroSlide);

export default router;
