/**
 * See F12 console
 * Enhance default console with (Chrome) colored console
 * eg: console.text( "mySection[||BACKGROUNDCOLOR][||COLOR]", data )
 *
 * UglifyJS drop_console=true will remove all `console.` statements
 * **/
console.log(function (
    $_background = 'background:',
    $_color = ';color:',
    $_bold = ';font-weight:bold',
    $_teal_white = `${$_background}teal${$_color}white;`,
    $_linebreak = '\n'
) {
    let labelWithFunctionName = label => {
        let errorStack = new Error().stack;
        // console.log(errorStack);
        return `%c ${label}: %c at: ${errorStack
            .split('at ')                   // create array of stack-trace
            .splice(3)[0]                   // discard 2 recent calls (within this console function)
            .split($_linebreak)[0]          // get part before line-break
            .replace("(http", "%c http")}`;
    };

    // let consoleMethods = "log,info,error,warn,group,groupCollapsed,groupEnd,table,time,timeEnd,count,trace,assert";

    console.text = function () {
        let params = Array.from(arguments);                                     // get all parameters and proces first parameter as label/CSS
        if (params.length === 0) params = [labelWithFunctionName('stack'), `${$_background}red${$_color}yellow${$_bold}`];
        let labelDef = String(params.shift()).split('||');                      // cast first parameter to String, then split on || to get CSS
        // define optional second backgroundcolor after dot (.)
        console.log.apply(
            null,
            [
                "%c Memory %c " + labelDef[0] + ' ',
                $_background + 'lightgreen;',                                   // styling first %c appName
                $_background + (labelDef[1] || "green")                         // label background
                + $_color + (labelDef[2] || "white")                            // label text color
                + ((labelDef[2] === "black" || labelDef[3] === "bold")          // label fontweight
                    ? $_bold
                    : ''),
                ...params                                                       // remaining parameters
            ]
        );
    };

    console.logerror = function (err) {
        console.text(
            labelWithFunctionName('Error'),   // pass current Stack
            `${$_background}red${$_color}yellow${$_bold}`,                            // styling first %c
            $_teal_white,                                            // styling second %c
            err
        );
    };

    console.event = function (eventname, eventarget) {
        console.text(' Event: ' + eventname + '||orange||black', eventarget);
    };

    // create extra Event listeners for debugging purposes
    //https://developer.mozilla.org/en-US/docs/Web/Events
    ['DOMContentLoaded', 'hashchange', 'load', 'click', 'focus', 'blur'].map(evt => window.addEventListener(evt, () => console.event(evt, event ? event.target : '')));

    return `%c Init logging`;
}(), 'background:#0F0');
