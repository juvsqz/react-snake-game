import React, { useMemo, useEffect } from 'react';
import { useGameContext } from '../providers';
import Lobby from './Lobby';
import SnakeImage from './SnakeImage';
import Multiplayer from './Multiplayer';
import JoinGame from './JoinGame';

const HomeScreen = () => {
	const [showMulti, setShowMulti] = React.useState(false);
	const [showJoin, setShowJoin] = React.useState(false);

	const roomIdParam = useMemo(() => {
		return new URLSearchParams(window.location.search).get('id');
	}, []);

	useEffect(() => {
		if (roomIdParam) {
			setShowJoin(true);
		}
	}, [roomIdParam, showJoin]);

	const { state, socket } = useGameContext();

	const waitingForOtherPlayers = useMemo(() => {
		if (state.roomDetails) {
			return (
				state.roomDetails?.connectedPlayers !== state.roomDetails?.noOfPlayers
			);
		}
		return false;
	}, [state.roomDetails]);

	const handleNewGameClick = () => socket?.emit('new_game');
	const handleMultiplayerClick = () => {
		setShowMulti(true);
		setShowJoin(false);
	};

	const handleJoinGameClick = () => {
		setShowMulti(false);
		setShowJoin(true);
	};

	const reset = () => {
		setShowMulti(false);
		setShowJoin(false);
	};

	if (waitingForOtherPlayers) return <Lobby />;
	if (showMulti) return <Multiplayer onCancel={reset} />;
	if (showJoin) return <JoinGame roomId={roomIdParam || ''} onCancel={reset} />;

	return (
		<div className="vh-100 d-flex justify-content-center align-items-center">
			<div>
				<h3 className="d-inline-block">Welcome to Snake Game</h3>
				<SnakeImage />
				<div className="text-center d-block">
					<button
						type="button"
						className="btn btn-success"
						onClick={handleNewGameClick}
					>
						Single Player
					</button>
					<button
						type="button"
						className="btn btn-success mx-3"
						onClick={handleMultiplayerClick}
					>
						Multiplayer
					</button>
					<button
						type="button"
						className="btn btn-success"
						onClick={handleJoinGameClick}
					>
						Join Game
					</button>
				</div>
				<small className="text-info text-center d-block pt-2">
					Developed by Julius Vasquez
				</small>
			</div>
		</div>
	);
};

export default HomeScreen;
