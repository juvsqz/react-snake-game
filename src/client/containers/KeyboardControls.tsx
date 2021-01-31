import { useGameContext } from 'client/providers';
import React from 'react';

const KeyboardControls = () => {
	const { socket } = useGameContext();

	const emit = (key: string) => socket?.emit('keydown', key);
	return (
		<div className="d-flex align-items-center flex-column">
			<h5 className="mb-5 text-info">Snake Controls</h5>
			<div>
				<button
					type="button"
					className="btn btn-light"
					onClick={() => emit('ArrowUp')}
				>
					<i className="fa fa-caret-up fa-2x" />
				</button>
			</div>
			<div>
				<button
					type="button"
					className="btn btn-light"
					onClick={() => emit('ArrowLeft')}
				>
					<i className="fa fa-caret-left fa-2x" />
				</button>

				<button
					type="button"
					className="btn btn-light"
					onClick={() => emit('ArrowDown')}
				>
					<i className="fa fa-caret-down fa-2x" />
				</button>
				<button
					type="button"
					className="btn btn-light"
					onClick={() => emit('ArrowRight')}
				>
					<i className="fa fa-caret-right fa-2x" />
				</button>
			</div>
			<small className="mt-5">or use your keyboard arrow keys.</small>
		</div>
	);
};

export default KeyboardControls;
