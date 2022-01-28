/* after changed content here, use https://www.toptal.com/developers/cssminifier/ to minify the css and paste it to style.css.js */
const styleStringBeauty = `
    .spb-item {
        overflow: auto;
        transition: transform 0.3s ease;
        position: relative;
        flex-shrink: 0;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: top left;
        padding: 15px;
        box-sizing: border-box;
    }

    .type_slider .carousel-root {
        max-width: 100%;
    }

    .spb-item-root {
        align-items: center;
        padding: 0px;
    }

    .spb-item .type_slider {
        background-color: white;
        padding: 0;
    }

    .spb-item.type_button {
        padding: 10px 20px;
        cursor: pointer;
        border: none;
        background-color: #ffffff;
    }

    .spb-item.type_button:hover {
        opacity: 0.8;
    }

    .spb-item.type_image {
        padding: 0;
    }
    .spb-item.type_dropdown.collapsed > .spb-item {
        display: none !important;
    }
    .spb-item.type_dropdown .smpb-dropdown-title {
        cursor: pointer;
        display: flex;
        padding: 15px;
        justify-content: space-between;
    }

    .spb-item.type_dropdown .smpb-dropdown-title svg,
    .spb-item.type_dropdown .smpb-dropdown-title img {
        width: 21px;
        height: 21px;
    }

    .spb-item > h1,
    .spb-item > h2,
    .spb-item > h3,
    .spb-item > h4,
    .spb-item > h5,
    .spb-item > h6 {
        margin-top: 0;
        margin-bottom: 0;
        font-weight: 500;
        line-height: 1.2;
    }
    .spb-item > h1 {
        font-size: 2.1875rem;
    }
    .spb-item > h2 {
        font-size: 1.75rem;
    }
    .spb-item > h3 {
        font-size: 1.53125rem;
    }
    .spb-item > h4 {
        font-size: 1.3125rem;
    }
    .spb-item > h5 {
        font-size: 1.09375rem;
    }
    .spb-item > h6 {
        font-size: 0.875rem;
    }

    .spb-item.type_instagram .simipb-insta-item {
        display: block;
    }
    .spb-item.type_instagram .simipb-insta-item img,
    .spb-item.type_instagram .simipb-insta-item video {
        max-width: 100%;
        height: 100%;
        object-fit: cover;
    }
    /*
    react-responsive-carousel/lib/styles/carousel.min.css
    */
    .carousel .control-arrow {
        -webkit-transition: all 0.25s ease-in;
        -moz-transition: all 0.25s ease-in;
        -ms-transition: all 0.25s ease-in;
        -o-transition: all 0.25s ease-in;
        transition: all 0.25s ease-in;
        opacity: 0.4;
        filter: alpha(opacity=40);
        position: absolute;
        z-index: 2;
        top: 20px;
        background: none;
        border: 0;
        font-size: 32px;
        cursor: pointer;
    }
    .carousel .control-arrow:focus {
        opacity: 1;
        filter: alpha(opacity=100);
    }
    .carousel .control-arrow:hover {
        opacity: 1;
        filter: alpha(opacity=100);
    }
    .carousel .control-arrow:before {
        margin: 0 5px;
        display: inline-block;
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
        content: '';
    }
    .carousel .control-disabled.control-arrow {
        opacity: 0;
        filter: alpha(opacity=0);
        cursor: inherit;
        display: none;
    }
    .carousel .control-prev.control-arrow {
        left: 0;
    }
    .carousel .control-prev.control-arrow:before {
        border-right: 8px solid #fff;
    }
    .carousel .control-next.control-arrow {
        right: 0;
    }
    .carousel .control-next.control-arrow:before {
        border-left: 8px solid #fff;
    }

    .carousel-root {
        outline: none;
    }

    .carousel {
        position: relative;
        width: 100%;
    }
    .carousel * {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }
    .carousel img {
        width: 100%;
        display: inline-block;
        pointer-events: none;
    }
    .carousel .carousel {
        position: relative;
    }
    .carousel .control-arrow {
        outline: 0;
        border: 0;
        background: none;
        top: 50%;
        margin-top: -13px;
        font-size: 18px;
    }
    .carousel .thumbs-wrapper {
        margin: 20px;
        overflow: hidden;
    }
    .carousel .thumbs {
        -webkit-transition: all 0.15s ease-in;
        -moz-transition: all 0.15s ease-in;
        -ms-transition: all 0.15s ease-in;
        -o-transition: all 0.15s ease-in;
        transition: all 0.15s ease-in;
        -webkit-transform: translate3d(0, 0, 0);
        -moz-transform: translate3d(0, 0, 0);
        -ms-transform: translate3d(0, 0, 0);
        -o-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
        position: relative;
        list-style: none;
        white-space: nowrap;
    }
    .carousel .thumb {
        -webkit-transition: border 0.15s ease-in;
        -moz-transition: border 0.15s ease-in;
        -ms-transition: border 0.15s ease-in;
        -o-transition: border 0.15s ease-in;
        transition: border 0.15s ease-in;
        display: inline-block;
        margin-right: 6px;
        white-space: nowrap;
        overflow: hidden;
        border: 3px solid #fff;
        padding: 2px;
    }
    .carousel .thumb:focus {
        border: 3px solid #ccc;
        outline: none;
    }
    .carousel .thumb.selected {
        border: 3px solid #333;
    }
    .carousel .thumb:hover {
        border: 3px solid #333;
    }
    .carousel .thumb img {
        vertical-align: top;
    }
    .carousel.carousel-slider {
        position: relative;
        margin: 0;
        overflow: hidden;
    }
    .carousel.carousel-slider .control-arrow {
        top: 0;
        color: #fff;
        font-size: 26px;
        bottom: 0;
        margin-top: 0;
        padding: 5px;
    }
    .carousel.carousel-slider .control-arrow:hover {
        background: rgba(0, 0, 0, 0.2);
    }
    .carousel .slider-wrapper {
        overflow: hidden;
        margin: auto;
        width: 100%;
        -webkit-transition: height 0.15s ease-in;
        -moz-transition: height 0.15s ease-in;
        -ms-transition: height 0.15s ease-in;
        -o-transition: height 0.15s ease-in;
        transition: height 0.15s ease-in;
    }
    .carousel .slider-wrapper.axis-horizontal .slider {
        -ms-box-orient: horizontal;
        display: -webkit-box;
        display: -moz-box;
        display: -ms-flexbox;
        display: -moz-flex;
        display: -webkit-flex;
        display: flex;
    }
    .carousel .slider-wrapper.axis-horizontal .slider .slide {
        flex-direction: column;
        flex-flow: column;
    }
    .carousel .slider-wrapper.axis-vertical {
        -ms-box-orient: horizontal;
        display: -webkit-box;
        display: -moz-box;
        display: -ms-flexbox;
        display: -moz-flex;
        display: -webkit-flex;
        display: flex;
    }
    .carousel .slider-wrapper.axis-vertical .slider {
        -webkit-flex-direction: column;
        flex-direction: column;
    }
    .carousel .slider {
        margin: 0;
        padding: 0;
        position: relative;
        list-style: none;
        width: 100%;
    }
    .carousel .slider.animated {
        -webkit-transition: all 0.35s ease-in-out;
        -moz-transition: all 0.35s ease-in-out;
        -ms-transition: all 0.35s ease-in-out;
        -o-transition: all 0.35s ease-in-out;
        transition: all 0.35s ease-in-out;
    }
    .carousel .slide {
        min-width: 100%;
        margin: 0;
        position: relative;
        text-align: center;
    }
    .carousel .slide img {
        width: 100%;
        vertical-align: top;
        border: 0;
    }
    .carousel .slide iframe {
        display: inline-block;
        width: calc(100% - 80px);
        margin: 0 40px 40px;
        border: 0;
    }
    .carousel .slide .legend {
        -webkit-transition: all 0.5s ease-in-out;
        -moz-transition: all 0.5s ease-in-out;
        -ms-transition: all 0.5s ease-in-out;
        -o-transition: all 0.5s ease-in-out;
        transition: all 0.5s ease-in-out;
        position: absolute;
        bottom: 40px;
        left: 50%;
        margin-left: -45%;
        width: 90%;
        border-radius: 10px;
        background: #000;
        color: #fff;
        padding: 10px;
        font-size: 12px;
        text-align: center;
        opacity: 0.25;
        -webkit-transition: opacity 0.35s ease-in-out;
        -moz-transition: opacity 0.35s ease-in-out;
        -ms-transition: opacity 0.35s ease-in-out;
        -o-transition: opacity 0.35s ease-in-out;
        transition: opacity 0.35s ease-in-out;
    }
    .carousel .control-dots {
        position: absolute;
        bottom: 0;
        margin: 10px 0;
        padding: 0;
        text-align: center;
        width: 100%;
        z-index: 1;
    }
    @media (min-width: 960px) {
        .carousel .control-dots {
            bottom: 0;
        }
    }
    .carousel .control-dots .dot {
        -webkit-transition: opacity 0.25s ease-in;
        -moz-transition: opacity 0.25s ease-in;
        -ms-transition: opacity 0.25s ease-in;
        -o-transition: opacity 0.25s ease-in;
        transition: opacity 0.25s ease-in;
        opacity: 0.3;
        filter: alpha(opacity=30);
        box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.9);
        background: #fff;
        border-radius: 50%;
        width: 8px;
        height: 8px;
        cursor: pointer;
        display: inline-block;
        margin: 0 8px;
    }
    .carousel .control-dots .dot.selected {
        opacity: 1;
        filter: alpha(opacity=100);
    }
    .carousel .control-dots .dot:hover {
        opacity: 1;
        filter: alpha(opacity=100);
    }
    .carousel .carousel-status {
        position: absolute;
        top: 0;
        right: 0;
        padding: 5px;
        font-size: 10px;
        text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.9);
        color: #fff;
    }
    .carousel:hover .slide .legend {
        opacity: 1;
    }

    /*tab*/
    .spb-item.type_tabs .spbitem-tab-nav {
        direction: ltr;
        padding: 0px 15px;
        display: flex;
        justify-content: center;
    }

    .spb-item.type_tabs > .spb-item {
        flex-shrink: initial;
    }

    .spb-item.type_tabs .spbitem-tab-nav .spbitem-tab-nav-item {
        cursor: pointer;
        margin-inline-end: 10px;
        padding: 10px 15px;
    }
    .spb-item.type_tabs .spbitem-tab-nav .spbitem-tab-nav-item.active {
        background-color: #ffffff;
        font-weight: 600;
    }

    .spb-item.type_tabs .spbitem-tab-nav.vertical {
        display: inline-block;
        flex-shrink: inherit;
        padding: 0;
    }

    .spb-item.type_tabs .spbitem-tab-nav.vertical .spbitem-tab-nav-item {
        width: 100%;
        margin-bottom: 5px;
        box-sizing: border-box;
    }
    /* partial slider*/
    .spb-item.type_partial_slider {
        position: relative;
    }
    .spb-item .partial-slider-child-container {
        display: flex;
        flex-wrap: nowrap;
        overflow-y: auto;
        width: 100%;
        margin-bottom: 20px;
        scroll-behavior: smooth;
        scrollbar-width: none;
        -ms-overflow-style: none;
        ::-webkit-scrollbar {
            display: none;
        }
    }
    .spb-item.type_partial_slider .partial-slider-navic {
        position: absolute;
        width: 30px;
        height: 30px;
        border-radius: 15px;
        background-color: rgba(255, 255, 255, 0.6);
        padding: 5px;
        z-index: 1;
        top: calc(50% - 40px);
        cursor: pointer;
    }

    .spb-item.type_partial_slider .partial-slider-navic.partial-slider-back-ic {
        left: 0px;
    }

    .spb-item.type_partial_slider .partial-slider-navic.partial-slider-next-ic {
        right: 0px;
    }

    .spb-item.type_partial_slider .partial-slider-navic svg {
        width: 20px;
        height: 20px;
    }

    .spb-item.type_partial_slider .partial-slider-dots {
        position: absolute;
        bottom: 5px;
        padding: 4px 8px;
        border-radius: 11px;
        display: flex;
        left: 50%;
        transform: translateX(-50%);
        z-index: 2;
    }

    .spb-item.type_partial_slider .partial-slider-dot {
        height: 10px;
        width: 10px;
        border-radius: 5px;
        background-color: #999999;
        cursor: pointer;
        margin-top: 3px;
    }

    .spb-item.type_partial_slider .partial-slider-dot:not(:last-of-type) {
        -webkit-margin-end: 10px;
        margin-inline-end: 10px;
    }
    .spb-item.type_partial_slider .partial-slider-dot.active {   
        background-color: #fa6402;
    }
`;
