/**
 * Created by Mazp on 2016/12/13.
 */

/*
* 作用: 获取scrollTop和scrollLeft
* 用法:scroll().top 和scroll().left
* */
function scroll() {
    if(window.pageXOffset !=null){// IE9+ 和 最新浏览器
        return {
            top: window.pageYOffset,
            left: window.pageXOffset
        }
    }else if(document.compatMode == 'CSS1Compat'){//标准浏览器
        return {
            top: document.documentElement.scrollTop,
            left: document.documentElement.scrollLeft
        }
    }
    //其它浏览器
    return{
        top:document.body.scrollTop,
        left:document.body.scrollLeft
    }
}
/*
* 作用:通过id获取标签
* 用法:$(id)
* */
function $(id) {
    return document.getElementById(id);
}