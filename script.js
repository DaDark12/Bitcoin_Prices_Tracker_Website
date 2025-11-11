let btcChart;

// Fetch Bitcoin price
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

// Fetch historical chart data
async function fetchChartData(period = '1d') {
  const periods = {
    '1h': 1/24,
    '1d': 1,
    '1w': 7,
    '2w': 14,
    '1m': 30,
    '1y': 365,
    '5y': 1825,
    'all': 'max'
  };

  const days = periods[period];

  const res = await fetch(`https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`);
  const data = await res.json();

  const labels = data.prices.map(p => {
    const d = new Date(p[0]);
    return `${d.getMonth()+1}/${d.getDate()} ${d.getHours()}:00`;
  });
  const prices = data.prices.map(p => p[1]);

  return { labels, prices };
}

// Update chart with new data
async function updateChart(period = '1d') {
  const { labels, prices } = await fetchChartData(period);

  if (btcChart) {
    btcChart.data.labels = labels;
    btcChart.data.datasets[0].data = prices;
    btcChart.update();
  } else {
    const ctx = document.getElementById('btcChart').getContext('2d');
    btcChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'BTC Price USD',
          data: prices,
          borderColor: 'gold',
          backgroundColor: 'rgba(255, 215, 0, 0.2)',
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { mode: 'index', intersect: false }
        },
        interaction: { mode: 'nearest', intersect: false },
        scales: {
          x: { display: true },
          y: { display: true }
        }
      }
    });
  }
}

// Initialize
fetchBitcoinPrice();
updateChart('1d');

// Update price every hour
setInterval(fetchBitcoinPrice, 3600000);
