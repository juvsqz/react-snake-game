import React, { useReducer, createContext, useMemo, useContext } from 'react';
import { io, Socket } from 'socket.io-client';

import { GameState, RoomDetails } from '../../types';

type GameContextState = {
	playerId: number | null;
	roomDetails: RoomDetails | null;
	winnerPlayerId: number | null;
	gameOver: boolean;
	gameState: GameState | null;
	reset: boolean;
};

const InitialState: GameContextState = {
	playerId: null,
	roomDetails: null,
	winnerPlayerId: null,
	gameOver: false,
	gameState: null,
	reset: false
};

type GameContextProps = {
	state: GameContextState;
	dispatch: React.Dispatch<Partial<GameContextState>>;
	socket: Socket | null;
	reset: () => void;
};

function reducer(state: GameContextState, action: Partial<GameContextState>) {
	return {
		...state,
		...action
	};
}

const GameContext = createContext<GameContextProps>({
	state: InitialState,
	dispatch: () => null,
	socket: null,
	reset: () => null
});

type GameContextProviderProps = {
	children: React.ReactNode;
};
const GameContextProvider = ({ children }: GameContextProviderProps) => {
	const socket = useMemo(
		() => io(`${process.env.REACT_APP_SOCKET_SERVER}` || ''),
		[]
	);
	const [state, dispatch] = useReducer(reducer, InitialState);

	const handleSetGameState = (_state: string) => {
		const parsedState = (JSON.parse(_state) as GameState) || null;
		dispatch({ gameState: parsedState });
	};

	React.useEffect(() => {
		socket.on('init', (id: string) => dispatch({ playerId: +id }));
		socket.on('room_details', (roomDetails: any) => {
			dispatch({ roomDetails });
		});
		socket.on('game_state', handleSetGameState);
		socket.on('game_over', (_state: string) =>
			dispatch({ gameOver: true, gameState: JSON.parse(_state) })
		);

		socket.on('invalid_room', () => alert('Invalid room!'));
		socket.on('room_full', () => alert('Room already full!'));
	}, [socket]);

	const reset = () => {
		window.history.pushState(null, '', window.location.pathname);
		dispatch(InitialState);
	};

	return (
		<>
			{socket && (
				<GameContext.Provider value={{ state, dispatch, socket, reset }}>
					{children}
				</GameContext.Provider>
			)}
		</>
	);
};

export const useGameContext = (): GameContextProps => useContext(GameContext);

export const withGameContext = (WrappedComponent: React.ElementType) => () => {
	return (
		<GameContextProvider>
			<WrappedComponent />
		</GameContextProvider>
	);
};

export default GameContextProvider;
