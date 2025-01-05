var productList, selectionBox, addBtn, cartDisplay, sum, stockInfo;

var lastSelectedItem,
  totalCost = 0;

function main() {
  productList = [
    { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
    { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
    { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
    { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
    { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
  ];

  const root = document.getElementById('app');
  const content = document.createElement('div');
  const wrapper = document.createElement('div');
  const header = document.createElement('h1');

  cartDisplay = document.createElement('div');
  cartDisplay.id = 'cart-items';

  sum = document.createElement('div');
  sum.id = 'cart-total';
  sum.className = 'text-xl font-bold my-4';

  selectionBox = document.createElement('select');
  selectionBox.id = 'product-select';
  selectionBox.className = 'border rounded p-2 mr-2';

  addBtn = document.createElement('button');
  addBtn.id = 'add-to-cart';
  addBtn.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  addBtn.textContent = '추가';

  stockInfo = document.createElement('div');
  stockInfo.id = 'stock-status';
  stockInfo.className = 'text-sm text-gray-500 mt-2';

  header.className = 'text-2xl font-bold mb-4';
  header.textContent = '장바구니';

  updateSelectionOptions();

  wrapper.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';

  wrapper.appendChild(header);
  wrapper.appendChild(cartDisplay);
  wrapper.appendChild(sum);
  wrapper.appendChild(selectionBox);
  wrapper.appendChild(addBtn);
  wrapper.appendChild(stockInfo);

  content.className = 'bg-gray-100 p-8';
  content.appendChild(wrapper);

  root.appendChild(content);

  updateCart();

  setTimeout(() => {
    setInterval(() => {
      const luckyItem =
        productList[Math.floor(Math.random() * productList.length)];
      if (Math.random() < 0.3 && luckyItem.quantity > 0) {
        luckyItem.price = Math.round(luckyItem.price * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateSelectionOptions();
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(() => {
    setInterval(() => {
      if (lastSelectedItem) {
        const suggestingItem = productList.find(
          (item) => item.id !== lastSelectedItem && item.quantity > 0,
        );
        if (suggestingItem) {
          alert(
            suggestingItem.name +
              '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!',
          );
          suggestingItem.price = Math.round(suggestingItem.price * 0.95);
          updateSelectionOptions();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

function updateSelectionOptions() {
  selectionBox.innerHTML = '';

  productList.forEach((item) => {
    const optionElement = document.createElement('option');
    optionElement.value = item.id;
    optionElement.textContent = item.name + ' - ' + item.price + '원';
    if (item.quantity === 0) optionElement.disabled = true;
    selectionBox.appendChild(optionElement);
  });
}

function updateCart() {
  totalCost = 0;
  let cartItemCount = 0;

  const cartItems = cartDisplay.children;
  let subTotalCost = 0;

  for (let i = 0; i < cartItems.length; i++) {
    let currentItem;

    for (let j = 0; j < productList.length; j++) {
      if (productList[j].id === cartItems[i].id) {
        currentItem = productList[j];
        break;
      }
    }

    const itemQuantity = parseInt(
      cartItems[i].querySelector('span').textContent.split('x ')[1],
    );

    const currentItemCost = currentItem.price * itemQuantity;
    let discount = 0;

    cartItemCount += itemQuantity;
    subTotalCost += currentItemCost;

    if (itemQuantity >= 10) {
      if (currentItem.id === 'p1') discount = 0.1;
      else if (currentItem.id === 'p2') discount = 0.15;
      else if (currentItem.id === 'p3') discount = 0.2;
      else if (currentItem.id === 'p4') discount = 0.05;
      else if (currentItem.id === 'p5') discount = 0.25;
    }

    totalCost += currentItemCost * (1 - discount);
  }

  let discountRate = 0;

  if (cartItemCount >= 30) {
    const bulkDiscount = totalCost * 0.25;
    const itemDiscount = subTotalCost - totalCost;

    if (bulkDiscount > itemDiscount) {
      totalCost = subTotalCost * (1 - 0.25);
      discountRate = 0.25;
    } else {
      discountRate = (subTotalCost - totalCost) / subTotalCost;
    }
  } else {
    discountRate = (subTotalCost - totalCost) / subTotalCost;
  }

  if (new Date().getDay() === 2) {
    totalCost *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }

  sum.textContent = '총액: ' + Math.round(totalCost) + '원';

  if (discountRate > 0) {
    const span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';
    sum.appendChild(span);
  }

  updateStockInfo();
  renderPointsLabel();
}

function renderPointsLabel() {
  let points = Math.floor(totalCost / 1000);
  let pointsLabel = document.getElementById('loyalty-points');

  if (!pointsLabel) {
    pointsLabel = document.createElement('span');
    pointsLabel.id = 'loyalty-points';
    pointsLabel.className = 'text-blue-500 ml-2';
    sum.appendChild(pointsLabel);
  }

  pointsLabel.textContent = '(포인트: ' + points + ')';
}

function updateStockInfo() {
  let infoMesssage = '';

  productList.forEach((item) => {
    if (item.quantity < 5) {
      infoMesssage +=
        item.name +
        ': ' +
        (item.quantity > 0
          ? '재고 부족 (' + item.quantity + '개 남음)'
          : '품절') +
        '\n';
    }
  });

  stockInfo.textContent = infoMesssage;
}

main();

addBtn.addEventListener('click', () => {
  const selectedItem = selectionBox.value;
  let itemToAdd = productList.find((product) => product.id === selectedItem);

  if (itemToAdd && itemToAdd.quantity > 0) {
    const item = document.getElementById(itemToAdd.id);

    if (item) {
      const newQuantity =
        parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
      if (newQuantity <= itemToAdd.quantity) {
        item.querySelector('span').textContent =
          itemToAdd.name + ' - ' + itemToAdd.price + '원 x ' + newQuantity;
        itemToAdd.quantity--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      const newItem = document.createElement('div');
      newItem.id = itemToAdd.id;
      newItem.className = 'flex justify-between items-center mb-2';
      newItem.innerHTML =
        '<span>' +
        itemToAdd.name +
        ' - ' +
        itemToAdd.price +
        '원 x 1</span><div>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="-1">-</button>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="1">+</button>' +
        '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
        itemToAdd.id +
        '">삭제</button></div>';
      cartDisplay.appendChild(newItem);
      itemToAdd.quantity--;
    }

    updateCart();
    lastSelectedItem = selectedItem;
  }
});

cartDisplay.addEventListener('click', (event) => {
  const target = event.target;

  if (
    target.classList.contains('quantity-change') ||
    target.classList.contains('remove-item')
  ) {
    const productId = target.dataset.productId;
    const itemElement = document.getElementById(productId);
    const product = productList.find((product) => product.id === productId);

    if (target.classList.contains('quantity-change')) {
      const quantityChange = parseInt(target.dataset.change);
      const newQuantity =
        parseInt(itemElement.querySelector('span').textContent.split('x ')[1]) +
        quantityChange;

      if (
        newQuantity > 0 &&
        newQuantity <=
          product.quantity +
            parseInt(
              itemElement.querySelector('span').textContent.split('x ')[1],
            )
      ) {
        itemElement.querySelector('span').textContent =
          itemElement.querySelector('span').textContent.split('x ')[0] +
          'x ' +
          newQuantity;
        product.quantity -= quantityChange;
      } else if (newQuantity <= 0) {
        itemElement.remove();
        product.quantity -= quantityChange;
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (target.classList.contains('remove-item')) {
      const removingQuantity = parseInt(
        itemElement.querySelector('span').textContent.split('x ')[1],
      );
      console.log(`removeQuantity: ${removingQuantity}`);
      product.quantity += removingQuantity;
      itemElement.remove();
    }

    updateCart();
  }
});
