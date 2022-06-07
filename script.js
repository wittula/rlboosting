let standardRanks = [
  "S1",
  "S2",
  "S3",
  "G1",
  "G2",
  "G3",
  "P1",
  "P2",
  "P3",
  "D1",
  "D2",
  "D3",
  "C1",
  "C2",
  "C3",
  "GC1",
  "GC2",
  "GC3",
  "SSL",
];

const priceList = [
  //  [cr, pln]
  [100, 2], // s1 - s2
  [100, 2], // s2 - s3
  [150, 3], // s3 - g1
  [150, 3], // g1 - g2
  [150, 3], // g2 - g3
  [200, 4], // g3 - p1
  [200, 4], // p1 - p2
  [250, 5], // p2 - p3
  [300, 6], // p3 - d1
  [400, 8], // d1 - d2
  [400, 8], // d2 - d3
  [500, 10], // d3 - c1
  [700, 14], // c1 - c2
  [800, 16], // c2 - c3
  [1000, 20], // c3 - gc1

  [4000, 80], // gc1 - gc2
  [8000, 160], // gc2 - gc3
  [12000, 240], // gc3 - ssl
];

const gamemodes = {
  solo: 0,
  duo: 0,
  trio: 50,
  rumble: 50,
  hoops: 50,
};

const paymentMethods = {
  standard: 0,
  psc: 50,
};

const multiRangPercentage = 1;
const streamPercentage = 15;
const playWithBoosterPercentage = 50;
const playWithBoosterMaxDifference = 3;

let counter = 0;

const selectors = document.querySelectorAll("select");
const checkboxes = document.querySelectorAll("input[type=checkbox]");

selectors.forEach((selector) => {
  selector.addEventListener("change", calculate);
});

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", calculate);
});

function playWithBoosterVisiblity(boolean) {
  if (boolean) {
    document.getElementById("boosterLabel").classList.add("visuallyhidden");
  } else {
    document.getElementById("boosterLabel").classList.remove("visuallyhidden");
  }
}

function createImg(name) {
  let img = document.createElement("img");
  img.src = "ranks/" + name + ".png";
  img.classList.add("rank");
  img.alt = name;

  return img;
}

const tbl1 = document.getElementById("table-standard");

for (let i = 0; i < priceList.length; i++) {
  const tr = tbl1.insertRow();

  const ranksCell = tr.insertCell();
  const crCell = tr.insertCell();
  const plnCell = tr.insertCell();

  let ranksContainer = document.createElement("div");
  ranksContainer.classList.add("ranks--container");

  ranksCell.appendChild(ranksContainer);

  ranksContainer.appendChild(createImg(standardRanks[counter]));
  ranksContainer.appendChild(document.createTextNode(" > "));

  crCell.appendChild(document.createTextNode(priceList[counter][0] + " cr"));
  plnCell.appendChild(
    document.createTextNode(priceList[counter][1].toFixed(2) + " PLN")
  );

  counter++;

  ranksContainer.appendChild(createImg(standardRanks[counter]));
}

const actualRank = document.getElementById("actualRank");
const desiredRank = document.getElementById("desiredRank");

for (let i = 0; i < standardRanks.length; i++) {
  let aOpt = document.createElement("option");
  aOpt.value = i;
  aOpt.innerHTML = standardRanks[i];

  let dOpt = document.createElement("option");
  dOpt.value = i;
  dOpt.innerHTML = standardRanks[i];

  actualRank.appendChild(aOpt);
  desiredRank.appendChild(dOpt);
}

function calculate() {
  let crPrice = 0;
  let plnPrice = 0;

  const actualRankID = parseInt(document.getElementById("actualRank").value);
  const desiredRankID = parseInt(document.getElementById("desiredRank").value);
  const selectedMode = document.getElementById("gamemode").value;
  const selectedPaymentMethod = document.getElementById("paymentMethod").value;

  const isStreaming = document.getElementById("stream").checked;
  const isPlaying = document.getElementById("playWithBooster").checked;

  const priceTextElement = document.getElementById("price");

  let pricePercent =
    gamemodes[selectedMode] + paymentMethods[selectedPaymentMethod];
  let rankDifference = desiredRankID - actualRankID;

  playWithBoosterVisiblity(
    !(
      selectedMode != "solo" &&
      rankDifference <= playWithBoosterMaxDifference &&
      desiredRankID < 13
    )
  );

  if (isStreaming) {
    pricePercent += streamPercentage;
  }

  if (
    isPlaying &&
    !document
      .getElementById("boosterLabel")
      .classList.contains("visuallyhidden")
  ) {
    pricePercent += playWithBoosterPercentage;
  }

  if (rankDifference > 1) {
    for (let i = 1; i < rankDifference; i++) {
      pricePercent -= multiRangPercentage;
    }
  }

  let sign = pricePercent > 0 ? "+" : "";

  let priceMultiplier = (100 + pricePercent) / 100;

  if (actualRankID >= desiredRankID) {
    priceTextElement.innerHTML =
      'Docelowa ranga musi być <strong class="highlight-y">wyższa</strong> niż obecna!';
  } else if (
    selectedMode != "solo" &&
    selectedMode != "hoops" &&
    desiredRankID > 15
  ) {
    priceTextElement.innerHTML =
      'Rangi <strong class="highlight-y">GC2 - SSL</strong> możliwe do wbicia tylko na trybie <strong class="highlight-y">1v1</strong> oraz <strong class="highlight-y">hoops</strong>!';
  } else {
    for (let i = actualRankID; i < desiredRankID; i++) {
      crPrice += priceList[i][0];
      plnPrice += priceList[i][1];
    }

    let crOutput = Math.round(crPrice * priceMultiplier);

    let plnOutput = plnPrice * priceMultiplier;
    plnOutput = plnOutput.toFixed(2);

    let priceOutput = "";

    if (selectedPaymentMethod == "psc") {
      priceOutput =
        'Cena: <strong class="highlight-y">' +
        plnOutput +
        " PLN</strong> <strong>PSC</strong> (" +
        sign +
        pricePercent +
        "%)";
    } else {
      priceOutput =
        'Cena: <strong class="highlight-y">' +
        crOutput +
        ' cr</strong> / <strong class="highlight-y">' +
        plnOutput +
        " PLN</strong> (" +
        sign +
        pricePercent +
        "%)";
    }

    priceTextElement.innerHTML = priceOutput;
  }
}
