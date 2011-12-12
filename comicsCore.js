function resetComics()
{
	displayed_comics = {};
	$('content').innerHTML = '';
}
 
/*********************************
	
	Base Comic Base
 
**********************************/
 
function Comic()
{
	/** parameters */
	this.name = '';
	this.shortName = '';
	this.author = '';
	this.imgsrc = '';
	this.errCount = 0;
	this.direction = -1;
	this.firstError = true;
}
 
Comic.prototype.updateImage = function()
{
	var self = this;
	if($(this.shortName) == null)
		setTimeout(function(){ self.updateImage();}, 100);
	else
		this._updateImage();
}

Comic.prototype._updateImage = function()
{
	$(this.shortName).src = this.imgsrc;//_IG_GetCachedUrl(this.imgsrc);
	$("a" + this.shortName).href = this.imgsrc;//_IG_GetCachedUrl(this.imgsrc);
	$("fb_" + this.shortName).setAttribute("href", "http://www.facebook.com/sharer.php?u=" + encodeURIComponent(this.imgsrc) + "&t=" + encodeURIComponent(this.name));//_IG_GetCachedUrl(this.imgsrc);
	$("tw_" + this.shortName).setAttribute("href", "http://twitter.com/home?status=" + encodeURIComponent(this.name) + encodeURIComponent(" - ") + encodeURIComponent(this.imgsrc));
};
 
Comic.prototype.onError = function()
{
	if(this.firstError)
	{
		this.firstError = false;
		return;
	}
	this.errCount += 1;
	if(this.errCount < 10)
	{
		if(this.direction < 0)
			this.setPrevious();
		else
			this.setNext();
	}
};

Comic.prototype.onResponse = function(response)
{
	this.parse(response.data);
	this.updateImage();
};

Comic.prototype.setImg = function()
{
	var self = this;
	var params = {};
	params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.TEXT;
	gadgets.io.makeRequest(this.url, (function(response){ self.onResponse(response);}), params);
};

Comic.prototype.parse = function(response){};
Comic.prototype.setPrevious = function(){};
Comic.prototype.setNext = function(){};
Comic.prototype.init = function(){};
 
Comic.prototype.previous = function()
{
	this.firstError = false;
	this.errCount = 0;
	this.direction = -1;
	this.setPrevious();
}
 
Comic.prototype.next = function()
{
	this.firstError = false;
	this.errCount = 0;
	this.direction = 1;
	this.setNext();
}
 
/*********************************
	
	Go Comics Class
 
**********************************/
 
function GoComic(comicObj)
{
	/** Parameters */
	this.date = new Date();
	this.format = "/20%Y/%M/%D/";
	this.source = comicObj;
	this.init();
}
GoComic.prototype = new Comic;
 
/** Go Comic Functions */
 
GoComic.prototype.init = function()
{
	this.name = this.source.name;
	this.shortName = this.source.link;
	this.linkName = this.source.shortName;
	//this.fixName(this.source.name);
	this.author = this.source.author;
	
	this.url = "http://www.gocomics.com/" + this.linkName;
	this.nexturl = null;
	this.previousurl = null;
	this.imgsrc = '';
	this.setImg();
};
 
GoComic.prototype.fixName = function(cname)
{
	cname = cname.split(":")[0];
	cname = cname.replace(/[ \.]/g, "");
	cname = cname.replace("@", "at");
	this.linkName = cname.toLowerCase();
};
 
GoComic.prototype.setNext = function()
{
	this.date.setDate( this.date.getDate() + 1);
	if(this.nexturl != null)
	{
		this.url = this.nexturl;
		this.nexturl = null;
	}
	else
	{
		this.url = "http://www.gocomics.com/" + this.linkName + getDateString(this.date, this.format);
	}
	this.setImg();
};
 
GoComic.prototype.setPrevious = function()
{
	this.date.setDate( this.date.getDate() - 1);
	if(this.previousurl != null)
	{
		this.url = this.previousurl;
		this.previousurl = null;
	}
	else
	{
		this.url = "http://www.gocomics.com/" + this.linkName + getDateString(this.date, this.format);
	}
	this.setImg();
};
 
GoComic.prototype.parse = function(response)
{
 	var searchterm = "http://cdn.svcs.c2.uclick.com/";
	var startindex = response.indexOf(searchterm);
	var endindex = startindex;
	if (startindex >= 0)
	{
		// get image src
		this.imgsrc = '';
		
		if(startindex >= 0)
		{
			startindex = startindex + searchterm.length;
			endindex = response.indexOf('"', startindex);
			if(endindex > startindex)
				this.imgsrc = searchterm + response.substring(startindex, endindex);
		}
 
        this.previousurl = null;
		// get prev url
		searchterm = '>Previous feature<';
		endindex = response.indexOf(searchterm);
		if(endindex >= 0)
		{
			startindex = response.lastIndexOf('href="', endindex);
			if(startindex >= 0)
			{
				startindex += 6;
				endindex = response.indexOf('"', startindex);
				if(endindex >= 0 && startindex < endindex)
					this.previousurl = "http://www.gocomics.com" + response.substring(startindex, endindex);
			}
		}

		// get next url
		this.nexturl = null;
		searchterm = '>Next feature<';
		endindex = response.indexOf(searchterm);
		if(endindex >= 0)
		{
			startindex = response.lastIndexOf('href="', endindex);
			if(startindex >= 0)
			{
				startindex += 6;
				endindex = response.indexOf('"', startindex);
				if(endindex >= 0 && startindex < endindex)
					this.nexturl = "http://www.gocomics.com" + response.substring(startindex, endindex);
			}
		}
	}
};
 
/*********************************
	
	PhD Comics
 
**********************************/
 
function PhDComic()
{
	this.date = new Date();
	this.format = "%M%D%Y";
	this.firstError = false;
	this.init();
}
 
PhDComic.prototype = new Comic;
 
PhDComic.prototype.init = function()
{
	this.name = phd.name;
	this.shortName = "PhD";
	this.author = phd.author;
	this.setImg();
};
 
PhDComic.prototype.setNext = function()
{
	if(isToday(this.date))
		return;
	this.date.setDate( this.date.getDate() + 1);
	this.setImg();
	this.updateImage();
};
 
PhDComic.prototype.setPrevious = function()
{
	this.date.setDate( this.date.getDate() - 1);
	this.setImg();
	this.updateImage();
};
 
PhDComic.prototype.setImg = function()
{
	this.imgsrc = "http://www.phdcomics.com/comics/archive/phd";
	this.imgsrc += getDateString(this.date, this.format) + "s.gif";
};
 
/*********************************
	
	Yahoo Comics
 
**********************************/
 
function YahooComic(comicObj)
{
	this.source = comicObj;
	this.init();
}
 
YahooComic.prototype = new Comic;
 
YahooComic.prototype.init = function()
{
	this.name = this.source.name;
	this.shortName = this.source.link;
	this.author = this.source.author;
	this.url = "http://news.yahoo.com/comics/" + this.shortName;
	this.nexturl = null;
	this.previousurl = null;
	this.imgsrc = '';
	this.currentImgIndex = -1;
	this.images = [];
	this.setImg();
};
 
YahooComic.prototype.onError = function(){};
 
YahooComic.prototype.parse = function(response)
{
	// parse the previous images
	var count = 0;
	var subindex = response.indexOf('<li class="item');
	while(subindex > 0 && count < 10)
	{
		++count;
		// get image src
		var startindex = 0;
		var endindex = 0;
		var checkindex = 0;

		startindex = response.indexOf('src="', subindex); 
		if(startindex < subindex)
			break;                

		startindex += 5;		
		var endindex = response.indexOf('"', startindex);
		if(endindex < startindex)
			break;
		this.images.push(response.substring(startindex, endindex));
		this.currentImgIndex += 1;
		subindex = response.indexOf('<li class="item', endindex);
	}
 
	if(this.currentImgIndex > -1)
		this.imgsrc = this.images[this.currentImgIndex];
};
 
YahooComic.prototype.setNext = function()
{
	if(this.currentImgIndex < this.images.length - 1)
	{
		this.currentImgIndex += 1;
		this.imgsrc = this.images[this.currentImgIndex];
		this.updateImage();
	}
};
 
YahooComic.prototype.setPrevious = function()
{
	if(this.currentImgIndex > 0)
	{
		this.currentImgIndex -= 1;
		this.imgsrc = this.images[this.currentImgIndex];
		this.updateImage();
	}
};
 
/*********************************
 
ArcaMax Comics
 
**********************************/
 
function ArcaMaxComic(comicObj)
{
	this.source = comicObj;
	this.init();
}
 
ArcaMaxComic.prototype = new Comic;
 
ArcaMaxComic.prototype.init = function()
{
	this.name = this.source.name;
	this.shortName = this.source.link;
	this.author = this.source.author;
	this.url = "http://www.arcamax.com/thefunnies/" + this.shortName; 
	this.nexturl = null; 
	this.previousurl = null; 
	this.imgsrc = ''; 
	this.setImg(); 
}; 
 
ArcaMaxComic.prototype.onError = function(){}; 
 
ArcaMaxComic.prototype.parse = function(response) 
{ 
	var subindex = response.indexOf("/newspics/"); 
 
	if (subindex >= 0)
	{
		// get image src
		var srcStart = subindex;
		var srcEnd = response.indexOf("\"", srcStart);
		this.imgsrc = "http://www.arcamax.com" + response.substring(srcStart, srcEnd);
 
		// get prev url
		var endindex = response.indexOf("\">Previous</a>", srcEnd);
		var startindex = endindex;
		if(endindex > srcEnd)
		{
			startindex = response.lastIndexOf("\"", endindex - 1);
			this.previousurl = "http://www.arcamax.com" + response.substring(startindex + 1, endindex);
		}
		else
		{
			this.previousurl = null;			
		}
 
		// get next url
		endindex = response.indexOf("\">Next</a>", srcEnd);
		if(endindex > srcEnd)
		{
			startindex = response.lastIndexOf("\"", endindex - 1);
			this.nexturl = "http://www.arcamax.com" + response.substring(startindex + 1, endindex);
		}
		else
		{
			this.nexturl = null;
		}
	}
};
 
ArcaMaxComic.prototype.setNext = function()
{
	if(this.nexturl == null)
		return;
	this.url = this.nexturl;
	this.nexturl = null;
	this.setImg();
};
 
ArcaMaxComic.prototype.setPrevious = function()
{
	if(this.previousurl == null)
		return;
	this.url = this.previousurl;
	this.previousurl = null;
	this.setImg();
};
 
/*********************************
 
XKCD Comic
 
**********************************/
 
function XKCDComic()
{
	this.init();
}
 
XKCDComic.prototype = new Comic;
 
XKCDComic.prototype.init = function()
{
	this.name = XKCD.name;
	this.shortName = "XKCD";
	this.author = XKCD.author;
	this.url = "http://www.XKCD.com/"
	this.maxComic = -1;
	this.currentComic = -1;
	this.imgsrc = ''; 
	this.setImg(); 
}; 
 
XKCDComic.prototype.onError = function(){}; 
 
XKCDComic.prototype.parse = function(response) 
{ 
	var startindex = -1;
	var endindex = -1;
	if(this.maxComic == -1)
	{
		var matchString = "Permanent link to this comic: http://xkcd.com/";
		startindex = response.indexOf(matchString); 
		if(startindex >= 0)
		{
			startindex += matchString.length;
			endindex = response.indexOf("/", startindex);
			if(endindex > startindex)
			{
				this.maxComic = parseInt(response.substring(startindex, endindex));
				this.currentComic = this.maxComic;
			}
		}
		
	}
	
	if(this.maxComic < 0)
		return;
		
	startindex = response.indexOf("http://imgs.xkcd.com/comics/"); 
 
	if (startindex >= 0)
	{
		endindex = response.indexOf("\"", startindex);
		if(endindex > startindex)
			this.imgsrc = response.substring(startindex, endindex);
	}
};
 
XKCDComic.prototype.setNext = function()
{
	if(this.currentComic == this.maxComic)
		return;
	++this.currentComic;
	this.url = "http://www.XKCD.com/" + this.currentComic;
	this.setImg();
};
 
XKCDComic.prototype.setPrevious = function()
{
	if(this.currentComic == 0)
		return;
	--this.currentComic;
	this.url = "http://www.XKCD.com/" + this.currentComic;
	this.setImg();
};

/*********************************
	
	Utilities
 
**********************************/
 
/**
 * Returns the given date in the format specified.
 * The year, month, and day will always be 2 digits
 * each.
 *
 * @param date - the Date to be converted 
 * @param format - format string where %Y will be replaced
 * by the 2 digit year, %D will be replaced by the 2 digit
 * day and %M will be replaced by the 2 digit month.
 */
function getDateString(date, format)
{
	var year = new String(date.getFullYear());
	year = year.substr(2,2);
	var month = new String(date.getMonth() + 1);
	if(month.length == 1)
		month = "0" + month;
	var day = new String(date.getDate());
	if(day.length == 1)
		day = "0" + day;
	format = format.replace("%Y", year);
	format = format.replace("%D", day);
	format = format.replace("%M", month);
	return format;
}
 
/**
 * Short hand for document.getElementById
 */
function $(id)
{ 
	return document.getElementById(id);
}

/**
 * Shallow Copies an array
 */
function copy(a)
{
	var b = new Array(a.length);
	for(var i = 0; i < a.length; ++i)
	{
		b[i] = a[i];
	}
	return b;
}
 
/**
 * Moves all displayed comics up a day
 */
function globalNext()
{
	for(var comic in displayed_comics)
	{
		displayed_comics[comic].next();
	}
}
 
/**
 * Moves all displayed comics back a day
 */
function globalPrevious()
{
	for(var comic in displayed_comics)
	{
		displayed_comics[comic].previous();
	}
}
 
/**
 * Returns true if the given date is today's date
 */
function isToday(date)
{
	if(date.getDate() != todaysDate.getDate())
		return false;
	if(date.getMonth() != todaysDate.getMonth())
		return false;
	if(date.getFullYear() != todaysDate.getFullYear())
		return false;
	return true;
}
 
function makeCachedRequest(url, callback, refreshInterval)
{
	var ts = new Date().getTime();
	var sep = "?";
 
	if(!refreshInterval)
	{
		ts = "cache";
	}
	else if (refreshInterval && refreshInterval > 0)
	{
		ts = Math.floor(ts / (refreshInterval * 1000));
	}
       
	if (url.indexOf("?") > -1)
	{
		sep = "&";
	}
       
	url = [ url, sep, "nocache=", ts ].join("");
	
	var params = {};
	params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.TEXT;
	gadgets.io.makeRequest(this.url, callback, params);
}
