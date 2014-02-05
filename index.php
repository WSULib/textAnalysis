<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">    

    <title>textAnalysis - Wayne State</title>
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
    <script src="js/userData.js"></script>

    <!-- cookies -->
    <script src="inc/jquery.cookie.js" type="text/javascript"></script> 

     

    

  </head>

  <body>
  
    <div id="wrapper">
      
      <!-- Sidebar -->
      <div id="sidebar">        
        <div id="logo">
          <a href="http://www.lib.wayne.edu">
            <img src="http://scholarscooperative.wayne.edu/img/ls_logo.png"/>
          </a>
          <p>Wayne State University Libraries</p>
        </div>
        <div id="menu">
          <hr>
          <ul id="username">
            <li id="username_display">Welcome, <span></span>! <a href="#" onclick="logoutUser(); return false;">(logout)</a></li>
            <li id="login_display"><a href="http://silo.lib.wayne.edu/digitalcollections/login.php">Login Here!</a></li>
          </ul>
          
          <ul>            
            <li><a href="#" onclick="fireAnno(); return false;">Annotations</a></li>
            <li><a href="#" onclick="fireAnalysis(); return false;">Analysis</a></li>
            <li><a id="eReader_link" href="" target="_blank">eReader</a></li>            
          </ul>

          <ul>
            <li><a href="textAnalysis-help.php" target="_blank" >Help / Instructions</a></li>
            <li><a href="#" onclick="toggleMenu(); return false;">Toggle Sidebar</a></li>
          </ul>
        </div>
        <hr>
        <ul dir=ltr id="page_thumbs"></ul>
      </div>   
          
      <!-- Page content -->
      <div id="page-content-wrapper">        

        <!-- Keep all page content within the page-content inset div! -->
        <div class="page-content">
          <div id="annotation_layer">

            <div class="row layer_header" id="status_tools">
              <div class="left_pane">
                <h2><span class="toggleMenu_top" onclick="toggleMenu(); return false;">(Toggle Sidebar)</span> Annotations - <span id="cpage"></span></h2>                            
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
                  <a target="_blank" href="">
                    <img src=""/>
                  </a>
                </div>
              </div>
              <div class="right_pane">                
                <div id="right_pane_HTML"></div>
              </div>            
            </div>
          </div>

          <div id="analysis_layer">
            
            <div class="row layer_header">
              <div class="left_pane">
                <h2><span class="toggleMenu_top" onclick="toggleMenu(); return false;">(Toggle Sidebar)</span> Textual Analysis</h2>
              </div>
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
                  <p><strong>Synonyms from Wordnet:</strong><p>
                  <ul id="synsets"></ul>
                  <p><strong>Concordance Instances:</strong><p>
                  <ul id="concordance_results"></ul>
                </div>
                <div>
                  <img id="word_analysis_loader" src="img/loader.gif"/>
                </div> 
              </div> <!--left analysis pane-->
              <div class="right_pane">
                <h3>Full-Text Metrics and Statistics</h3>
                <p>(click any metric for brief description)</p>
                <img id="metrics_results_loader" src="img/loader.gif"/>
                <div id="metrics_results">
                  <ul>
                    <li><strong><a target="_blank" href="textAnalysis-help.php#totalWordCount">Total Word Count</a>: </strong><span id="totalWordCount"></span></li>
                    <li><strong><a target="_blank" href="textAnalysis-help.php#totalWordCount_sans_stopwords">Total Word Count (sans English stopwords)</a>: </strong><span id="totalWordCount_sans_stopwords"></span></li>
                    <li><strong><a target="_blank" href="textAnalysis-help.php#uniqueWords">Unique Word Coun</a>t: </strong><span id="uniqueWords"></span></li>
                    <li><strong><a target="_blank" href="textAnalysis-help.php#lexicalDensity">Lexical Density</a>: </strong><span id="lexicalDiversity"></span><li>
                    <li><strong><a target="_blank" href="textAnalysis-help.php#lexicalDensity_sans_stopwords">Lexical Density (sans English stopwords)</a>: </strong><span id="lexicalDiversity_sans_stopwords"></span></li>
                    <li><strong><a target="_blank" href="textAnalysis-help.php#totalSentences">Total Sentences</a>: </strong><span id="totalSentences"></span></li>
                    <li><strong><a target="_blank" href="textAnalysis-help.php#longestSentence">Longest Sentence</a>: </strong><span id="longestSentence"></span></li>
                    <li><strong><a target="_blank" href="textAnalysis-help.php#shortestSentence">Shortest Sentence</a>: </strong><span id="shortestSentence"></span></li>
                    <li><strong><a target="_blank" href="textAnalysis-help.php#avgSentenceLength">Average Sentence Length</a>: </strong><span id="avgSentenceLength"></span></li>                  
                  </ul>
                  <!--collocations-->
                  <div id="text_collocations">
                    <ul>
                      <li><strong><a target="_blank" href="textAnalysis-help.php#collocations">Collocations</a>:</strong></li>
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
                      <li><strong><a target="_blank" href="textAnalysis-help.php#freqLongWords">Frequent "Long" Words</a>:</strong></li>
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
                      <li><strong><a target="_blank" href="textAnalysis-help.php#mostFreqWords">Most Frequent Words</a>:</strong></li>
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