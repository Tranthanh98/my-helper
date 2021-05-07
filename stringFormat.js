export default function stringFormat(string)
{
  [...Array(arguments.length)].map( (_,i) => string = string.replace('{' + (i - 1) + '}', arguments[i]))
  return string;
}
