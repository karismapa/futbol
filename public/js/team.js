document.addEventListener("DOMContentLoaded", function() {
  const urlParams = new URLSearchParams(window.location.search);
  const isFromSaved = urlParams.get("saved");

  const btnSave = document.getElementById("save");
  const btnIcon = document.getElementById("icon");

  if (isFromSaved) {
    // btnSave.style.display = "none";
    btnIcon.innerHTML = "remove";
  } else {
    btnIcon.innerHTML = "thumb_up";
  }

  const team = getTeamById();

  btnSave.onclick = function() {
    console.log("Tombol di-klik.");
    team.then(function(team) {
      if (isFromSaved) {
        removeFromFavourite(team.id);

        M.toast({html: 'Tim dihapus dari daftar tim favorit'});
      } else {
        addToFavourite(team);

        M.toast({html: 'Tim ditambahkan ke daftar tim favorit'});
      };
    })
  };
});