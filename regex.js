// The MIT License (MIT)
//
// Copyright (c) 2016 Francis Gagné
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
// BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

(function () {
    var elements = {};

    function loadElements() {
        var ids = ["input", "regex", "global", "ignore_case", "multiline", "unicode", "sticky", "function", "replace", "result"];
        for (var i = 0; i < ids.length; i++) {
            elements[ids[i]] = document.getElementById(ids[i]);
        }
    }

    function getFlags() {
        var flags = "";
        if (elements.global.checked) {
            flags += "g";
        }
        if (elements.ignore_case.checked) {
            flags += "i";
        }
        if (elements.multiline.checked) {
            flags += "m";
        }
        if (elements.unicode.checked) {
            flags += "u";
        }
        if (elements.sticky.checked) {
            flags += "y";
        }
        return flags;
    }

    function replace() {
        var input = elements.input.value;
        var regex = new RegExp(elements.regex.value, getFlags());
        var replacement_function = function () {
            // The callback receives 3 fixed arguments (match, offset and string)
            // plus as many arguments as there are captures in the match,
            // between the match and the offset arguments.
            var functionParams = ["match"];
            for (var i = 1; i < arguments.length - 3 + 1; i++) {
                functionParams.push("p" + i);
            }
            functionParams.push("offset");
            functionParams.push("string");
            functionParams.push(elements.function.value);
            return Function.apply(null, functionParams).apply(this, arguments);
        };
        try {
            var result = input.replace(regex, replacement_function);
        } catch (e) {
            alert(e);
            return;
        }
        elements.result.value = result;
        doResize(elements.result);
    }

    function doResize(textarea) {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
    }

    // adapted from http://stackoverflow.com/a/5346855/234590
    function setUpAutoSizeInTextAreas() {
        function resize(e) {
            doResize(e.target);
        }

        function delayedResize(e) {
            setTimeout(function () {
                doResize(e.target);
            }, 0);
        }

        for (var p in elements) {
            if (elements.hasOwnProperty(p)) {
                var element = elements[p];
                if (/^textarea$/i.test(element.localName)) {
                    element.addEventListener("change", resize, false);
                    element.addEventListener("cut", delayedResize, false);
                    element.addEventListener("paste", delayedResize, false);
                    element.addEventListener("drop", delayedResize, false);
                    element.addEventListener("keydown", delayedResize, false);
                    doResize(element);
                }
            }
        }
    }

    function load() {
        loadElements();
        elements.replace.addEventListener("click", replace, false);
        setUpAutoSizeInTextAreas();
    }

    document.addEventListener("DOMContentLoaded", load, false);
})();
