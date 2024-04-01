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
      let filters = document.querySelector(".filter");
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
  btn.className = "filterBtn";
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
    }
  });
};

