const API_KEY = '097a6402039c557407d72d752da172289d6195a6d4747bd1d95bed9ca76172dc';

const tickersHandlers = new Map();

// ToDo: реализовать через search params
export const loadTicker = () => {
    if (tickersHandlers.size === 0) {
        return;
    }
    [...tickersHandlers.keys()].forEach((tickerName) => {
        const key = `${tickerName}-USD`;
        fetch(
            `https://data-api.coindesk.com/index/cc/v1/latest/tick?market=ccix&instruments=${key}&api_key=${API_KEY}`,
        ).then(res => res.json())
        .then((data) => {
            const updatedData = data;
            const newPrice = updatedData.Data[key]?.VALUE;
            const hendlers = tickersHandlers.get(tickerName);

            hendlers.forEach((hendler) => {
                hendler(newPrice)
            })
        })
    })
}

export const subscribeToTicker = (ticker, collBack)  => {
    const subscribers = tickersHandlers.get(ticker) || [];
    tickersHandlers.set(ticker, [...subscribers, collBack]); // добавление функции колбека для тикера
}

export const unsubscribeFromTicker = (ticker) => {
    tickersHandlers.delete(ticker); // удаление всех коллбеков
}

setInterval(loadTicker, 5000)
