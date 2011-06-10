function initDisplay()
{
	if(currentWelcomeCount > welcomeCount)
	{
		$("welcome").style.display = 'block';
                prefs.set('welcome', currentWelcomeCount);
	}	
	
	if(selection.length == 0)
		return;

	// Go Comics
	for(var k = 0; k < gocomics.length; ++k)
	{
	    var comicProps = gocomics[k];
		chooseComic(comicProps.index, comicTypes.GO, comicProps);
	}
	
	// Yahoo Comics
	for(var k = 0;k < yahoo.length; ++k)
	{
	    var comicProps = yahoo[k];
		chooseComic(comicProps.index, comicTypes.YAHOO, comicProps);
	}
	
	// PhD
	chooseComic(phd.index, comicTypes.PHD, null);
	
        // ArcaMax Comics
	for(var k = 0;k < arcamax.length; ++k)
	{
	    var comicProps = arcamax[k];
	    chooseComic(comicProps.index, comicTypes.ARCAMAX, comicProps);
	}

	// XKCD
	chooseComic(XKCD.index, comicTypes.XKCD, null);
	
	// Other
	
	if (getViewName() == "canvas" || autoheight)
	{
		/* Do canvas specific stuff here */
		gadgets.window.adjustHeight();
		setTimeout("gadgets.window.adjustHeight()", 1000);
		setTimeout("gadgets.window.adjustHeight()", 2000);
		setTimeout("gadgets.window.adjustHeight()", 5000);      
	}

    SetOpenNewWindow();
}

function chooseComic(index, type, comicProps)
{
	if(!hasComic(index))
		return;
	var comic;
	if( type == comicTypes.GO)
		comic = new GoComic(comicProps);
	else if ( type == comicTypes.PHD)
		comic = new PhDComic();
	else if ( type == comicTypes.YAHOO)
		comic = new YahooComic(comicProps);
    else if ( type == comicTypes.ARCAMAX)
		comic = new ArcaMaxComic(comicProps);
	else if ( type == comicTypes.XKCD)
		comic = new XKCDComic();
	else
		return;
	addComicToDisplay(comic);
}

function addComicToDisplay(comic)
{
	displayed_comics[comic.shortName] = comic;
	addComic(comic);
}

function getViewName()
{
  return gadgets.views.getCurrentView().getName();
}

function addComic(comic)
{
	// Create variables
	var content = $("content");
	var div = document.createElement("div");
	var controls = document.createElement("div");
	var img = document.createElement("img");
	var link = document.createElement("a");
	var linkdiv = document.createElement("div");
	var next = document.createElement("span");
	var prev = document.createElement("span");
	var header = document.createElement("div");
	var text = document.createTextNode(comic.name + " by " + comic.author);
	var nexttext = document.createTextNode(">");
	var prevtext = document.createTextNode("<");
	var facebookLink = document.createElement("a");
	var facebookText = document.createTextNode(" ");
	var twLink = document.createElement("a");
	var twText = document.createTextNode(" ");
	
	var proxy = (comic.imgsrc == "" ? "" : comic.imgsrc);//gadgets.io.getProxyUrl(comic.imgsrc));
        
	// Set attributes
	div.className = "comic";
	header.className = "header";
	
	controls.className = "controls";
	prev.className = "previous";
	prev.onclick = function(e){comic.previous();};
	next.className = "next";
	next.onclick = function(e){comic.next();};
	
	facebookLink.setAttribute("id", "fb_" + comic.shortName);
	facebookLink.setAttribute("class", "fblink");
	facebookLink.setAttribute("href", "http://www.facebook.com/sharer.php?u=" + encodeURIComponent(comic.imgsrc) + "&t=" + encodeURIComponent(comic.name) );
	facebookLink.onclick = function(e) { window.open(facebookLink.href,'sharer','toolbar=0,status=0,width=750,height=436'); return false;};
	
	twLink.setAttribute("id", "tw_" + comic.shortName);
	twLink.setAttribute("class", "twlink");
	twLink.setAttribute("href", "http://twitter.com/home?status=" + encodeURIComponent(comic.name) + encodeURIComponent(" - ") + encodeURIComponent(comic.imgsrc));
	twLink.onclick = function(e) { window.open(twLink.href,'sharer','toolbar=0,status=0,width=775,height=436'); return false;};
	
	img.onerror = function(e) {comic.onError();};
	img.onload = function(e) {checkImage(img);};
	img.src = proxy;
	img.setAttribute("id", comic.shortName);
	img.setAttribute("border", 0);
	img.className = "all";

	link.setAttribute("href", comic.imgsrc);
	link.setAttribute("id", "a" + comic.shortName);
	link.setAttribute("target", "_blank");

	// Add to DOM
	facebookLink.appendChild(facebookText);
	twLink.appendChild(twText);
	next.appendChild(nexttext);
	prev.appendChild(prevtext);
	header.appendChild(text);
	
	link.appendChild(img);
	linkdiv.appendChild(link);
	
	controls.appendChild(prev);
	controls.appendChild(next);
	controls.appendChild(facebookLink);
	controls.appendChild(twLink);
	
	div.appendChild(header);
	div.appendChild(linkdiv);
	div.appendChild(controls);
	
	content.appendChild(div);
}

function checkImage(img)
{
	if(img.naturalWidth && img.naturalWidth < img.width)
		img.className = "all";
	else if(img.width < (document.body.clientWidth-32))
		img.className = "all";
	else
		img.className = "all restrained";
}

function SetOpenNewWindow()
{
  var loc = "http://" + window.location.hostname + window.location.pathname;
  var q = window.location.search;
  if(q.indexOf("up_comics") < 0)
  {
    q = q + "&up_comics=" + encodeURIComponent( prefs.getString('comics') ) + "&up_welcome=" + encodeURIComponent(prefs.getString("welcome")); 	
  }
  loc = loc + q;
  $("openInNew").setAttribute("href", loc);
}
