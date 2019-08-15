## Classes

<dl>
<dt><a href="#Card">Card</a></dt>
<dd><p>Container for cards</p>
</dd>
<dt><a href="#Device">Device</a></dt>
<dd><p>Container for card readers</p>
</dd>
</dl>

<a name="Card"></a>

## Card
Container for cards

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| card | <code>smartcard.Card</code> | The card to wrap |
| device | [<code>Device</code>](#Device) | Parent device |


* [Card](#Card)
    * [new Card()](#new_Card_new)
    * [.getAtr()](#Card+getAtr) ⇒ <code>string</code>
    * [.connect()](#Card+connect)
    * [.close()](#Card+close)
    * [.sendCommand(APDUBuffer)](#Card+sendCommand) ⇒ [<code>Promise.&lt;Device&gt;</code>](#Device)

<a name="new_Card_new"></a>

### new Card()
Wraps a smartcard.Card

<a name="Card+getAtr"></a>

### card.getAtr() ⇒ <code>string</code>
Returns the card atr.

**Kind**: instance method of [<code>Card</code>](#Card)  
**Returns**: <code>string</code> - card atr  
<a name="Card+connect"></a>

### card.connect()
Connects to the card. Do this before sending commands.

**Kind**: instance method of [<code>Card</code>](#Card)  
<a name="Card+close"></a>

### card.close()
Closes the current connection.

**Kind**: instance method of [<code>Card</code>](#Card)  
<a name="Card+sendCommand"></a>

### card.sendCommand(APDUBuffer) ⇒ [<code>Promise.&lt;Device&gt;</code>](#Device)
Executes the APDUBuffer on the card.

**Kind**: instance method of [<code>Card</code>](#Card)  
**Returns**: [<code>Promise.&lt;Device&gt;</code>](#Device) - Output APDU  

| Param | Type | Description |
| --- | --- | --- |
| APDUBuffer | <code>Buffer</code> | Buffer of bytes |

**Example**  
```js
let aid = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];card.connect(); // You need to connect in order to issue commands.// Selects the aid above.let response = await card.sendCommand(Buffer.from([		[0x00, 0xA4, 0x04, 0x00, 0x00, 0x09, ...aid]]));console.log("Response", response); // Buffer < 90 00 >card.close(); // Don't forget to close the connection when you're done.
```
<a name="Device"></a>

## Device
Container for card readers

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Device name. |
| index | <code>number</code> | Device index. |


* [Device](#Device)
    * [new Device(device, index)](#new_Device_new)
    * ["insert"](#Device+event_insert)
    * ["remove"](#Device+event_remove)

<a name="new_Device_new"></a>

### new Device(device, index)
Wraps a smartcard.Device


| Param | Type | Description |
| --- | --- | --- |
| device | <code>smartcard.Device</code> | The device to wrap |
| index | <code>number</code> | Raw device index usually `0` |

<a name="Device+event_insert"></a>

### "insert"
Fired when a card is inserted into the reader.

**Kind**: event emitted by [<code>Device</code>](#Device)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| card | [<code>Card</code>](#Card) | The card that was inserted. |

<a name="Device+event_remove"></a>

### "remove"
Fired when a card is removed from the reader.

**Kind**: event emitted by [<code>Device</code>](#Device)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| card | [<code>Card</code>](#Card) | The card that was removed. |

