/**
 *  =$
 *  @about 选择器（单个）
 *  @from  https://gist.github.com/ryanseddon/1009759
 *  @param {string}    a  选择目标
 *  @param {selector}  b  root
 */
function $(a ,b) {
    return (b || doc).querySelector(a);
}
/**
*  =$$
*  @about    选择器（一组）
*  @from     https://gist.github.com/ryanseddon/1009759
*
*  @param    {string}    a  选择目标
*  @param    {selector}  b  root
*/
function $$(a ,b) {
    return (b || doc).querySelectorAll(a)
}



/**
 *  =changeClass  删除增加删除样式
 *
 *  @param    {dom}     $a
 *  @param    {string}  delete class
 *  @param    {string}  add class
 */

// $a为dom节点，不是jq和zepto的节点
function changeClass($a, dlass, alass) {
    var s = 1, arr = [],
        dList = dlass.split(/\s+/g),
        aList = alass.split(/\s+/g);
    $a.getAttribute('class').split(/\s+/g).forEach(function(klass) {
        s = 1;
        dList.forEach(function(dlass) {
            if (klass === dlass) s = 0;
        });

        if (s) arr.push(klass);
    });

    aList.forEach(function (alass) {
        if (arr.indexOf(alass) === -1) {
            arr = arr.push(alass);
        };
    })

    $a.setAttribute('class', arr.join(" "));

    return $a;
}
