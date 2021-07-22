const Generate = require("./Generate.js");

const object = new Generate.Generate(100, 20);

object
  .cpt([0, 1], [2])
  .then((cptOut) => {
    console.log(cptOut);
  })
  .catch((err) => {
    console.log(err);
  });

object
  .gonogo(["ب", "ت", "ث"], ["پ"])
  .then((gonogoOut) => {
    console.log(gonogoOut);
  })
  .catch((err) => {
    console.log(err);
  });

object
  .stroop([
    { text: "قرمز", color: "red", codeColor: "#B10D0D" },
    { text: "زرد", color: "yellow", codeColor: "#F0E210" },
    { text: "سبز", color: "green", codeColor: "#4CA810" },
    { text: "آبی", color: "blue", codeColor: "#1042F0" },
  ])
  .then((stroopOut) => {
    console.log(stroopOut);
  })
  .catch((err) => {
    console.log(err);
  });

object
  .nback([5,6,7],1, 4)
  .then((nbackOut) => {
    console.log(nbackOut);
  })
  .catch((err) => {
    console.log(err);
  });
