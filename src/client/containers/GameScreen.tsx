import React from 'react';
import { useGameContext } from 'client/providers';
import { GamePlayer } from 'types';
import SnakeBoard from './SnakeBoard';
import ScoreBoard from './ScoreBoard';
import KeyboardControls from './KeyboardControls';
import ResultsScreen from './ResultsScreen';

const GameScreen = () => {
	const { state } = useGameContext();
	const playerData = state?.gameState?.players?.filter((player) => {
		return player?.id === state.playerId;
	})?.[0] as GamePlayer;
	const players = state?.gameState?.players || [];

	if (state.gameOver) return <ResultsScreen />;
	return (
		<div
			className="vh-100 d-flex align-items-center"
			style={{ justifyContent: 'space-evenly' }}
		>
			<KeyboardControls />
			<div className="text-center">
				<SnakeBoard />
				<h5 className="d-inline-block" style={{ color: playerData.color }}>
					Your score: {playerData?.score || 0}
				</h5>
			</div>
			<div className="pt-5">
				{players.length > 1 && (
					<>
						{!playerData?.status && (
							<h3 className="text-center text-danger mb-5">GAME OVER</h3>
						)}
						<ScoreBoard />
					</>
				)}
			</div>
		</div>
	);
};

export default GameScreen;
