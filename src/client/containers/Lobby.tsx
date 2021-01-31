import { useGameContext } from 'client/providers';
import React, { useMemo } from 'react';
import SnakeImage from './SnakeImage';

const Lobby = () => {
	const { state } = useGameContext();
	const roomDetails = state?.roomDetails;
	const shareLink = useMemo(() => {
		const url = new URL(window.location.href);
		url.searchParams.set('id', `${roomDetails?.roomId}`);
		return url.href;
	}, [roomDetails]);

	const handleCopy = (value: string) => {
		if (value !== '') {
			const el = document.createElement('input');
			el.value = value;
			el.setAttribute('readonly', '');
			el.style.position = 'absolute';
			el.style.left = '-9999px';
			document.body.appendChild(el);
			el.select();
			document.execCommand('copy');
			document.body.removeChild(el);
		}
	};
	const copyLink = () => handleCopy(shareLink);

	const copyCode = () => handleCopy(roomDetails?.roomId || '');

	const handleShareToFacebook = () => {
		window.open(
			`https://www.facebook.com/sharer/sharer.php?u=${shareLink}`,
			'_blank'
		);
	};
	return (
		<div className="vh-100 d-flex justify-content-center align-items-center">
			<div>
				<h3 className="d-inline-block">Invite your friends to play</h3>
				<SnakeImage />
				<div className="text-center">
					<h4 className="text-primary">Room ID</h4>
					<div className="input-group m-auto" style={{ width: 300 }}>
						<input
							type="text"
							className="form-control form-control-lg"
							readOnly
							value={roomDetails?.roomId}
						/>
						<div className="input-group-append">
							<button
								className="btn btn-outline-secondary"
								type="button"
								onClick={copyCode}
							>
								Copy
							</button>
						</div>
					</div>
					<div className="text-center d-block m-5">
						<button
							type="button"
							className="btn btn-info"
							onClick={copyLink}
							style={{
								backgroundColor: '4d498f'
							}}
						>
							Copy Link
						</button>
						<button
							type="button"
							className="btn btn-danger mx-3"
							onClick={handleShareToFacebook}
							style={{ backgroundColor: '#4d498f' }}
						>
							Share to facebook
						</button>
					</div>
					<div className="mt-5">Waiting for the other players...</div>
					<br />
					<div>
						Connected players:&nbsp;{roomDetails?.connectedPlayers} of{' '}
						{roomDetails?.noOfPlayers}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Lobby;
