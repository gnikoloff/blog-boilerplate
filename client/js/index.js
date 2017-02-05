import MediumEditor from 'medium-editor'
import socialite from 'socialite'

import Styles from '../scss/imports.scss'

let editableEls = document.querySelector('.editable')
let editor = new MediumEditor(editableEls)