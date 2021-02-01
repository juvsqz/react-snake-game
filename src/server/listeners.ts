import { Server } from 'socket.io';

import { KEYCODE_DIRECTIONS } from './constants';
import { generateId } from './utils';
import { loopGame, isGameOver, isSinglePlayer, startGame } from './game';
import { cacheStates, cacheRooms } from './cache';
import { GameState } from '../types';

export default (io: Server, socket: any) => {
	const emitRoomDetails = (roomId: string, state: GameState) => {
		io.sockets.in(roomId).emit('room_details', {
			roomId,
			noOfPlayers: state.noOfPlayers,
			connectedPlayers: state.connectedPlayers
		});
	};

	/**
	 * Triggers to continously run the game for a specific room
	 * until in becomes game over.
	 * @param roomId unique id for a specific game
	 */
	function handleRunGame(roomId: string) {
		const intervalId = setInterval(() => {
			const currentGameState = loopGame(cacheStates[roomId]);
			currentGameState.status = true;
			// means no winner yet
			if (!isGameOver(currentGameState)) {
				io.sockets
					.in(roomId)
					.emit('game_state', JSON.stringify(currentGameState));
			} else {
				// Game over, clear the game and emit to end the game.
				io.sockets
					.in(roomId)
					.emit('game_over', JSON.stringify(currentGameState));
				cacheStates[roomId] = null;
				clearInterval(intervalId);
			}
		}, cacheStates[roomId].speed);
	}

	/**
	 * Change snake direction based on keyboard event key
	 * @param key is the keyboard event key
	 */
	function handleKeydown(key: string) {
		const roomId = cacheRooms[socket.id];

		//  Get the player state
		const playerState = cacheStates[roomId]?.players[socket.number - 1] || {};

		// Only allow players to perform keydown events
		// who have not yet been game over.
		if (playerState?.status) {
			const newDirection = KEYCODE_DIRECTIONS[key] || null;
			if (newDirection) {
				// Save the current direction as previous, and set the
				// current direction into the new one.
				cacheStates[roomId].players[socket.number - 1].previousDirection =
					playerState.direction;

				cacheStates[roomId].players[socket.number - 1].direction = newDirection;
			}
		}
	}

	/**
	 * Initialize and emits a new game
	 */
	function handleNewGame(data: any) {
		const roomId = generateId(5);
		cacheRooms[socket.id] = roomId;
		const gameState = startGame(data?.name, +data?.noOfPlayers || 1);
		cacheStates[roomId] = gameState;
		socket.join(roomId);
		socket.number = 1;
		socket.emit('init', 1);

		// Single player immediately runs the game
		if (isSinglePlayer(gameState)) {
			handleRunGame(roomId);
		} else {
			emitRoomDetails(roomId, gameState);
		}
	}

	/**
	 * Joins the new player to a specific room
	 * @param roomId is the unique id shared by
	 *  the player who hosted a game
	 */
	function handleJoinGame(data: any) {
		const roomId = data?.roomId;
		const connectedPlayers = io.sockets.adapter.rooms.get(roomId)?.size || 0;
		const gameState: GameState = cacheStates[roomId];

		if (!gameState || connectedPlayers === 0) {
			socket.emit('invalid_room');
			return;
		}

		if (connectedPlayers === gameState?.noOfPlayers) {
			socket.emit('room_full');
			return;
		}

		// Save the room
		cacheRooms[socket.id] = roomId;
		socket.join(roomId);

		// Provides a player id
		socket.number = connectedPlayers + 1;
		socket.emit('init', socket.number);

		gameState.players[connectedPlayers].name = data?.name;
		gameState.connectedPlayers = socket.number;

		// If active players is equal to the required players,
		// run the game.
		if (socket.number === gameState.noOfPlayers) {
			handleRunGame(roomId);
		} else {
			emitRoomDetails(roomId, gameState);
		}
	}

	const handleDisconnected = () => {
		const roomId = cacheRooms[socket.id];
		// Remove from the state
		const playerState = cacheStates[roomId]?.players[socket.number - 1] || {};
		playerState.status = false;
	};

	socket.on('keydown', handleKeydown);
	socket.on('new_game', handleNewGame);
	socket.on('join_game', handleJoinGame);
	socket.on('disconnect', handleDisconnected);
};
