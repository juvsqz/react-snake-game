import React from 'react';
import { useGameContext } from 'client/providers';
import { MAX_PLAYERS_PER_ROOM } from '../../settings';
import SnakeImage from './SnakeImage';

type MultiplayerProps = {
	onCancel: () => void;
};
const Multiplayer = ({ onCancel }: MultiplayerProps) => {
	const { socket } = useGameContext();

	const [name, setName] = React.useState('');
	const [noOfPlayers, setNoOfPlayers] = React.useState(2);

	// Render the dropdown from settings
	const renderSelection = (): Array<React.ReactNode> => {
		const selection = [];
		for (let count = 1; count <= MAX_PLAYERS_PER_ROOM; count++) {
			if (count > 1) {
				selection.push(
					<option key={count} value={count}>
						{count}
					</option>
				);
			}
		}

		return selection;
	};

	const handleCreateGame = () => {
		if (name.trim() === '') {
			alert('Please enter your name!');
		} else {
			socket?.emit('new_game', {
				name,
				noOfPlayers
			});
		}
	};

	const handleSetNoOfPlayers = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		return setNoOfPlayers(+event.target.value);
	};

	const handleSetName = (event: React.ChangeEvent<HTMLInputElement>) => {
		return setName(event.target.value);
	};

	return (
		<div className="vh-100 d-flex justify-content-center align-items-center">
			<div>
				<h3 className="d-inline-block">Create a multiplayer game</h3>
				<SnakeImage />
				<div className="mb-3">
					<span className="pr-5">Enter your name</span>
					<input
						type="text"
						className="form-control form-control-lg"
						onChange={handleSetName}
					/>
				</div>
				<div>
					<span className="pr-5">How Many Players?</span>
					<select
						className="form-control-lg"
						onChange={handleSetNoOfPlayers}
						onBlur={handleSetNoOfPlayers}
					>
						{renderSelection()}
					</select>
				</div>
				<div className="text-center d-block m-5">
					<button
						type="button"
						className="btn btn-success"
						onClick={handleCreateGame}
					>
						Create Game
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

export default Multiplayer;
