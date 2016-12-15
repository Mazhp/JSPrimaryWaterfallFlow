/**
 * Created by acer on 2016/12/13.
 */
window.onload=function () {
    var screenWidth=0;
    screenWidth=document.documentElement.clientWidth||document.body.clientWidth;
   //1.实现瀑布流
    waterFall('outBox',screenWidth);

    //实现向下滚动,无线加载图片
    var timers=null;
    //监听滚动事件
    window.onscroll=function () {
       clearTimeout(timers);
        timers=setTimeout(function () {
            if(willBeLoad()){//需要加载
                //制造点假数据
                var dataArr=[
                    {src:'1.jpg'},
                    {src:'5.jpg'},
                    {src:'3.jpg'},
                    {src:'4.jpg'},
                    {src:'2.jpg'},
                    {src:'9.jpg'},
                    {src:'8.jpg'},
                    {src:'6.jpg'},
                    {src:'7.jpg'},
                    {src:'10.jpg'},
                    {src:'12.jpg'},
                    {src:'13.jpg'},
                ]
                //遍历数据
                for(var i=0;i<dataArr.length;i++){
                    //创建一个新的盒子
                    var newBox=document.createElement('div');
                    //新盒子的className为box,和其它的样式一样
                    newBox.className='box';
                    //添加新盒子
                    $('outBox').appendChild(newBox);
                    //创建一个新的pic盒子
                    var newPic=document.createElement('div');
                    //新盒子的className为pic,和其它的样式一样
                    newPic.className='pic';
                    //添加新盒子
                    newBox.appendChild(newPic);
                    //创建一个img标签
                    var newImg=document.createElement('img');
                    //img标签的src是哪个从json数据中取出
                    newImg.src='images/'+dataArr[i].src;
                    //添加新的img标签
                    newPic.appendChild(newImg);
                }
                //所有的盒子都创建完成之后,再执行一次瀑布流方法,否则新创建的标签不会实现瀑布流的效果
                waterFall('outBox',screenWidth);
            }
        },200)
    }
    var timer=null;
    window.onresize=function () {//监听窗口改变事件
        clearTimeout(timer);
        timer=setTimeout(function () {
            //获取浏览器的宽度
            screenWidth=document.documentElement.clientWidth||document.body.clientWidth;
            //重新执行瀑布流方法
            waterFall('outBox',screenWidth);
        },200)
    }

}
/*
* 实现瀑布流布局
* 用法:waterFall(最外侧盒子的id)
* */
function waterFall(outBox,screenWidth) {
    //首先将大盒子outBox居中排列
    //要给大盒子设置宽度,大盒子的宽度为屏幕的宽度/小盒子box的宽度 取整 然后再乘以小盒子的宽度
    //获取大盒子

    var outBox=$(outBox);
    //获取大盒子中所有的小盒子
    var allBoxs=outBox.children;
    //由于小盒子的宽度一样,所以随便找到一个小盒子,获取齐宽度
    var boxWidth=allBoxs[0].offsetWidth;

    //那么可以计算显示的列数就是浏览器的宽度除以每个小盒子的宽度取整
    var cols=parseInt(screenWidth/boxWidth);

    //设置大盒子的宽度
    outBox.style.width=cols*boxWidth +'px';
    //设置大盒子的margin值
    outBox.style.margin='0 auto';
    //遍历所有的box,然后将第一排(前cols个盒子的高度放入数组中)
    //创建一个空数组
    var boxHeightArr=[];
    //创建两个临时变量最小的高度以及盒子的高度
    var minHeight=0,boxHeight=0;
    //遍历所有的盒子
    for(var i=0;i<allBoxs.length;i++){
        //获取遍历到每个盒子的高度
        boxHeight=allBoxs[i].offsetHeight;
        if(i<cols){//讲第一排的高度放入数组中
            boxHeightArr.push(boxHeight);
            allBoxs[i].style='';
        }else { //然后将第一排后面的所有的元素放入之前数组中高度最小的那一列

           //获取数组中最小的高度
            minHeight=_.min(boxHeightArr);

            //计算最小高度的下标,通过遍历实现
            var minIndex=getIndexByValue(boxHeightArr,minHeight);

            //设置当前盒子的样式,首先为固定定位
            allBoxs[i].style.position='absolute';
            //设置当前盒子的top,为最小高度
            allBoxs[i].style.top= minHeight +'px';
            //设置当前盒子的left为最小高度的下标乘以盒子的宽度,如果第三个为最小高度,那么当前盒子的left和第三个left一样,为3*盒子的宽度,因为盒子的宽度都一样
            allBoxs[i].style.left= minIndex*boxWidth+'px';
            //将数组中最小盒子的高度更新为当前高度+原来高度
            boxHeightArr[minIndex]+=allBoxs[i].offsetHeight;

        }
    }
}
/*
 * 作用:通过数组中某一个元素,返回其在数组的索引
 * 用法:getIndexByValue(数组,数组元素)
 * 返回值:返回数组元素在数组中的索引
 * */
function getIndexByValue(arr,value) {
    //遍历数组
    for(var i=0;i<arr.length;i++){
        //输入数组中第i个元素的值和value一样,则返回i,i为最小宽度的下标
        if(arr[i]==value){
            return i;
        }
    }
}
/*
* 功能:判断是否需要加载图片
* 用法:willBeLoad()
* 返回值:true 需要加载 false不需要加载
* */
function willBeLoad() {
    //1.先获取到最后一张照片,然后看它是否显示出来.如果显示则返回true,否则返回false
    //如果图片已经显示出来,那么这个图片到顶部的距离offsettop <屏幕的高度+滚动的高度
    //获取所有的照片
    var allBoxs=document.getElementsByClassName('box');
    //获取最后一张图片,最后一张图片的下标为数组的长度减一
    var lastBox=allBoxs[allBoxs.length-1];
    //获取最后一张图片的offsetTop值
    var lastBoxDis=lastBox.offsetTop;
    //获取屏幕的高度,这里需要适配不同的浏览器,所以使用||兼容一下
    var screenHeight=document.documentElement.clientHeight||document.body.clientHeight;
    //获取滚动的高度
    var scrollHeight=scroll().top;
    //判断,返回结果
    if(lastBoxDis<=scrollHeight+screenHeight){
        return true;
    }else {
        return false;
    }
}