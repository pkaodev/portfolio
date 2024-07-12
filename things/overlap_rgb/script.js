document.addEventListener('DOMContentLoaded', function() {
    const draggableElements = document.querySelectorAll('.red-lantern, .green-lantern, .blue-lantern');

    draggableElements.forEach(elem => {
        elem.addEventListener('mousedown', function(e) {
            let offsetX = e.clientX - elem.getBoundingClientRect().left;
            let offsetY = e.clientY - elem.getBoundingClientRect().top;

            function mouseMoveHandler(e) {
                elem.style.position = 'absolute';
                elem.style.left = (e.clientX - offsetX) + 'px';
                elem.style.top = (e.clientY - offsetY) + 'px';
            }

            function mouseUpHandler() {
                document.removeEventListener('mousemove', mouseMoveHandler);
                document.removeEventListener('mouseup', mouseUpHandler);
            }

            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        });
    });
});
