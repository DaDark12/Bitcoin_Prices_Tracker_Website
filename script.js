// script.js
async function fetchBitcoinPrice() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    const data = await res.json();
    const price = data.bitcoin.usd.toLocaleString("en-US", { style: "currency", currency: "USD" });
    document.getElementById('btc-price').textContent = price;
  } catch (err) {
    console.error('Error fetching Bitcoin price:', err);
  }
}

// Fetch immediately on load
fetchBitcoinPrice();

// Update every hour (3600000ms)
setInterval(fetchBitcoinPrice, 3600000);
