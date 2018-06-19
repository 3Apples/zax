function framework_paths (name) {
	return '../../' + name;
}

module.exports = function(grunt) {
	require("load-grunt-tasks")(grunt);
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		babel: {
			options: {
				sourceMap: false,
				"presets": [ "env", "react", ],
				"plugins": [ "transform-react-pug", "transform-react-jsx" ],
			},
			dist: {
				files: [
					{
						expand: true,
						cwd: 'public/genetelella/app/',
						src: ['**/*.jsx'],
						dest: 'public/genetelella/app/',
						ext: '.js',
						extDot: 'first'
					}
				]
			},
		},
		watch: {
			scripts: {
				files: ['**/*.jsx'],
				tasks: ['babel'],
				options: {
					spawn: false,
				},
			},
		},
	});



	grunt.registerTask('default', [ /* 'requirejs', 'less', */ 'babel', 'watch' ]);
};
