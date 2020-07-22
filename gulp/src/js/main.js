$(document).ready(function () {
    $('.navbar__dropdown__items').hover(
        function () {
            $('.navbar__dropdown').removeClass('hidden');
        },
        function () {
            $('.navbar__dropdown').addClass('hidden');
        }
    )
});