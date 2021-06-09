function initialize(connection) {
    let galleryModal = $('#gallery-modal');
    let questionModal = $('#question-modal');

    document.onpaste = (event) => {
        if (!galleryModal.is(':visible') || questionModal.is(':visible')) {
            return;
        }

        let items = (event.clipboardData  || event.originalEvent.clipboardData).items;
        // get mime types
        //console.log(JSON.stringify(items));
        console.log(items);
        // find pasted image among pasted items
        let blob = null;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") === 0) {
                blob = items[i].getAsFile();
            }
        }

        // load image if there is a pasted image
        if (blob !== null) {
            let reader = new FileReader();
            reader.onload = function(event) {
                console.log(event.target.result); // data url!
                connection.sendMessage("add_question/" + event.target.result);
            };
            reader.readAsDataURL(blob);
        }
    };
}

module.exports = {
    initialize: initialize
}