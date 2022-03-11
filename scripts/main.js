var parser = new DOMParser();
var loading_image = new Image();
loading_image.src = "/media/loading.svg";

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
    set_content(page);

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
    return new Promise( function (resolve, reject)
    {
        if (file == "/")
        {
            reject({
                status: 0,
                statusText: "Tried to recurse"
            });
        }
        else
        {
            var rawFile = new XMLHttpRequest();
            rawFile.open("GET", file);
            rawFile.onload = function ()
            {
                resolve(rawFile.responseText);
            };
            rawFile.onerror = function()
            {
                reject({
                    status: this.status,
                    statusText: rawFile.statusText
                });
            };
            rawFile.send();
        }
    });
    
    
}

function set_content(page_url, push = true)
{
    var contentDiv = document.getElementById("content");
    /// Delete existing children
    while (contentDiv.childNodes.length > 0)
    {
        contentDiv.removeChild(contentDiv.childNodes[0]);
    }
    var loading_element = document.createElement("div");
    loading_element.setAttribute("id", "loader");
    contentDiv.appendChild(loading_element);

    wait_content(page_url, contentDiv, push)
}
async function wait_content(page_url, contentDiv, push = true) {
    
    // Create parser
    // get children of new document
    let result_text = await readFile(page_url);
    while (contentDiv.childNodes.length > 0)
    {
        contentDiv.removeChild(contentDiv.childNodes[0]);
    }
    console.log("Result: " + page_url);

    var newChildren = parser.parseFromString(result_text, "text/html").getElementsByTagName("body")[0].getElementsByTagName("*");
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

function openCollapsible(thing)
{
	if (thing.textContent.charAt(0) == '⯈')
	{
		thing.textContent = thing.textContent.replace('⯈', '▼');
	}
	else
	{
		thing.textContent = thing.textContent.replace('▼', '⯈');
	}
	var b = thing.nextElementSibling;
	b.hidden = !b.hidden;
};