import React from 'react';
import { Global, css } from '@emotion/core';

import ModernEraRegular from '../public/assets/webfonts/ModernEraRegular.ttf';
import ModernEraBold from '../public/assets/webfonts/ModernEraBold.ttf';
import ModernEraItalic from '../public/assets/webfonts/ModernEraItalic.ttf';
import ModernEraBoldItalic from '../public/assets/webfonts/ModernEraBoldItalic.ttf';
import ModernEraMedium from '../public/assets/webfonts/ModernEraMedium.ttf';
import ModernEraExtraBold from '../public/assets/webfonts/ModernEraExtraBold.ttf';
import SpaceMonoRegular from '../public/assets/webfonts/SpaceMonoRegular.ttf';
import JostMedium from '../public/assets/webfonts/JostMedium.woff';

const GlobalStyle: React.FC = () => {
  return (
    <Global
      styles={css`
        @font-face {
          font-family: 'ModernEra';
          src: url(${ModernEraRegular}) format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'ModernEra';
          src: url(${ModernEraBold}) format('truetype');
          font-weight: bold;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'ModernEra';
          src: url(${ModernEraItalic}) format('truetype');
          font-weight: normal;
          font-style: italic;
          font-display: swap;
        }
        @font-face {
          font-family: 'ModernEra';
          src: url(${ModernEraBoldItalic}) format('truetype');
          font-weight: bold;
          font-style: italic;
          font-display: swap;
        }
        @font-face {
          font-family: 'ModernEra';
          src: url(${ModernEraMedium}) format('truetype');
          font-weight: 500;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'ModernEra';
          src: url(${ModernEraExtraBold}) format('truetype');
          font-weight: 800;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'SpaceMono';
          src: url(${SpaceMonoRegular}) format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'Jost';
          src: url(${JostMedium}) format('woff');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }

        html,
        body,
        #root {
          height: 100%;
        }

        /* Keyboard Layout */
        .hg-theme-default {
          width: 100%;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          box-sizing: border-box;
          overflow: hidden;
          touch-action: manipulation;
        }

        .hg-theme-default .hg-button span {
          pointer-events: none;
        }

        .hg-theme-default button.hg-button {
          border-width: 0;
          outline: 0;
          font-size: inherit;
        }

        .hg-theme-default {
          font-family: HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande,
            sans-serif;
          background-color: #1a1a1a;
          padding: 5px;
          border-radius: 5px;
        }

        .hg-theme-default .hg-button {
          display: inline-block;
          flex-grow: 1;
        }

        .hg-theme-default .hg-row {
          display: flex;
        }

        .hg-theme-default .hg-row:not(:last-child) {
          margin-bottom: 5px;
        }

        .hg-theme-default .hg-row .hg-button-container,
        .hg-theme-default .hg-row .hg-button:not(:last-child) {
          margin-right: 5px;
        }

        .hg-theme-default .hg-row > div:last-child {
          margin-right: 0;
        }

        .hg-theme-default .hg-row .hg-button-container {
          display: flex;
        }

        .hg-theme-default .hg-button {
          height: 58px;
          border-radius: 0px;
          box-sizing: border-box;
          padding: 5px;
          background: #2e2e2e;
          color: #f8f8f8;
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }

        .hg-theme-default .hg-button.hg-activeButton {
          background: #999;
        }

        .hg-theme-default.hg-layout-numeric .hg-button {
          width: 33.3%;
          height: 60px;
          align-items: center;
          display: flex;
          justify-content: center;
        }

        .hg-theme-default .hg-button.hg-button-numpadadd,
        .hg-theme-default .hg-button.hg-button-numpadenter {
          height: 85px;
        }

        .hg-theme-default .hg-button.hg-button-numpad0 {
          width: 105px;
        }

        .hg-theme-default .hg-button.hg-button-com {
          max-width: 85px;
        }

        .hg-theme-default .hg-button.hg-standardBtn.hg-button-at {
          max-width: 45px;
        }

        .hg-theme-default .hg-button.hg-selectedButton {
          background: rgba(5, 25, 70, 0.53);
          color: '#fff';
        }

        .hg-theme-default .hg-button.hg-standardBtn[data-skbtn='.com'] {
          max-width: 82px;
        }

        .hg-theme-default .hg-button.hg-standardBtn[data-skbtn='@'] {
          max-width: 60px;
        }
        /* END Keyboard Layout */

        .print-icon:before {
          fill:  #718096;
        }

        .print-icon:after {
          fill:  #718096;
          opacity: 0.4;
        }

        /* ImageViewer */
        #lightboxBackdrop {
          z-index: 4011;
        }
        /* END ImageViewer */

        /* Sales Order Item List */
        #order-item-list::-webkit-scrollbar {
          display: none;
        }
        #order-item-list {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        /* END Sales Order Item List */
        /* Problem Solver */
        #problems-column::-webkit-scrollbar {
          display: none;
        }
        #problems-column {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        /* END Problem Solver */
      `}
    />
  );
};

export default GlobalStyle;
