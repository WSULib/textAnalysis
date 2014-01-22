<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">    

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

    <!-- cookies -->
    <script src="inc/jquery.cookie.js" type="text/javascript"></script> 

     

    

  </head>

  <body>
  
    <div id="wrapper">
      
      <!-- Sidebar -->
      <div id="sidebar">        
        <div id="logo">
          <img src="http://scholarscooperative.wayne.edu/img/ls_logo.png"/>
          <p>Wayne State University Libraries</p>
        </div>
        <div id="menu">
          <ul>
            <li><a href="#" onclick="fireAnno(); return false;">annotation</a></li>
            <li><a href="#" onclick="fireAnalysis(); return false;">analysis</a></li>
            <li><a href="https://docs.google.com/document/d/1MwGoXZavQFukII83Pe5ku4xIzZD6tv6-FKxChhQXn_I/edit?usp=sharing" target="_blank">dev_notes</a></li>
          </ul>
        </div>
        <ul id="page_thumbs"></ul>
      </div>

      <div class="content-header">          
        <div class="row">           
          <!-- <div id="left_pane_header">
            <a href="#" onclick="fireAnno(); return false;">annotation</a>
            <a href="#" onclick="fireAnalysis(); return false;">analysis</a>              
            <a href="https://docs.google.com/document/d/1MwGoXZavQFukII83Pe5ku4xIzZD6tv6-FKxChhQXn_I/edit?usp=sharing" target="_blank">dev_notes</a>
          </div> -->            
        </div>            
      </div>
          
      <!-- Page content -->
      <div id="page-content-wrapper">        

        <!-- Keep all page content within the page-content inset div! -->
        <div class="page-content">
          <div id="annotation_layer">
            <div class="row" id="status_tools">
              <div class="left_pane">
                <h2>Annotations - <span id="cpage"></span></h2>                            
              </div>
              <div class="right_pane">
                <div class="status_tools" id="html_tools">
                  <p>Font size: <span onclick="fontResize('increase'); return false;">increase</span> / <span onclick="fontResize('decrease'); return false;">decrease</span></p>
                </div>
                <div class="status_tools" id="nav_tools">                  
                  <p>Page Navigation: <span id="prev_page">previous</span> / <span id="next_page">next</span></p>
                </div>
              </div>
            </div>
            <div class="row" id="image_text">
              <div class="left_pane">
                <div id="image_container">
                  <img src=""/>
                </div>
              </div>
              <div class="right_pane">                
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
                <div id="nltk_results">
                  <p><strong>Concordance Instances:</strong><p>
                  <ul id="concordance_results"></ul>
                </div>
              </div>
              <div class="right_pane">
                <h3>Text Metrics and Analysis</h3>
                <img id="metrics_results_loader" src="img/loader.gif"/>
                <div id="metrics_results">
                  <ul>
                    <li><strong>Total Word Count: </strong><span id="totalWordCount"></span></li>
                    <li><strong>Total Word Count (sans English stopwords): </strong><span id="totalWordCount_sans_stopwords"></span></li>
                    <li><strong>Unique Word Count: </strong><span id="uniqueWords"></span></li>
                    <li><strong>Lexical Density (Total Words Count / Unique Word Count): </strong><span id="lexicalDiversity"></span><li>
                    <li><strong>Lexical Density (sans English stopwords): </strong><span id="lexicalDiversity_sans_stopwords"></span></li>
                    <li><strong>Total Sentences: </strong><span id="totalSentences"></span></li>
                    <li><strong>Longest Sentence: </strong><span id="longestSentence"></span></li>
                    <li><strong>Shortest Sentence: </strong><span id="shortestSentence"></span></li>
                    <li><strong>Average Sentence Length: </strong><span id="avgSentenceLength"></span></li>                  
                  </ul>
                  <!--collocations-->
                  <div id="text_collocations">
                    <ul>
                      <li><strong>Collocations:</strong></li>
                      <li>
                        <ul>
                          <li><div id="text_collocations_results"></div></li>
                        </ul>
                      </li>
                    </ul>                    
                  </div>
                  <!-- frequent, long words-->
                  <div id="freq_long_words">
                    <ul>
                      <li><strong>Frequent Words: length > 5, frequency > ?</strong></li>
                      <li>
                        <ul>
                          <li><span></li>
                        </ul>
                      </li>                      
                    </ul>
                  </div>
                  <!-- unique words-->
                  <div id="unique_words">
                    <ul>
                      <li><strong>Unique Words:</strong></li>
                      <li>
                        <ul>
                          <li>
                            <table></table>
                            <div id="uniqueWordCounts"><script type="text/javascript">uniqueWordCounts();</script></div>                            
                          </li>
                        </ul>
                      </li>                      
                    </ul>
                  </div>

                </div> <!-- closes results -->
                <!-- TO ADD:
                  Frequency and Top Words
                -->
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