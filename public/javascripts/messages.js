var msg
;(function(){
    function message(content, status, duration) {
        if (typeof duration != 'number')
            duration = 3000
        var msg = $('<div class="message ' + status + '">' + content + '</div>').appendTo($('#messages')).slideDown('fast')
        setTimeout(function() {
            msg.slideUp('fast', function() { msg.remove() })
        }, duration)
    }
    function infoMessage(content, duration) { message(content, 'info', duration) }
    function warningMessage(content, duration) { message(content, 'warning', duration) }
    function errorMessage(content, duration) { message(content, 'error', duration) }
    function ajaxError(xhr) {
        errorMessage(xhr.responseText || xhr.statusText || ('Что-то пошло не так: ' + xhr.status))
    }
    msg = { general: message, info: infoMessage, warning: warningMessage, error: errorMessage, ajaxError: ajaxError }
    $(document).ready(function() {
        $('body').append('<div id="messages"></div>')
    })
})()
