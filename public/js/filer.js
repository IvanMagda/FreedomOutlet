﻿$(document).ready(function () {
    FilerLoad();
});

function FilerLoad() {
    $('#filer_input').fileuploader({
        extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp'],
        changeInput: ' ',
        theme: 'thumbnails',
        enableApi: true,
        addMore: true,
        thumbnails: {
            box: '<div class="fileuploader-items">' +
            '<ul class="fileuploader-items-list">' +
            '<li class="fileuploader-thumbnails-input"><div class="fileuploader-thumbnails-input-inner">+</div></li>' +
            '</ul>' +
            '</div>',
            item: '<li class="fileuploader-item">' +
            '<div class="fileuploader-item-inner">' +
            '<div class="thumbnail-holder">${image}</div>' +
            '<div class="actions-holder">' +
            '<a class="fileuploader-action fileuploader-action-remove" title="Remove"><i class="remove"></i></a>' +
            '</div>' +
            '<div class="progress-holder">${progressBar}</div>' +
            '</div>' +
            '</li>',
            item2: '<li class="fileuploader-item">' +
            '<div class="fileuploader-item-inner">' +
            '<div class="thumbnail-holder">${image}</div>' +
            '<div class="actions-holder">' +
            '<a class="fileuploader-action fileuploader-action-remove" title="Remove"><i class="remove"></i></a>' +
            '</div>' +
            '</div>' +
            '</li>',
            startImageRenderer: true,
            canvasImage: false,
            _selectors: {
                list: '.fileuploader-items-list',
                item: '.fileuploader-item',
                start: '.fileuploader-action-start',
                retry: '.fileuploader-action-retry',
                remove: '.fileuploader-action-remove'
            },
            onItemShow: function (item, listEl) {
                var plusInput = listEl.find('.fileuploader-thumbnails-input');

                plusInput.insertAfter(item.html);

                if (item.format == 'image') {
                    item.html.find('.fileuploader-item-icon').hide();
                }
            },
            onItemRemove: function (itemEl, listEl, parentEl, newInputEl, inputEl) {
                itemEl.children().animate({ 'opacity': 0 }, 200, function () {
                    setTimeout(function () {
                        itemEl.slideUp(200, function () {
                            itemEl.remove();
                        });
                    }, 100);
                });
                deleteImg(itemEl);
            }
        },
        afterRender: function (listEl, parentEl, newInputEl, inputEl) {
            var plusInput = listEl.find('.fileuploader-thumbnails-input'),
                api = $.fileuploader.getInstance(inputEl.get(0));

            plusInput.on('click', function () {
                api.open();

            });
        },
    });
};


function deleteImg(itemEl) {
    var img_src = $(itemEl).find('img:first').attr('src');
    var src = { 'src': img_src };
    if (img_src.startsWith("/")) {
        $.post('/products/delete_img/', src, function (answer) {
            console.log('del');
	    console.log(answer);
        });
    }
}