export type GamePlayer = {
	id: number;
	name: string;
	color: string;
	previousDirection: [number, number] | null;
	direction: [number, number];
	snake: number[][];
	status: boolean;
	score: number;
};
export type GameState = {
	noOfPlayers: number;
	connectedPlayers: number;
	players: Array<GamePlayer>;
	food: number[];
	foodColor: string;
	scale: number;
	speed: number;
	canvasSize: number[];
};

export type RoomDetails = {
	roomId: string;
	noOfPlayers: number;
	connectedPlayers: number;
};
