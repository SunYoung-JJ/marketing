//using jQuery 1.11.3
//using vestweb.js
jQuery(function($) {
    $.extend({
        ajax2: function(obj,callback) {
            var t = typeof(obj);
            if(t != "object" || obj === null) {
                // simple data type
                if(t == "string") obj = '"' + obj + '"';
                return String(obj);
            } else {
                console.log("before data :"+obj.data);
                console.log("before $.serializeJSON2 data :"+$.serializeJSON2(obj.data));
                console.log("before $.param2 data :"+$.param2(obj.data));
                console.log("before $.param2 $.serializeJSON2 data :"+$.param2($.serializeJSON2(obj.data)));
//                if($.serializeJSON2(obj.data) == null) {
//                	obj.data = VestAjax($.param2(obj.data));
//                } else {
//                	obj.data = VestAjax($.param2($.serializeJSON2(obj.data)));
//                }	
                obj.data = VestAjax($.param2(obj.data));
				console.log("after data :"+obj.data);
				var successFnc = obj.success + " ";
				console.log("before successFnc :"+successFnc);
				successFnc = successFnc.replace(/(\)*\{)/ig,"{\ndata = VestDec(data.result);console.log(data);\ndata = JSON.parse(data);console.log(data);\nvar strData = '';\ntry{\n strData = fn_filteringSubmitString(JSON.stringify(data));\ndata = typeof strData == 'string' ? JSON.parse(strData) : strData;\n}\n catch(e){\nstrData = fn_filteringSubmitString($.serializeJSON(data));\ndata = typeof strData == 'string' ? JSON.parse(strData) : strData;\n}\nconsole.log(data);\n");
//				successFnc = successFnc.replace(/(?<=(callback).*);/gi,"\");");
//				successFnc = successFnc.replace("callback","eval(\"callback");
				console.log("after successFnc :"+successFnc);
				eval("obj.success = " + successFnc);
				$.ajax(obj);
				
            }
        }
    }
    
    );
});


jQuery(function($) {
    $.extend({
        serializeJSON: function(obj) {
            var t = typeof(obj);
            if(t != "object" || obj === null) {
                // simple data type
                if(t == "string") obj = '"' + obj + '"';
                return String(obj);
            } else {
                // array or object
                var json = [], arr = (obj && obj.constructor == Array);
 
                $.each(obj, function(k, v) {
                    t = typeof(v);
                    if(t == "string") v = '"' + v + '"';
                    else if (t == "object" & v !== null) v = $.serializeJSON(v)
                    json.push((arr ? "" : '"' + k + '":') + String(v));
                });
 
                return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
            }
        }
    }
    
    );
});


var __comm__ret = null;

jQuery(function($) {
    $.extend({
        serializeJSON2: function(obj) {
            var t = typeof(obj);
 
            $.each(obj, function(k, v) {
                t = typeof(v);
                if(t == "string" || t == "number") pushJson2(__comm__ret, k, v);
                else if(typeof v == "undefined" || v == null) pushJson2(__comm__ret, k, "");
                else if(obj[k].constructor == Array) {
                	for(var i=0; i<obj[k].length; i++) {
                		$.serializeJSON2(eval("_o = {"+k+" : v[i]}"));
                		delete _o;
                	}
                }
                else if (t == "object" & v !== null) v = $.serializeJSON2(v)
            });
 
            return __comm__ret;
        }
    });
});



var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams2( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				//buildParams2( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
				buildParams2( prefix , v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			//buildParams2( prefix + "[" + name + "]", obj[ name ], traditional, add );
			buildParams2( prefix , obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

jQuery(function($) {
    $.extend({
    	param2: function(a, traditional ) {

    		var prefix,
    			s = [],
    			add = function( key, value ) {
    				// If value is a function, invoke it and return its value
    				value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
    				s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
    			};

    		// Set traditional to true for jQuery <= 1.3.2 behavior.
    		if ( traditional === undefined ) {
    			traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
    		}

    		// If an array was passed in, assume that it is an array of form elements.
    		if ( a != null && (jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) )) ) {
    			// Serialize the form elements
    			jQuery.each( a, function() {
    				add( this.name, this.value );
    			});

    		} else {
    			// If traditional, encode the "old" way (the way 1.3.2 or older
    			// did it), otherwise encode params recursively.
    			for ( prefix in a ) {
    				buildParams2( prefix, a[ prefix ], traditional, add );
    			}
    		}

    		// Return the resulting serialization
    		return s.join( "&" ).replace( r20, "+" );
        }


    });
});


function pushJson2(____ret, k, v) {
	
	if(____ret == null) ____ret = {};
	
	if(typeof ____ret[k] == "undefined") {
		____ret[k] = [];		
	}
	
	if(typeof v == "undefined" ||  v == "[object Object]") v = "";
	
	//alert("{'"+k+"' : '"+v+"'}");
	____ret[k].push(eval("{"+k+" : v}"));
}


/**
 * submit string replace For empty true
 * @param str
 * @returns
 */
function fn_filteringSubmitString(str) {
	var returnStr = str.replace(/:true,/ig, ":\"\",").replace(/\[true,/ig, "\[\"\",").replace(",true,", ",\"\",").replace(/:true/ig, ":\"\"").replace(/\"true\"/ig, "\"\"");
	return returnStr;
}