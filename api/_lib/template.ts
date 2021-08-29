
import { readFileSync } from 'fs';
import marked from 'marked';
import { sanitizeHtml } from './sanitizer';
import { ParsedRequest } from './types';
const twemoji = require('twemoji');
const twOptions = { folder: 'svg', ext: '.svg' };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const rglr = readFileSync(`${__dirname}/../_fonts/Inter-Regular.woff2`).toString('base64');
const bold = readFileSync(`${__dirname}/../_fonts/Inter-Bold.woff2`).toString('base64');
const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString('base64');

function getCss(theme: string, text: string) {
    let background = '#674ea7ff';
    let foreground = 'white';
    // let radial = 'lightgray';

    if (theme === 'dark') {
        background = 'black';
        foreground = 'white';
        // radial = 'dimgray';
    }
    return `
    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }

    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
      }

      @import url('https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

    body {
        background: ${background};
        background-image: linear-gradient(90deg, rgba(103,78,167,0.74) 0%, rgba(103,78,167,0.74) 100%), url('https://v2.hackclub.dev/pattern.svg');
        background-size: 600px 600px;
        background-repeat: repeat;
        height: 100vh;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        font-family: 'Fira Sans', sans-serif;
        font-style: normal;
        color: ${foreground};
        line-height: 1.2;
    }

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .logo-wrapper {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
        margin-top: 84px;
        padding-bottom: 51px;
        
    }

    .logo-backer{
        background: white;
        padding: 24px;
        border-radius: 12px;
    }

    .logo {
        margin: 0 35px;
        border-radius: 12px;
    }

    .ic-logo {
        width: 190px;
        border-radius: 12px;
        margin-bottom: 74px
    }

    .plus {
        color: #BBB;
        font-family: Times New Roman, Verdana;
        font-size: 100px;
    }

    .spacer {
        margin: 150px;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }
    
    .heading {
        font-family: 'Fira Sans', sans-serif;
        font-size: min(calc(1.2 * 100vw / ${text.length}), 300px);
        margin-block-start: 0em;
        margin-block-end: 0em;
        font-style: normal;
        color: ${foreground};
    }

    .subheading {
        font-family: 'Fira Sans', sans-serif;
        font-size: 72px;
        font-style: normal;
        color: ${foreground};
        margin: 0px 0px;
    }

    .name{
        font-weight: 800;
    }
    
    `;
}

export function getHtml(parsedReq: ParsedRequest) {
    const { text, theme, md, images, widths, heights, event, message } = parsedReq;
    return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, text)}
    </style>
    <body>
        <div>
            <div class="spacer" style="padding-top: 174px">
            <div class="subheading">This certificate is awarded to</div>
            <div class="heading name">${emojify(
                sanitizeHtml(text)
            )}</div>
            <div class="subheading">${emojify(
                sanitizeHtml(message)
             )} ${emojify(
               sanitizeHtml(event)
            )} </div>
            <div class="heading" id="#my-element" style="display: none">${emojify(
                md ? marked(text) : sanitizeHtml(text)
            )}
            </div>
            <div class="logo-wrapper">
                <div class="logo-backer">
                    ${getImage("https://github.com/the-innovation-circuit.png")}
                    ${images.map((img, i) =>
                        getImage(img, widths[i], heights[i])
                    ).join('')}
                </div>
            </div>
            <script src="https://raw.githubusercontent.com/rikschennink/fitty/gh-pages/dist/fitty.min.js"></script>
            <script>
                fitty('#my-element');
            </script>
    </body>
</html>`;
}

function getImage(src: string, width ='auto', height = '125') {
    return `<img
        class="logo"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`
}
