const API_KEY = '097a6402039c557407d72d752da172289d6195a6d4747bd1d95bed9ca76172dc';

const tickersHandlers = new Map();
const socket = new WebSocket(`wss://data-streamer.coindesk.com/?api_key=${API_KEY}`);

socket.addEventListener('message', (event) => {
    const messageContent = JSON.parse(event.data);
    const { TYPE: type, VALUE: newPrice, INSTRUMENT: key} = JSON.parse(event.data);
    console.log(messageContent);

    if(type !== '1101' || newPrice === undefined ) {
        return;
    }

    const ticker = key.split('-')[0];

    const handlers = tickersHandlers.get(ticker) ?? [];
    handlers.forEach(handler => handler(newPrice));
})

function sendMessageToWs(message) {
    const stringifiedMessage = JSON.stringify(message)

    if (socket.readyState === WebSocket.OPEN) {
        socket.send(stringifiedMessage);
        return;
    }
    socket.addEventListener('open', () => {
        socket.send(stringifiedMessage);
    }, {once: true});
}

function subscribeToTickerOnWs(ticker) {
    const message = {
        action: 'SUB_ADD',
        type: "1101",
        groups: ["VALUE"],
        subscriptions: [{"market": "cadli", "instrument": `${ticker}-USD`}]
    }

    sendMessageToWs(message);
}

function unSubscribeFromTickerOnWs(ticker) {
    const message = {
        action: 'SUB_REMOVE',
        type: "1101",
        groups: ["VALUE"],
        subscriptions: [{"market": "cadli", "instrument": `${ticker}-USD`}]
    }

    sendMessageToWs(message);
}

export const subscribeToTicker = (ticker, collBack)  => {
    const subscribers = tickersHandlers.get(ticker) || [];
    tickersHandlers.set(ticker, [...subscribers, collBack]); // добавление функции колбека для тикера

    subscribeToTickerOnWs(ticker) // подписка через WebSocket
}

export const unsubscribeFromTicker = (ticker) => {
    tickersHandlers.delete(ticker); // удаление всех коллбеков
    unSubscribeFromTickerOnWs(ticker)
}
