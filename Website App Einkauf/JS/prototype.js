String.prototype.replaceAt = function(index, replacement) {
  return this.substring(0, index) + replacement + this.substring(index + replacement.length);
};

String.prototype.indexOfRegex = function(regex){
  let match = this.match(regex);
  return match ? this.indexOf(match[0]) : -1;
}

String.prototype.lastIndexOfRegex = function(regex){
  let match = this.match(regex);
  return match ? match.index + match[0].length -1  : -1;
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
