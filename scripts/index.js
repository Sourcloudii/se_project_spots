//Edit Profile Modals
const profileEditBtn = document.querySelector(".profile__edit-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

const editModal = document.querySelector("#edit-modal");
const editFormEl = editModal.querySelector(".modal__form");
const closeEditProfileBtn = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector("#profile-description-input");

//Post Card Modals
const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardPostBtn = document.querySelector(".profile__post-btn");
const closeAddCardBtn = cardModal.querySelector(".modal__close-btn");
const cardlinkInput = cardModal.querySelector("#card-link-input");
const cardCaptionInput = cardModal.querySelector("#card-caption-input");

//Preview Modals
const previewModal = document.querySelector("#preview-modal");
const previewImageEl = previewModal.querySelector(".modal__image");
const closePreviewBtn = previewModal.querySelector(".modal__close-btn");
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
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
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

//Edit Profile
profileEditBtn.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  openModal(editModal);
});
closeEditProfileBtn.addEventListener("click", () => {
  closeModal(editModal);
});
editFormEl.addEventListener("submit", handleProfileFormSubmit);

//New Post
cardPostBtn.addEventListener("click", () => {
  openModal(cardModal);
});
closeAddCardBtn.addEventListener("click", () => {
  closeModal(cardModal);
});

cardForm.addEventListener("submit", handleCardFormSubmit);

//Preview Card
closePreviewBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

initialCards.forEach(function (item) {
  const cardEl = getCardEl(item);
  cardsList.append(cardEl);
});
