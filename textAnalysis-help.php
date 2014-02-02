<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">    

    <title>textAnalysis Help - Wayne State</title>
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
    <!--<script src="js/textAnalysis.js"></script>-->

    <!-- cookies -->
    <script src="inc/jquery.cookie.js" type="text/javascript"></script> 

     

    

  </head>

  <body>
  
    <div id="wrapper">
      
      <!-- Sidebar -->
      <div id="sidebar">        
        <div id="logo">
          <a href="https://docs.google.com/document/d/1MwGoXZavQFukII83Pe5ku4xIzZD6tv6-FKxChhQXn_I/edit?usp=sharing" target="_blank">
            <img src="http://scholarscooperative.wayne.edu/img/ls_logo.png"/>
          </a>
          <p>Wayne State University Libraries</p>
        </div>
        <div id="menu">          
          <ul>
            <li><a href="#introduction">Introduction</a></li>
            <li><a href="#annotations">Annotations</a></li>
            <li><a href="#analysis">Analysis</a></li>
            <li><a href="#glossary">Glossary</a></li>                        
          </ul>
        </div>
      </div>   
          
      <!-- Page content -->
      <div id="page-content-wrapper">        

        <!-- Keep all page content within the page-content inset div! -->
        <div class="page-content">
          <div id="help_layer">

            <div class="row layer_header" id="status_tools">
              <div class="left_pane">
                <h2>textAnalysis Help</h2>                            
              </div>              
            </div>

            <div class="row" id="image_text">
              <div class="solo_pane">
                <div id="introduction">
                  <h3>Welcome to textAnalysis help!</h3>
                  <h4><a name="introduction">Introduction</a></h4>
                  <p>This page is designed to help contextualize the various text analysis tools found on this website, and define some terms related to text analysis.  This is by no means a comprehensive guide to textual analysis, merely insight and clarificiation of the tools and terms used on these pages.</p>

                  <p>This experimental "textAnalysis" tool was created to work specifically with texts digitized by the Wayne State University Libraries.  These texts are complex digital objects, part of the library's digital collections.  Each text is comprised of page image scans, OCRed text in gently marked-up HTML form, and XML metadata providing spatial coordinates of each word on the page.  These tools use the page images and the OCRed text to create shared annotations and perform textual analysis.</p>

                  <p>The tools contained herein were meant to be functional first, pretty second.  As an experimental tool, an exploration of textual analysis and the affordances that digital texts provide, we warmly welcome any <a href="mailto:libwebmaster@wayne.edu">comments, feedback, or suggestions</a> about the tool.</p>

                  <p>Happy exploring and enjoy!</p>              
                </div>

                <hr>
                
                <div id="annotation_help">
                  <h4><a name="annotations">Annotations</a></h4>
                  <p>One unique charactersitic of digital texts is the ability for multiple people to interact with the same version of the text.  In the case of these annotations, after logging in, users are able to annotate the OCR text on the right-hand side of the page.  To create annotations, navigate to the page you wish to annotate, highlight text, and click the annotation icon that appear above the text you have highlighted.  Below is a screenshot of this icon:</p>
                  <img src="http://162.243.93.130/textAnalysis/annotate_icon.jpg"/>                  
                  <p>When you create annotations your name and username are associated with each annotation, and they can only be edited or removed by you.  You can, however, see others annotations on the same page, and can even annotate the same section of text.</p>
                  <p>This functionality was created using the <a href="http://annotatorjs.org/">"Annotator" javascript plug-in</a>.  Annotations are stored in an <a href="http://www.elasticsearch.org/">Elasticsearch</a> backend datastore, with an intermediary Python / Flask interpreter layer that translates Annotator requests for Elasticsearch.</p>
                </div>

                <hr>

                <div id="analysis_help">
                  <h4><a name="analysis">Analysis</a></h4>

                  <p>The Annotations interface leverages a social characteristic of digital texts, the Analysis layer focuses on quantatitive analysis that can be performed on digital text.  The Analysis layer is comprised of two major areas: "Individual Word Analysis" on the left, and "Full-Text Metrics and Statistics" on the right.  Quantative textual analysis is performed server-side using the Python <a href="http://nltk.org/">Natural Language Toolkit (NLTK)</a>.  NLTK provides a handy, abstracted way to interact and analyze corpuses of text.</p>

                  <p>"Individual Word Analysis" is a couple of tools used to explore how given word(s) are used in the text.  Using the search box provided, enter a word to search for, or multiple ones seperated by a comma.  The <strong>graph displayed</strong> is a chart showing how many times the word shows up (frequency) on the y-axis, and the page numbers on the x-axis.  Below that are <strong>"Synonyms from Wordnet"</strong>.  <a href="http://wordnet.princeton.edu/">WordNet</a> is, "a large lexical database of English. Nouns, verbs, adjectives and adverbs are grouped into sets of cognitive synonyms (synsets), each expressing a distinct concept."  WordNet is an extremely powerful corpus / database of english words, this tool just scratches the surface of the kind of analysis WordNet provides. These "synonyms" from WordNet are the relation of "synonymy" between words, where "shut" and "close" might be interchangeable in text.  Or the interesting case of "he" where "helium" might be used.  Even though we understand the context to be "he", "she", "him", etc., WordNet does not automatically make this distinction.  These synonyms are not like synonyms we are accustomed to seeing, but interesting nonetheless.  Finally, below those are <strong>"Concordances"</strong>, showing a snippet of text for each instance of the word(s) searched for.<p>

                  <p>On the right-hand side of the page are "Full-Text Metrics and Statistics".  The first time a book is loaded in textAnalysis, some preliminary analysis and preperation is performed server-side, with all future analysis using this perliminary preperation to reduce loading time.  Below are short explanations and definitions of the metrics for this section:</p>

                  <table class="table table-hover">
                  
                    <tbody>

                      <tr>
                        <td><strong><a name="totalWordCount">Total Word Count</a></strong></td>
                        <td>After <a href="#tokenization">tokenization</a> of the text, and puncutation is removed, total number of discrete words.</td>
                      </tr>
                      <tr>
                        <td><strong><a name="totalWordCount_sans_stopwords">Total Word Count (sans English stopwords)</a></strong></td>
                        <td>Total number of words from above, minus common <a href="#stopwords">stopwords</a>.  These stopwords are defined and provided by NLTK.</td>
                      </tr>
                      <tr>
                        <td><strong><a name="uniqueWords">Unique Word Count</a></strong></td>
                        <td>Total amount of unique words found in the text.</td>
                      </tr>
                      <tr>
                        <td><strong><a name="lexicalDensity">Lexical Density</a></strong></td>
                        <td>In this instance, <a href="http://en.wikipedia.org/wiki/Lexical_density">Lexical Density</a> is determined by dividing the total amount of words by the number of unique words, (Total Words Count / Unique Word Count).</td>
                      </tr>
                      <tr>
                        <td><strong><a name="lexicalDensity_sans_stopwords">Lexical Density (sans English stopwords)</a></strong></td>
                        <td>Similar metric to above, with the added dimension of removing stopwards from both the total and unique count of words.</td>
                      </tr>
                      <tr>
                        <td><strong><a name="totalSentences">Total Sentences</a></strong></td>
                        <td>Fairly self-explanatory, the total number of sentences as counted by NLTK's sentence tokenizer.  This tokenizer identifies sentences using punctuation and spacing in the text.</td>
                      </tr>
                      <tr>
                        <td><strong><a name="longestSentence">Longest Sentence</a></strong></td>
                        <td>From all sentences in the text, the longest among them.</td>
                      </tr>
                      <tr>
                        <td><strong><a name="shortestSentence">Shortest Sentence</a></strong></td>
                        <td>From all sentences in the text, the shortest among them.</td>
                      </tr>                      
                      <tr>
                        <td><strong><a name="avgSentenceLength">Average Sentence Length</a></strong></td>
                        <td>Sum of all sentences lengths divided by the total number of sentences.</td>
                      </tr>
                      <tr>
                        <td><strong><a name="collocations">Collocations</a></strong></td>
                        <td>These "collocations" are calculated finding common two-word combinations, also known as "bi-grams", where each word is longer than 3 characters, appearing more than twice in the text, with stopwards removed.</td>
                      </tr>
                      <tr>
                        <td><strong><a name="freqLongWords">Frequent "Long" Words</a></strong></td>
                        <td>This metric is comprised of words, longer than 5 characters long, appearing more than 7 times in the text, with stopwards removed.</td>
                      </tr>
                      <tr>
                        <td><strong><a name="mostFreqWords">Frequent Words</a></strong></td>
                        <td>These are the 15 most frequent words in text, with stopwords removed.</td>
                      </tr>                      

                    </tbody>
                  </table>
                </div>

                <hr>

                <div id="glossary">
                  <h4><a name="glossary">Glossary of Terms</a></h4>
                  <table class="table table-hover">                  
                  <tbody>
                    <tr>
                      <td><strong><a name="stopwords">stopwords</a></strong></td>
                      <td>Definition of "stopwords" from the Python <a href="http://nltk.org/book/ch02.html">Natural Lanuage Toolkit (NLTK) documentation</a>, "There is also a corpus of stopwords, that is, high-frequency words like the, to and also that we sometimes want to filter out of a document before further processing. Stopwords usually have little lexical content, and their presence in a text fails to distinguish it from other texts."</td>
                    </tr>
                    <tr>
                      <td><strong><a name="tokenization">tokenization</a></strong></td>
                      <td>Wikipedia's entry for <a href="http://en.wikipedia.org/wiki/Tokenization">tokenization</a> includes this definition, "Tokenization is the process of breaking a stream of text up into words, phrases, symbols, or other meaningful elements called tokens. The list of tokens becomes input for further processing such as parsing or text mining. Tokenization is useful both in linguistics (where it is a form of text segmentation), and in computer science, where it forms part of lexical analysis."</td>
                    </tr>
                   
                  </tbody>
                </div>

              </div>     <!-- left pane -->                     
            </div>
          </div>

        </div> <!--close page content-->
        
      </div>     
  </body>
  <script type="text/javascript">
    $(document).ready(function(){
      $('tr:odd').css('background-color', 'rgb(231,231,231');
    })                    
  </script>
</html>