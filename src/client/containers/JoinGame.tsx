import { useGameContext } from 'client/providers';
import React from 'react';
import SnakeImage from './SnakeImage';

type JoinGameProps = {
	roomId?: string;
	onCancel: () => void;
};

const JoinGame = ({ onCancel, roomId: roomIdParam }: JoinGameProps) => {
	const { socket } = useGameContext();

	const [name, setName] = React.useState('');
	const [roomId, setRoomId] = React.useState(roomIdParam || '');

	const handleSetName = (event: React.ChangeEvent<HTMLInputElement>) => {
		setName(event.target.value);
	};

	const handleSetRoomId = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRoomId(event.target.value);
	};

	const handleJoinGame = () => {
		if (name.trim() === '') {
			// eslint-disable-next-line no-alert
			alert('Please enter your name!');
		} else if (roomId.trim() === '') {
			alert('Please the Room ID!');
		} else {
			socket?.emit('join_game', {
				name,
				roomId
			});
		}
	};

	return (
		<div className="vh-100 d-flex justify-content-center align-items-center">
			<div>
				<h3 className="d-inline-block">Join a Game</h3>
				<SnakeImage />
				<div className="mb-3">
					<span className="pr-5">Enter your name:</span>
					<input
						type="text"
						className="form-control form-control-lg"
						onChange={handleSetName}
					/>
					<div className="mb-3">
						<span className="pr-5">Room ID</span>
						<input
							type="text"
							value={roomId}
							className="form-control form-control-lg"
							onChange={handleSetRoomId}
						/>
					</div>
				</div>
				<div className="text-center d-block m-5">
					<button
						type="button"
						className="btn btn-success"
						onClick={handleJoinGame}
					>
						Join Game
					</button>
					<button
						type="button"
						className="btn btn-danger mx-3"
						onClick={onCancel}
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default JoinGame;
