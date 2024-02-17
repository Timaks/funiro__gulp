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
    }   
}