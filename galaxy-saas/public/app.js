async function load() {
  const res = await fetch("/api/dashboard", {
    headers: {
      Authorization: localStorage.token
    }
  });

  const data = await res.json();

  document.getElementById("app").innerHTML =
    data.map(d => `
      <div class="card">
        <h3>${d.name}</h3>
        <p>Score: ${d.score}</p>
      </div>
    `).join("");
}

load();
