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