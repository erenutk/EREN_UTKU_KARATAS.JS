(() => {

  var isHome = location.hostname.includes("e-bebek.com") && (location.pathname === "/" || location.pathname === ""); //only home page
  if(!isHome){
    console.log("wrong page");
    return;
} 
  const init = async () => {
    buildHTML();
    buildCSS();
    const data = await getData();
    renderProducts(data);
    setEvents();
  };

  const buildHTML = () => {

    if (document.getElementById("my-carousel")) return;
    //stories
    var anchor = document.querySelector(".ins-instory.ins-preview-mode");
    if (!anchor){
        console.log("anchor not found");
        return;
    }


    var root = document.createElement("section");
    root.id="my-carousel";

        var container = document.createElement("div");
    container.className = "container";

    var bannerTitle = document.createElement("div");
    bannerTitle.className="banner__titles";

    var title = document.createElement("h2");
    title.textContent="Beğenebileceğinizi düşündüklerimiz";
    title.className="title-primary"
    bannerTitle.appendChild(title);
    container.appendChild(bannerTitle);

    var box = document.createElement("div");
    box.id="carousel-box";
    container.appendChild(box);
    root.appendChild(container);
    anchor.after(root);

  };

  const buildCSS = () => {
    var style = document.createElement("style");
    style.textContent = `
    #my-carousel {
        margin:24px 0 8px;
        font-family: Poppins, cursive;
        color:#7d7d7d;
    }
    #my-carousel #carousel-box{
        display:flex;
        gap:20px;
        height:604px;
        margin:20px;
        margin-left:0px;
        overflow-x:auto;
        overflow-y:hidden;
        padding: 8px 0 16px;
        border-radius:50px;
    }
    .product-card {
        border-radius:12px;
        flex: 0 0 242px;      /* fixed width */
        box-sizing: border-box;
        border: 1px solid #eee;
        border-radius: 8px;
        padding: 20px;
        background: #fff;
        text-align: center;
        position:relative;
        cursor: pointer;
        
        display:flex;
        flex-direction:column;
    }
    .product-card img{
        width: 100%;
        height: 250px;        /* fixed height for images */
        object-fit: contain;
        display: block;
    }

    .fav-btn{
        position: absolute; 
        top: 20px; 
        right: 20px;
        z-index: 5;           /* draw above image */
        width: 28px; 
        height: 28px;
        border: 1px solid #ffd3a8; 
        border-radius: 50%;
        background: #fff; 
        cursor: pointer;
        display: flex; 
        align-items: center; 
        justify-content: center;
    }
    .fav-btn .icon { font-size:16px; color:#ff7a00; opacity:.35; }
    .fav-btn.active .icon { opacity:1; }
    #add-to-cart-btn{
        position:absolute;
        bottom:20px;
        width:80%;
    }
    #product-brand{font-weight:bolder;}
    `;
    document.head.appendChild(style);
  };

  const setEvents = () => {
    
  };

  const getData = async () => {
    try{
        //from local storage
        const saved = localStorage.getItem("productData"); //string
        if(saved){
            console.log("Loaded from localStorage");
            const data = JSON.parse(saved);
            console.log("Product data:",data);
            return data;

        }
        //from url
        const res = await fetch("https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json");
        const data = await res.json();
        console.log("Product data:", data);

        localStorage.setItem("productData",JSON.stringify(data));
        return data;
    }catch (err) {
        console.error("Error:",err);
    }
  };

  const renderProducts = (products) => {
    
    const box = document.getElementById("carousel-box");
    if (!box) return;
    if(box.hasChildNodes()) return;

    const favs = getFavs();
    console.log("favs",favs);

    products.forEach(prod => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.addEventListener("click",()=>{
            window.open(prod.url,"_blank","noopener"); //to product page
        })


        const img =document.createElement("img");
        img.src=prod.img;
        img.alt= prod.name;


        const fullName = document.createElement("h2");
        fullName.className="product-item__brand";

        const brand = document.createElement("span");
        brand.id="product-brand";
        brand.textContent=prod.brand+" - ";

        const name = document.createElement("span");
        name.textContent = prod.name;

        fullName.appendChild(brand);
        fullName.appendChild(name);

        const priceWrap = document.createElement("div");
        priceWrap.className = "product-item__price";


        if (prod.original_price > prod.price) {
        const row = document.createElement("div");
        row.className = "d-flex align-items-center ng-star-inserted";

        const oldSpan = document.createElement("span");
        oldSpan.className = "product-item__old-price ng-star-inserted";
        oldSpan.textContent = String(prod.original_price).replace(".", ",") + " TL";

        const perc = document.createElement("span");
        perc.className = "product-item__percent carousel-product-price-percent ml-2 ng-star-inserted";
        perc.innerHTML = `%${getDiscountPercentage(prod.original_price, prod.price)} <i class="icon icon-decrease"></i>`;

        row.appendChild(oldSpan);
        row.appendChild(perc);
        priceWrap.appendChild(row);
        }

        const newPrice = document.createElement("span");
        newPrice.className = prod.original_price > prod.price
        ? "product-item__new-price discount-product ng-star-inserted"
        : "product-item__new-price ng-star-inserted";
        newPrice.textContent = String(prod.price).replace(".", ",") + " TL";

        priceWrap.appendChild(newPrice);

        
        

        const favBtn = document.createElement("button");
        favBtn.type="button";
        favBtn.className="fav-btn";
        if(isFav(prod.id,favs)) favBtn.classList.add("active");

        const icon = document.createElement("span");
        icon.className="icon";
        icon.textContent="♥";
        favBtn.appendChild(icon);

        favBtn.addEventListener("click",(e)=>{
            e.preventDefault();
            e.stopPropagation();
            const updated = toggleFav(prod.id);
            const active = updated.includes(prod.id);
            favBtn.classList.toggle("active",active);
        })

        const addToCartBtn = document.createElement("button");
        addToCartBtn.id="add-to-cart-btn";
        addToCartBtn.type = 'button';
        addToCartBtn.className = 'btn close-btn disable';
        addToCartBtn.textContent= "Sepete Ekle";



        card.appendChild(img);
        card.appendChild(fullName);
        card.appendChild(priceWrap);

        card.appendChild(favBtn);
        card.appendChild(addToCartBtn);
        box.appendChild(card);
    })

  };

  const getDiscountPercentage = (oldPrice,newPrice) =>{
    return Math.round(((oldPrice-newPrice)/oldPrice)*100);
    
  };

  const getFavs = () => {
    const raw= localStorage.getItem("favorites");
    if(!raw) return [];
    const parsed = JSON.parse(raw);
    console.log("parsed:",parsed);
    return parsed;
  };

  const setFavs = (arr) => {
    localStorage.setItem("favorites",JSON.stringify(arr));
  };

  const isFav = (id, favs) => favs.indexOf(Number(id)) > -1;

  const toggleFav = (id) => {
    const favs= getFavs();
    const i = favs.indexOf(id);
    if(i>-1) favs.splice(i,1);else favs.push(id);
    setFavs(favs);
    return favs;
  };

  init();
})();