import React, { useEffect, useState } from 'react';
import { useGameContext } from 'client/providers';
import { GamePlayer } from 'types';
import SnakeBoard from './SnakeBoard';
import ScoreBoard from './ScoreBoard';
import KeyboardControls from './KeyboardControls';
import ResultsScreen from './ResultsScreen';

const GameScreen = () => {
	const { state, dispatch } = useGameContext();
	const [timeLeft, setTimeLeft] = useState(3);
	const playerData = state?.gameState?.players?.filter((player) => {
		return player?.id === state.playerId;
	})?.[0] as GamePlayer;
	const players = state?.gameState?.players || [];

	useEffect(() => {
		// exit early when we reach 0
		if (state.status) return;

		if (timeLeft === 0) {
			dispatch({ status: true });
			setTimeLeft(3);
		}

		// save intervalId to clear the interval when the
		// component re-renders
		const intervalId = setInterval(() => {
			setTimeLeft(timeLeft - 1);
		}, 1000);

		// clear interval on re-render to avoid memory leaks
		return () => clearInterval(intervalId);
		// add timeLeft as a dependency to re-rerun the effect
		// when we update it
	}, [timeLeft, state.status, dispatch, setTimeLeft]);

	if (state.gameOver) return <ResultsScreen />;
	return (
		<div
			className="vh-100 d-flex align-items-center"
			style={{ justifyContent: 'space-evenly' }}
		>
			<div>
				{!state.status && (
					<h5 className="mb-5 text-color text-danger">
						The game will start in {timeLeft}
					</h5>
				)}
				<KeyboardControls />
			</div>

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
