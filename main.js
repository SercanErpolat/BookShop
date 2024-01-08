let bookList = [],
  basketList = [];

const toggleModal = () => {
  const basketModal = document.querySelector(".basket_modal");
  basketModal.classList.toggle("active");
};

const getBooks = () => {
  fetch("./products.json")
    .then((res) => res.json())
    .then((books) => (bookList = books))
    .catch((err) => console.log(err));
};
getBooks();

// We created dynamic stars.
const createBookStars = (starRate) => {
  let starRateHtml = "";
  for (let i = 1; i <= 5; i++) {
    if (Math.round(starRate) >= i) {
      starRateHtml += ` <i class="bi bi-star-fill active"></i>`;
    } else {
      starRateHtml += ` <i class="bi bi-star-fill"></i>`;
    }
  }
  return starRateHtml;
};

// We created html and sent the books into it

const createBookItemsHtml = () => {
  const bookListEl = document.querySelector(".book-list");
  let bookListHtml = "";
  bookList.forEach((book, index) => {
    bookListHtml += `
        <div class="col-5 ${index % 2 == 0 && "offset-2"} my-5">
        <div class="row book-cart">
          <div class="col-6">
            <img
              src="${book.imgSource}"
              class="img-fluid shadow"
              width="220px"
              height="400px"
              alt="Harry Potter and the Cursed Child"
            />
          </div>
          <div class="col-6">
            <div class="book-detail">
              <span class="fos gray fs-5">${book.author}</span> <br />
              <span class="fs-4 fw-bold">
              ${book.name}</span
              >
              <br />
              <span class="book_star_rate"> 
                  ${createBookStars(book.starRate)} <br/>
                <span class="gray">1400 reviews</span>
              </span>
            </div>
            <p class="book_description">
                 ${book.description}
            </p>
            <div>
              <span class="black fw-bold fs-4 me-2">${book.price}$</span>
              <span class="fs-4 fw-bold old_price">${
                book.oldPrice
                  ? `<span class="fs-4 fw-bold old_price">${book.oldPrice}$</span>`
                  : ""
              }</span>
            </div>
            <button class="btn-purple" onclick= "addBookToBasket(${
              book.id
            })">Add To Basket</button>
          </div>
        </div>
      </div>
        `;
  });
  bookListEl.innerHTML = bookListHtml;
};

const BOOK_TYPES = {
  ALL: "All",
  NOVEL: "Novel",
  CHILDREN: "Children",
  HISTORY: "History",
  FINANCE: "Finance",
  SCIENCE: "Science",
  SELFIMPROVEMENT: "Self-Improvement",
};

const createBookTypesHtml = () => {
  const filterEle = document.querySelector(".filter");
  let filterHtml = "";
  let filterTypes = ["ALL"];
  bookList.forEach((book) => {
    if (filterTypes.findIndex((filter) => filter == book.type) == -1) {
      filterTypes.push(book.type);
    }
  });
  filterTypes.forEach((type, index) => {
    filterHtml += ` <li onClick="filterBooks(this)" data-types="${type}" class="${
      index == 0 ? "active" : null
    }">${BOOK_TYPES[type] || type}</li>`;
  });

  filterEle.innerHTML = filterHtml;
};

const filterBooks = (filterEl) => {
  console.log(filterEl);
  document.querySelector(".filter .active").classList.remove("active");
  filterEl.classList.add("active");
  let bookType = filterEl.dataset.types;
  getBooks();
  if (bookType != "ALL") {
    bookList = bookList.filter((book) => book.type == bookType);
  }
  createBookItemsHtml();
};
createBookTypesHtml();

// const listBasketItems = () =>{
//   const basketListEl = document.querySelector(".basket_list");
//   const basketCountEl = document.querySelector(".book_count");
//   basketCountEl.innerHTML = basketList.length > 0 ? basketList.length : null;
//   basketListHtml = "";
//   let totalPrice = 0;
//   basketList.forEach((item)=>{
//     basketListHtml += `
//     <li class="basket_item">
//     <img
//       src="images/Harry Potter and the Cursed Child.jpeg"
//       alt="Harry Potter and the Cursed Child"
//       width="100"
//       height="100"
//     />
//     <div class="basket_item-info">
//       <h3 class="book_name">Harry Potter</h3>
//       <span class="book_price">27$</span> <br />
//       <span class="book_remove">Remove</span>
//     </div>
//     <div class="book_count">
//       <span class="decrease">-</span>
//       <span class="mx-2">3</span>
//       <span class="increase">+</span>
//     </div>
//   </li>
//     `
//   });
//   basketListEl.innerHTML = basketListHtml;
// }

const listBasketItems = () => {
  const basketListEl = document.querySelector(".basket_list");
  const basketCountEl = document.querySelector(".basket_count");
  console.log(basketList);
  const totalQuantity = basketList.reduce(
    (total, item) => total + item.quantity,
    0
  );
  basketCountEl.innerHTML = totalQuantity > 0 ? totalQuantity : null;
  const totalPriceEl = document.querySelector(".total_price");
  console.log(totalPriceEl);
  let basketListHtml = "";
  let totalPrice = 0;
  basketList.forEach((item) => {
    console.log(item);
    totalPrice += item.product.price * item.quantity;
    basketListHtml += `
    <li class="basket_item">
    <img
      src="${item.product.imgSource}"
      alt=""
      width="100"
      height="100"
    />
    <div class="basket_item-info">
      <h3 class="book_name">${item.product.name}</h3>
      <span class="book_price">${item.product.price}$</span> <br />
      <span class="book_remove" onClick="removeItemBasket(${item.product.id})">Remove To Basket</span>
    </div>
    <div class="book_count">
      <span class="decrease" onClick="decreaseItemToBasket(${item.product.id})">-</span>
      <span class="mx-2">${item.quantity}</span>
      <span class="increase" onClick="increaseItemToBasket(${item.product.id})">+</span>
    </div>
  </li>
    
    `;
  });
  basketListEl.innerHTML = basketListHtml
    ? basketListHtml
    : `<li class="basket_item">There is no product in the cart. Add product to cart.</li>`;
  totalPriceEl.innerHTML = totalPrice > 0 ? "Total:" + totalPrice + "$" : null;
};

const addBookToBasket = (bookId) => {
  console.log(bookId);
  let findedBook = bookList.find((book) => book.id == bookId);
  listBasketItems();
  if (findedBook) {
    const basketAlreadyIndex = basketList.findIndex(
      (basket) => basket.product.id == bookId
    );
    if (basketAlreadyIndex == -1) {
      let addItem = { quantity: 1, product: findedBook };
      basketList.push(addItem);
    } else {
      basketList[basketAlreadyIndex].quantity += 1;
    }
  }
  const btnCheck = document.querySelector(".btnCheck");
  btnCheck.style.display = "block";
  listBasketItems();
};

const removeItemBasket = (bookId) => {
  const findedIndex = basketList.findIndex(
    (basket) => basket.product.id == bookId
  );
  if (findedIndex != -1) {
    basketList.splice(findedIndex, 1);
  }
  const btnCheck = document.querySelector(".btnCheck");
  btnCheck.style.display = "none";
  listBasketItems();
};

const decreaseItemToBasket = (bookId) => {
  const findedIndex = basketList.findIndex(
    (basket) => basket.product.id == bookId
  );
  if (findedIndex != -1) {
    if (basketList[findedIndex].quantity != 1) {
      basketList[findedIndex].quantity -= 1;
    } else {
      removeItemBasket(bookId);
    }
    listBasketItems();
  }
  listBasketItems();
};

const increaseItemToBasket = (bookId) => {
  const findedIndex = basketList.findIndex(
    (basket) => basket.product.id == bookId
  );
  if (findedIndex != -1) {
    basketList[findedIndex].quantity += 1;
  }
  listBasketItems();
};

setTimeout(() => {
  createBookItemsHtml();
  createBookTypesHtml();
}, 100);
