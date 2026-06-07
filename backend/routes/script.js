const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getScriptList, getScriptDetail, getScriptsByCategory } = require('../controllers/scriptController');

router.get('/', auth, getScriptList);
router.get('/category/:category', auth, getScriptsByCategory);
router.get('/:id', auth, getScriptDetail);

module.exports = router;
