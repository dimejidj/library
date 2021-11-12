const library = document.querySelector(".library");
const newBookDetails = document.querySelector(".new-book-details");
const addBookBtn = document.querySelector(".add-book");
const bookName = document.getElementById("book-name");
const authorName = document.getElementById("auth-name");
const amountOfPages = document.getElementById("pages");
let bookRead = document.querySelector(".input-radio");
let localStorageLoaded = false;

function Book(name, author, pages, read) {
  this.name = name;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

let myLibrary = [];

function addBookToLibrary(books) {
  myLibrary.push(books);
}

Book.prototype.readUpdated = function () {
  if (this.read == "Read") {
    this.read = "Not Read";
  } else if (this.read == "Not Read") {
    this.read = "Read";
  }
  updateDisplay();
  updateStorage();
};

function updateStorage() {
  let currentStorageLib = localStorage.getItem("myLibrary");
  if (!currentStorageLib) {
    localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
  } else {
    localStorage.removeItem("myLibrary");
    localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
  }
}

function localStorageContent() {
  if (localStorageLoaded == false) {
    if (localStorage.getItem("myLibrary")) {
      let tempLibrary = JSON.parse(localStorage.getItem("myLibrary"));
      for (let x = 0; x < tempLibrary.length; x++) {
        let tempBook = new Book(
          tempLibrary[x].name,
          tempLibrary[x].author,
          tempLibrary[x].pages,
          tempLibrary[x].read
        );
        myLibrary.push(tempBook);
      }

      updateDisplay();
    }
  }
  localStorageLoaded = true;
}

localStorageContent();
function updateDisplay() {
  newBookDetails.innerHTML = "";
  for (let x = 0; x < myLibrary.length; x++) {
    let bookdetailsDiv = document.createElement("div");
    objectLoop(myLibrary[x], bookdetailsDiv, x);
    bookdetailsDiv.classList.add("book-details");
    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.value = x;
    deleteBtn.classList.add("deletebtn");
    bookdetailsDiv.appendChild(deleteBtn);
    newBookDetails.appendChild(bookdetailsDiv);
  }
  return newBookDetails;
}

addBookBtn.addEventListener("click", function (e) {
  if (bookName.value !== "" && amountOfPages !== "") {
    let newBook = new Book(
      bookName.value,
      authorName.value,
      amountOfPages.value,
      bookRead.checked == true ? "Read" : "Not Read"
    );
    addBookToLibrary(newBook);
    newBookDetails.innerHTML = "";
    updateDisplay();
    resetDisplay();
    updateStorage();
  }
});

function resetDisplay() {
  (bookName.value = ""),
    (authorName.value = ""),
    (amountOfPages.value = ""),
    (bookRead.checked = false);
}

function objectLoop(obj, div, ind) {
  let bookToggle = document.createElement("button");
  for (let key in obj) {
    if (key == "readUpdated") continue;
    let bookNode = document.createElement("div");
    if (key !== "read") {
      bookNode.textContent = `${obj[key]}`;
      bookNode.classList.add("book-para");
    } else {
      bookToggle.textContent = `${obj[key]}`;
      bookToggle.value = ind;
      bookToggle.classList.add("readbtns");
    }
    div.appendChild(bookNode);
  }
  div.appendChild(bookToggle);
  return div;
}

document.addEventListener("click", function (e) {
  if (e.target.classList == "readbtns") {
    myLibrary[e.target.value].readUpdated();
    updateDisplay();
    updateStorage();
  }
});

document.addEventListener("click", function (e) {
  if (e.target.classList == "deletebtn") {
    myLibrary.splice(e.target.value, 1);
    updateDisplay();
    updateStorage();
  }
});
