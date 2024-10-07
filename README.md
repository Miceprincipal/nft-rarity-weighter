A simple html front ended bulk rarity weighting adjuster for NFT assets for artists and other creators. 

It allows for five different rarity settings with an editable value for each. Rarity level can then be
selected for each trait from a dropdown box. Colour coding is then applied to traits for ease of use.

There are two versions: 
If you are editing static image files where the weighting is commonly
applied to a number at the end of the IMAGE FILENAME, in which case you will need the PNG version and
PNGSERVER.js. 

If you are editing animated gifs or are using a complier where the weighting is otherwise applied to
the FOLDER NAME, use the FOLDER VERSION and GIFSERVER.JS.

Just drop both files in the **top level** of your assets folder.

Installl required node dependencies:

```npm install express cors```

Then 

```node pngserver.js```

or

```node gifserver.js```

to run the local server and open the html. 

In all honesty it's about 10% me and 90% chatgpt but it was just a little tool I needed for a horribly
bloated project and I thought maybe 1 in 7 billion people might find it handy.
