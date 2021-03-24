import Component from "@ember/component";
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './test.css';

export default Component.extend({
    classNames: "react-el-container",
    didInsertElement() {
        this._el = this.element;
        ReactDOM.render(<App/> , this.element);
    },

    willDestroy() {
        ReactDOM.unmountComponentAtNode(this._el);
    },
});