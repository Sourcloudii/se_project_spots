import { resetValidation, enableValidation, settings } from "../scripts/validation.js";
import { setBtnText } from "../utils/helpers.js";
import Api from "../utils/Api.js";
import "./index.css";

//Universal variables
const closeBtn = document.querySelectorAll(".modal__close-btn");
const modals = document.querySelectorAll(".modal");

//Edit Profile Avatar
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const profileAvatarEditBtn = document.querySelector(".profile__avatar-btn");
const profileAvatar = document.querySelector(".profile__avatar");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

//Cards Template
const cardTemplate = document.querySelector("#card-template").content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

//Edit Profile Modal
const profileEditBtn = document.querySelector(".profile__edit-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

const editModal = document.querySelector("#edit-modal");
const editFormEl = editModal.querySelector(".modal__form");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector("#profile-description-input");

//Delete Card Modal
const deleteCardModal = document.querySelector("#delete-modal");
const deleteFormEl = deleteCardModal.querySelector(".modal__form");
const cardDeleteCancelBtn = deleteCardModal.querySelector(".modal__cancel-btn");
let currentCard, currentCardId;

//Post Card Modal
const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardPostBtn = document.querySelector(".profile__post-btn");
const cardlinkInput = cardModal.querySelector("#card-link-input");
const cardCaptionInput = cardModal.querySelector("#card-caption-input");

//Preview Modal
const previewModal = document.querySelector("#preview-modal");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "403e13a2-b5e1-4f12-b34b-030d308366cc",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, info]) => {
    cards.forEach((item) => {
      const cardEl = getCardEl(item);
      cardsList.append(cardEl);
    });
    profileAvatar.src = info.avatar;
    profileName.textContent = info.name;
    profileDescription.textContent = info.about;
  })
  .catch((err) => {
    console.error(err);
  });

function getCardEl(data) {
  const cardEl = cardTemplate.cloneNode(true);

  const cardNameEl = cardEl.querySelector(".card__title");
  const cardImageEl = cardEl.querySelector(".card__image");
  const cardLikeEl = cardEl.querySelector(".card__like-btn");
  const cardTrashBtn = cardEl.querySelector(".card__delete-btn");

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.alt || data.name;

  if (data.isLiked) {
    cardLikeEl.classList.add("card__like-btn_liked");
  }

  cardLikeEl.addEventListener("click", (evt) => handleLiked(data._id, evt));

  cardTrashBtn.addEventListener("click", () => handleDeleteCard(cardEl, data._id));

  cardDeleteCancelBtn.addEventListener("click", () => {
    closeModal(deleteCardModal);
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

  const submitBtn = evt.submitter;

  setBtnText(submitBtn, true);

  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
      setBtnText(submitBtn, false);
    });
}

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;

  setBtnText(submitBtn, true);

  api
    .editUserAvatar({ avatar: avatarInput.value })
    .then((data) => {
      profileAvatar.src = data.avatar;
      closeModal(avatarModal);
      avatarForm.reset();
    })
    .catch(console.error)
    .finally(() => {
      setBtnText(submitBtn, false);
    });
}

function handleCardFormSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;

  setBtnText(submitBtn, true);

  api
    .postNewCard({
      name: cardCaptionInput.value,
      link: cardlinkInput.value,
    })
    .then((data) => {
      const cardEl = getCardEl(data);
      cardsList.prepend(cardEl);
      closeModal(cardModal);
      cardForm.reset();
    })
    .catch(console.error)
    .finally(() => {
      setBtnText(submitBtn, false);
    });
}

function handleLiked(id, evt) {
  const isLiked = evt.target.classList.contains("card__like-btn_liked");
  if (!isLiked) {
    api
      .handleLikeStatus(id, false)
      .then(() => {
        evt.target.classList.add("card__like-btn_liked");
      })
      .catch(console.error);
  } else
    api
      .handleLikeStatus(id, true)
      .then(() => {
        evt.target.classList.remove("card__like-btn_liked");
      })
      .catch(console.error);
}

function handleDeleteCard(cardEl, id) {
  currentCard = cardEl;
  currentCardId = id;
  openModal(deleteCardModal);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setBtnText(submitBtn, true, "Deleting...");

  if (currentCard) {
    api
      .deleteCard(currentCardId)
      .then(() => {
        currentCard.remove();
        currentCard = null;
        closeModal(deleteCardModal);
      })
      .catch(console.error)
      .finally(() => {
        setBtnText(submitBtn, false, "Deleting...", "Delete");
      });
  }
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

//Edit Profile Avatar
profileAvatarEditBtn.addEventListener("click", () => {
  openModal(avatarModal);
});
avatarForm.addEventListener("submit", handleAvatarFormSubmit);

//Edit Profile
profileEditBtn.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(editFormEl, [editModalNameInput, editModalDescriptionInput]);
  openModal(editModal);
});
editFormEl.addEventListener("submit", handleProfileFormSubmit);

//Delete Card
deleteFormEl.addEventListener("submit", handleDeleteSubmit);

//New Post
cardPostBtn.addEventListener("click", () => {
  openModal(cardModal);
});
cardForm.addEventListener("submit", handleCardFormSubmit);

enableValidation(settings);
