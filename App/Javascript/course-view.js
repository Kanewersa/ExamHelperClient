function initialize() {
    let courseButtons = $('#tabs-buttons').children('button');
    let courseTabs = $('#tabs').children('div');

    courseButtons.click(function () {
        courseButtons.each(function () {
            $(this).removeClass('active');
        });

        $(this).addClass('active');

        courseTabs.each(function () {
            $(this).removeClass('active');
        });

        let index = courseButtons.index($(this));
        courseTabs[index].classList.add('active');
    });
}

module.exports = {
    initialize: initialize
}