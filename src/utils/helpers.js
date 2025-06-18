export function setBtnText(btn, isLoading, loadingTxT = "Saving...", defaultTxt = "Save") {
  if (isLoading) {
    btn.textContent = loadingTxT;
    btn.disabled = true;
  } else {
    btn.textContent = defaultTxt;
    btn.disabled = false;
  }
}
