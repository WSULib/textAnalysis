<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>TextSuite - Wayne State</title>
    <!-- jQuery must be included before Annotator -->
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>   

    <!--Google Charts-->
    <script type="text/javascript" src="https://www.google.com/jsapi"></script> 
         
    <!-- The main Annotator script -->    
     <script src="inc/annotator/annotator-full.min.js"></script>
    <!-- Annotator's styling and images -->
    <link rel="stylesheet" type="text/css" href="inc/annotator/annotator.min.css">    
     <!-- The Store plugin. Saves annotations to a remote backend -->
    <script src="inc/annotator/annotator.store.min.js"></script>

    <!-- Add custom CSS here -->
    <link href="css/textAnalysis.css" rel="stylesheet">    

    <!--JS loads-->          
    <script src="js/textAnalysis.js"></script>      

     

    

  </head>

  <body>
  
    <div id="wrapper">
      
      <!-- Sidebar -->
      <div id="sidebar">
        <h3>Wayne State University Libraries - textSuite</h3>
        <ul id="page_thumbs"></ul>
      </div>

      <div class="content-header">          
          <div class="row">
            <!-- <div id="left_pane_header">
              <button>images</button>
              <button>text</button>
            </div> -->
            <div id="left_pane_header">
              <a href="#" onclick="fireAnno(); return false;">annotation</a>
              <a href="#" onclick="fireAnalysis(); return false;">analysis</a>              
              <a href="https://docs.google.com/document/d/1MwGoXZavQFukII83Pe5ku4xIzZD6tv6-FKxChhQXn_I/edit?usp=sharing" target="_blank">dev_notes</a>
            </div>            
          </div>            
        </div>
          
      <!-- Page content -->
      <div id="page-content-wrapper">        

        <!-- Keep all page content within the page-content inset div! -->
        <div class="page-content">
          <div id="annotation_layer">
            <div class="row">
              <h2>Image Annotations - <span id="cpage"></span></h2>              
            </div>
            <div class="row">
              <div class="left_pane">
                <div id="image_container">
                  <img src=""/>
                </div>
              </div>
              <div class="right_pane">
                <div id="html_tools">
                  <p>Font size: <span onclick="fontResize('increase'); return false;">increase</span> / <span onclick="fontResize('decrease'); return false;">decrease</span></p>
                </div>
                <div id="right_pane_HTML"></div>
              </div>            
            </div>
          </div>
          <div id="analysis_layer">
            <div class="row">
              <h2>Textual Analysis</h2>
            </div>
            <div class="row">
              <div class="left_pane">
                <h3>Individual Word Analysis</h3>
                <form onsubmit="stringSearch(); return false;">
                  <label>String to search for:</label>
                  <input id="search_string" type='textbox'/>
                  <input type="submit"/>
                </form>
                <div id="stringSearch_results">
                  <div id="stringSearch_lineGraph"><script type="text/javascript">paintWordFreq();</script></div>                                                  
                </div>
              </div>
              <div class="right_pane">
                <h3>Text Metrics and Analysis</h3>
                <div id="text_collocations">
                  <p>Collocations:</p>
                  <div id="text_collocations_results"><img src="img/loader.gif"/></div>
                </div>
              </div>
            </div>
          </div>
        </div> <!--close page content-->
        
      </div> 
    
    <!-- Launch -->  
    <script type="text/javascript">       
      launch("<?php echo $_REQUEST['PID']; ?>",1);
    </script>
    
  </body>
</html>