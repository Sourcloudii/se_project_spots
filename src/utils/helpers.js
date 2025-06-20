export function setBtnText(btn, isLoading, loadingTxT = "Saving...", defaultTxt = "Save") {
  if (isLoading) {
    btn.textContent = loadingTxT;
    btn.disabled = true;
  } else if (defaultTxt === "Delete") {
    btn.textContent = defaultTxt;
    btn.disabled = false;
  } else {
    btn.textContent = defaultTxt;
  }
}
