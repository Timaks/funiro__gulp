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
        if (targetElement.classList.contains('products__more'))
        {
            getProducts(targetElement);
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
}
