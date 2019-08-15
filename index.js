const EventEmitter = require("events");

const smartcard = require("smartcard");

const win = process.platform === "win32";

let addon;

if (process.platform === "win32") {
	addon = require('./build/Release/addon');
}

/**
 * Container for cards
 */
class Card extends EventEmitter {
	/**
	 * Wraps a smartcard.Card
	 * 
	 * @property {smartcard.Card} card The card to wrap
	 * @property {Device} device Parent device
	 */
	constructor(card, device) {
		super();

		this.card = card;
		this.device = device;

		this.connection = null;
	}

	/**
	 * Returns the card atr.
	 * 
	 * @returns {string} card atr
	 */
	getAtr() {
		return this.card.getAtr();
	}

	/**
	 * Connects to the card. Do this before sending commands.
	 */
	connect() {
		if (win) {
			this.connection = new addon.Device(this.device.index.toString());
		}
	}

	/**
	 * Closes the current connection.
	 */
	close() {
		if (this.connection)
			this.connection.close(),
			this.connection = null;
	}

	/**
	 * Executes the APDUBuffer on the card.
	 * 
	 * @param {Buffer} APDUBuffer Buffer of bytes
	 * 
	 * @returns {Promise<Device>} Output APDU
	 * 
	 * @example
	 * let aid = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
	 * 
	 * card.connect(); // You need to connect in order to issue commands.
	 * 
	 * // Selects the aid above.
	 * let response = await card.sendCommand(Buffer.from([
	 * 		[0x00, 0xA4, 0x04, 0x00, 0x00, 0x09, ...aid]
	 * ]));
	 * 
	 * console.log("Response", response); // Buffer < 90 00 >
	 * 
	 * card.close(); // Don't forget to close the connection when you're done.
	 */
	sendCommand(APDUBuffer) {
		if (win) {
			return new Promise((resolve, reject) => {
				try {
					resolve(this.connection.sendCommand(APDUBuffer));
				}catch (e) {
					reject("Unable to connect to device " + this.device.index);
				}
			});
		}else{
			return new Promise((resolve, reject) => {
				this.card.issueCommand(new smartcard.CommandApdu({bytes: APDUBuffer}))
					.then((res) => {
						resolve(res.buffer());
					});
			});
		}
	}
}

/**
 * Container for card readers
 * 
 * @property {string} name Device name.
 * @property {number} index Device index.
 */
class Device extends EventEmitter {
	/**
	 * Wraps a smartcard.Device
	 * 
	 * @param {smartcard.Device} device The device to wrap
	 * @param {number} index Raw device index usually `0`
	 */
	constructor(device, index) {
		super();

		this.device = device;
		this.name = device.reader.name
		this.index = index;

		this.currentCard = null;

		this.device.on("card-inserted", (e) => {
			this.currentCard = new Card(e.card, this);
			this.emit("insert", {card: this.currentCard});
		});

		this.device.on("card-removed", (e) => {
			this.emit("remove", this.currentCard);
			this.currentCard = null;
		});
	}
}

/**
 * @event Device#insert
 * @description Fired when a card is inserted into the reader.
 * @type {object} event
 * @property {Card} card The card that was inserted.
 */

/**
 * @event Device#remove
 * @description Fired when a card is removed from the reader.
 * @type {object} event
 * @property {Card} card The card that was removed.
 */

class DeviceManager extends EventEmitter {
	constructor() {
		super();

		this.devices = new smartcard.Devices();

		this.devices.on("device-activated", (e) => {
			this.emit("activate", {device: new Device(e.device, 0)});;
		});
	}

	getDevices() {
		return this.devices.listDevices().map((device, index) => new Device(device, index));
	}
}

/**
 * @event DeviceManager#activate
 * @description Fired when a card reader is ready.
 * @type {object} event
 * @property {Device} device The device that was activated.
 */

module.exports = {
	DeviceManager,
	Device,
	Card
};