// Globals
var textMeta = new Object();
var analysisBlob = new Object();
var Charts = new Object();
Charts.Handles = new Object();
Charts.Options = new Object();

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

	//update page number	
	$("#cpage").html("Page "+pagenum);

	// RUN FULLTEXT ANALYSIS IN BACKGROUND
	// run collocations
	fulltextAnalysis();
	
}

function updatePage(pagenum){
	// hide analysis, fade in annotations
	$("#analysis_layer").hide();
	$("#annotation_layer").fadeIn();
	// swap out image
	insertImage(pagenum);
	// swap out text
	insertTextAnnotate(pagenum);

	//update page number
	$("#cpage").html("Page "+pagenum);
}

function annoLaunch(pagenum,type){
	// construct URI
	var uri = textMeta.PIDsuffix+"_"+pagenum;	

	if (type == 'launch'){
		jQuery(function ($) {	    
		    $('.right_pane').annotator();
		    $('.right_pane').annotator('addPlugin', 'Store', {
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
			// clear annotations
			$('.right_pane').data('annotator').plugins['Store'].annotations = [];	    
		    $('.right_pane').data('annotator').plugins['Store'].options.loadFromSearch.uri = uri;
		    $('.right_pane').data('annotator').plugins['Store'].options.annotationData.uri = uri;		    
		    $('.right_pane').data('annotator').plugins['Store'].loadAnnotationsFromSearch({		    	
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
	resizePageImage();	
}

// fire Annotations
function fireAnno(){
	$("#analysis_layer").hide();
	$("#annotation_layer").fadeIn();
}

// fire Analysis
function fireAnalysis(){	
	$("#annotation_layer").hide();
	$("#analysis_layer").fadeIn();
	

	// load analysis template
}



// Text Analysis
//////////////////////////////////////////////////////////////////////

function stringSearch(){

	// iterate through search terms, seperated by commas from input form

	var solrParams = new Object();
	solrParams.q = $("#search_string").val();
	solrParams['fq[]'] = [
		"ItemID:"+textMeta.structMeta.XMLtoJSON.ebook_item.item_ID
		];
	solrParams.rows = 1000;
	solrParams.sort = "page_num asc";
	solrParams.hl = "true";
	solrParams['hl.fl'] = "OCR_text";
	solrParams['hl.snippets'] = 1000;
	solrParams['hl.fragmenter'] = 'gap';
	solrParams['hl.fragsize'] = 70;

	//pass solr parameters os stringify-ed JSON, accepted by Python API as dicitonary
	solrParamsString = JSON.stringify(solrParams);	
	// Calls API functions	
	var APIcallURL = "http://silo.lib.wayne.edu/WSUAPI?functions[]=eTextSearch&solrParams="+solrParamsString;

	$.ajax({          
	  url: APIcallURL,      
	  dataType: 'json',	  	    
	  success: callSuccess,
	  error: callError
	});

	function callSuccess(response){
		console.log(response);
		analysisBlob.stringSearch = response.eTextSearch;
		paintWordFreq_Update();
	}
	function callError(response){
		console.log(response);
	}

}

// function to create Google Chart of StringPerPage
function paintWordFreq(){

	google.load("visualization", "1", {packages:["corechart"]});	
	google.setOnLoadCallback(drawChart);	
	function drawChart() {    
		

		var data = google.visualization.arrayToDataTable([
          ['Page', 'Count'],
          ['',  0]
        ]);

		Charts.Options.stringSearch_lineGraph = {
		  title: "Word Frequency per Page",
		  titleTextStyle: {color: '#333'},
		  vAxis: {title: 'Count',  
		          titleTextStyle: {color: '#333', italic: 'false', bold: 'true'},
		          textStyle: {fontSize: '12'},
		          minValue:0,
		          format:"#"
		      },
		  hAxis: {title: 'Page',  
		          titleTextStyle: {color: '#333', italic: 'false', bold: 'true'}, 
		          textStyle: {fontSize: '12'},
		          slantedText: 'true',
		          slantedTextAngle: '65',
		          gridlines: {color: '#aaa', count: '5'}, 
		          minorGridlines: {color: '#eee', count: '4'}
		      },
		  pointSize: '3',
		  fontSize: '14',
		  fontName: 'Arial',
		  height: 500,
		  width: 500,
		  legend: 'none',
		  chartArea: {'width': '90%', 'height': '60%', top: '60', left: '90'},
		  // curveType: 'function'
		};

		Charts.Handles.stringSearch_lineGraph = new google.visualization.LineChart(document.getElementById('stringSearch_lineGraph'));
		Charts.Handles.stringSearch_lineGraph.draw(data, Charts.Options.stringSearch_lineGraph);
	}
}

function paintWordFreq_Update(){
	// hide
	$("#stringSearch_results").css('display','none');

	// Initiate data table    
	var data = new google.visualization.DataTable();
	// Set columns
	data.addColumn('number','page');
	data.addColumn('number','count');

	// create object to push to data
	var JSONobject = [];

	// create data points for each page
	for (var i=0; i < textMeta.structMeta.XMLtoJSON.ebook_item.dimensions.leafs; i++) {
		// page name - textMeta.structMeta.XMLtoJSON.ebook_item.item_ID + i
		var dataRow = new Object();
		// dataRow['page'] = textMeta.structMeta.XMLtoJSON.ebook_item.item_ID+"_OCR_HTML_"+(i+1);
		dataRow['page'] = (i+1);
		dataRow['count'] = 0;
		JSONobject.push(dataRow);
	}

	console.log("Pre highlights addition:",JSONobject);	
	
	// iterate through highlights, push to JSONobject that has all pages from text
	var snippet_keys = Object.keys(analysisBlob.stringSearch.highlighting);
	snippet_keys.alphanumSort();
	for (var i = 0; i < snippet_keys.length; i++) {
		var pageSnippets = analysisBlob.stringSearch.highlighting[snippet_keys[i]];
		var pageNum = snippet_keys[i].split("_OCR_HTML_")[1];
		JSONobject[(pageNum - 1)]['count'] = pageSnippets.OCR_text.length;	
	}

	// // iterate through pages, creates JSONobject that is ONLY highlights
	// var snippet_keys = Object.keys(analysisBlob.stringSearch.highlighting);
	// snippet_keys.alphanumSort();
	// for (var i = 0; i < snippet_keys.length; i++) {
	// 	var pageSnippets = analysisBlob.stringSearch.highlighting[snippet_keys[i]];
	// 	var dataRow = new Object();
	// 	dataRow['page'] = snippet_keys[i];
	// 	dataRow['count'] = pageSnippets.OCR_text.length;
	// 	// dataRow[snippet_keys[i]] = pageSnippets.OCR_text.length;
	// 	JSONobject.push(dataRow);
	// }

	console.log("After insertions",JSONobject);
	 
	// Add rows to data object
	for (var i=0; i<JSONobject.length; i++){
	  data.addRow([ 
	    JSONobject[i]['page'],JSONobject[i]['count']
      ]);
	}

	Charts.Handles.stringSearch_lineGraph.draw(data, Charts.Options.stringSearch_lineGraph);
	$("#stringSearch_results").fadeIn();
}

// fulltextAnalysis
function fulltextAnalysis(){
	var analysisURL = "http://silo.lib.wayne.edu/WSUAPI-dev/projects/textAnalysis?text_location=http://silo.lib.wayne.edu/fedora/objects/"+textMeta.PIDsuffix+":fullbook/datastreams/HTML_FULL/content";	
	$.ajax({
		url: analysisURL,
		success: successCall,
		error: errorCall		
	});

	function successCall(response){
		console.log("fullbook analysis:",response);
		analysisBlob.fullbookAnalysis = response;
		$("#text_collocations_results").html(response.textAnalysis_results);
	}
	function errorCall(response){
		console.log(response);
	}
}





// LISTENERS

// resizing
$(window).resize(function() {
    resizePageImage();
    resizePageThumbs();
}).resize();    

function resizePageImage(){
	$("#image_container").css({
    	'height':( $(window).height() - 120 )
    }); 
}

function resizePageThumbs(){
	$("#page_thumbs").css({
    	'height':($(window).height() - 100)
    });
}


// UTILITIES

//natural language sorter
Array.prototype.alphanumSort = function(caseInsensitive) {
  for (var z = 0, t; t = this[z]; z++) {
    this[z] = []; var x = 0, y = -1, n = 0, i, j;

    while (i = (j = t.charAt(x++)).charCodeAt(0)) {
      var m = (i == 46 || (i >=48 && i <= 57));
      if (m !== n) {
        this[z][++y] = "";
        n = m;
      }
      this[z][y] += j;
    }
  }

  this.sort(function(a, b) {
    for (var x = 0, aa, bb; (aa = a[x]) && (bb = b[x]); x++) {
      if (caseInsensitive) {
        aa = aa.toLowerCase();
        bb = bb.toLowerCase();
      }
      if (aa !== bb) {
        var c = Number(aa), d = Number(bb);
        if (c == aa && d == bb) {
          return c - d;
        } else return (aa > bb) ? 1 : -1;
      }
    }
    return a.length - b.length;
  });

  for (var z = 0; z < this.length; z++)
    this[z] = this[z].join("");
}

// font resizer
// increase / decrease font size ("delta" as "increase" or "decrease")
// works for both OCR overlays and plain text display
function fontResize(delta){
    // font-size conversion array
    var conv_array = [ '6px', 'xx-small', 'x-small', 'small', 'medium', 'large', 'x-large', 'xx-large', '72px', '90px' ];
    
    var font_tags = $('#right_pane_HTML font');        
    font_tags.each(function () {  //each tag is"this"      
	    var font_handle = $(this); //removed children, as it is "this"            
	    var fsize = font_handle[0].style.fontSize;        
	    var fsize_index = conv_array.indexOf(fsize);        
	    if (delta == "increase"){
	        fsize_index += 1;
	        font_handle.css('font-size', conv_array[fsize_index])
	    }
	    if (delta == "decrease"){
	        fsize_index -= 1;
	        font_handle.css('font-size', conv_array[fsize_index])
	    }                
    });
}

















