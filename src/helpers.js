export let indicators = [];

export async function makeApiRequest(path) {
    // indicators = await getSigmas();

    try {
        // const response = await fetch(`https://min-api.cryptocompare.com/${path}`);
        const response = await fetch('http://localhost:3000/backtestData', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        // backtests_data = response.json();
        return response.json();
    } catch(error) {
        throw new Error(`CryptoCompare request error: ${error.status}`);
    }
}

export async function getSigmas() {
    try {
        // const response = await fetch(`https://min-api.cryptocompare.com/${path}`);
        const response = await fetch('http://localhost:3000/getSigmas', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        // backtests_data = response.json();
        return response.json();
    } catch(error) {
        throw new Error(`Cannot get indicators data: ${error.status}`);
    }
}

// Generate a symbol ID from a pair of the coins
export function generateSymbol(exchange, fromSymbol, toSymbol) {
    const short = `${fromSymbol}/${toSymbol}`;
    return {
        short,
        full: `${exchange}:${short}`,
    };
}

export function parseFullSymbol(fullSymbol) {
    const match = fullSymbol.match(/^(\w+):(\w+)\/(\w+)$/);
    if (!match) {
        return null;
    }

    return { exchange: match[1], fromSymbol: match[2], toSymbol: match[3] };
}