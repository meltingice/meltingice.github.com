(function () {

var usernames = {
	twitter: 'meltingice',
	github: 'meltingice',
	twitpic: 'meltingice'
};

jfu.set_path('js/jsonp-fu/');
jfu.load({
	github: {}
});

jfu.ready('github', function () {
	var self = this;
	
	this.repos.user({user: usernames.github}, function (resp) {
		// Sort the repositories by pushed_at date
		resp.repositories.sort(function (a, b) {
			return strtotime(b.pushed_at) - strtotime(a.pushed_at);
		});
		
		resp.repositories.forEach(function (repo) {
			if (repo.fork) {
				return true;
			}
				
			$('<li />')
				.addClass('github-repo')
				.data('name', repo.name)
				.data('url', repo.url)
				.data('homepage', repo.homepage)
				.html(
					'<h1>' + repo.name + '</h1>' + 
					'<p>' + repo.description + '</p>' +
					'<p class="timeline-meta"><small>' + repo.watchers + ' watchers, ' + repo.forks + ' forks</small></p>'
				)
				.appendTo("#github");
		});
	})
	
	$('.github-repo').live('click', function () {
		$("#sidebar-title").html($(this).data('name'));
		$("#commit-timeline").empty();
		
		$("#sidebar-buttons").show();
		$("#repo-site").attr('href', $(this).data('homepage'));
		$("#repo-link").attr('href', $(this).data('url'));
		
		self.commits.list(
			{
				user_id: usernames.github,
				repository: $(this).data('name'),
				branch: 'master'
			},
			function (resp) {
				resp.commits.forEach(function (commit) {
					$('<li />')
						.addClass("github-commit")
						.html(
							'<p>' + commit.message + '</p>' +
							'<p><small>Committed ' + 
								'<a target="_blank" href="http://github.com' + commit.url + '">' +
								date('M j, Y g:ia', strtotime(commit.committed_date)) + 
								'</a>' +
							'</small></p>'
						)
						.appendTo('#commit-timeline');
				});
			}
		);
	});
});

}());