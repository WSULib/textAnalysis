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
	   	// push pages to list
	   	for (var i=0; i<textMeta.structMeta.XMLtoJSON.ebook_item.dimensions.leafs; i++){	   		
	   		$("#text_pages").append("<img onclick='updatePage("+(i+1)+"); return false;' src='http://silo.lib.wayne.edu/fedora/objects/"+PIDsuffix+":thumbs/datastreams/THUMB_"+(i+1)+"/content'/>");
	   	}
	   }
	   
	});

	var url = "http://silo.lib.wayne.edu/fedora/objects/yellowwallpaper:HTML/datastreams/HTML_1/content";	
	$.ajax({
	   url: url,
	   success: function(response){	    
	    $("#right_pane_HTML").html(response);
	    annoLaunch();
	   }
	   
	});
	
}

function annoLaunch(){	
	jQuery(function ($) {	    
	    $('#right_pane').annotator();
	    $('#right_pane').annotator('addPlugin', 'Store', {
	    	prefix: 'http://silo.lib.wayne.edu/annotations',
	    	annotationData: {
	    		'uri':'yellow_wallpaper_page1'
    		},
			loadFromSearch: {
				'limit': 20,
		        'uri': 'yellow_wallpaper_page1'
			}
	    });
	});
}


function updatePage(pagenum){
	// swap out image
	$("#image_container img").attr('src','http://silo.lib.wayne.edu/fedora/objects/'+textMeta.PIDsuffix+':images/datastreams/IMAGE_'+pagenum+'/content');

	// swap out text
	var url = 'http://silo.lib.wayne.edu/fedora/objects/'+textMeta.PIDsuffix+':HTML/datastreams/HTML_'+pagenum+'/content';	
	$.ajax({
	   url: url,
	   success: function(response){	    
	    $("#right_pane_HTML").html(response);
	    annoLaunch();
	   }
	   
	});
}


// listeners

// Custom JavaScript for the Menu Toggle    
$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("active");
});

// image resizer
$(window).resize(function() {
    resizePageImage();       
}).resize();    

function resizePageImage(){
	$("#image_container").css({
    	'height':($(window).height() - 40)
    }); 
}