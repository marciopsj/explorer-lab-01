import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo > span:nth-child(2) > img")

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black", "gray"],
  }

  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

const cvcMask = IMask(document.querySelector("#security-code"), {
  mask: "000",
})

const expirationDateMask = IMask(document.querySelector("#expiration-date"), {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
  },
})

const cardNumberMasked = IMask(document.querySelector("#card-number"), {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })

    console.log(foundMask)

    return foundMask
  },
})

// Input Número do Cartão

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
  updateCardNumber(cardNumberMasked.value)
})

const updateCardNumber = (cardNumber) => {
  const ccNumber = document.querySelector(".cc-number")
  console.table(cardNumber.length, cardNumber)
  ccNumber.innerText =
    cardNumber.length === 0 ? "1234 5678 9012 3456" : cardNumber
}

// Input do Nome do Titular
const cardHolder = document.querySelector("#card-holder")

cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")
  console.log(cardHolder.value.length)
  ccHolder.innerText =
    cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value
})

//Input Expiration Date

expirationDateMask.on("accept", () => {
  updateExpirationDate(expirationDateMask.value)
})

const updateExpirationDate = (expirationDate) => {
  const ccExpiration = document.querySelector(".cc-expiration .value")
  ccExpiration.innerHTML =
    expirationDate.length === 0 ? "02/32" : expirationDate
}

//Input CVC
cvcMask.on("accept", () => {
  updateCVC(cvcMask.value)
})

const updateCVC = (inputCode) => {
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText = inputCode.length === 0 ? "123" : inputCode
}

//Clique do Botão
const addButton = document.querySelector("#add-card")

addButton.addEventListener("click", () => {
  let nameCardHolder = cardHolder.value.toUpperCase()
  cardHolder.value.length === 0
    ? alert("Preencha o nome do Titular!")
    : alert(`Cartão adicionado para o Titular ${nameCardHolder}`)
})

//Prevenir o evento Submit do Form
document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault()
})

globalThis.setCardType = setCardType
