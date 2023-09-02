exports.isNumeric = (n) => {
 // console.log("!!! ", n, typeof(n), !Number.isNaN(n), !Number.isNaN(Number.parseFloat(n)));
  console.log("n and type: ", n, typeof(n));
  return /^-?\d+(\.\d+)?$/.test(n);  //if (typeof n != "string") return false; // we only process strings!  
//  return !Number.isNaN(n) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
//         !Number.isNaN(Number.parseFloat(n)); // ...and ensure strings of whitespace fail
}
