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
    
        showGallery(works);
        
        
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
      //references to DOM
      gallery.appendChild(workFig);
      workFig.append(workImg, workCaption);
    });
  }