//'**/*.{unityweb,js,html,json,css,png,gif,eot,ttf,woff,woff2,ts,md,mp3,tflite,data,wasm,binarypb,ffs_db,ico}'

module.exports = {
	cacheId : "main",
	skipWaiting : true,
	clientsClaim : true,
	globDirectory: 'public/',
	globPatterns: [
		"static/js/**.{js,css,json}",
		"static/lib/**/*.{js,css,json}",
		"**/*.css",
		"**/*.js",
		"**/*.json",
		"**/*.{png,jpg,svg,mp3}",
		"static/res/*.{js,css,json}",
		"static/locales/*.{js,css,json}",
		"Build/*.{js,unityweb}",
		"StreamingAssets/aa/*.{json,xml}",
		"StreamingAssets/aa/AddressablesLink/*.xml",
		"StreamingAssets/aa/WebGL/*.json",
	],
	globIgnores : [
		//'**/*.{unityweb,png,gif,eot,ttf,woff,woff2,ts,md,mp3,tflite,data,wasm,binarypb,ico}'
		"**/node_modules/**/*",
		"sw.js",
		"workbox-*.js"
	],
	runtimeCaching : [
		{
			urlPattern: '/',
			handler: 'NetworkFirst',
			options: {
				cacheName: 'page',
				expiration: {
					maxAgeSeconds: 60 * 60 * 24
				}
			}
		},
		/*{
			urlPattern: /static\/img\/.*(png|jpg|svg|mp3|ico)/,
			handler: 'CacheFirst',
			options: {
				cacheName: 'assets',
				expiration: {
					maxAgeSeconds: 60 * 60 * 24 * 14
				}
			}
		},*/
		/*{
			urlPattern: new RegExp("Build/.*\.unityweb"),
			handler: 'CacheFirst',
			options: {
				cacheName: 'unity',
				expiration: {
					maxAgeSeconds: 60 * 60 * 24 * 31
				}
			}
		},*/
		{
			urlPattern: /^.*static\/win\/mp\/.(data|tflite|wasm)/,
			handler: 'CacheFirst',
			options: {
				cacheName: 'mediapipe',
				expiration: {
					maxAgeSeconds: 60 * 60 * 24 * 31
				}
			}
		},
		{
			urlPattern: /.*StreamingAssets\/aa\/WebGL\/.*\.(bundle)/,
			handler: 'CacheFirst',
			options: {
				cacheName: 'streamingasset',
				expiration: {
					maxAgeSeconds: 60 * 60 * 24 * 31
				}
			}
		},
		{
			urlPattern : /^https\:\/\/cdn\.jsdelivr\.net\/npm\/.*\.(js|css)/,
			handler : "CacheFirst",
			options : {
				cacheName : "jsdelivr",
				expiration : {
					maxAgeSeconds: 60 * 60 * 24 * 31
				}
			}
		},
		/*{
			urlPattern : /^https\:\/\/unpkg\.com\/.*\.(js|css)/,
			handler : "CacheFirst",
			options : {
				cacheName : "unpkg",
				expiration : {
					maxAgeSeconds: 60 * 60 * 24 * 31
				}
			}
		},*/
		{
			urlPattern : /^https\:\/\/fonts\.googleapis\.com\/css.*/,
			handler : "CacheFirst",
			options : {
				cacheName : "googlefont1",
				expiration : {
					maxAgeSeconds: 60 * 60 * 24 * 14
				}
			}
		},
		{
			urlPattern : /^https\:\/\/fonts\.gstatic\.com\/.*(woff|woff2|ttf|eot)/,
			handler : "CacheFirst",
			options : {
				cacheName : "googlefont2",
				expiration : {
					maxAgeSeconds: 60 * 60 * 24 * 14
				}
			}
		}
	],
	swDest: 'public/sw.js',
	maximumFileSizeToCacheInBytes : 1024 * 1024 * 90,
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};