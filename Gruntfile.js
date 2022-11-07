/* SPDX-License-Identifier: GPL-2.0-or-later */
/**
 * @source https://github.com/wikimedia/MonoBook/blob/master/Gruntfile.js
 * @license <https://www.gnu.org/licenses/old-licenses/gpl-2.0-standalone.html>
 */
'use strict';

module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-eslint');
	grunt.loadNpmTasks('grunt-stylelint');

	grunt.initConfig({
		eslint: {
			options: {
				cache: true,
				fix: grunt.option('fix')
			},
			all: [
				'*.{js,json}',
				'**/*.{js,json}',
				'!node_modules/**'
			]
		},
		stylelint: {
			all: [
				'**/*.{css,less}',
				'!node_modules/**'
			]
		}
	});

	grunt.registerTask('test', ['eslint', 'stylelint']);
	grunt.registerTask('default', ['test']);
};
