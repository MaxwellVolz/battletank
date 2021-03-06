var ServerNetworkEvents = {
	/**
	 * Is called when the network tells us a new client has connected
	 * to the server. This is the point we can return true to reject
	 * the client connection if we wanted to.
	 * @param data The data object that contains any data sent from the client.
	 * @param clientId The client id of the client that sent the message.
	 * @private
	 */
	_onPlayerConnect: function (socket) {
		// Don't reject the client connection
		return false;
	},

	_onPlayerDisconnect: function (clientId) {
		if (ige.server.players[clientId]) {
			// Remove the player from the game
			ige.server.players[clientId].destroy();

			// Remove the reference to the player entity
			// so that we don't leak memory
			delete ige.server.players[clientId];
		}
	},

	_onPlayerEntity: function (data, clientId) {
		if (!ige.server.players[clientId]) {
			ige.server.players[clientId] = new Player(clientId)
				.streamMode(1)
                .drawBounds(true)
                .id(clientId)
                .box2dBody({
                    type: 'dynamic',
                    linearDamping: 0.0,
                    angularDamping: 0.3,
                    allowSleep: true,
                    bullet: false,
                    gravitic: true,
                    fixedRotation: false,
                    fixtures: [{
                        density: 2.0,
                        friction: 5.0,
                        restitution: 0.0,
                        shape: {
                            type: 'rectangle'
                        }
                    }]
                })
				.mount(ige.server.scene1);

			// Tell the client to track their player entity
			ige.network.send('playerEntity', ige.server.players[clientId].id(), clientId);
            console.log('Creating entity with client ID: ', clientId)
		}
	},

    _onPlayerDamage: function (data, clientId) {

    },
    _onPlayerDeath: function (data, clientId) {

    },

	_onPlayerLeftDown: function (data, clientId) {
		ige.server.players[clientId].controls.left = true;
	},

	_onPlayerLeftUp: function (data, clientId) {
		ige.server.players[clientId].controls.left = false;
	},

	_onPlayerRightDown: function (data, clientId) {
		ige.server.players[clientId].controls.right = true;
	},

	_onPlayerRightUp: function (data, clientId) {
		ige.server.players[clientId].controls.right = false;
	},

	_onPlayerThrustDown: function (data, clientId) {
		ige.server.players[clientId].controls.thrust = true;
	},

	_onPlayerThrustUp: function (data, clientId) {
		ige.server.players[clientId].controls.thrust = false;
	},

    _onPlayerBrakeDown: function (data, clientId) {
        ige.server.players[clientId].controls.brake = true;
    },

    _onPlayerBrakeUp: function (data, clientId) {
        ige.server.players[clientId].controls.brake = false;
    },

    _onPlayerShootDown: function (data, clientId) {
        ige.server.players[clientId].controls.shoot = true;
    },

    _onPlayerShootUp: function (data, clientId) {
        ige.server.players[clientId].controls.shoot = false;
    }
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ServerNetworkEvents; }