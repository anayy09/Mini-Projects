const blogContainer = document.querySelector(".blog__container");
const blogModal = document.querySelector(".blog__modal__body");
let globalStore = [];

const newCard = ({
  id,
  imageUrl,
  blogTitle,
  blogType,
  blogDescription,
}) => `<div class="col-lg-4 col-md-6" id=${id}>
<div class="card m-2">
  <div class="card-header custom-radius d-flex justify-content-end gap-2">
    <button type="button" class="btn btn-outline-success" id="${id}" onclick="editCard.apply(this, arguments)"><i class="fas fa-pencil-alt" id="${id}" onclick="editCard.apply(this, arguments)"></i></button>
    <button type="button" class="btn btn-outline-danger" id="${id}" onclick="deleteCard.apply(this, arguments)"><i class="fas fa-trash-alt" id="${id}" onclick="deleteCard.apply(this, arguments)"></i></button>
  </div>
  <img
    src=${imageUrl}
    class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">${blogTitle}</h5>
    <p class="card-text">${blogDescription}</p>
    <span class="badge bg-primary">${blogType}</span>
  </div>
  <div class="card-footer custom-radius text-muted">
    <button type="button" id="${id}" class="btn btn-outline-primary float-end" data-bs-toggle="modal"
    data-bs-target="#showblog" onclick="openBlog.apply(this, arguments)">Open Blog</button>
  </div>
</div>
</div>`;

// --------------------------------------------------
const loadData = async () => {
  const getInitialData = localStorage.blog; // if null, then
  if (!getInitialData) return;

  const { cards } = JSON.parse(getInitialData);

  cards.map((blogObject) => {
    const createNewBlog = newCard(blogObject);
    blogContainer.insertAdjacentHTML("beforeend", createNewBlog);
    globalStore.push(blogObject);
  });
  const isDarkMode = localStorage.getItem("darkMode") === "true";
  const body = document.body;

  if (isDarkMode) {
    body.classList.add("dark-mode");
  }
};

const updateLocalStorage = () => {
  localStorage.setItem(
    "blog",
    JSON.stringify({
      cards: globalStore,
    })
  );
};

const saveChanges = () => {
  const blogData = {
    id: `${Date.now()}`, // generating a unique id for each card
    imageUrl: document.getElementById("imageurl").value,
    blogTitle: document.getElementById("title").value,
    blogType: document.getElementById("type").value,
    blogDescription: document.getElementById("description").value,
  };

  const createNewBlog = newCard(blogData);
  blogContainer.insertAdjacentHTML("beforeend", createNewBlog);

  globalStore.push(blogData);

  updateLocalStorage();
};

const deleteCard = (event) => {
  // id
  event = window.event;
  const targetID = event.target.id;
  const tagname = event.target.tagName;

  globalStore = globalStore.filter((blogObject) => blogObject.id !== targetID);

  updateLocalStorage();

  if (tagname === "BUTTON") {
    // task__container
    return blogContainer.removeChild(
      event.target.parentNode.parentNode.parentNode // col-lg-4
    );
  }

  return blogContainer.removeChild(
    event.target.parentNode.parentNode.parentNode.parentNode // col-lg-4
  );
};

const editCard = (event) => {
  event = window.event;
  const targetID = event.target.id;
  const tagname = event.target.tagName;

  let parentElement;
  if (tagname === "BUTTON") {
    parentElement = event.target.parentNode.parentNode;
  } else {
    parentElement = event.target.parentNode.parentNode.parentNode;
  }

  let blogTitle = parentElement.childNodes[5].childNodes[1];
  let blogDescription = parentElement.childNodes[5].childNodes[3];
  let blogType = parentElement.childNodes[5].childNodes[5];
  let submitBtn = parentElement.childNodes[7].childNodes[1];

  blogTitle.setAttribute("contenteditable", "true");

  blogDescription.setAttribute("contenteditable", "true");
  blogType.setAttribute("contenteditable", "true");
  submitBtn.setAttribute("onclick", "saveEditChanges.apply(this, arguments)");
  submitBtn.innerHTML = "Save Changes";

  submitBtn.removeAttribute("data-bs-toggle");
  submitBtn.removeAttribute("data-bs-target");
};

const saveEditChanges = (event) => {
  event = window.event;
  const targetID = event.target.id;
  const tagname = event.target.tagName;

  let parentElement;
  if (tagname === "BUTTON") {
    parentElement = event.target.parentNode.parentNode;
  } else {
    parentElement = event.target.parentNode.parentNode.parentNode;
  }

  let blogTitle = parentElement.childNodes[5].childNodes[1];
  let blogDescription = parentElement.childNodes[5].childNodes[3];
  let blogType = parentElement.childNodes[5].childNodes[5];
  let submitBtn = parentElement.childNodes[7].childNodes[1];

  const updatedData = {
    blogTitle: blogTitle.innerHTML,
    blogDescription: blogDescription.innerHTML,
    blogType: blogType.innerHTML,
  };

  globalStore = globalStore.map((blog) => {
    if (blog.id === targetID) {
      return {
        id: blog.id,
        imageUrl: blog.imageUrl,
        blogTitle: updatedData.blogTitle,
        blogType: updatedData.blogType,
        blogDescription: updatedData.blogDescription,
      };
    }
    return blog;
  });

  updateLocalStorage();

  blogTitle.setAttribute("contenteditable", "false");

  blogDescription.setAttribute("contenteditable", "false");
  blogType.setAttribute("contenteditable", "false");

  submitBtn.setAttribute("onclick", "openBlog.apply(this, arguments)");
  submitBtn.setAttribute("data-bs-toggle", "modal");
  submitBtn.setAttribute("data-bs-target", "#showblog");

  submitBtn.innerHTML = "Open Blog";
};

const htmlModalContent = ({
  id,
  blogTitle,
  blogDescription,
  imageUrl,
  blogType,
}) => {
  const date = new Date(parseInt(id));
  return ` <div id=${id}>
   <img
   src=${imageUrl}
   alt="bg image"
   class="img-fluid place__holder__image mb-3 p-4"
   />
   <div class="text-sm text-muted ">Created on ${date.toDateString()}</div>
   <h2 class="my-5 mt-5" style="display:inline;">${blogTitle}</h2>
   <span class="badge bg-primary">${blogType}</span>
   <p class="lead mt-2">
   ${blogDescription}
   </p></div>`;
};

const openBlog = (event) => {
  event = window.event;
  const targetID = event.target.id;

  const getBlog = globalStore.filter(({ id }) => id === targetID);

  blogModal.innerHTML = htmlModalContent(getBlog[0]);
};

const sampleBlogs = [
  {
    id: "1",
    imageUrl:
      "https://images.ctfassets.net/80kbt2ff73ne/2onu6i2T6CCia1kqB2YqkP/8c81a6c641be46171849f201f8abdce3/Brain_Network_-16-9.jpg?q=70&fl=progressive&fm=jpg",
    blogTitle: "The Rise of Artificial Intelligence: A New Era Begins",
    blogType: "AI",
    blogDescription:
      "Discover the fascinating advancements in artificial intelligence and its impact on various industries.",
  },
  {
    id: "2",
    imageUrl:
      "https://wallpapersmug.com/download/1600x900/a8a1e4/coin-money-bitcoin.jpg",
    blogTitle:
      "The World of Cryptocurrency: Exploring Digital Assets and Decentralized Finance",
    blogType: "Cryptocurrency",
    blogDescription:
      "Dive into the exciting realm of cryptocurrency and decentralized finance, and learn about the future of digital assets.",
  },
  {
    id: "3",
    imageUrl:
      "https://images.wallpaperscraft.com/image/single/map_road_travel_137025_1600x900.jpg",
    blogTitle:
      "Wanderlust Chronicles: Embarking on a Journey to Unexplored Destinations",
    blogType: "Travel",
    blogDescription:
      "Join us on a thrilling adventure to breathtaking destinations around the world and get inspired for your next trip.",
  },
];

const loadSampleBlogs = () => {
  sampleBlogs.forEach((blog) => {
    const createNewBlog = newCard(blog);
    blogContainer.insertAdjacentHTML("beforeend", createNewBlog);
    globalStore.push(blog);
  });
};

loadSampleBlogs();

const toggleMode = () => {
  const body = document.body;
  body.classList.toggle("dark-mode");
};
