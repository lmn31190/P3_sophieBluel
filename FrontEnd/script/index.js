// link bdd data
const data = "https://p3-sophiebluel.onrender.com/api/";
let works;
let categories;

// utilisation fetch pour récuperer data dans bdd

fetch(`${data}works`)
  .then((res) => res.json())
  .then((data) => {
    works = data;
    //fonction affichage works
    showGallery(works);
    fetchModalGallery(works);

    //List des catégories
    listCategory();

    //fonction filtre
    let filters = document.querySelector(".filters");
    filterCategory(categories, filters);

    //Ouvrir Upload
    openUpload();

    //Fermer Upload
    closeUpload();

    // Passer de mode : delete à upload
    changeMode();

    categorySelect();

    picturePreview();

    document.addEventListener("click", newWorkFormSubmit);
  });

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
      document.querySelector(".active")?.classList.remove("active");
      btn.classList.add("active");
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
    };
  });
};

//LOGIN
const loginUrl = "https://p3-sophiebluel.onrender.com/api/";

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

const logoutBtn = document.querySelector(".login");
localStorage.getItem("key") ? (logoutBtn.innerHTML = "logout") : "login";
logoutBtn.addEventListener("click", () => {
  if (localStorage.getItem("key")) {
    localStorage.removeItem("key");
    window.location.reload();
  } else {
    window.location.replace("./login.html");
  }
});

// ADMIN MODE

//Ouvrir admin fetch & Upload
const editMode = document.querySelector(".editMode");
const tokenLog = localStorage.getItem("key");
const upload = document.querySelector(".upload");
const uploadContainer = document.querySelector(".uploadContainer");
const uploadMode = document.querySelector("#uploadMode");
const deleteMode = document.querySelector("#deleteMode");

const openUpload = () => {
  if (tokenLog) {
    editMode.style.display = "block";

    editMode.addEventListener("click", () => {
      upload.classList.add("openUpload");
    });
  }
  document.addEventListener("click", trashBtn);
  
};
      

const changeMode = () => {
  if (deleteMode) {
    const changeMode = document.querySelector(".addImg");
    changeMode.addEventListener("click", () => {
      document.querySelector(".open")?.classList.remove("open");
      uploadMode.classList.add("open");
    });
  }

 

  if (uploadMode) {
    const test = document.querySelector(".uploadReturn");
    test.addEventListener("click", () => {
      document.querySelector(".open")?.classList.remove("open");
      deleteMode.classList.add("open");
      pictureInput.onchange = picturePreview;
    });
  }
};

//Fermer admin fetch & Upload
const closeUpload = () => {
  const close = document.querySelector(".fa-xmark");
  const uploadClose = document.querySelector("span i");
  close.addEventListener("click", () => {
    upload.classList.remove("openUpload");
  });
  uploadClose.addEventListener("click", () => {
    upload.classList.remove("openUpload");
  });
};

let pictureInput;

const openNewWorkForm = (e) => {
  if(e.target === document.querySelector("#addPictureBtn")){
    document.querySelector("#picturePreview").style.display = "none";
    pictureInput = document.querySelector("#photo");
    pictureInput.onchange = picturePreview;
  }
}

const picturePreview = () => {
  const [file] = pictureInput.files;
  if (file) {
    document.querySelector("#picturePreviewImg").src =
      URL.createObjectURL(file);
    document.querySelector("#picturePreview").style.display = "flex";
    document.querySelector(".picture").style.display = "none";
  }
};

const fetchModalGallery = (img) => {
  const uploadWork = document.querySelector(".uploadWork");
  uploadWork.innerHTML = "";

  img.forEach((i) => {
    const fig = document.createElement("figure");
    fig.className = "imgContainer";

    const workImage = document.createElement("img");
    workImage.src = i.imageUrl;
    workImage.alt = i.title;

    const trash = document.createElement("i");
    trash.id = i.id;
    trash.classList.add("fa-solid", "fa-trash-can");

    uploadWork.appendChild(fig);
    fig.append(workImage, trash);
  });
};

const trashBtn = (e) => {
  if (e.target.matches(".fa-trash-can")) {
    deleteWork(e.target.id);
  }
};

// Supprimer Work
const deleteWork = async (id) => {
  let key = localStorage.getItem("key");
  fetch(`${data}works/${id}`, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${key}`,
    },
  }).then((res) => {
    if (res.ok) {
      works = works.filter((work) => work.id != id);
      // Mise à jour dom
      showGallery(works);
      fetchModalGallery(works);
    } else {
      alert("Erreur : " + res.status);
    }
  });
};

const categorySelect = () => {
  const select = document.querySelector(".categorySelect");
  let option = document.createElement("option");

  select.innerHTML = "";
  select.appendChild(option);

  categories.forEach((categorie) => {
    option = document.createElement("option");
    option.value = categorie?.name;
    option.innerText = categorie?.name;
    option.id = categorie.id;
    select.appendChild(option);
  });
};

const newWorkFormSubmit = (e) => {
  if (e.target === document.querySelector(".submitForm")) {
    e.preventDefault();
    addNewWork();
  }
};

const addNewWork = () => {
  let key = localStorage.getItem("key");
  const select = document.querySelector(".categorySelect");
  const title = document.querySelector(".title").value;
  const optionName = select.options[select.selectedIndex].innerText;
  const optionId = select.options[select.selectedIndex].id;
  const picture = document.getElementById("getFile").files[0];

  let validity = formValidation(picture, title, optionId);
  if (validity === true) {
    //create FormData
    const formData = new FormData();
    formData.append("image", picture);
    formData.append("title", title);
    formData.append("category", optionId);
    
    sendNewData(key, formData, title, optionName);
  }
};


const sendNewData = (key, formData, title, optionName) => {
  fetch(`${data}works`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${key}`,
    },
    body: formData,
  })
    .then((res) => {
      if (res.ok) {
        alert("Nouveau fichier envoyé avec succés : " + title);
        return res.json();
      } else {
        console.error("Erreur:", res.status);
      }
    })
    .then((data) => {
      addToWorks(data, optionName);
      showGallery(works);
      fetchModalGallery(works);
      document.querySelector(".modal").style.display = "none";
      document.removeEventListener("click", closeUpload);
    })
    .catch((error) => console.error("Erreur:", error));
};

const formValidation = (picture, title, optionId) => {
  if (picture == undefined) {
    alert("Veuillez ajouter une image");
    return false;
  }
  if (title.length == 0) {
    alert("Veuillez ajouter un titre");
    return false;
  }
  if (optionId == "") {
    alert("Veuillez choisir une catégorie");
    return false;
  } else {
    upload.classList.remove("openUpload");
    return true;
  }
};

// Ajouter work dynamiquement
const addToWorks = (data, optionName) => {
  newWork = {};
  newWork.title = data.title;
  newWork.id = data.id;
  newWork.category = { id: data.optionId, name: optionName };
  newWork.imageUrl = data.imageUrl;
  works.push(addNewWork);
};
