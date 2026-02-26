


// Hidng Sell Page
document.addEventListener('DOMContentLoaded', () => {

    // 1. Select all elements with class "key" AND the one with "keyy"
const allKeys = document.querySelectorAll('.submit-btn');

// 2. Loop through them
allKeys.forEach(button => {
    button.addEventListener('click', function() {
        // This code runs no matter which button is clicked
        alert("Opening pages...");  
    });
});
  
  
 
  // ensure there's a page wrapper to blur
  let wrap = document.getElementById('page-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'page-wrap';
    // move all body children except script tags and the upcoming modal script into #page-wrap
    const toMove = [];
    document.body.childNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'script') return;
      toMove.push(node);
    });
    toMove.forEach(node => wrap.appendChild(node));
    document.body.insertBefore(wrap, document.body.firstChild);
  }

  // collect product sections by their <h2> text
  const sections = Array.from(document.querySelectorAll('.productList .product-section'));
  const map = new Map();
  const normalize = s => (s || '').toString().trim().toLowerCase().replace(/[^a-z0-9]+/g, '');

  sections.forEach(sec => {
    const h2 = sec.querySelector('h2');
    if (!h2) return;
    const key = normalize(h2.textContent);
    if (!map.has(key)) map.set(key, sec);
  });

  // wire buttons
  const buttons = Array.from(document.querySelectorAll('.container .cards'));
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      openCategoryModal(btn.textContent || btn.innerText);
    });
  });

  function findSectionByButtonText(buttonText) {
    const nbtn = normalize(buttonText);
    // exact or partial match
    for (const [key, sec] of map.entries()) {
      if (nbtn === key || nbtn.includes(key) || key.includes(nbtn)) return sec;
    }
    // fallback: try matching by words
    for (const [key, sec] of map.entries()) {
      const common = key.split(/(?=[A-Z])|[^a-z0-9]+/).filter(Boolean);
      if (common.some(w => nbtn.includes(w))) return sec;
    }
    return null;
  }

  function openCategoryModal(buttonText) {
    const sec = findSectionByButtonText(buttonText);
    if (!sec) {
      console.warn('No product section matched for:', buttonText);
      return;
    }
    // prevent duplicate modal
    if (document.querySelector('.product-modal-overlay')) return;

    // clone content to modal
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'product-modal-overlay';
    modalOverlay.setAttribute('role', 'dialog');
    modalOverlay.setAttribute('aria-modal', 'true');

    const modalBox = document.createElement('div');
    modalBox.className = 'product-modal';

    // close button html (small)
    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close';
    closeBtn.type = 'button';
    closeBtn.innerHTML = '✕';
    closeBtn.addEventListener('click', closeModal);

    // clone section content (deep)
    const clone = sec.cloneNode(true);
    // If the product-section has inputs/file fields, remove 'id' attributes to avoid duplicates
    clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));

    modalBox.appendChild(closeBtn);
    modalBox.appendChild(clone);
    modalOverlay.appendChild(modalBox);
    document.body.appendChild(modalOverlay);

    // blur page
    wrap.classList.add('blurred');

    // focus for accessibility
    closeBtn.focus();

    // close on overlay click (but not when clicking inside modal box)
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    // close on ESC
    function onKey(e) {
      if (e.key === 'Escape') closeModal();
    }
    document.addEventListener('keydown', onKey);

    function closeModal() {
      document.removeEventListener('keydown', onKey);
      if (modalOverlay && modalOverlay.parentNode) modalOverlay.parentNode.removeChild(modalOverlay);
      wrap.classList.remove('blurred');
    }
  }

});




// ===============================
// PART 1 — sell.htm logic
// ===============================
document.addEventListener('click', function (e) {
  const btn = e.target.closest('.submit-btn');
  if (!btn) return;

  e.preventDefault();

  // Set flag ONLY when coming from sell.htm
  sessionStorage.setItem('openAfterRedirect', 'true');

  // Redirect
  window.location.href = "Dropshippimg.html";
});


// ===============================
// PART 2 — Dropshippimg.html logic
// ===============================
document.addEventListener('DOMContentLoaded', function () {

  // Only run if we came from sell.htm
  const shouldOpen = sessionStorage.getItem('openAfterRedirect');

  if (shouldOpen === 'true') {

    // Remove flag immediately so refresh won’t trigger it
    sessionStorage.removeItem('openAfterRedirect');

    // Wait 2 seconds
    setTimeout( toggleModal(true)  , 4000);
  }

});








// Account sigup blured page
function toggleModal(show) {
    const modal = document.getElementById("accountModal");
    if (show) {
        modal.style.display = "flex";
        document.body.classList.add("modal-active");
    } else {
        modal.style.display = "none";
        document.body.classList.remove("modal-active");
    }
}

// Handle Form Submission
document.getElementById("storeForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // Get values
    const nickName = document.getElementById("nickName").value.trim();
    const contactType = document.getElementById("contactType").value;
    const contactNum = document.getElementById("contactNumber").value.trim();
    const location = document.getElementById("location").value.trim();

    // Validation logic
    if (!nickName || !contactType || !contactNum || !location) {
        alert("Please fill in all information before proceeding.");
        return;
    }

    // Success (you would typically send this to a server)
    alert(`Account created for ${nickName}!\nContact via: ${contactType}`);
    toggleModal(false);
    form.reset();
});

// Close modal if clicking outside the white box
window.onclick = function (event) {
    if (event.target == modal) {
        toggleModal(false);
    }
};





// small helper to safely read element value
  function val(id) {
    const el = document.getElementById(id);
    return el ? el.value : '';
  }

  // helper to safely return number value (or '')
  function numVal(id) {
    const el = document.getElementById(id);
    if (!el) return '';
    const v = el.value;
    return v === '' ? '' : Number(v);
  }

  // helper to return files array or empty array
  function filesArr(id) {
    const el = document.getElementById(id);
    if (!el || !el.files) return [];
    return Array.from(el.files);
  }

// personal information data
function personalinfoData() {
    return {
        sellerName: document.getElementById("sellerName").value,
        sellerContactOne: document.getElementById("sellerContact-one").value,
        sellerContactTwo: document.getElementById("sellerContact-two").value,
        sellerLocation: document.getElementById("sellerLocation").value
    };
}

 // Electronics
  function elecProduct() {
    return {
      name: val('elecName'),
      specs: val('elecSpecs'),
      condition: val('elecCondition'),
      price: numVal('elecPrice'),
      description: val('elecDescription'),
      images: filesArr('elecImages') // array of File objects
    };
  }

  // Animals / Meat / Dairy
  function animalProduct() {
    return {
      product: val('animalProduct'),
      pricing: val('animalPricing'),
      description: val('animalDescription'),
      images: filesArr('animalImages')
    };
  }

  // Computers & Accessories
  function compProduct() {
    return {
      product: val('compProduct'),
      model: val('compModel'),
      condition: val('compCondition'),
      pricing: val('compPrice'),
      description: val('compDescription'),
      images: filesArr('compImages')
    };
  }

  // Cosmetics
  function cosmeticsProduct() {
    return {
      product: val('cosmeticsProduct'),
      pricing: val('cosmeticsPrice'),
      description: val('cosmeticsDescription'),
      images: filesArr('cosmeticsImages')
    };
  }

  // Furnitures
  function furnProduct() {
    return {
      product: val('furnProduct'),
      material: val('furnMaterial'),
      condition: val('furnCondition'),
      price: numVal('furnPrice'),
      description: val('furnDescription'),
      images: filesArr('furnImages')
    };
  }

  // Home & House Utilities
  function homeProduct() {
    return {
      product: val('homeProduct'),
      condition: val('homeCondition'),
      material: val('homeMaterial'),
      price: numVal('homePrice'),
      description: val('homeDescription'),
      images: filesArr('homeImages')
    };
  }

  // Land & Property
  function landProduct() {
    return {
      size: val('landSize'),
      location: val('landLocation'),
      pricing: val('landPricing'),
      description: val('landDescription'),
      images: filesArr('landImages')
    };
  }

  // Motor (cars, bikes)
  function motorProduct() {
    return {
      product: val('motorProduct'),
      specs: val('motorSpecs'),
      condition: val('motorCondition'),
      pricing: val('motorPricing'),
      description: val('motorDescription'),
      images: filesArr('motorImages')
    };
  }

  // Phones & Tablets
  function phoneProduct() {
    return {
      model: val('phoneModel'),
      specs: val('phoneSpecs'),
      condition: val('phoneCondition'),
      pricing: val('phonePricing'),
      description: val('phoneDescription'),
      images: filesArr('phoneImages')
    };
  }

  // Produce & Foods
  function produceProduct() {
    return {
      product: val('produceProduct'),
      pricing: val('producePricing'),
      description: val('produceDescription'),
      images: filesArr('produceImages')
    };
  }

  // Softwares
  function softwareProduct() {
    return {
      product: val('softwareProduct'),
      keyType: val('softwareKeySelect'),
      description: val('softwareDescription'),
      images: filesArr('softwareImages')
    };
  }

  // Fashion & Apparel
  function fashionProduct() {
    return {
      size: val('fashionSize'),
      material: val('fashionMaterial'),
      colorPattern: val('fashionColor'),
      description: val('fashionDescription'),
      images: filesArr('fashionImages')
    };
  }


//adding product on home page
function addHomePage(product) {
    // Create a div for the card
    const container = document.getElementById("productDisplay");

    const card = document.createElement("div");
    card.className = "product-card";
    // Inject the HTML structure using Template Literals
    card.innerHTML = `
        <img src="${product.images}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <p class="product-meta">📍 ${product.condition} | 👤 ${product.condition}</p>
            <h3>${product.name}</h3>
            <p class="product-price">$${product.price}</p>
            <p class="product-description">${product.description}</p>
            <a href="mailto:${product.contact}" class="btn-contact">Contact Seller</a>
        </div>
    `;
    // Append to the list (Self-growing)
    container.appendChild(card);
}

document.getElementById("elecPostBtn").addEventListener("click", function () {
  console.log("clicked");
    const data = elecProduct();
    addHomePage(data);
});

