// link bdd data
const data = "http://localhost:5678/api/";
let works;
let categories;

// utilisation fetch pour récuperer data dans bdd
window.onload = () => {
  fetch(`${data}works`)
    .then((res) => res.json())
    .then((data) => {
      works = data;
      //fonction affichage works
      showGallery(works);

      //List des catégories
      listCategory();

      //fonction filtre
      let filters = document.querySelector(".filters");
      filterCategory(categories, filters);

    });
};

const showGallery = (data) => {
  let gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  data.forEach((i) => {
    //creation element
    const workFig = document.createElement("figure");
    workFig.dataset.category = i.category.name;
    workFig.className = "workFig";

    const workImg = document.createElement("img");
    workImg.src = i.imageUrl;
    workImg.alt = i.title;

    const workCaption = document.createElement("figcaption");
    workCaption.innerText = i.title;

    gallery.appendChild(workFig);
    workFig.append(workImg, workCaption);
  });
};

const listCategory = () => {
  let categoriesList = new Set();
  // récuperer catégories
  works.forEach((work) => {
    categoriesList.add(JSON.stringify(work.category));
  });

  //Ajouter catégorie dans un filtre
  const arrayCategories = [...categoriesList];

  //.map sur array pour return les objets
  categories = arrayCategories.map((s) => JSON.parse(s));
  console.log(categories);
};

const filterCategory = (categories, filter) => {
  btnAll(filter);
  filterButtons(categories, filter);
  filterModal();
};

const btnAll = (filter) => {
  const btn = document.createElement("button");
  btn.innerText = "Tous";
  btn.className = "filterBtn active";
  btn.dataset.category = "Tous";
  filter.appendChild(btn);
};

const filterButtons = (categories, filter) => {
  categories.forEach((categorie) => {
    const btn = document.createElement("button");
    btn.innerText = categorie.name;
    btn.className = "filterBtn";
    btn.dataset.category = categorie.name;
    filter.appendChild(btn);
  });
};

const filterModal = () => {
  const filterBtn = document.querySelectorAll(".filterBtn");

  filterBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      setCategories(btn.dataset.category);
      document.querySelector('.active')?.classList.remove('active');
      btn.classList.add("active")
    });

    const setCategories = (setCategory) => {
      const workType = document.querySelectorAll(".workFig");
      if ("Tous" === setCategory) {
        workType.forEach((figure) => {
          figure.style.display = "block";
        });
      } else {
        workType.forEach((type) => {
          type.dataset.category === setCategory
            ? (type.style.display = "block")
            : (type.style.display = "none");
        });
      }
    }
  });
};

//LOGIN
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
        localStorage.setItem("key", data.token);
        window.location.replace("./index.html");
      });
    } else {
      alert("Erreur dans l’identifiant ou le mot de passe");
    }
  });
});


// LOGIN & LOGOUT BTN


  const logoutBtn = document.querySelector('.login');
  localStorage.getItem("key") ? logoutBtn.innerHTML ="logout" : "login"
  logoutBtn.addEventListener('click', () => {

    if (localStorage.getItem("key")) {
      localStorage.removeItem('key')
      window.location.reload();
    } else{
      window.location.replace("./login.html");
    }
  })

  // ADMIN MODE

  const editMode = document.querySelector(".editMode");
  if (localStorage.getItem("key")) {
    editMode.style.display = "block"
    editMode.addEventListener('click', () => {
      const modal = document.querySelector('.modal');
      modal.style.display = "block"
    })

  }