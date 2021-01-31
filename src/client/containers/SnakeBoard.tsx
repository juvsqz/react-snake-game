import React, { useRef, useEffect, KeyboardEvent } from 'react';
import { useGameContext } from 'client/providers';

const SnakeBoard = (): JSX.Element => {
	const snakeBoardRef = useRef<HTMLCanvasElement>(
		document.createElement('canvas')
	);

	React.useLayoutEffect(() => {
		snakeBoardRef.current.focus();
	}, []);

	const { state, socket } = useGameContext();
	const { gameState } = state;

	useEffect(() => {
		if (snakeBoardRef.current) {
			const context = snakeBoardRef.current.getContext('2d');
			if (context) {
				if (gameState) {
					context.setTransform(gameState.scale, 0, 0, gameState.scale, 0, 0);
					context.clearRect(
						0,
						0,
						gameState.canvasSize[0],
						gameState.canvasSize[1]
					);
					context.fillStyle = '#aed565';
					context.fillRect(
						0,
						0,
						gameState.canvasSize[0],
						gameState.canvasSize[1]
					);

					gameState.players.forEach(({ color, snake, status }) => {
						if (status) {
							context.fillStyle = color;
							snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1));
						}
					});
					const { food } = gameState;
					context.fillStyle = gameState.foodColor;
					context.fillRect(food[0], food[1], 1, 1);
				}
			}
		}
	}, [gameState]);

	const handleKeyDown = (event: KeyboardEvent) => {
		return socket?.emit('keydown', event.key);
	};

	return (
		<>
			<div>
				{gameState && (
					<>
						<canvas
							tabIndex={0}
							onKeyDown={handleKeyDown}
							style={{ border: '5px solid #75923e' }}
							ref={snakeBoardRef}
							width={state.gameState?.canvasSize[0]}
							height={state.gameState?.canvasSize[1]}
						/>
					</>
				)}
			</div>
		</>
	);
};

export default SnakeBoard;
