const esbuild = require('esbuild');
const alias = require('esbuild-plugin-alias');
const chokidar = require('chokidar');
const isProduction = process.env.ELEVENTY_ENV === 'production';
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

const buildJS = () => {
	esbuild.build({
		entryPoints: ['src/js/main.js'],
		bundle: true,
		minify: isProduction,
		sourcemap: false,
		define: { DEV_MODE: true },
		loader: { '.glsl': 'text', '.vert': 'text', '.frag': 'text' },
		outfile: 'bundle/main.js',
		plugins: [
			alias({
				'three': __dirname + '/node_modules/three/build/three.min.js',
			})
		]
	});
}

if(!isProduction) {
	chokidar.watch('src/').on('change', (eventType, file) => {
		console.log(`Updated JS [${eventType}]`);
		buildJS();
	});
}

buildJS();

module.exports = function (eleventyConfig) {
	eleventyConfig.addPlugin(syntaxHighlight);

	eleventyConfig.setUseGitIgnore(false);
	// browser sync options
	eleventyConfig.setBrowserSyncConfig({
		ghostMode: false,
	});
	eleventyConfig.setWatchJavaScriptDependencies(false);
	eleventyConfig.addPassthroughCopy({"src/assets": "assets"});
	eleventyConfig.addPassthroughCopy("bundle");

	/* eleventyConfig.addFilter("cssmin", function(code) {
		return new CleanCSS({}).minify(code).styles;
	}); */

	return {
		dir: {
			data: '../data',
			input: 'src/site/pages',
			includes: '../partials',
			layouts: '../base',
			output: 'public'
		},
		templateFormats: ['html', 'njk', 'md'],
		htmlTemplateEngine: 'njk',
	}
}