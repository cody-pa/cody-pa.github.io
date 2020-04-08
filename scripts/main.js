function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
function getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
        }
    return urlparameter;
}


function page_load() {
    var page = getUrlParam("page", "/pages/front.html");
    var request = new XMLHttpRequest();
    set_iframe(page);
}

function resizeIframe() {
    frame_obj = document.getElementById("content");
    var frame_url = "/" + frame_obj.contentWindow.location.href.replace(/^(?:\/\/|[^/]+)*\//, '');

    if (frame_url != "/blank.html") // when the page first loads the dummy src is put there
    {
        frame_obj.style.height = frame_obj.contentWindow.document.documentElement.scrollHeight + 'px';
        frame_obj.style.width = frame_obj.contentWindow.document.documentElement.scrollWidth + 'px';
        window.history.replaceState({}, "Page Title", "/?page=" + frame_url);
    };
}

function set_iframe(page_url) {
    var fr = document.getElementById("content");
    if (fr == null)
    {
        location.href = page_url;
    }
    else
    {
        fr.src = page_url;
    }
}