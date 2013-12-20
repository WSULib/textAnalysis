// Globals
var textMeta = new Object();

// on page launch
function launch(PID, pagenum){

	// text ID sufffix
	var PIDsuffix = PID.split(":")[1];
	textMeta.PID = PID;
	textMeta.PIDsuffix = PIDsuffix;

	// get page dimensions
	var textURL = "http://silo.lib.wayne.edu/WSUAPI?functions[]=XMLtoJSON&url=http://silo.lib.wayne.edu/fedora/objects/"+PID+"/datastreams/STRUCT_META/content";
	$.ajax({
	   url: textURL,
	   success: function(response){	    
	   	console.log(response);	   
	   	textMeta.structMeta = response;
	   	textMeta.structMeta.XMLtoJSON.ebook_item.dimensions.leafs = parseInt(textMeta.structMeta.XMLtoJSON.ebook_item.dimensions.leafs);	
	   	
	   	// push page thumbnails to page
	   	for (var i=0; i<textMeta.structMeta.XMLtoJSON.ebook_item.dimensions.leafs; i++){	   		
	   		$("#page_thumbs").append("<li><img onclick='updatePage("+(i+1)+"); return false;' src='http://silo.lib.wayne.edu/fedora/objects/"+PIDsuffix+":thumbs/datastreams/THUMB_"+(i+1)+"/content'/></li>");
	   	}
	   }
	   
	});

	// initialize text	
	insertTextAnnotate('launch');

	// initialize page image
	insertImage(1);

	// resize page thumbs
	resizePageThumbs();
	
}

function updatePage(pagenum){
	// swap out image
	insertImage(pagenum);
	// swap out text
	insertTextAnnotate(pagenum);
}

function annoLaunch(pagenum,type){
	// construct URI
	var uri = textMeta.PIDsuffix+"_"+pagenum;	

	if (type == 'launch'){
		jQuery(function ($) {	    
		    $('#right_pane').annotator();
		    $('#right_pane').annotator('addPlugin', 'Store', {
		    	prefix: 'http://silo.lib.wayne.edu/annotations',
		    	annotationData: {
		    		'uri':uri
	    		},
				loadFromSearch: {
					'limit': 20,
			        'uri': uri
				}
		    });
		});	
	}

	if (type == 'update'){		
		jQuery(function ($) {	    
		    $('#right_pane').data('annotator').plugins['Store'].options.loadFromSearch.uri = uri;
		    $('#right_pane').data('annotator').plugins['Store'].options.annotationData.uri = uri;		    
		    $('#right_pane').data('annotator').plugins['Store'].loadAnnotationsFromSearch({		    	
		    	'uri':uri
		    });		    
		});
	}
	
}

// utilities

// swap out text
function insertTextAnnotate(pagenum){

	if (pagenum == 'launch'){
		pagenum = 1;
		var type = 'launch';
	}
	else {
		var type = 'update';
	}
	var url = 'http://silo.lib.wayne.edu/fedora/objects/'+textMeta.PIDsuffix+':HTML/datastreams/HTML_'+pagenum+'/content';	
	$.ajax({
	   url: url,
	   success: function(response){	    
	    $("#right_pane_HTML").html(response);
	    annoLaunch(pagenum,type);
	   }	   
	});
}

// swap out image
function insertImage(pagenum){
	$("#image_container img").attr('src','http://silo.lib.wayne.edu/fedora/objects/'+textMeta.PIDsuffix+':images/datastreams/IMAGE_'+pagenum+'/content');
}

// listeners

// resizing
$(window).resize(function() {
    resizePageImage();
    resizePageThumbs();
}).resize();    

function resizePageImage(){
	$("#image_container").css({
    	'height':($(window).height() )
    }); 
}

function resizePageThumbs(){
	$("#page_thumbs").css({
    	'height':($(window).height() - 100)
    });
}























