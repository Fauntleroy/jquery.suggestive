( function( $ ){

	'use strict';

	var DEFAULT_DELAY = 200;
	var DEFAULT_MAX = 8;
	var DEFAULT_COMPARATOR = function( source, string ){
		// http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex#answer-6969486
		var regex_safe_string = string.replace( /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&' );
		var regex = new RegExp( '^'+ regex_safe_string, 'i' );
		return regex.test( source ) && string !== source;
	};
	var DEFAULT_SORTER = function( a, b ){
		return ( a < b )? -1: ( a > b )? 1: 0;
	};

	var methods = {

		// Start $.suggestive
		initialize: function( config ){

			config = config || {};

			return this.each( function(){

				var $this = $(this);

				// Set configuration defaults
				// Attach config to each element's data object
				var data = {
					delay: config.delay || DEFAULT_DELAY,
					max: config.max || DEFAULT_MAX,
					matches: config.matches,
					delay_timer: null,
					'$container': $('<div class="suggestive container"></div>'),
					'$suggestions': $('<ul class="suggestive suggestions empty"></div>')
				};
				for( var i in data.matches ){
					var match = data.matches[i];
					match.comparator = match.comparator || DEFAULT_COMPARATOR;
					match.sorter = match.sorter || DEFAULT_SORTER;
				}

				$this.data( 'suggestive', data );

				// Bind interface events
				$this.on({
					'focus.suggestive': function(){
						$this.suggestive('active');
					},
					'keydown.suggestive': function( e ){
						// Up
						if( e.which === 38 ){
							e.preventDefault();
							$this.suggestive('previous');
						// Down
						} else if( e.which === 40 ){
							e.preventDefault();
							$this.suggestive('next');
						// Enter
						} else if( e.which === 13 ){
							if( $suggestions.children('.selected').length ){
								e.preventDefault();
								e.stopPropagation();
								$this.suggestive('select');
							}
						// Some other key
						} else {
							if( data.delay_timer ) clearTimeout( data.delay_timer );
							data.delay_timer = setTimeout( function(){
								$this.suggestive('update');
							}, data.delay );
						}
					},
					'blur.suggestive': function(){
						$this.suggestive('inactive');
					}
				});
				data.$suggestions.on( 'mouseenter.suggestive', '> li', function(){
					var index = $(this).index();
					$this.suggestive( 'highlight', index );
				});
				data.$suggestions.on( 'mouseup.suggestive', '> li', function(){
					var $suggestion = $suggestions.children('.selected');
					var index = $suggestion.index();
					$this.suggestive( 'select', index );
				});
				data.$suggestions.on( 'mousedown.suggestive', function( e ){
					e.preventDefault();
				});

				// Add elements to DOM
				$('body').append( data.$container.append( data.$suggestions ) );

			});

		},
		update: function(){

			return this.each( function(){

				var $this = $(this);

				console.log( $this.data('suggestive') );

			});

		},
		suggestions: function(){},
		highlight: function(){},
		next: function(){},
		previous: function(){},
		select: function(){},
		active: function(){},
		inactive: function(){},
		destroy: function(){}

	};

	// Attach stPagination to jQuery
	$.fn.suggestive = function( method ){

		if( methods[method] ){
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		}
		else if( typeof method === 'object' || ! method ){
			return methods.initialize.apply( this, arguments );
		}

	};

})( jQuery );