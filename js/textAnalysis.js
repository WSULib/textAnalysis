// Globals
var textMeta = new Object();
var analysisBlob = new Object();
var Charts = new Object();
Charts.Handles = new Object();
Charts.Options = new Object();
// set cookie
var userCook = new Object();

// temp users for this class
var classUsers = ["ay4047","ea5386","dw3821","el5498","av8259","ef0791","fi1806","ej2929","ez9133","ad5820","ef1885","dp5745","ef3048","eh2889","dz3816","ey4748","ei5545","es2260","eb0594","ci3917"];

// on page launch
function launch(PID, pagenum){

	// set cPage
	textMeta.cPage = 1;

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
	   		$("#page_thumbs").append("<li>Page "+(i+1)+" <img onclick='updatePage("+(i+1)+"); return false;' src='http://silo.lib.wayne.edu/fedora/objects/"+PIDsuffix+":thumbs/datastreams/THUMB_"+(i+1)+"/content'/></li>");
	   	}

	   	// set nav pages
		setNav();
	   }
	   
	});		

	// initialize page image
	insertImage(1);

	// resize page thumbs
	resizePageThumbs();

	// update page number	
	$("#cpage").html("Page "+pagenum);	

	// set links
	$("#eReader_link").attr('href','http://silo.lib.wayne.edu/eTextReader/eTextReader.php?ItemID='+textMeta.PID+'#page/1/mode/2up')
	
	// user work
	getUserInfo();	
}

function getUserInfo(){
	$(document).ready(function(){
		console.log("Checking WSUDOR cookie");
		if (typeof $.cookie("WSUDOR") != 'undefined'){
			WSUDORcookie = $.parseJSON($.cookie("WSUDOR"));
			console.log(WSUDORcookie);

			userCook.username = WSUDORcookie.username_WSUDOR;
			userCook.displayName = WSUDORcookie.displayName;
			userCook.fontPrefIndex = 4;

			// set user prefs
			$("#username span").html(userCook.displayName);

			// initialize annotation text	
			insertTextAnnotate('launch');
		}
	});
}

function updatePage(pagenum){
	textMeta.cPage = pagenum;

	// hide analysis, fade in annotations
	$("#analysis_layer").hide();
	$("#annotation_layer").fadeIn();
	// swap out image
	insertImage(pagenum);
	// swap out text
	insertTextAnnotate(pagenum);

	//update page number
	$("#cpage").html("Page "+pagenum);

	// update eReader link
	$("#eReader_link").attr('href','http://silo.lib.wayne.edu/eTextReader/eTextReader.php?ItemID='+textMeta.PID+'#page/'+pagenum+'/mode/1up')

	// set nav pages
	setNav();
	
}

function annoLaunch(pagenum,type){
	
	// // construct URI
	// var uri = textMeta.PIDsuffix+"_"+pagenum;	

	// construct URI - unique identifier for particular student
	// var uri = userCook.username+"_"+textMeta.PIDsuffix+"_"+pagenum;	
	var uri = textMeta.PIDsuffix+"_"+pagenum;	

	var readersArray

	if (type == 'launch'){
		jQuery(function ($) {	    
		    $('#image_text .right_pane').annotator();
		    $('#image_text .right_pane').annotator('addPlugin', 'Store', {
		    	prefix: 'http://silo.lib.wayne.edu/annotations',
		    	annotationData: {
		    		'uri':uri
	    		},
				loadFromSearch: {
					'limit': 20,
			        'uri': uri
				}
		    });
		    $('#image_text .right_pane').annotator('addPlugin', 'Permissions', {
			  user:userCook.username,
			   permissions: {
			    'read':   [userCook.username],
			    'update': [userCook.username],
			    'delete': [userCook.username],
			    'admin':  [userCook.username]
			  }		    
			});	  
			$('#image_text .right_pane').annotator('addPlugin', 'Auth', {
			  tokenUrl: "http://silo.lib.wayne.edu/annotations/authToken"		  
			}); 			 
		});	
	}

	if (type == 'update'){		
		jQuery(function ($) {
			// clear annotations
			$('#image_text .right_pane').data('annotator').plugins['Store'].annotations = [];	    
		    $('#image_text .right_pane').data('annotator').plugins['Store'].options.loadFromSearch.uri = uri;
		    $('#image_text .right_pane').data('annotator').plugins['Store'].options.annotationData.uri = uri;		    
		    $('#image_text .right_pane').data('annotator').plugins['Store'].loadAnnotationsFromSearch({		    	
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
	    // snap to user text preference
	    fontResize('pageload');
	    annoLaunch(pagenum,type);
	   }	   
	});
}

// swap out image
function insertImage(pagenum){
	$("#image_container a").attr('href','http://silo.lib.wayne.edu/fedora/objects/'+textMeta.PIDsuffix+':images/datastreams/IMAGE_'+pagenum+'/content');
	$("#image_container img").attr('src','http://silo.lib.wayne.edu/fedora/objects/'+textMeta.PIDsuffix+':images/datastreams/IMAGE_'+pagenum+'/content');
	resizePageImage();	
}

// fire Annotations
function fireAnno(){
	$("#analysis_layer").hide();
	$("#annotation_layer").show();
}

// fire Analysis
function fireAnalysis(){	
	$("#annotation_layer").hide();
	$("#analysis_layer").show();
}


// Text Analysis
//////////////////////////////////////////////////////////////////////

function stringSearch(){

	toggleLoader();	

	// empty previous
	// hide graph
	$("#stringSearch_results").css('display','none');
	// text results
	$("#concordance_results").empty();	
	$("#synsets").empty();	


	analysisBlob.search_string = $("#search_string").val();
	var search_terms = analysisBlob.search_string.split(",");	
	analysisBlob.search_terms = search_terms;	

	// create array of results
	analysisBlob.stringSearches = [];

	// counter
	var search_count = 0;

	// function getHighlights(search_term){
	for (var i=0; i<search_terms.length; i++){
		var search_term = search_terms[i];
		console.log(search_term);
		var solrParams = new Object();
		solrParams.q = search_term;
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

		function callSuccess(response){
			analysisBlob.stringSearches.push(response.eTextSearch);
			search_count++;
			console.log("total / current:",analysisBlob.stringSearches.length,search_count);
			if (search_count === search_terms.length) {
				paintWordFreq_Update();
				wordAnalysis();
			}				
		}

		function callError(response){
			console.log(response);
		}

		$.ajax({          
		  url: APIcallURL,      
		  dataType: 'json',	  	    
		  success: callSuccess,
		  error: callError
		});

		
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
		  pointSize: '1',
		  fontSize: '14',
		  fontName: 'Arial',
		  height: 500,
		  width: 500,		  
		  // chartArea: {'width': '90%', 'height': '50%', left: '50'},
		  legend:'bottom'
		  // curveType: 'function'
		};

		Charts.Handles.stringSearch_lineGraph = new google.visualization.LineChart(document.getElementById('stringSearch_lineGraph'));
		Charts.Handles.stringSearch_lineGraph.draw(data, Charts.Options.stringSearch_lineGraph);
	}
}

function paintWordFreq_Update(){
	

	// Initiate data table    
	var data = new google.visualization.DataTable();

	Charts.Options.stringSearch_lineGraph['width'] = 500;
	
	// Set columns
	data.addColumn('number','page');
	console.log("number of terms:",analysisBlob.stringSearches.length);
	for (var i=0; i<analysisBlob.stringSearches.length; i++){
		// generate colName
		var colName = analysisBlob.stringSearches[i].responseHeader.params.q;		
		console.log("Adding row header to data:",colName);
		data.addColumn('number',colName);	
	}	
	console.log("Data before any rows added:",data);

	// create object to push to data
	var JSONobject = [];

	// create empty data points for each page	
	for (var i=0; i < textMeta.structMeta.XMLtoJSON.ebook_item.dimensions.leafs; i++) {
		var dataRow = new Object();
		dataRow['page'] = (i+1);
		for (var j=0; j<analysisBlob.stringSearches.length; j++){
			var colName = analysisBlob.stringSearches[j].responseHeader.params.q;
			dataRow[colName] = 0;
		}
		JSONobject.push(dataRow);
	}		

	console.log("Pre highlights addition:",JSONobject);	
	
	// iterate through search terms, then iterate through highlights, push to JSONobject that has all pages from text
	for (var i=0; i<analysisBlob.stringSearches.length; i++){

		// generate colName
		var colName = analysisBlob.stringSearches[i].responseHeader.params.q;
		console.log("Adding hits for:",colName);
		var snippet_keys = Object.keys(analysisBlob.stringSearches[i].highlighting);
		snippet_keys.alphanumSort();
		for (var j = 0; j < snippet_keys.length; j++) {
			var pageSnippets = analysisBlob.stringSearches[i].highlighting[snippet_keys[j]];
			var pageNum = snippet_keys[j].split("_OCR_HTML_")[1];
			JSONobject[(pageNum - 1)][colName] = pageSnippets.OCR_text.length;	
		}
	}

	console.log("After insertions",JSONobject);	
	 
	// Add rows to data object
	var all_rows = []
	for (var i=0; i<JSONobject.length; i++){
		var row_array = [];		
		var row_keys = Object.keys(JSONobject[i]);
		// repeater val
		for (var j=0; j<row_keys.length; j++){
			var ckey = row_keys[j];
			row_array.push(JSONobject[i][ckey]);
		}
		all_rows.push(row_array);
	}

	data.addRows(all_rows);

	Charts.Handles.stringSearch_lineGraph.draw(data, Charts.Options.stringSearch_lineGraph);
	toggleLoader();
	$("#stringSearch_results").fadeIn();

}

// concordance
function wordAnalysis(){	

	// for each search term, push concordance results to a list
	for (var i=0; i<analysisBlob.search_terms.length; i++){

		var search_term = $.trim(analysisBlob.search_terms[i]);
		var wordAnalysisURL = "http://silo.lib.wayne.edu/WSUAPI-dev/projects/textAnalysis?id="+textMeta.PIDsuffix+"&type=wordAnalysis&word="+search_term+"&text_location=http://silo.lib.wayne.edu/fedora/objects/"+textMeta.PIDsuffix+":fullbook/datastreams/HTML_FULL/content"
		// push concordances	
		function pushConcs(response){
			var word = response.textAnalysis.concordance.word;
			$("#concordance_results").append("<li><ul class='conc_list' id='conc_"+word+"'></ul></li>")
			$("#conc_"+word).append("<li><strong>Instances of \""+word+"\":</strong></li>")
			for (var i=0; i<response.textAnalysis.concordance.conc_list.length; i++)	{
				var blurb = response.textAnalysis.concordance.conc_list[i]
				blurb = blurb.replace(word,("<span class='hl'>"+word+"</span>"));			
				$("#conc_"+word).append("<li>..."+blurb+"...</li>")
			}
		}

		// push synsets
		function pushSynsets(response){
			var word = response.textAnalysis.concordance.word;
			$("#synsets").append("<li><ul class='syn_list' id='syns_"+word+"'></ul></li>")
			$("#syns_"+word).append("<li><strong>Synonyms for \""+word+"\":</strong></li>")
			for (var i=0; i<response.textAnalysis.synsets.length; i++)	{
				var syn = response.textAnalysis.synsets[i]				
				$("#syns_"+word).append("<li>"+syn+"</li>")
			}
		}
		function successCall(response){		
			console.log("Word Analysis reponse: ",response);			
			pushConcs(response);		
			pushSynsets(response);	
		}

		function errorCall(response){
			console.log(response);
		}

		$.ajax({
			url: wordAnalysisURL,
			dataType: "json",
			success: successCall,
			error: errorCall		
		});		

		
	}
}






function toggleLoader(){
	$("#word_analysis_loader").toggle();
}



// fulltextAnalysis
function fulltextAnalysis(){
	var analysisURL = "http://silo.lib.wayne.edu/WSUAPI-dev/projects/textAnalysis?id="+textMeta.PIDsuffix+"&type=fullbookAnalysis&text_location=http://silo.lib.wayne.edu/fedora/objects/"+textMeta.PIDsuffix+":fullbook/datastreams/HTML_FULL/content";	
	function successCall(response){
		$("#metrics_results_loader").hide();
		$("#metrics_results").fadeIn();
		console.log("fullbook analysis:",response);
		analysisBlob.fullbookAnalysis = response;
		
		// collocations
		$("#text_collocations_results").html(analysisBlob.fullbookAnalysis.textAnalysis.collocations);
		
		// simple metrics
		var simple_metrics =analysisBlob.fullbookAnalysis.textAnalysis.simple_metrics
		$("#totalWordCount").html(simple_metrics.totalWordCount);
		$("#totalWordCount_sans_stopwords").html(simple_metrics.totalWordCount_sans_stopwords);
		$("#uniqueWords").html(simple_metrics.uniqueWords);
		// should be lexicalDensity, not lexicalDiversity
		$("#lexicalDiversity").html(simple_metrics.lexicalDiversity);
		$("#lexicalDiversity_sans_stopwords").html(simple_metrics.lexicalDiversity_sans_stopwords);
		//
		$("#totalSentences").html(simple_metrics.totalSentences);
		$("#longestSentence").html("<ul><li><strong>Word Count:</strong> "+simple_metrics.longestSentence.length+"</li><li>"+simple_metrics.longestSentence.text+"</li></ul>");
		$("#shortestSentence").html("<ul><li><strong>Word Count:</strong> "+simple_metrics.shortestSentence.length+"</li><li>"+simple_metrics.shortestSentence.text+"</li></ul>");
		$("#avgSentenceLength").html(simple_metrics.avgSentenceLength);

		//frequent, long words table
		for (var i=0; i<simple_metrics.freqLongWords.length; i++)	{
			$("#freq_long_words span").append(simple_metrics.freqLongWords[i]+"; ");
		}

		//unique word table
		for (var i=0; i<simple_metrics.uniqueWordsList.length; i++)	{
			$("#unique_words table").append("<tr><td>"+simple_metrics.uniqueWordsList[i].text+"</td><td>"+simple_metrics.uniqueWordsList[i].count+"</td></tr>");
		}

		uniqueWordCounts_update();

	}
	function errorCall(response){
		console.log(response);
	}
	$.ajax({
		url: analysisURL,
		dataType: "json",
		success: successCall,
		error: errorCall		
	});

	
}

// function to create distribution chart of top 15 unique words
function uniqueWordCounts(){	

	google.load("visualization", "1", {packages:["corechart"]});	
	google.setOnLoadCallback(drawChart);	
	function drawChart() {		

		var data = google.visualization.arrayToDataTable([
          ['Word', 'Count'],
          ['abba',  0]
        ]);

		Charts.Options.uniqueWordCounts = {
		  title: "Top 15 Unique Word Counts",
		  titleTextStyle: {color: '#333'},
		  vAxis: {title: 'Count',  
		          titleTextStyle: {color: '#333', italic: 'false', bold: 'true'},
		          textStyle: {fontSize: '12'},
		          minValue:0,
		          format:"#"
		      },
		  hAxis: {title: 'Word',  
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
		  // chartArea: {'width': '90%', 'height': '60%', top: '60', left: '90'},
		  // curveType: 'function'
		};

		Charts.Handles.uniqueWordCounts = new google.visualization.BarChart(document.getElementById('uniqueWordCounts'));
		Charts.Handles.uniqueWordCounts.draw(data, Charts.Options.uniqueWordCounts);

		// fires rest of fulltext analysis
		fulltextAnalysis();
	}
}

// function to create distribution chart of top 15 unique words
function uniqueWordCounts_update(){		

	// Initiate data table    
	var data = new google.visualization.DataTable();
	
	// Set columns
	data.addColumn('string','word');
	data.addColumn('number','count');

	// create object to push to data
	var JSONobject = [];

	// create data points for each page
	for (var i=0; i < analysisBlob.fullbookAnalysis.textAnalysis.simple_metrics.uniqueWordsList.length; i++) {		
		var dataRow = new Object();		
		dataRow['word'] = analysisBlob.fullbookAnalysis.textAnalysis.simple_metrics.uniqueWordsList[i].text;
		dataRow['count'] = analysisBlob.fullbookAnalysis.textAnalysis.simple_metrics.uniqueWordsList[i].count;
		JSONobject.push(dataRow);
	}	
	 
	// Add rows to data object
	for (var i=0; i<JSONobject.length; i++){
	  data.addRow([ 
	    JSONobject[i]['word'],JSONobject[i]['count']
      ]);
	}

	Charts.Handles.uniqueWordCounts.draw(data, Charts.Options.uniqueWordCounts);	
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
    	'height':($(window).height() - 250)
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
	        userCook.fontPrefIndex = fsize_index;
	        font_handle.css('font-size', conv_array[fsize_index]);
	    }
	    if (delta == "decrease"){
	        fsize_index -= 1;
	        userCook.fontPrefIndex = fsize_index;
	        font_handle.css('font-size', conv_array[fsize_index]);
	    }                
	    if (delta == "pageload"){
	    	var fontPrefIndex = userCook.fontPrefIndex;	    	
	    	font_handle.css('font-size', conv_array[fontPrefIndex]);
	    }
    });
}

//set nav
function setNav(){
	var prev_page = null;
	var next_page = null;	
	if (textMeta.cPage == 1) { 					
		prev_page = 1; 
		next_page = textMeta.cPage + 1;
	}	
	else if (textMeta.cPage == textMeta.structMeta.XMLtoJSON.ebook_item.dimensions.leafs) {				
		prev_page = textMeta.cPage - 1; 
		next_page = textMeta.cPage;
	}
	else { 		
		prev_page = textMeta.cPage - 1; 
		next_page = textMeta.cPage + 1; 
	}			
	$("#prev_page").attr('onclick',"updatePage("+prev_page+"); return false;");
	$("#next_page").attr('onclick',"updatePage("+next_page+"); return false;");
}
	
function logoutUser(){
	$.removeCookie("WSUDOR",{
          path:"/"
        }
    );
	// $("#fav_link").remove(); 
	location.reload();
}













