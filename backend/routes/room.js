const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getRoomList,
  createRoom,
  joinRoom,
  toggleReady,
  startGame,
  leaveRoom,
  getRoomMessages
} = require('../controllers/roomController');
const {
  getMyRole,
  sendVote,
  getVotes,
  endGame
} = require('../controllers/gameController');

router.get('/', auth, getRoomList);
router.post('/', auth, createRoom);
router.post('/:id/join', auth, joinRoom);
router.post('/:id/ready', auth, toggleReady);
router.post('/:id/start', auth, startGame);
router.post('/:id/leave', auth, leaveRoom);
router.get('/:id/messages', auth, getRoomMessages);

router.get('/:id/role', auth, getMyRole);
router.post('/:id/vote', auth, sendVote);
router.get('/:id/votes', auth, getVotes);
router.post('/:id/end', auth, endGame);

module.exports = router;
