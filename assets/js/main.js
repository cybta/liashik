$ = (q) => {
  const elements = document.querySelectorAll(q);
  if (elements.length > 1) {
    return elements;
  } else if (elements.length == 1) {
    return elements[0];
  }
};

state = {
  page: 1,
  lang:
    localStorage.getItem("lang") === null ? "RU" : localStorage.getItem("lang"),
  dayState: "",
};

let counterCarousel =
  localStorage.getItem("counterCarousel") === null
    ? 0
    : localStorage.getItem("counterCarousel");
const distanceCarousel = window.innerWidth;
let positionCarousel = -distanceCarousel * counterCarousel;

const renderDOM = async () => {
  fetch(`./assets/json/LianaLebanon-${state.lang}.json`)
    .then((response) => response.json())
    .then((data) => {
      $(".liana").innerHTML = state.lang === "EN" ? "Liana" : "Лиана";
      data.map((day, i) => {
        if (i == state.page - 1) {
          $("#app").innerHTML = "";

          if(state.lang === "EN"){
            $('#app').classList.add("EN")
            $('#app').classList.remove("RU") ;
          } else{
            $('#app').classList.remove("EN")
            $('#app').classList.add("RU") ;
          }
          
          const places = day.places;
          const getPlaces = () => {
            let listOfPlaces = "";
            places.map((place, index) => {
              if (
                localStorage.getItem("check" + [i] + "-" + [index]) === null
              ) {
                localStorage.setItem(
                  "check" + [i] + "-" + [index],
                  place.status
                );
              }

              let gallery = place.description.gallery;
              let thumbs = [];
              gallery.map((thumb, thumbindex) => {
                const letThumb = `
                  <div class="thumb"
                  id="${thumbindex}"
                  data-bg="${thumbindex}"
                  style="background-image:url(${thumb})"></div>
                  `;
                thumbs.push(letThumb);
              });

              const newThumbs = thumbs.join("")

              const aPlace = `
                    <div class="place" data-bg="${index}" style="background-image:url(${
                place.description.gallery[0]
              })"> 
                        <div>
                            <div class="userUI-btns">
                                <a href="${place.map}" target="_blank">
                                    <span class="icon-location"></span>
                                </a>
                                <div class="status">
                                    <input type="checkbox" id="${
                                      "check" + [i] + "-" + [index]
                                    }" data-status="${place.status}">
                                    <label for="${
                                      "check" + [i] + "-" + [index]
                                    }"><span class="icon-heart-o"></span></label>
                                </div>
                            </div>
                            <div class="bottom-shades">
                                <div>
                                    <small>${
                                      day.city + ", " + place.area
                                    }</small>
                                    <h1>${place.toDo}</h1>
                                </div>
                                <div class="gallery">
                                    ${newThumbs}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
              listOfPlaces += aPlace;
            });

            return listOfPlaces;
          };

          $("#app").innerHTML += `<div class="day">
                <div class="carouselWrapper">${getPlaces()}</div>
                ${
                  places.length > 1
                    ? '<div id="previous" class="previous carousel-nav"><div><span class="icon-prev"></span></div></div><div id="next" class="next carousel-nav"><div><span class="icon-next"></span></div></div>'
                    : ""
                }
            </div>`;

          $(".carouselWrapper").style.width =
            window.innerWidth * places.length + "px";
        }
      });

      let getPages = "";

      const reGenereatePages = () => {
        data.map((day, i) => {
          const getCheckStatus = () => {
            let statePage = [];
            day.places.map((place, index) => {
              statePage.push(
                localStorage.getItem("check" + [i] + "-" + [index])
              );
            });

            let getTrack = 0;
            for (let q = 0; q < statePage.length; q++) {
              const singlePlacePercent = 100 / statePage.length;
              if (statePage[q] == "true") {
                getTrack = singlePlacePercent + getTrack;
              }
            }
            if (getTrack === 0) {
              return `<div class="daycomplete">Start Now</div>`;
            } else if (getTrack === 100) {
              return `<div class="daycomplete">complete</div>`;
            } else {
              return `<div class="daystate-container"><div class="daystate" style="width:${getTrack}%"></div></div>`;
            }
          };

          const renderPages = () => {
            return `<div class="pageNav" id="btn-${day.day}" data-page="${
              day.day
            }">
                <span><span class="showOnActive">AREA</span>${day.day}</span>
                <div class="showOnActive">${getCheckStatus()}</div>
            </div>`;
          };
          let singlePage = renderPages();
          getPages += singlePage;
        });

        $("#app").innerHTML += `<div class="navigation">${getPages}</div>`;

        const allPages = document.querySelectorAll(".pageNav");

        allPages.forEach((pageBtn) => {
          if (pageBtn.dataset.page !== state.page) {
            pageBtn.classList.remove("active");
          } else {
            pageBtn.classList.add("active");
          }

          pageBtn.addEventListener("click", () => {
            setState(() => {
              reGenereatePages();
              counterCarousel = 0;
              localStorage.setItem("counterCarousel", 0);
              state.page = pageBtn.dataset.page;
            });
          });
        });
      };
      reGenereatePages();

      const langRadios = $("#lang").querySelectorAll('input[type="radio"]');
      langRadios.forEach((lang) => {
        lang.addEventListener("change", () => {
          setState(() => {
            state.lang = lang.value;
            localStorage.setItem("lang", lang.value);
          });
        });
      });

      if (localStorage.getItem("lang") === null) {
        $("#lang-RU").checked = true;
      } else {
        if (localStorage.getItem("lang") === "EN") {
          $("#lang-EN").checked = true;
        } else {
          $("#lang-RU").checked = true;
        }
      }

      const getInputValues = () => {
        const allInputs = document.querySelectorAll('input[type="checkbox"]');
        allInputs.forEach((input) => {
          let myStatus = true;
          const placeDiv = input.parentNode.parentNode.parentNode.parentNode;

          const thisLabel = document.querySelector(`label[for="${input.id}"]`);
          const spanIcon = thisLabel.querySelector("span");

          const activateItem = () => {
            placeDiv.classList.add("active");
            spanIcon.classList.add("icon-heart");
            spanIcon.classList.remove("icon-heart-o");
          };

          const deactivateItem = () => {
            placeDiv.classList.remove("active");
            spanIcon.classList.add("icon-heart-o");
            spanIcon.classList.remove("icon-heart");
          };

          if (localStorage.getItem(input.id) !== null) {
            if (localStorage.getItem(input.id) === "true") {
              input.checked = true;
              activateItem();
            } else {
              deactivateItem();
            }
          }

          input.addEventListener("change", () => {
            if (input.checked === true) {
              myStatus = true;
              input.dataset.status = myStatus;
              localStorage.setItem(input.id, myStatus);
              activateItem();
            } else {
              myStatus = false;
              input.dataset.status = false;
              localStorage.setItem(input.id, myStatus);
              deactivateItem();
            }
            setState(() => {
              state.dayState = input.id;
            });
          });
        });
      };
      getInputValues();

      const animateCarousel = () => {
        positionCarousel = -counterCarousel * distanceCarousel;
        $(
          ".carouselWrapper"
        ).style.transform = `translateX(${positionCarousel}px)`;
      };
      animateCarousel();

      if (data[state.page - 1].places.length > 1) {
        $("#next").addEventListener("click", () => {
          if (counterCarousel === data[state.page - 1].places.length - 1) {
            counterCarousel = -1;
          }
          counterCarousel++;
          localStorage.setItem("counterCarousel", counterCarousel);
          animateCarousel();
        });

        $("#previous").addEventListener("click", () => {
          if (counterCarousel === 0) {
            counterCarousel = data[state.page - 1].places.length;
          }
          counterCarousel--;
          animateCarousel();
        });
      }

      const thumbList = document.querySelectorAll(".thumb");
      thumbList.forEach((thumbnail) => {
        thumbnail.addEventListener("click", () => {
          const thumbBg = thumbnail.style.backgroundImage;
          const activePlace =
            thumbnail.parentNode.parentNode.parentNode.parentNode;
          activePlace.style.backgroundImage = thumbBg;
        });
      });
    });
};

renderDOM();

setTimeout(() => {
  const allPages = document.querySelectorAll(".pageNav");
  allPages[0].classList.add("active");
}, 500);

const setState = (callback) => {
  callback();
  renderDOM();
};

