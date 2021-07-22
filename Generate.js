class Generate {
  sampleCount;
  percent;
  outSamples = [];
  constructor(sampleCount, percent) {
    this.sampleCount = sampleCount;
    this.percent = percent;
  }

  #setSampleNback = (samplesArray, nthNumber, maxTry) => {
    let outSetSample = [];
    let sampleIndex = 0;
    for (let i = 0; i < this.sampleCount; i++) {
      if (sampleIndex >= samplesArray.length) {
        sampleIndex = 1;
      } else {
        sampleIndex = sampleIndex + 1;
      }

      let nbackObject = {
        text: samplesArray[sampleIndex - 1],
        targetSample: false,
      };
      outSetSample.push(nbackObject);
    }

    outSetSample = outSetSample.sort(() => Math.random() - 0.5);
    this.#setTargetNback(outSetSample, nthNumber, maxTry, samplesArray);
  };
  #setTargetNback = (setSamplesArray, nthNumber, maxTry, samplesArray) => {
    let target = Math.floor(this.sampleCount * (this.percent / 100));
    let distance = Math.ceil(this.sampleCount / target);
    let targetSoFar = this.#countTargetNback(setSamplesArray, nthNumber);
    let difference = target - targetSoFar;
    let cntSetTarget = 0;
    for (let i = nthNumber; i < this.sampleCount - distance; i += distance) {
      if (i + nthNumber < this.sampleCount) {
        if (setSamplesArray[i] !== setSamplesArray[i + nthNumber]) {
          setSamplesArray[i + nthNumber].text = setSamplesArray[i].text;
          setSamplesArray[i + nthNumber].targetSample = true;
          cntSetTarget = cntSetTarget + 1;
        }
        if (cntSetTarget >= difference) {
          break;
        }
      }
    }
    this.#checkCountTarget(setSamplesArray, nthNumber, maxTry, samplesArray);
  };
  #countTargetNback = (nbackArray, nthNumber) => {
    let cntTarget = 0;
    for (let i = nbackArray.length - 1; i >= nthNumber; i--) {
      if (nbackArray[i].text === nbackArray[i - nthNumber].text) {
        nbackArray[i].targetSample = true;
        cntTarget = cntTarget + 1;
      }
    }
    this.outSamples = nbackArray;
    return cntTarget;
  };
  #checkCountTarget = (setTargetArray, nthNumber, maxTry, samplesArray) => {
    return new Promise((resolve) => {
      let targetSoFar = this.#countTargetNback(setTargetArray, nthNumber);
      setTargetArray = this.outSamples;
      let countTryNumber = 0;
      let target = Math.floor(this.sampleCount * (this.percent / 100));
      let distance = Math.ceil(this.sampleCount / target);
      let tolerance = target * 0.05;
      while (tolerance < Math.abs(target - targetSoFar)) {
        targetSoFar = this.#countTargetNback(setTargetArray, nthNumber);
        setTargetArray = this.outSamples;
        if (targetSoFar > target) {
          let goalDifference = targetSoFar - target;
          let startPoint;
          while (goalDifference) {
            startPoint = 0;
            setTargetArray = this.#deleteTargetNback(
              setTargetArray,
              startPoint,
              nthNumber,
              samplesArray
            );
            goalDifference = goalDifference - 1;
          }
        }
        if (targetSoFar < target) {
          let goalDifference = target - targetSoFar;
          let startPoint = 0;
          let startIndex = 0;

          while (goalDifference) {
            let addTargetArray;

            if (countTryNumber > maxTry) {
              targetSoFar = this.#countTargetNback(setTargetArray, nthNumber);
              return resolve(setTargetArray);
            }

            if (startPoint === this.sampleCount - 1) {
              startPoint = startIndex;
              startIndex++;
              if (startIndex >= this.sampleCount) {
                startIndex = 0;
              }
            }
            if (startPoint + nthNumber < this.sampleCount) {
              addTargetArray = this.#addTargetNback(
                setTargetArray,
                startPoint,
                nthNumber
              );
              if (addTargetArray.length > 0) {
                setTargetArray = addTargetArray;
                goalDifference = goalDifference - 1;
              }

              startPoint = startPoint + distance;
            }
            countTryNumber = countTryNumber + 1;
          }
        }
      }
      this.outSamples = setTargetArray;
      resolve(this.outSamples);
    });
  };
  #deleteTargetNback = (
    additionalTargets,
    startPoint,
    nthNumber,
    samplesArray
  ) => {
    for (let i = startPoint; i < this.sampleCount; i++) {
      if (i + nthNumber < this.sampleCount) {
        if (
          additionalTargets[i].text === additionalTargets[i + nthNumber].text
        ) {
          additionalTargets[i + nthNumber].targetSample = false;
          if (i < nthNumber) {
            const sampleFilter = samplesArray.filter((character) => {
              return character !== additionalTargets[i].text;
            });
            let rndIndex = Math.floor(Math.random() * sampleFilter.length) + 1;
            rndIndex = rndIndex - 1;
            additionalTargets[i].text = sampleFilter[rndIndex];
          } else {
            const sampleFilter = samplesArray.filter((character) => {
              return (
                character !== additionalTargets[i - nthNumber].text &&
                character !== additionalTargets[i].text
              );
            });
            let rndIndex = Math.floor(Math.random() * sampleFilter.length) + 1;
            rndIndex = rndIndex - 1;
            additionalTargets[i].text = sampleFilter[rndIndex];
          }

          return additionalTargets;
        }
      }
    }
  };
  #addTargetNback = (lessTargetArray, startPoint, nthNumber) => {
    for (let i = startPoint; i < this.sampleCount - nthNumber; i++) {
      if (lessTargetArray[i].text !== lessTargetArray[i + nthNumber].text) {
        if (i + nthNumber + nthNumber <= this.sampleCount - 1) {
          if (
            lessTargetArray[i + nthNumber].text !==
            lessTargetArray[i + nthNumber + nthNumber].text
          ) {
            lessTargetArray[i + nthNumber].text = lessTargetArray[i].text;
            lessTargetArray[i + nthNumber].targetSample = true;
            return lessTargetArray;
          }
        } else {
          lessTargetArray[i + nthNumber].text = lessTargetArray[i].text;
          lessTargetArray[i + nthNumber].targetSample = true;
          return lessTargetArray;
        }
      }
    }
    return [];
  };
  nback = (samples, nth, tryNumber) => {
    return new Promise((resolve, reject) => {
      if (samples.length === 0 || nth === 0) {
        reject(new Error("input is wrong!"));
      } else if (nth < 0) {
        reject(new Error("nth number is not correct"));
      } else if (this.sampleCount < 10) {
        reject(new Error("samples is not enough"));
      } else if (samples.length < 3) {
        reject(new Error("number of samples is not enough!"));
      } else if (samples.length !== 0) {
        if (this.percent > 60) {
          this.percent = 60;
        }
        this.#setSampleNback(samples, nth, tryNumber);
        resolve(this.outSamples);
      } else {
        reject(new Error("array of samples is empty!"));
      }
    });
  };

  #nextIndexColor = (colorI, colorsArray) => {
    colorI++;
    if (colorI >= colorsArray.length) {
      colorI = 0;
    }
    return colorI;
  };
  #setIncong = (congArray, colorsArray) => {
    let incCount = Math.floor(this.sampleCount * (this.percent / 100));
    let colorIndex = 0;
    for (let i = 0; i < incCount; i++) {
      congArray[i].type = "I";
      colorIndex = this.#nextIndexColor(colorIndex, colorsArray);
      while (congArray[i].colorName === colorsArray[colorIndex].color) {
        colorIndex = this.#nextIndexColor(colorIndex, colorsArray);
      }
      congArray[i].colorCode = colorsArray[colorIndex].codeColor;
      congArray[i].colorName = colorsArray[colorIndex].color;
    }
    this.outSamples = congArray.sort(() => Math.random() - 0.5);
  };
  #setSampleStroop = (colorsArray) => {
    let outSetSample = [];
    let colorIndex = 0;
    for (let i = 0; i < this.sampleCount; i++) {
      if (colorIndex >= colorsArray.length) {
        colorIndex = 1;
      } else {
        colorIndex = colorIndex + 1;
      }

      let stroopObject = {
        type: "C",
        colorText: colorsArray[colorIndex - 1].text,
        colorName: colorsArray[colorIndex - 1].color,
        colorCode: colorsArray[colorIndex - 1].codeColor,
      };
      outSetSample.push(stroopObject);
    }
    outSetSample = outSetSample.sort(() => Math.random() - 0.5);
    this.#setIncong(outSetSample, colorsArray);
  };
  stroop = (colors) => {
    return new Promise((resolve, reject) => {
      const colorsFilter = colors.filter((character) => {
        return (
          character.text === "" ||
          character.codeColor === "" ||
          character.color === ""
        );
      });

      const colorsMap = colors.map((character) => {
        if (Object.keys(character).length === 3) {
          return true;
        } else {
          return false;
        }
      });
      const colorsObject = colorsMap.filter((character) => {
        return character === true;
      });
      if (colorsFilter.length !== 0) {
        reject(new Error("field of array is empty!"));
      } else if (colors.length < 2) {
        reject(new Error("number of color is not enough!"));
      } else if (colors.length < 2) {
        reject(new Error("number of color is not enough!"));
      } else if (colorsObject.length !== colors.length) {
        reject(new Error("field of object is miss!"));
      } else if (colors.length !== 0) {
        this.#setSampleStroop(colors);
        resolve(this.outSamples);
      } else {
        reject(new Error("array of colors is empty!"));
      }
    });
  };

  #nextTargetIndex = (targetI, targetArray) => {
    targetI++;
    if (targetI >= targetArray.length) {
      targetI = 0;
    }
    return targetI;
  };
  #setSampleCpt = (samplesArray, targetArray) => {
    let outSetSamples = [];
    let targetIndex = 0;
    for (let i = 0; i < this.sampleCount; i++) {
      if (targetIndex >= samplesArray.length) {
        targetIndex = 1;
      } else {
        targetIndex = targetIndex + 1;
      }

      let cptObject = {
        imageIndex: samplesArray[targetIndex - 1],
        targetSample: false,
      };
      outSetSamples.push(cptObject);
    }
    outSetSamples = outSetSamples.sort(() => Math.random() - 0.5);
    this.#setTargetCpt(outSetSamples, targetArray);
  };
  #setTargetCpt = (setSampleArray, targetArray) => {
    let targetIndex = 0;
    let cptTarget = Math.floor(this.sampleCount * (this.percent / 100));
    for (let i = 0; i < cptTarget; i++) {
      targetIndex = this.#nextTargetIndex(targetIndex, targetArray);
      setSampleArray[i].imageIndex = targetArray[targetIndex];
      setSampleArray[i].targetSample = true;
    }
    this.outSamples = setSampleArray.sort(() => Math.random() - 0.5);
  };
  cpt = (samples, target) => {
    return new Promise((resolve, reject) => {
      let intersectionArray = samples.filter((x) => target.includes(x));
      if (samples.length === 0 || target.length === 0) {
        reject(new Error("array of input is empty!"));
      } else if (intersectionArray.length === 0) {
        this.#setSampleCpt(samples, target);
        resolve(this.outSamples);
      } else {
        reject(new Error("samples and target have intersection!"));
      }
    });
  };

  #setTargetGonogo = (setsampleArray, targetArray) => {
    let targetIndex = 0;
    let gonogoTarget = Math.floor(this.sampleCount * (this.percent / 100));
    for (let i = 0; i < gonogoTarget; i++) {
      targetIndex = this.#nextTargetIndex(targetIndex, targetArray);
      setsampleArray[i].text = targetArray[targetIndex];
      setsampleArray[i].targetSample = true;
    }
    this.outSamples = setsampleArray.sort(() => Math.random() - 0.5);
  };
  #setSampleGonogo = (samplesArray, targetArray) => {
    let outSetSample = [];
    let targetIndex = 0;
    for (let i = 0; i < this.sampleCount; i++) {
      if (targetIndex >= samplesArray.length) {
        targetIndex = 1;
      } else {
        targetIndex = targetIndex + 1;
      }

      let gonogoObject = {
        text: samplesArray[targetIndex - 1],
        targetSample: false,
      };
      outSetSample.push(gonogoObject);
    }
    outSetSample = outSetSample.sort(() => Math.random() - 0.5);
    this.#setTargetGonogo(outSetSample, targetArray);
  };
  gonogo = (samples, target) => {
    return new Promise((resolve, reject) => {
      let intersectionArray = samples.filter((x) => target.includes(x));
      if (samples.length === 0 || target.length === 0) {
        reject(new Error("array of input is empty!"));
      } else if (intersectionArray.length === 0) {
        this.#setSampleGonogo(samples, target);
        resolve(this.outSamples);
      } else {
        reject(new Error("samples and target have intersection!"));
      }
    });
  };
}
exports.Generate = Generate;
