var parser = new DOMParser();
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
    set_content(page);
    setFooter();

    window.onpopstate = function(e)
    {
        if (e.state)
        {
            this.set_content(e.state, false);
        }
    }
    
}

function readFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    var str = ""
    rawFile.onreadystatechange = function ()
    {
        str = rawFile.responseText;
    }
    rawFile.send(null)
    return str;
}
function setFooter()
{
    var div_obj = document.getElementById("rev");
    div_obj.textContent = "Site Revision: " + readFile("/.git/refs/heads/master");
}

function set_content(page_url, push = true) {
    // Create parser
    // get children of new document
    var newChildren = parser.parseFromString(readFile(page_url), "text/html").getElementsByTagName("body")[0].getElementsByTagName("*");
    var contentDiv = document.getElementById("content");
    /// Delete existing children
    while (contentDiv.childNodes.length > 0)
    {
        contentDiv.removeChild(contentDiv.childNodes[0]);
    }
    // insert new children
    while (newChildren.length > 0)
    {
        contentDiv.appendChild(newChildren[0]);
    }

    // fix clicks
    links = contentDiv.getElementsByTagName("a");
    for (index = 0; index < links.length; index++)
    {
        ele = links[index];
        var link_ref = ele.getAttribute("href");
        ele.setAttribute("href", "javascript:set_content('" + link_ref + "');");
    }

    if (push)
    {
        console.log("Trying to push state as " + page_url);
        window.history.pushState(page_url, "", "?page=" + page_url);
    }
    
}