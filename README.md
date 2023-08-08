# Words
A game I made so I could play the word-building games my grandma loves while protecting my privacy (apps like Words With Friends are embarassingly bloated, and I don't have a smartphone anyway)

<img width="700" alt="Screenshot 2023-08-08 at 08 26 42" src="https://github.com/benn-mctosh/words/assets/107890667/196e686a-c54e-4276-936f-adfc3a7f43e3">

## What is this? 
A privacy-preserving crossword game. **This game protects your data through the simple expedient of not collecting any data.**

Everything is performed client-side. Think about it as a game in the tradition of chess-by-correspondence: you make a move, then send the game state to your opponent, who makes their move... Even dictionary lookups are performed client-side (This makes for a larger-than-ideal web page, since you're downloading the entire dictionary. Maybe there's some sort of client-side caching that can address this, but that's not part of the minimum viable product. You could also just download `loadDictionary.js` for yourself and run the game offline if you want.)

The stable version of this game lives on my website, at [`https://bennettmcintosh.com/words`](https://bennettmcintosh.com/words).

I can’t provide any privacy guarantees, though, becuase my website is hosted by GitHub, and I haven’t bothered to figure out what sort of analytics they collect. So if it’s really important to you that MSFT not have your Scrabble moves (to train ScrabbleGPT? That train has probably left the station) I suggest, even encourage you, to download the javascript source yourself. 

## Starting a new game
Navigating to the landing page (in this case, [`https://bennettmcintosh.com/words`](https://bennettmcintosh.com/words), with no URL parameters) produces an empty game board and automatically draws seven tiles for you. Build words by clicking on a tile to select it, then click on the board to place it where you click, or on the rack to remove it from the board. If you have made a legal move, the `Play` button will turn green and display the number of points this play would earn you. 

If you're not sure why a move isn’t valid, clicking on the `Play` button while it’s gray will produce a message explaining why.

## Enlisting/informing an opponent

Once you click the `Play` button, the game automatically generates:
* A URL that includes the `seed` parameter, which your opponent can visit to view/play the game from their perspective
* The text of an email or message you can send to your opponent with that URL (so that you can use communications protocol of your choice)
* A `mailto` link (with blank recipient field) that you can click to generate such an email. Simply input your opponent’s email address.

<img width="400" alt="Screenshot 2023-08-08 at 08 33 23" src="https://github.com/benn-mctosh/words/assets/107890667/33aeb676-37d8-4539-b827-27e3928fa20e">

## More game rules (these are pretty standard)

### Word placement

The first word must be placed on the blue sunflower square in the center. Future words must use at least one tile already in play. All moves must place tiles in only a single row or column, and must form only one ‘stem’ word (that is, while you can place tiles on either side of a tile already in play, you cannot place tiles on either side of a blank cell). 

### Letter point value and frequency
| 9 × A<sup>1</sup> | 3 × B<sup>3</sup> | 2 × C<sup>3</sup> | 4 × D<sup>2</sup> | 14 × E<sup>1</sup> | 3 × F<sup>5</sup> | 5 × G<sup>3</sup> |
|---|---|---|---|---|---|---|
| 5 × H<sup>3</sup> | 9 × I<sup>1</sup> | 1 × J<sup>8</sup> | 2 × K<sup>6</sup> | 5 × L<sup>2</sup> | 3 × M<sup>2</sup> | 5 × N<sup>1</sup> |
| 9 × O<sup>5</sup> | 3 × P<sup>3</sup> | 1 × Q<sup>10</sup> | 4 × R<sup>1</sup> | 4 × S<sup>1</sup> | 4 × T<sup>3</sup> | 6 × U<sup>3</sup> | 
| 2 × V<sup>K</sup> | 2 × W<sup>5</sup> | 1 × X<sup>8</sup> | 2 × Y<sup>5</sup> | 1 × Z<sup>9</sup> | 3 × _<sup>0</sup> | |

### Colored cells

For the first move in which a tile is placed on these cells, these multiply the value of the letter placed on them (purple & pink cells) or any word that includes them (blue and green cells) by the number shown in the cell. 

## Known issues/future features

* The game interprets `p1` and `p2` parameters in the URL as player one and player two’s names, but those aren’t currently added to the URL that gets sent to your oppnent.
* The `seed` parameter currently includes both players’ hands in cleartext. Will soon implement a simple encryption/compression procedure to discourage peeking at your opponent’s hand
* The `discard/swap` button has not yet been implemented
* There’s debate among players (even within my own family) whether it’s more fun for a game to tell you in real-time whether the word you’re considering is legal, or to make you wait until pressing the `Play` button. As currently implemented, this game tells you in real time (because that’s how Grandma likes it!), but I might add an option to toggle that later. 

Also of note: I provide a link to the *Official SCRABBLE® Players' Dictionary* (*OSPD*), because that provides a useful search tool for prefixes/suffixes, etc., but this game doesn't use *OSPD*. So the game may reject a play that would be valid per *OSPD* or vice versa. 




