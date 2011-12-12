/*********************************
	
	PrefencesDisplayLogic

**********************************/
var tempPrefs;
var isPrefsShowing = false;

function resetPreferences()
{
	$('prefsDiv').innerHTML = '';
	tempPrefs = null;
}

function showPreferences()
{
	if(isPrefsShowing)
		return;
	isPrefsShowing = true;
	tempPrefs = copy(selection);
	buildPreferences();
	$('content').style.display = 'none';
	$('header').style.display = 'none';
	$("welcome").style.display = 'none';
	$('prefsDiv').style.display = 'block';
}

function hidePreferences()
{
	isPrefsShowing = false;
	$('content').style.display = 'block';
	$('header').style.display = 'block';
	$('prefsDiv').style.display = 'none';
	resetPreferences();
}

function savePreferences()
{
	saveComics();
	hidePreferences();
	resetComics();
	initDisplay();
}

/*********************************
	
	Prefences Display

**********************************/
function buildPreferences()
{
	addLinks();
	addPreferenceButtons();
        
	// Go Comics
	addBreak("GoComics");
	for(var k = 0; k < gocomics.length; ++k)
	{
	    var comicProps = gocomics[k];
		addPreference(comicProps.index, comicProps.name);
	}
	
	// Yahoo Comics
	addBreak("Yahoo");
	for(var k = 0;k < yahoo.length; ++k)
	{
	    var comicProps = yahoo[k];
		addPreference(comicProps.index, comicProps.name);
	}
	
	// PhD
	addBreak("Other");
	addPreference(phd.index, phd.name);
	addPreference(XKCD.index, XKCD.name);
	
        // ArcaMax Comics
	addBreak("ArcaMax");
	for(var k = 0;k < arcamax.length; ++k)
	{
	    var comicProps = arcamax[k];
	    addPreference(comicProps.index, comicProps.name);
	}

	// Other
	
	// Add buttons
        addBreak("");
	addPreferenceButtons();
	
	if (getViewName() == "canvas" || autoheight)
	{
		/* Do canvas specific stuff here */
		gadgets.window.adjustHeight
    }
}

function addLinks()
{
	// Create variables
	var content = $("prefsDiv");
	var container = document.createElement("div");

	container.className = "hd";
	container.appendChild(makeActionLink(selectAll,"Select All"));
	container.appendChild(makeLinkSeparator());
	container.appendChild(makeActionLink(selectNone,"Deselect All"));

	content.appendChild(container);
}

function makeLinkSeparator()
{
	var span = document.createElement("span");
	var text = document.createTextNode("|");
	span.appendChild(text);
	span.className = "linkSep";
	return span;
}

function makeActionLink(fun, txt)
{
	var link = document.createElement("a");
	var text = document.createTextNode(txt);

	link.onclick = function() {fun();};
	link.href = "#";
	link.appendChild(text);
	return link;
}

function addBreak(name)
{
	// Create variables
	var content = $("prefsDiv");
	var container = document.createElement("div");
	var span = document.createElement("span");
	var text = document.createTextNode(name);
	var hr = document.createElement("hr");
	
	// Set attributes
	container.className = "comicType";
		
	// Add to DOM
	span.appendChild(text);
	container.appendChild(span);
	container.appendChild(hr);
	content.appendChild(container);
}

function addPreferenceButtons()
{
	// Create variables
	var content = $("prefsDiv");
	var container = document.createElement("div");
	var cancel = document.createElement("input");
	var save = document.createElement("input");
	var stext = document.createTextNode('Save');
	var ctext = document.createTextNode('Cancel');
	
	// Set attributes
	cancel.type = 'button';
	cancel.value = "Cancel";
	cancel.className = "prefBut";
	cancel.onclick = function(e){hidePreferences();};
	save.value = "Save";
	save.type = 'button';
	save.className = "prefBut";
	save.onclick = function(e){savePreferences();};
		
	// Add to DOM
	container.appendChild(save);
	container.appendChild(cancel);
	content.appendChild(container);
}

function addPreference(index, name)
{
	checkPrefSize(index);
	
	// Create variables
	var content = $("prefsDiv");
	var container = document.createElement("div");
	var choice = document.createElement("input");
	var label = document.createElement("span");
	var text = document.createTextNode(name);
	
	// Set attributes
	choice.type = 'checkbox';
	if( hasComic(index) )
		choice.defaultChecked = true;
	choice.onclick = function(e) {saveComic(index);}
		
	// Add to DOM
	label.appendChild(text);
	container.appendChild(choice);
	container.appendChild(label);
	content.appendChild(container);
}


/*********************************
	
	Prefences Utilities

**********************************/

function selectAll()
{
	defaultChoices(true);
}

function selectNone()
{
	defaultChoices(false);
}

function defaultChoices(choice)
{
	var content = $("prefsDiv");
	var selections = content.getElementsByTagName("input");
	for(var i = 0; i < selections.length; ++i)
	{
	    if(selections[i].type != "checkbox")
	        continue;
		selections[i].defaultChecked = choice;
	    selections[i].checked = choice;
	}
	for(var i = 0; i < tempPrefs.length; ++i)
	{
		if(choice)
	        tempPrefs[i] = '1';
	    else
	        tempPrefs[i] = '0';
	}
}

function checkPrefSize(index)
{
	var rlen = index + 1;
	if(tempPrefs.length < rlen)
	{
		for(var i = tempPrefs.length; i < rlen; ++i)
		{
			tempPrefs.push("0");
		}
	}
}

function hasComic(index)
{
	if(selection[index] == '1')
		return true;
	return false;
}

function saveComic(index)
{
	if(tempPrefs[index] == '0')
		tempPrefs[index] = '1';
	else
		tempPrefs[index] = '0';
}

function saveComics()
{
	selection = tempPrefs;
	prefs.set('comics', selection.join(''));
}
