import React from 'react';
import { useGameContext } from 'client/providers';
import ScoreBoard from './ScoreBoard';
import SnakeImage from './SnakeImage';

const ResultsScreen = () => {
	const { state, reset, socket } = useGameContext();
	// const playerData = state?.gameState?.players?.filter((player) => {
	// 	return player?.id === state.playerId;
	// })?.[0] as GamePlayer;
	const players = state?.gameState?.players || [];
	const isSinglePlayer = players.length === 1;
	const handlePlayAgainClick = () => {
		socket?.emit('new_game');
		reset();
	};
	return (
		<div
			className={`vh-100 d-flex align-items-${
				isSinglePlayer ? 'center' : 'start'
			}`}
			style={{ justifyContent: 'space-evenly' }}
		>
			<div className="text-center pt-10">
				<SnakeImage />
				<h2 className="text-center text-danger">GAME OVER</h2>
				<div className="pt-5">
					<ScoreBoard />
				</div>
				<div className="text-center d-block mt-5">
					<button
						type="button"
						className="btn btn-success mr-5"
						onClick={handlePlayAgainClick}
					>
						Play again?
					</button>
					<button type="button" className="btn btn-success" onClick={reset}>
						Home
					</button>
				</div>
			</div>
		</div>
	);
};

export default ResultsScreen;
