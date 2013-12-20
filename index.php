<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>TextSuite - Wayne State</title>
    <!-- jQuery must be included before Annotator -->
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>   
         
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
        <h3>textSuite</h3>
        <ul></ul>
      </div>
          
      <!-- Page content -->
      <div id="page-content-wrapper">
        <div class="content-header"> 
          <div class="row">
            <div id="text_pages">              
            </div>
          </div> 
          <div class="row">
            <div id="left_pane_header">
              <button>images</button>
              <button>text</button>
            </div>
            <div id="right_pane_header">
              <button>analysis</button>
              <button>annotation</button>
            </div>
          </div>

            
        </div>
        <!-- Keep all page content within the page-content inset div! -->
        <div class="page-content">
          <div class="row">
            <div id="left_pane">
              <div id="image_container">
                <img src="http://silo.lib.wayne.edu/fedora/objects/yellowwallpaper:images/datastreams/IMAGE_1/content"/>
              </div>
            </div>
            <div id="right_pane">
              <div id="right_pane_HTML"></div>
            </div>            
          </div>
        </div>
      </div>
      
    </div> 
    
    <!-- Launch -->  
    <script type="text/javascript">       
      launch("<?php echo $_REQUEST['PID']; ?>");
    </script>
    
  </body>
</html>