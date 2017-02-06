import MediumEditor from 'medium-editor'
import Styles from '../scss/imports.scss'

let editableEls = document.querySelector('.editable')
let editor = new MediumEditor(editableEls, {
    forcePlainText: false
})

function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

let pageCount = parseInt(getParameterByName('page')) + 1 || 2
let pagination = document.querySelector('.pagination-container')

if (pagination) {
    let chosenItem = pagination.querySelector(`ul li:nth-of-type(${pageCount}) span`)
    chosenItem.className += 'active';
}
