/**
 * This is the X,Y direction
 * positioning of the snake
 */
export const DIRECTIONS = {
	UP: [0, -1],
	DOWN: [0, 1],
	LEFT: [-1, 0],
	RIGHT: [1, 0]
};

export const KEYCODE_DIRECTIONS: Record<any, any> = {
	ArrowUp: DIRECTIONS.UP,
	ArrowDown: DIRECTIONS.DOWN,
	ArrowLeft: DIRECTIONS.LEFT,
	ArrowRight: DIRECTIONS.RIGHT
};
