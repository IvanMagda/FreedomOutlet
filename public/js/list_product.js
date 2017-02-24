function info_tile(node) {
    var parent = node.parentNode;
    var elt = findAncestor(parent, 'product-info');
    elt.childNodes[4].style.display = 'flex';
}

function findAncestor(el, sel) {
    while ((el = el.parentElement) && ((el.matches || el.matchesSelector).call(el, sel))) { console.log(el);};
    return el;
}

function close_info(node) {
    node.parentNode.parentNode.parentNode.style.display = 'none';
}