const base_url = "https://api.football-data.org/v2/";
const api_key = "1c9bbbd517984c63ac72eacfdd548852";

const fetchApi = function(url, method) {
  return fetch(url, {
    method: method,
    headers: {
      "X-Auth-Token": api_key,
    },
  });
};

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}

function showStandings(data) {
  let standings = "";
  data.standings[0].table.forEach(function(team) {
    standings += `
      <tr>
        <td><a href="./team.html?id=${team.team.id}">${team.team.name}</a></td>
        <td>${team.playedGames}</td>
        <td>${team.won}</td>
        <td>${team.draw}</td>
        <td>${team.lost}</td>
        <td>${team.points}</td>
      </tr>
    `;
  });
  // Sisipkan komponen card ke dalam elemen dengan id #content
  document.getElementById("standings").innerHTML = standings;
}

// Blok kode untuk melakukan request data json
function getStandings() {
  if ('caches' in window) {
    caches.match(`${base_url}competitions/2014/standings`).then(function(response) {
      if (response) {
        response.json().then(function (data) {
          console.log(data)
          showStandings(data);
        })
      }
    })
  }

  fetchApi(`${base_url}competitions/2014/standings`, "GET")
    .then(status)
    .then(json)
    .then(function(data) {
      console.log(data)
      showStandings(data);
    })
    .catch(error);
}

function showTeam(data) {
  const teamHTML = `
    <div class="card">
      <div class="card-image waves-effect waves-block waves-light">
        <img style="max-width:200px" src="${data.crestUrl}" />
      </div>
      <div class="card-content">
        <span class="card-title">${data.name}</span>
      </div>
    </div>
  `;
  // Sisipkan komponen card ke dalam elemen dengan id #content
  document.getElementById("body-content").innerHTML = teamHTML;
}

function getTeamById() {
  return new Promise(function(resolve, reject) {
    // Ambil nilai query parameter (?id=)
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get("id");
  
    if ('caches' in window) {
      caches.match(`${base_url}teams/${idParam}`).then(function(response) {
        if (response) {
          response.json().then(function (data) {
            console.log(data);
            showTeam(data);
            resolve(data);
          });
        }
      })
    }
  
    fetchApi(`${base_url}teams/${idParam}`, "GET")
      .then(status)
      .then(json)
      .then(function(data) {
        console.log(data);
        showTeam(data);
        resolve(data);
      });
  })
}

function getFavouriteTeams() {
  getAll().then(function(teams) {
    console.log(teams);
    // Menyusun komponen card artikel secara dinamis
    var teamsHTML = "";
    teams.forEach(function(team) {
      teamsHTML += `
        <div class="card">
        <a href="./team.html?id=${team.id}&saved=true">
          <div class="card-content">
              <span class="card-title truncate">${team.shortName}</span>
            <p>${team.website}</p>
          </div>
          </a>
        </div>
      `;
    });
    // Sisipkan komponen card ke dalam elemen dengan id #body-content
    document.getElementById("body-content").innerHTML = teamsHTML;
  });
}