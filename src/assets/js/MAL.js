document.addEventListener("DOMContentLoaded", function () {

	// var httpRequest;

	// if (window.XMLHttpRequest) {
	//   httpRequest = new XMLHttpRequest();
	// } else if (window.activeObject) {
	//   httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
	// }

	// httpRequest.open('GET', 'http://myanimelist.net/malappinfo.php?u=hatefish&status=all');
	// httpRequest.setRequestHeader('Content-Type', 'text/xml', true);

	// function loadMAL() {
	//   if (httpRequest.readyState === 4) {
	// 	var list = httpRequest.responseText;
	// 	var parser = new DOMParser();
	// 	var newList = parser.parseFromString(list, 'text/xml');

	// 	var animeList = newList.getElementsByTagName('anime');
	// 	var listContainer = document.getElementById('MAL');

	// 	for (var i = 0; i < animeList.length; i++) {
	// 	  // If the status of the series is 1 (meaning 'watching')
	// 	  var curStatus = animeList[i].getElementsByTagName('my_status')[0].firstChild.wholeText;
	// 	  if (animeList[i].getElementsByTagName('my_status')[0].firstChild.wholeText === "1") {
	// 		var newItem = '';
	// 		var title = animeList[i].getElementsByTagName('series_title')[0].firstChild.wholeText;
	// 		var epsWatched = animeList[i].getElementsByTagName('my_watched_episodes')[0].firstChild.wholeText;
	// 		var epsTotal = animeList[i].getElementsByTagName('series_episodes')[0].firstChild.wholeText;

	// 		var seriesId = animeList[i].getElementsByTagName('series_animedb_id')[0].firstChild.wholeText;
	// 		var urlTitle = title.replace(' ', '_');
	// 		var url = 'http://myanimelist.net/anime/'+seriesId+'/'+urlTitle;

	// 		newItem = '<tr><td><a href="'+url+'">'+ title + '</a></td><td>'+ epsWatched + ' / ' + epsTotal + '</td></tr>';
	// 		listContainer.innerHTML = listContainer.innerHTML + newItem;
	// 	  }
	// 	}
	//   }
	// }

	// httpRequest.onreadystatechange = loadMAL;
	// httpRequest.send();
	var mal = new MAList ({
		"user": "hatefish",
		"containerId": "MAL"
	});
	mal.populate();
	console.log(mal.parsedList);

});


function checkExists (cls, target, prop) {
	if (cls[prop] !== undefined) { target[prop] = cls[prop]; }
}

function MAList (argv) {
	var me = this;

	this.user = '';
	this.containerId = 'MAList';

	if (argv) {
		var argList = [
			'user',
			'containerId'
		];
		for (var x = 0; x < argList.length; x++) {
			checkExists (argv, this, argList[x]);
		}
	}

	var listContainer = document.getElementById(this.containerId);
	this.list = [];
	this.parsedList = [];

	var request = new XMLHttpRequest();
	request.open('GET', 'http://whateverorigin.org/get?url=http://myanimelist.net/malappinfo.php?u='+this.user+'&status=all');
	request.setRequestHeader('Content-Type', 'text/xml', true);
	request.onreadystatechange = this.loadMAL;
	request.send();

	this.loadMAL = function () {
		this.list = this.getList();
		console.log(this.list);
	};

	this.getAnimeAttribute = function (obj, tName) {
		return obj.getElementsByTagName(tName)[0].firstChild.wholeText;
	};

	this.getList = function () {
		var list = request.responseText;
		var parser = new DOMParser();
		var newList = parser.parseFromString(list, 'text/xml');
		return newList.getElementsByTagName('anime');
	};

	this.populate = function () {
		for(var i = 0; i < this.list.length; i++) {
			var curAnime = this.list[i];
			if (this.getAnimeAttribute(curAnime, 'my_status') === "1") {
				var newItem = {};
				newItem.title = getAnimeAttribute(curAnime, 'series_title');
				newItem.ref = newItem.title.replace(' ', '_');
				newItem.epsWatched = getAnimeAttribute(curAnime, 'series_title');
				newItem.epsTotal = getAnimeAttribute(curAnime, 'series_episodes');
				newItem.seriesId = getAnimeAttribute(curAnime, 'series_anime_id');
				newItem.seriesURL = 'http://myanimelist.net/anime/'+newItem.seriesId+'/'+newItem.ref;
				this.parsedList.push(newItem);
			}
		}
	  // if (animeList[i].getElementsByTagName('my_status')[0].firstChild.wholeText === "1") {
	  //   var newItem = '';
	  //   var title = animeList[i].getElementsByTagName('series_title')[0].firstChild.wholeText;
	  //   var epsWatched = animeList[i].getElementsByTagName('my_watched_episodes')[0].firstChild.wholeText;
	  //   var epsTotal = animeList[i].getElementsByTagName('series_episodes')[0].firstChild.wholeText;
	  //
	  //   var seriesId = animeList[i].getElementsByTagName('series_animedb_id')[0].firstChild.wholeText;
	  //   var urlTitle = title.replace(' ', '_');
	  //   var url = 'http://myanimelist.net/anime/'+seriesId+'/'+urlTitle;
	  //
	  //   newItem = '<tr><td><a href="'+url+'">'+ title + '</a></td><td>'+ epsWatched + ' / ' + epsTotal + '</td></tr>';
	  //   listContainer.innerHTML = listContainer.innerHTML + newItem;
	  // }
	};
}
