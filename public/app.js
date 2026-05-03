let chart;

async function load() {
  const res = await fetch("/api/recommendations");
  const data = await res.json();

  renderTop(data);
  renderChart(data);
  renderList(data);
}

function renderTop(data) {
  const best = data[0];

  document.getElementById("highlight").innerHTML = `
    <div class="highlight">
      <h2>🎯 Best Craft</h2>
      <h3>${best.name}</h3>
      <p>Score: ${best.score}</p>
    </div>
  `;
}

function renderChart(data) {
  const ctx = document.getElementById("chart");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.slice(0, 5).map(x => x.name),
      datasets: [{
        label: "Score",
        data: data.slice(0, 5).map(x => x.score)
      }]
    }
  });
}

function renderList(data) {
  const el = document.getElementById("list");

  el.innerHTML = data.map(s => `
    <div class="card">
      <h3>${s.name}</h3>
      ${s.missing.map(r => `<p>❌ ${r}</p>`).join("")}
    </div>
  `).join("");
}

load();
setInterval(load, 60000);
