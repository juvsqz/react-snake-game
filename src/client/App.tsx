import React from 'react';
import './App.css';
import { GameScreen, HomeScreen } from './containers';
import { useGameContext, withGameContext } from './providers';

const App = (): JSX.Element => {
	const { state } = useGameContext();
	return (
		<div>{state.gameState === null ? <HomeScreen /> : <GameScreen />}</div>
	);
};

export default withGameContext(App);
