const Generate=require('./Generate.js')

const obj = new Generate.Generate(100, 40);


try {
    let gonogoOut = obj.gonogo(["ب", "ت", "ث"],["پ"]);
    console.log(gonogoOut);
  } catch (e) {
    console.log("mamad gonogo");
    console.log(e);
  }
try{
  let cptOut = obj.cpt([0, 1], [2]);
  console.log(cptOut);
}catch(e)
{
  console.log("mamad cpt");
    console.log(e);
}

let stroopOut = obj.stroop([
  { IC: "C", text: "قرمز", color: "red", codeColor: "#B10D0D" },
  { IC: "C", text: "زرد", color: "yellow", codeColor: "#F0E210" },
  { IC: "C", text: "سبز", color: "green", codeColor: "#4CA810" },
  { IC: "C", text: "آبی", color: "blue", codeColor: "#1042F0" },
]);
console.log(stroopOut);


try {
  let nbackOut=obj.nback([1,2,3,4,5,6,7,8,9],1,5);
  console.log(nbackOut);
} catch (e) {
  console.log("mamad Nback");
  console.log(e);
}