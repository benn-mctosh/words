let params = new URLSearchParams(location.search);
var seed = params.get('seed');
if (seed == null) {
  seed = '-0--0-225'; // TODO: replace w/ randomly generated hand  
}
const p1name = params.get('p1')
const p2name = params.get('p2')

/*
* build a board from 225 w3-buttons with defined size
* track in a dictionary of arrays containing
* preset tile
* letter bonus
* word bonus


*/