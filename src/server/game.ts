import {
	CANVAS_SIZE,
	SPEED,
	SCALE,
	SCORE_POINTING,
	SNAKE_OFFSET,
	SNAKE_COLORS,
	SNAKE_INITIAL_LENGTH,
	FOOD_COLOR
} from './settings';

import type { GamePlayer, GameState } from '../types';

/**
 * It will initialize and create a state for the newly created game
 * @param noOfPlayers is the allowed players before the game starts.
 */
const initGameState = (name: string, noOfPlayers: number): GameState => {
	const players: Array<GamePlayer> = [];

	// Initialize state for each player
	for (let count = 0; count < noOfPlayers; count++) {
		// Calculates player's initial snake position
		const xPos = SNAKE_OFFSET[0] * (count + 1);
		const snake = [];
		for (let len = 0; len < SNAKE_INITIAL_LENGTH; len++) {
			snake.push([xPos, SNAKE_OFFSET[1] + len]);
		}

		players.push({
			id: count + 1,
			name: name || `Player ${count + 1}`,
			color: SNAKE_COLORS[count],
			previousDirection: null,
			direction: [0, -1],
			score: 0,
			snake,
			status: true
		});
	}

	return {
		connectedPlayers: 1,
		noOfPlayers,
		players,
		food: [0, -1],
		foodColor: FOOD_COLOR,
		scale: SCALE,
		speed: SPEED,
		canvasSize: CANVAS_SIZE
	};
};

/**
 * Generate a new position for the new food based
 * on the current state of the game.
 * @param state is the current state of the game
 */
const getRandomFoodPosition = (state: GameState) => {
	return state.food.map((_a, i) =>
		Math.floor(Math.random() * (state.canvasSize[i] / state.scale))
	);
};

/**
 * Starts the game by initializing game state
 * and positioning of the food
 * @param noOfPlayers is the maximum total players in a specific room
 */
export const startGame = (name: string, noOfPlayers: number): GameState => {
	const state = initGameState(name, noOfPlayers);
	state.food = getRandomFoodPosition(state);
	return state;
};

/**
 * Check if the current direction reverses the previous one.
 * Useful to avoid snake body collision detection
 * @param _previousDirection previous direction of the snake
 * @param _currentDirection current direction of the snake
 */
const checkReverseDirection = (
	_previousDirection: number[] | null,
	_currentDirection: number[]
) => {
	if (_previousDirection) {
		const prevXPos = _previousDirection[0];
		const currXPos = _currentDirection[0];
		const prevYPos = _previousDirection[1];
		const currYPos = _currentDirection[1];

		if (
			(prevXPos !== 0 && currXPos !== 0 && prevXPos !== currXPos) ||
			(prevYPos !== 0 && currYPos !== 0 && prevYPos !== currYPos) ||
			prevYPos === currYPos ||
			prevXPos === currXPos
		) {
			return true;
		}
	}
	return false;
};

/**
 * This will check if the snake's new segment collides with the body.
 * @param segment is the new segment of the snake
 * @param snake is the snake positioning object.
 */
const checkSnakeBodyCollision = (
	segment: number[],
	snake: GamePlayer['snake']
) => {
	for (const segmentSnake of snake) {
		if (segmentSnake[0] === segment[0] && segmentSnake[1] === segment[1]) {
			return true;
		}
	}
	return false;
};

/**
 * Check if the snake already collides with the wall
 * @param segment is the snake body segment
 * @param canvasSize is the current size of the snake game
 */
const checkSnakeWallCollision = (segment: number[], state: GameState) => {
	if (
		segment[0] * state.scale >= state.canvasSize[0] ||
		segment[0] < 0 ||
		segment[1] * state.scale >= state.canvasSize[1] ||
		segment[1] < 0
	) {
		return true;
	}
	return false;
};

/**
 * Check if the food collides with the snake.
 * Once collided, it will automatically generate a new
 * food within a random position
 * @param snake is the current position
 * @param state is the game state
 */
const checkFoodCollision = (snake: GamePlayer['snake'], state: GameState) => {
	if (snake[0][0] === state.food[0] && snake[0][1] === state.food[1]) {
		let newFood = getRandomFoodPosition(state);
		while (
			checkSnakeWallCollision(newFood, state) ||
			checkSnakeBodyCollision(newFood, snake)
		) {
			newFood = getRandomFoodPosition(state);
		}
		state.food = newFood;
		return true;
	}
	return false;
};

/**
 * Move snake based on the current direction.
 * It modifies the position array to allows us
 * to execute the moving of the snake
 */
export const loopGame = (state: GameState): GameState => {
	state.players.forEach(({ snake, direction, score }, index) => {
		// Deep cloning the 2D array
		const newSnake = JSON.parse(JSON.stringify(snake));

		// Calculate the new snake segment
		// based on the current direction
		const newSnakeSegment = [
			newSnake[0][0] + direction[0],
			newSnake[0][1] + direction[1]
		];

		// Add the new segment position
		newSnake.unshift(newSnakeSegment);

		state.players.forEach(
			({ snake: _snake, previousDirection, direction: _direction }, _index) => {
				if (
					!checkReverseDirection(previousDirection, _direction) ||
					_index !== index
				) {
					// End the game once it collides to restricted elements
					// such as snake body and wall
					if (checkSnakeBodyCollision(newSnakeSegment, _snake)) {
						state.players[index].status = false;
					}
				}

				if (checkSnakeWallCollision(newSnakeSegment, state)) {
					state.players[index].status = false;
				}
			}
		);

		// If food is not eaten, remove the last segment
		// to simulate the movement
		if (!checkFoodCollision(newSnake, state)) {
			newSnake.pop();
		} else {
			state.players[index].score = score + SCORE_POINTING;
		}

		// Update the  player's snake position
		state.players[index].snake = newSnake;
	});

	return state;
};

/**
 * Check if it is a single player game
 * @param state current state of the game.
 */
export const isSinglePlayer = (state: GameState): boolean => {
	return state.noOfPlayers === 1;
};

/**
 * Check the game is already over
 * @param state current state of the game
 */
export const isGameOver = (state: GameState): boolean => {
	const activePlayerIds = state.players.filter(({ status }) => !!status);
	return activePlayerIds.length === 0;
};
