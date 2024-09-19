const loginUrl = "http://localhost:5678/api/";

document.addEventListener("submit", (e) => {
  e.preventDefault();
  let log = {
    email: document.getElementById("email"),
    password: document.getElementById("password"),
  };

  fetch(`${loginUrl}users/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: log.email.value,
      password: log.password.value,
    }),
  }).then((response) => {
    if (response.status === 200) {
      response.json().then((data) => {
        //Stackage Token dans le Local storage
        localStorage.setItem("token", data.token);
        window.location.replace("./index.html");
      });
    } else {
      alert("Erreur dans l’identifiant ou le mot de passe");
    }
  });
});
