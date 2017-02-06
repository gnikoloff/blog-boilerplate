import MediumEditor from 'medium-editor'
import Styles from '../scss/imports.scss'

let editableEls = document.querySelector('.editable')
let editor = new MediumEditor(editableEls, {
    forcePlainText: false
})

preview.config({ prvBox:'preview' })
           .listen('#uploader');