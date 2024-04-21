// URL de base pour les requêtes API.
const data = "http://localhost:5678/api";

// Stockent respectivement les travaux et les catégories récupérés de la base de données.
let works;
let categories;


//Variable pour manipuler la galerie dans le DOM.
let gallery;

// FETCH
window.onload = () => {
  fetch(data + "/works")
    .then((res) => res.json())
    .then((data) => {
      works = data;
      //GET catégories
      getCategories();
      //Afficher works
      getGallery(works);
      //Filtres
      let filter = document.querySelector(".filter");
      filters(categories, filter);
      //Admin
      adminMode(filter);
    });
};

//GALLERIE

const getGallery = (data) => {
  gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  //Works dans array
  data.forEach((i) => {
    //creation éléments
    const workCard = document.createElement("figure");
    const workImage = document.createElement("img");
    const workTitle = document.createElement("figcaption");
    workImage.src = i.imageUrl;
    workImage.alt = i.title;
    workTitle.innerText = i.title;
    workCard.dataset.category = i.category.name;
    workCard.className = "workCard";
    // Afficher DOM
    gallery.appendChild(workCard);
    workCard.append(workImage, workTitle);
  });
};

// FILTRES

const getCategories = () => {
  let listOfCategories = new Set();

  works.forEach((work) => {
    listOfCategories.add(JSON.stringify(work.category));
  });

  const arrayOfStrings = [...listOfCategories];

  categories = arrayOfStrings.map((s) => JSON.parse(s));
};

//BTN FILTERS

//créée btn TOUS
const filters = (categories, filter) => {
  const button = document.createElement("button");
  button.innerText = "Tous";
  button.className = "filterButton active";
  button.dataset.category = "Tous";
  filter.appendChild(button);
  filterBtn(categories, filter);
  functionFilter();
};

//crée btn Filtres
const filterBtn = (categories, filter) => {
  categories.forEach((categorie) => {
    btnFilter(categorie, filter);
  });
};

const btnFilter = (categorie, filter) => {
  const button = document.createElement("button");
  button.innerText = categorie.name;
  button.className = "filterButton";
  button.dataset.category = categorie.name;
  filter.appendChild(button);
};

// filtres
const functionFilter = () => {
  const filterBtn = document.querySelectorAll(".filterButton");

  filterBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      setCategories(btn.dataset.category);
      document.querySelector(".active").classList.remove("active");
      btn.classList.add("active");
    });
  });
};

//BTN "TOUS"
const setCategories = (typeOfCategory) => {
  const figures = document.querySelectorAll(".workCard");
  if ("Tous" === typeOfCategory) {
    figures.forEach((figure) => {
      figure.style.display = "block";
    });
  } else {
    figures.forEach((figure) => {
      figure.dataset.category === typeOfCategory
        ? (figure.style.display = "block")
        : (figure.style.display = "none");
    });
  }
};

//ADMIN

let upload = document.querySelector(".upload");

const adminMode = () => {
  // vérifier adminToken

  //btn logout
  const logout = document.querySelector(".login");
  localStorage.getItem("adminToken") ? (logout.innerHTML = "logout") : "login";
  logout.addEventListener("click", () => {
    if (localStorage.getItem("adminToken")) {
      localStorage.removeItem("adminToken");
      window.location.reload();
    } else {
      window.location.replace("./login.html");
    }
  });

  if (localStorage.getItem("adminToken")) {
    document.querySelector(".filter").style.display = "none";

    const editBtn = `<p class="editBtn"><i class="fa-regular fa-pen-to-square"></i>Modifier</p>`;

    document
      .querySelector("#portfolio h2")
      .insertAdjacentHTML("afterend", editBtn);
    //Click open Module
    document
      .querySelector("#portfolio p")
      .addEventListener("click", openSettingsUpload);
  }
};

// Module Upload

//Vérifier adminToken
const openSettingsUpload = () => {
  if (localStorage.getItem("adminToken")) {
    upload.style.display = "flex";
    document.querySelector("#addPicture").style.display = "none";
    document.querySelector("#editGallery").style.display = "flex";
    adminGalery(works);
    //Click close Module
    upload.addEventListener("click", closeSettingsUpload);
    // BTN Delete
    document.addEventListener("click", deleteBtn);
    document.addEventListener("click", uploadMode);
  }
};

//close
const closeSettingsUpload = (e) => {
  if (
    e.target === document.querySelector(".upload") ||
    e.target === document.querySelector(".fa-xmark") ||
    e.target === document.querySelector(".closeCreate")
  ) {
    document.querySelector(".upload").style.display = "none";
    document.removeEventListener("click", closeSettingsUpload);
    document.removeEventListener("click", deleteBtn);
  }
};

// DELETE

const adminGalery = (data) => {
  const uploadContent = document.querySelector(".uploadContent");
  uploadContent.innerHTML = "";

  data.forEach((i) => {
    //crée élémént
    const work = document.createElement("figure");
    const workImage = document.createElement("img");
    const edit = document.createElement("figcaption");
    const deleteIcon = document.createElement("i");

    deleteIcon.id = i.id;
    deleteIcon.classList.add("fa-solid", "fa-trash-can");
    workImage.src = i.imageUrl;
    workImage.alt = i.title;
    work.className = "work";
    //DOM
    uploadContent.appendChild(work);
    work.append(workImage, edit, deleteIcon);
  });
};

const deleteBtn = (e) => {
  e.preventDefault();

  if (e.target.matches(".fa-trash-can")) {
    deleteWork(e.target.id);
  }
};

//DELETE bACKEND
const deleteWork = (i) => {
  let adminToken = localStorage.getItem("adminToken");
  fetch(data + "/works/" + i, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${adminToken}`,
    },
  }).then((res) => {
    if (res.ok) {
      alert("Projet supprimé");

      works = works.filter((work) => work.id != i);

      getGallery(works);
      adminGalery(works);
    } else {
      alert("Erreur : " + res.status);
    }
  });
};

//ADD

let btnDisplayImg = document.querySelector("#photo");

const uploadMode = (e) => {
  if (e.target === document.querySelector("#btnAddImg")) {
    document.querySelector("#addPicture").style.display = "flex";
    document.querySelector("#editGallery").style.display = "none";
    document.querySelector("#labelPhoto").style.display = "flex";
    document.querySelector("#displayImg").style.display = "none";
    document.getElementById("addPictureForm").reset();

    selectCategory();
    //Affichage Image
    
    btnDisplayImg.onchange = displayImg;

    document.querySelector("#addPictureForm").onchange = btnSubmitColor;

    document.addEventListener("click", closeSettingsUpload);
    document
      .querySelector(".uploadHeader .fa-arrow-left")
      .addEventListener("click", openSettingsUpload);
    document.removeEventListener("click", uploadMode);
    document.removeEventListener("click", deleteBtn);
    document.addEventListener("click", submitForm);
  }
};

const displayImg = () => {
  const [file] = btnDisplayImg.files;
  if (file) {
    document.querySelector("#displayImgPreview").src =
      URL.createObjectURL(file);
    document.querySelector("#displayImg").style.display = "flex";
    document.querySelector("#labelPhoto").style.display = "none";
  }
};

const selectCategory = () => {
  document.querySelector("#selectCategory").innerHTML = "";

  option = document.createElement("option");
  document.querySelector("#selectCategory").appendChild(option);

  categories.forEach((categorie) => {
    option = document.createElement("option");
    option.value = categorie.name;
    option.innerText = categorie.name;
    option.id = categorie.id;
    document.querySelector("#selectCategory").appendChild(option);
  });
};

const submitForm = (e) => {
  if (e.target === document.querySelector("#valider")) {
    e.preventDefault();
    addNewWork();
  }
};

const addNewWork = () => {
  let adminToken = localStorage.getItem("adminToken");
  const select = document.getElementById("selectCategory");

  const title = document.getElementById("title").value;
  const optionName = select.options[select.selectedIndex].innerText;
  const optionId = select.options[select.selectedIndex].id;
  const picture = document.getElementById("photo").files[0];

  let valideStep = formValidation(picture, title, optionId);
  if (valideStep === true) {
    //crée élément
    const formData = new FormData();
    formData.append("image", picture);
    formData.append("title", title);
    formData.append("category", optionId);

    postDataBdd(adminToken, formData, title, optionName);
  }
};

const btnSubmitColor = () => {
  const select = document.getElementById("selectCategory");
  if (document.getElementById("title").value !== "" && document.getElementById("photo").files[0] !== undefined && select.options[select.selectedIndex].id !== "") {
    document.querySelector("#valider").style.backgroundColor = "#1D6154";
    document.querySelector("#valider").disabled = false;
  } else {
    document.querySelector("#valider").style.backgroundColor = "#A7A7A7"
  }
}

//Vérif Form
const formValidation = (picture, title, optionId) => {
  if (!picture) {
    alert("Ajoutez une image");
  }
  else if (title.length == 0) {
    alert("Ajoutez un titre");
  }
  else if (optionId == "") {
    alert("Choisissez une catégorie");
  } else {
    return true;
  }
};

const addToWorksData = (data, optionName) => {
  newWork = {};
  newWork.title = data.title;
  newWork.id = data.id;
  newWork.category = { id: data.optionId, name: optionName };
  newWork.imageUrl = data.imageUrl;
  works.push(newWork);
};

const postDataBdd = (adminToken, formData, title, optionName) => {
  fetch(data + "/works", {
    method: "POST",
    headers: {
      authorization: `Bearer ${adminToken}`,
    },
    body: formData,
  })
    .then((res) => {
      if (res.ok) {
        alert(title + " a bien été publié");
        return res.json();
      } else {
        console.error("Erreur:", res.status);
      }
    })
    .then((data) => {
      addToWorksData(data, optionName);
      getGallery(works);
      document.querySelector(".upload").style.display = "none";
    })
    .catch((error) => console.error("Erreur:", error));
};
