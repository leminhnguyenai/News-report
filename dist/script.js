const btn = document.querySelector(".search-bar button");

const whenButtonIsClicked = function () {
  const searchBar = document.querySelector(".search-bar");
  searchBar.style.transform = "translateY(-35vh)";
};

const newSearch = function () {
  const searchBar = document.querySelector(".search-bar");
  searchBar.style.transform = "translateY(0)";
  searchBar.style.transform = "scale(1.1)";
};

addEventListener("keydown", function (e) {
  if (e.metaKey && e.key == "k") newSearch();
  e.preventDefault();
});
btn.addEventListener("click", whenButtonIsClicked);
