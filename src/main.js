import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")


function setCardType(type) {
    const colors = {
        visa: ["#436D99", "2D57F2"],
        mastercard: ["#DF6F29", "#C69347"],
        default: ["#black", "gray"],
}

ccBgColor01.setAttribute("fill", colors[type][0])
ccBgColor02.setAttribute("fill", colors[type][1])
ccLogo.setAttribute("src", `cc-${type}.svg`)

}

const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
    mask: "0000"
}

const securityCodeMasked = IMask(securityCode, securityCodePattern)


const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
    mask:"MM{/}YY",
    blocks: {
        YY: {
            mask: IMask.MaskedRange,
            from: String(new Date().getFullYear()).slice(2),
            to: String(new Date().getFullYear()+10).slice(2),
        },
        MM: {
            mask: IMask.MaskedRange,
            from: 1,
            to: 12
        }
    }
}
const expirationDateMasked =  IMask(expirationDate, expirationDatePattern)


const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
    mask: [
        {
            mask: "0000 0000 0000 0000",
            regex:/^4\d{o,15}/,
            cardtype: "visa",
        },
        {
            mask: "0000 0000 0000 0000",
            regex:/(^5[1-5]\d{0,2}|^22[2-9]\dZ^2[3-7]\d{0,2})\d{0,12}/,
            cardtype: "mastercard",
        },
        {
            mask: "0000 0000 0000 0000",
            cardtype: "defaut",
        },
    ],
    dispatch: function (appended, dynamicMasked) {
        const number = (dynamicMasked.value + appended).replace(/\D/g, '');
        const foundMask = dynamicMasked.compiledMasks.find(item => {
          return number.match(item.regex);

        });
        
        return foundMask;
    },
}

const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

cardNumberMasked.on('accept', () => {
  const ccNumber = document.querySelector('.cc-number');
  ccNumber.innerText = cardNumberMasked.value || '1234 5678 9012 3456';

  const cardType = cardNumberMasked.masked.currentMask.cardtype;
  setCardType(cardType);
});

document
  .querySelector('form')
  .addEventListener('submit', event => event.preventDefault());

const addCardButton = document.querySelector('#add-card');
addCardButton.addEventListener('click', event => {
  console.log('clicou');
  addCard();
});

const cardHolder = document.querySelector('#card-holder');
cardHolder.addEventListener('input', () => {
  ccHolder.innerText = cardHolder.value.substr(0, 22) || defaultNameHolder;
});

function addCard() {
  const completed =
    cardNumberMasked.value &&
    expirationDateMasked.value &&
    securityCodeMasked.value &&
    cardHolder.value;

  if (!completed) {
    showMessage('Informe os dados do cartão', 'Dados Incompletos');
    return;
  }

  const cardData = {
    'card holder': cardHolder.value,
    'card number': cardNumberMasked.value,
    'security code': securityCodeMasked.value,
    'expiration date': expirationDateMasked.value,
    flag: cardNumberMasked.masked.currentMask.cardtype,
  };

  console.log(cardData);
  //alert('cartão adicionado!');
  showMessage('Seu cartão foi adicionado!');
  clearCardForm();
}

function clearCardForm() {
  cardNumberMasked.value = '';
  securityCodeMasked.value = '';
  expirationDateMasked.value = '';
  cardHolder.value = '';
  ccHolder.innerText = defaultNameHolder;
}

globalThis.clearForm = clearCardForm;

const modalDialog = document.querySelector('dialog');
const modalMessage = document.querySelector('dialog form p');
const modalTitle = document.querySelector('dialog form h3');
function showMessage(message, title) {
  modalTitle.innerText = title || 'Rocketpay';
  modalMessage.innerText = message;

  const modalNotVisible = !modalDialog.checkVisibility();
  if (modalNotVisible) modalDialog.showModal();
}
globalThis.showMessage = showMessage;

const tiltCard = document.querySelector('.cc');
const tiltConfig = {
  max: 18, // max tilt rotation (degrees)
  speed: 600, // Speed of the enter/exit transition
  gyroscope: true, // Boolean to enable/disable device orientation detection,
  'full-page-listening': false,
};

VanillaTilt.init(tiltCard, tiltConfig);