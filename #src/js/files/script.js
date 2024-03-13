//весь контент на странице загрузится
window.onload = function(){
    document.addEventListener("click", documentActions);

    //documentActions(делегирование событий click)
    function documentActions(e){
        //нажатый объект
        const targetElement = e.target;
        //isMobile ф-ия находится в файле functions.js вернет булево значение
        if(window.innerWidth > 768 && isMobile.any()){
            if(targetElement.classList.contains('menu__arrow')){
                //contains ищет строку со значением ('menu__arrow')
                //closest('.menu__item') ищет ближайшего родителя
                targetElement.closest('.menu__item').classList.toggle('_hover');
            }
            //закрывать меню при клике на другое поле
            if(!targetElement.closest('.menu__item') && document.querySelectorAll('.menu__item._hover').length > 0){
                _removeClasses(document.querySelectorAll('.menu__item._hover'), "_hover");
            }
        }
        //для отображения кнопки поиска в мобильной версии
        // если у нашего объекта есть класс, который соотвествует иконке изображения
        if(targetElement.classList.contains('search-form__icon')){
            //тогда находим объект .search-form, обращаемся к списку класса и добавляем\убираем класс актив
            document.querySelector('.search-form').classList.toggle('_active');
        // при клике на пространство форма закрывалась
        } else if(!targetElement.closest('.search-form') && document.querySelector('.search-form._active')){
            document.querySelector('.search-form').classList.remove('_active');
        }
        if (targetElement.classList.contains('products__more')){
            getProducts(targetElement);
            e.preventDefault();
        }
        if (targetElement.classList.contains('actions-product__button')){
            const productId = targetElement.closest('.item-product').dataset.pid;
            addToCart(targetElement, productId);
            e.preventDefault();
        }
        // нажатый объект имеет класс cart-header__icon или у нажатого объекта есть класс
        if (targetElement.classList.contains('cart-header__icon') || targetElement.closest('.cart-header__icon')) {
            //существуют ли товары в этом списке
            if (document.querySelector('.cart-list').children.length > 0) {
                document.querySelector('.cart-header').classList.toggle('_active');
            }
            e.preventDefault();
            //скрываем содержимое если кликнем куда то помимо классов ...
        } else if (!targetElement.closest('.cart-header') && !targetElement.classList.contains('actions-product__button')) {
            document.querySelector('.cart-header').classList.remove('_active');
        }
        //удаление из корзины
        if (targetElement.classList.contains('cart-list__delete')) {
            const productId = targetElement.closest('.cart-list__item').dataset.cartPid;
            updateCart(targetElement, productId, false);
            e.preventDefault();
        }

    }   
    //header

    const headerElement = document.querySelector('.header');
//Intersection Observer  браузерный API, 
//который позволяет асинхронно отслеживать пересечение элемента с его родителем или областью видимости документа (viewport).
    const callback = (entries, observer) => {
          if (entries[0].isIntersecting) {
            headerElement.classList.remove('_scroll');
          } else {
            headerElement.classList.add('_scroll');
          }
      };

    const headerObserver = new IntersectionObserver(callback);
    headerObserver.observe(headerElement);


    //products__more 
    //в саму ф-цию получаем кнопку show more

    async function getProducts(button){
        //если нет класса hold, мы его добавляем
        if (!button.classList.contains('_hold')){
            button.classList.add('_hold');
            //путь к нашему файлу (в реальном проекте адрес сервера и передаваемые параметры)
            const file = "json/products.json";
        //выполняем GET запрос с помощью fetch
            let response = await fetch(file, {
                method: "GET"
            });
            //проверка
            if(response.ok){
                //получаем содержание файла в формате json
                let result = await response.json();
                loadProducts(result);
                //после этого убираем класс _hold и удаляем кнопку
                button.classList.remove('_hold');
            //чтобы не подгружал одни и те же продукты
                button.remove();
            } else {
                alert("Ошибка");
            }
        }
    }
    function loadProducts(data){
        const productsItems = document.querySelector('.products__items');
        data.products.forEach(item => {
            const productId = item.id;
            const productUrl = item.url;
            const productImage = item.image;
            const productTitle = item.title;
            const productText = item.text;
            const productPrice = item.price;
            const productOldPrice = item.priceOld;
            const productShareUrl = item.shareUrl;
            const productLikeUrl = item.likeUrl;
            const productLabels = item.labels;

            let productTemplateStart = `<article data-pid="${productId}" class="products__item item-product">`;
			let productTemplateEnd = `</article>`;

			let productTemplateLabels = '';
			if (productLabels) {
				let productTemplateLabelsStart = `<div class="item-product__labels">`;
				let productTemplateLabelsEnd = `</div>`;
				let productTemplateLabelsContent = '';

				productLabels.forEach(labelItem => {
					productTemplateLabelsContent += `<div class="item-product__label item-product__label_${labelItem.type}">${labelItem.value}</div>`;
				});

				productTemplateLabels += productTemplateLabelsStart;
				productTemplateLabels += productTemplateLabelsContent;
				productTemplateLabels += productTemplateLabelsEnd;
			}

			let productTemplateImage = `
		<a href="${productUrl}" class="item-product__image _ibg">
			<img src="img/products/${productImage}" alt="${productTitle}">
		</a>
	`;

			let productTemplateBodyStart = `<div class="item-product__body">`;
			let productTemplateBodyEnd = `</div>`;

			let productTemplateContent = `
		<div class="item-product__content">
			<h5 class="item-product__title">${productTitle}</h5>
			<div class="item-product__text">${productText}</div>
		</div>
	`;

			let productTemplatePrices = '';
			let productTemplatePricesStart = `<div class="item-product__prices">`;
			let productTemplatePricesCurrent = `<div class="item-product__price">Rp ${productPrice}</div>`;
			let productTemplatePricesOld = `<div class="item-product__price item-product__price_old">Rp ${productOldPrice}</div>`;
			let productTemplatePricesEnd = `</div>`;

			productTemplatePrices = productTemplatePricesStart;
			productTemplatePrices += productTemplatePricesCurrent;
			if (productOldPrice) {
				productTemplatePrices += productTemplatePricesOld;
			}
			productTemplatePrices += productTemplatePricesEnd;

			let productTemplateActions = `
		<div class="item-product__actions actions-product">
			<div class="actions-product__body">
				<a href="" class="actions-product__button btn btn_white">Add to cart</a>
				<a href="${productShareUrl}" class="actions-product__link _icon-share">Share</a>
				<a href="${productLikeUrl}" class="actions-product__link _icon-favorite">Like</a>
			</div>
		</div>
	`;

			let productTemplateBody = '';
			productTemplateBody += productTemplateBodyStart;
			productTemplateBody += productTemplateContent;
			productTemplateBody += productTemplatePrices;
			productTemplateBody += productTemplateActions;
			productTemplateBody += productTemplateBodyEnd;

			let productTemplate = '';
			productTemplate += productTemplateStart;
			productTemplate += productTemplateLabels;
			productTemplate += productTemplateImage;
			productTemplate += productTemplateBody;
			productTemplate += productTemplateEnd;

            productsItems.insertAdjacentHTML('beforeend', productTemplate);
            });
    }


//AddToCart

    function addToCart(productButton, productId) {
        if (!productButton.classList.contains('_hold')) {
            productButton.classList.add('_hold');
            productButton.classList.add('_fly');
// //количество товаров
            const cart = document.querySelector('.cart-header__icon');
            const product = document.querySelector(`[data-pid="${productId}"]`);
            const productImage = product.querySelector('.item-product__image');
//         //копия изобращения
            const productImageFly = productImage.cloneNode(true);
  //ширина, высота, позиция сверху и слева оригинальной картинки
            const productImageFlyWidth = productImage.offsetWidth;
            const productImageFlyHeight = productImage.offsetHeight;
            const productImageFlyTop = productImage.getBoundingClientRect().top;
            const productImageFlyLeft = productImage.getBoundingClientRect().left;

            productImageFly.setAttribute('class', '_flyImage _ibg');
            productImageFly.style.cssText =
                `
                left: ${productImageFlyLeft}px;
                top: ${productImageFlyTop}px;
                width: ${productImageFlyWidth}px;
                height: ${productImageFlyHeight}px;
            `;
            document.body.append(productImageFly);

            const cartFlyLeft = cart.getBoundingClientRect().left;
            const cartFlyTop = cart.getBoundingClientRect().top;

            productImageFly.style.cssText =
                `
                left: ${cartFlyLeft}px;
                top: ${cartFlyTop}px;
                width: 0px;
                height: 0px;
                opacity: 0;
            `;

            productImageFly.addEventListener('transitionend', function () {
                if (productButton.classList.contains('_fly')) {
                    productImageFly.remove();
                    updateCart(productButton, productId);
                    productButton.classList.remove('_fly');
                }
            });
        }
    }
    //Update Cart
    function updateCart(productButton, productId, productAdd = true) {
        //общая оболочка корзины
        const cart = document.querySelector('.cart-header');
        //иконка
        const cartIcon = cart.querySelector('.cart-header__icon');
        //количество товаров внутри иконки
        const cartQuantity = cartIcon.querySelector('span');
        //товар находящийся в списке внутри корзины
        const cartProduct = document.querySelector(`[data-cart-pid="${productId}"]`);
        //оболочка списка товаров
        const cartList = document.querySelector('.cart-list');

        //Добавляем
        if (productAdd) {
            if (cartQuantity) {
                // если существует спан, то мы увеличиваем содержимое на единицу
                cartQuantity.innerHTML = ++cartQuantity.innerHTML;
            } else {
            // если не существует то мы создаем этот спан
                cartIcon.insertAdjacentHTML('beforeend', `<span>1</span>`);
            }
            //существует ли добавленный товар, если нет то формируем его
            if (!cartProduct) {
                // получаем оригинальный товар, получаем картинки и название
                const product = document.querySelector(`[data-pid="${productId}"]`);
                const cartProductImage = product.querySelector('.item-product__image').innerHTML;
                const cartProductTitle = product.querySelector('.item-product__title').innerHTML;
//блок с корзиной
                const cartProductContent =
                    `<a href="" class="cart-list__image _ibg">${cartProductImage}</a>
                    <div class="cart-list__body">
                        <a href="" class="cart-list__title">${cartProductTitle}</a>
                        <div class="cart-list__quantity">Quantity: <span>1</span></div>
                        <a href="" class="cart-list__delete">Delete</a>
                    </div>`;
                cartList.insertAdjacentHTML('beforeend', `<li data-cart-pid="${productId}" class="cart-list__item">${cartProductContent}</li>`);
            } else {
                const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
                cartProductQuantity.innerHTML = ++cartProductQuantity.innerHTML;
            }
//после всех действий
            productButton.classList.remove('_hold');
            //удаление из корзины
        } else {
            // количество добавленного товара в корзину и уменьшение его на 1
            const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
            cartProductQuantity.innerHTML = --cartProductQuantity.innerHTML;
            // и если ничего удалять то товар убираем
            if (!parseInt(cartProductQuantity.innerHTML)) {
                cartProduct.remove();
            }

            const cartQuantityValue = --cartQuantity.innerHTML;
// если количество больше 0 то убираем из спан
            if (cartQuantityValue) {
                cartQuantity.innerHTML = cartQuantityValue;
            } else {
                cartQuantity.remove();
                cart.classList.remove('_active');
            }
        }
    }




    //Furniture gallery
    const furniture = document.querySelector('.furniture__body');
    if(furniture && !isMobile.any()) {
         // проверка на существование абъекта и то что это не тач скрин
        const furnitureItems = document.querySelector('.furniture__items');
        const furnitureColumn = document.querySelectorAll('.furniture__column');
        
        //Скорость анимации
        const speed = furniture.dataset.speed;

         //Объявление переменных
        let positionX = 0;
        
        let coordXprocent = 0;

        function setMouseGalleryStyle() {
            let furnitureItemsWidth = 0;
            //вычисляем актуальный размер всего контента
            furnitureColumn.forEach(element => {
                furnitureItemsWidth += element.offsetWidth;
            });

            //получаем разницу ширин всего контента и видимой части (движение за курсором)
            const furnitureDifferent = furnitureItemsWidth - furniture.offsetWidth;
            const distX = Math.floor(coordXprocent - positionX);
 //  с учетом скорости добавляем в переменную positionX потом относительно разницы ширин
            positionX = positionX + (distX * speed);
            let position = furnitureDifferent / 200 * positionX;

            furnitureItems.style.cssText = `transform: translate3d(${-position}px,0,0);`;

            if (Math.abs(distX) > 0) {
                requestAnimationFrame(setMouseGalleryStyle);
            } else {
                furniture.classList.remove('_init');
            }
        }

        furniture.addEventListener("mousemove", function (e) {
             //получение ширины
            const furnitureWidth = furniture.offsetWidth;

             //ноль по середине
            const coordX = e.pageX - furnitureWidth / 2;

             //получаем проценты
            coordXprocent = coordX / furnitureWidth * 200;

            if (!furniture.classList.contains('_init')) {
                requestAnimationFrame(setMouseGalleryStyle);
                furniture.classList.add('_init');
            }
        });
    }
}