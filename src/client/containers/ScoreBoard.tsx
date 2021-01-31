import React from 'react';
import { useGameContext } from '../providers';
import { GamePlayer } from '../../types';

const ScoreBoard = () => {
	const { state } = useGameContext();

	if (!state) return null;

	const { gameState } = state;

	const activePlayers: Array<GamePlayer> = [];
	const inactivePlayers: Array<GamePlayer> = [];

	// Extract players by status
	// eslint-disable-next-line no-unused-expressions
	gameState?.players.forEach((player) => {
		if (player.status) {
			activePlayers.push(player);
		} else {
			inactivePlayers.push(player);
		}
	});

	// Sort players based on their score
	const rankedActivePlayers = activePlayers.sort((a, b) => b.score - a.score);
	const rankedInactivePlayers = inactivePlayers.sort(
		(a, b) => b.score - a.score
	);

	const players = [...rankedActivePlayers, ...rankedInactivePlayers];

	return (
		<>
			{players.length === 1 ? (
				<h3>Your score is: {players[0].score}</h3>
			) : (
				<>
					<h3>
						<ol>Scoreboard</ol>
					</h3>
					<ol>
						{[...rankedActivePlayers, ...rankedInactivePlayers]?.map(
							(player) => {
								return (
									<li key={player.id}>
										<span
											style={{
												color: player.color,
												textDecoration:
													!player?.status && !state.gameOver
														? 'line-through'
														: 'none'
											}}
										>
											{player.name}
										</span>{' '}
										- {player.score}
									</li>
								);
							}
						)}
					</ol>
				</>
			)}
		</>
	);
};

export default ScoreBoard;
