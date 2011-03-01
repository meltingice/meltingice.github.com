var MI = window.MI || {};

(function (window, $) {

	var load = (function () {
		var username	= 'meltingice',
			url_regex	= /(http\:\/\/([a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3})(\/\S*)?)/,
			hash_regex	= /#([A-Za-z0-9_]+)/;
		
		return {
			twitter: function () {
				twttr.anywhere(function(T) {
					T("body").hovercards();
				});
				
				$.ajax({
					type: 'GET',
					url: 'http://api.twitter.com/1/statuses/user_timeline.json',
					data: { screen_name : username },
					dataType: 'jsonp',
					success: function (data) {
						$("#twitter > .loading").remove();
						var profile_image = data[0].user.profile_image_url;
						$("#profile_image").html('<img src="' + profile_image.replace('normal', 'reasonably_small') + '" />');
						
						$.each(data.slice(0, 5), function (i, tweet) {
							tweet.text = tweet.text.replace(url_regex, "<a target=\"_blank\" href=\"$1\">$1</a>");
							tweet.text = tweet.text.replace(hash_regex, "<a target=\"_blank\" href=\"http://twitter.com/#search/%23$1\">#$1</a>");
							
							$("#twitter").append(
								"<li>" + 
								"<p>" + tweet.text + "</p>" +
								'<p class="meta">' + 
								'<a target="_blank" href="http://twitter.com/' + username + '/status/' + tweet.id + '">' + date.relative_time(tweet.created_at) + '</a>' +
								' via ' + tweet.source +
								'</p>' +
								"</li>"
							);
						});
					}
				});
			},
			
			github: function () {
				$.ajax({
					type: 'GET',
					url: 'http://github.com/api/v2/json/repos/show/' + username,
					data: { sortBy : 'pushed_at' },
					dataType: 'jsonp',
					success: function (data) {
						$("#github > .loading").remove();
						$.each(data.repositories.reverse().slice(0, 5), function (i, repo) {
							$("#github").append(
								"<li>" + 
									"<h3><a target=\"_blank\" href=\"" + repo.url + "\">" + repo.name + "</a></h3>" + 
									'<p class="meta">' + repo.description + '</p>' +
								"</li>"
							);
						});
					}
				});
			},
			
			twitpic: function () {
				twitpic.users.show({username : username}, function (user) {
					$("#twitpic_images > .loading").remove();
					$.each(user.images.slice(0, 15), function (i, image) {
						$("#twitpic_images").append(
							'<a target="_blank" href="http://twitpic.com/' + image.short_id + '">' +
							'<img style="width:75px;height:75px;" src="http://twitpic.com/show/mini/' + image.short_id + 
							'" /></a> '
						);
					});
				});
			},
			
			facebook: function () {
				FB.api('/rlefevre/feed', function (resp) {
					var HTML;
					
					$("#facebook > .loading").remove();
					
					$.each(resp.data.slice(0, 6), function (i, status) {
						console.log(status);

						HTML = "";
						if (status.type === 'status') {
							HTML = 
								"<li>" + 
									"<p>" + status.message + "</p>" +
									'<p class="meta">status updated ' + 
									date.relative_time(status.created_time.replace('T', ' ').replace('+0000', ''));
									
							if(status.comments) {
								HTML += ' with ' + status.comments.count + ' comment';
								if(status.comments.count > 1) {
									HTML += 's';
								}
							}
							
							HTML +=
									'</p>' +
								"</li>";
						} else if (status.type === 'link') {
							HTML =
								"<li>" +
									"<p><a href=\"" + status.link + "\">" + status.name + "</a></p>" +
									'<p class="meta">link shared ' + 
									date.relative_time(status.created_time.replace('T', ' ').replace('+0000', ''));
									
							if(status.comments) {
								HTML += ' with ' + status.comments.count + ' comment';
								if(status.comments.count > 1) {
									HTML += 's';
								}
							}
							
							HTML +=
									'</p>' +
								"</li>";
						}
						
						$("#facebook").append(HTML);
					});
				});
			},
			
			flickr: function () {
				$.ajax({
					type: 'GET',
					url: 'http://api.flickr.com/services/rest/',
					data: {
						method: 'flickr.people.getPublicPhotos',
						format: 'json',
						api_key: '54a547642fde8a600075acafbfe00861',
						user_id: '45836197@N00',
						per_page: 15
					},
					dataType: 'jsonp',
					jsonpCallback: 'jsonFlickrApi',
					success: function (data) {
						var photo_page,
							photo_url;

						$("#flickr_images > .loading").remove();						
						
						$.each(data.photos.photo, function (i, photo) {
							photo_page = "http://flickr.com/photos/meltingice/" + photo.id;
							photo_url = "http://farm" + photo.farm + ".static.flickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_s.jpg";
							$("#flickr_images").append(
								'<a target="_blank" href="' + photo_page + '">' +
								'<img style="width:75px;height:75px;" src="' + photo_url + '" /></a> '
							);
						});
					}
				});
			},
			
			blog: function () {
				$.ajax({
					type: 'GET',
					url: 'http://blog.meltingice.net/api/get_recent_posts',
					dataType: 'jsonp',
					success: function (data) {
						$("#blog > .loading").remove();
						
						$.each(data.posts.slice(0, 3), function (i, post) {
							$("#blog").append(
								"<li>" + 
									"<h3><a target=\"_blank\" href=\"" + post.url + "\">" + post.title + "</a></h3>" + 
									'<p class="meta">' + post.excerpt + '</p>' +
								"</li>"
							);
						});
					}
				});
			}
		};
	}());
	
	window.MI.facebook = function () {
		load.facebook();
	};
	
	$(document).ready(function () {
		load.twitter();
		load.github();
		load.twitpic();
		load.flickr();
		load.blog();
	});

}(window, jQuery));