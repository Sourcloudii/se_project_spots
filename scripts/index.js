//Universal variables
const closeBtn = document.querySelectorAll(".modal__close-btn");
const modals = document.querySelectorAll(".modal");

//Edit Profile Modals
const profileEditBtn = document.querySelector(".profile__edit-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

const editModal = document.querySelector("#edit-modal");
const editFormEl = editModal.querySelector(".modal__form");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector("#profile-description-input");

//Post Card Modals
const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardPostBtn = document.querySelector(".profile__post-btn");
const cardlinkInput = cardModal.querySelector("#card-link-input");
const cardCaptionInput = cardModal.querySelector("#card-caption-input");

//Preview Modals
const previewModal = document.querySelector("#preview-modal");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");

const cardTemplate = document.querySelector("#card-template").content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

function getCardEl(data) {
  const cardEl = cardTemplate.cloneNode(true);

  const cardNameEl = cardEl.querySelector(".card__title");
  const cardImageEl = cardEl.querySelector(".card__image");
  const cardLikeEl = cardEl.querySelector(".card__like-btn");
  const cardDeleteEl = cardEl.querySelector(".card__delete-btn");

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.alt;

  cardLikeEl.addEventListener("click", () => {
    cardLikeEl.classList.toggle("card__like-btn_liked");
  });

  cardDeleteEl.addEventListener("click", () => {
    const cardItem = cardDeleteEl.closest(".card");
    cardItem.remove();
  });

  cardImageEl.addEventListener("click", () => {
    openModal(previewModal);
    previewImageEl.src = data.link;
    previewImageEl.alt = data.alt;
    previewCaptionEl.textContent = data.name;
  });

  return cardEl;
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscape);
}

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    closeModal(openedModal);
  }
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescriptionInput.value;
  closeModal(editModal);
}

function handleCardFormSubmit(evt) {
  evt.preventDefault();
  const inputValues = { name: cardCaptionInput.value, link: cardlinkInput.value };
  const cardEl = getCardEl(inputValues);
  cardsList.prepend(cardEl);
  closeModal(cardModal);
  cardForm.reset();
}

//Close modals
closeBtn.forEach((button) => {
  const modal = button.closest(".modal");

  button.addEventListener("click", () => closeModal(modal));
});

modals.forEach((modal) => {
  modal.addEventListener("click", (evt) => {
    if (evt.target === modal) {
      closeModal(modal);
    }
  });
});

//Edit Profile
profileEditBtn.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(editFormEl, [editModalNameInput, editModalDescriptionInput]);
  openModal(editModal);
});
editFormEl.addEventListener("submit", handleProfileFormSubmit);

//New Post
cardPostBtn.addEventListener("click", () => {
  openModal(cardModal);
});

cardForm.addEventListener("submit", handleCardFormSubmit);

//Preview Card

initialCards.forEach(function (item) {
  const cardEl = getCardEl(item);
  cardsList.append(cardEl);
});
