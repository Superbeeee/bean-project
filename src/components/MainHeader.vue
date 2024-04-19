<template>
  <div class="desktop-topmenuWrap">
        <div class="BLOGO">
            <a href="index.html">
                <img :src="logoImg" alt="#">
            </a>
        </div>
        <section class="desktop-topmenuList">
            <nav class="en">
              <a href="PL.html"><span data-hover="線上購買">shop online</span></a>
              <a href="Art.html"><span data-hover="線上探索豆間">bean Art Present</span></a>
              <a href="RM.html"><span data-hover="豆間菜單">bean Menu</span></a>
              <a href="MP.html"><span data-hover="尋找豆間">where? bean</span></a>
            </nav>
          </section>
        <!-- <ul class="top-linkList">
            <li class="lw-fb" ><a href="#" target="_blank">
                <img src="./photo/w-logo/w-fb.svg" alt="#">
            </a></li>
            <li class="lw-ig"><a href="#" target="_blank">
                <img src="./photo/w-logo/w-ig.svg" alt="#">
            </a></li>
            <li class="lw-reservation"><a href="AK.html" target="_blank">
                <img src="./photo/w-logo/w-ask-logo.png" alt="#">
            </a></li>
            <li class="lw-bag opencart"><a href="SC.html" target="_blank">
                <img src="./photo/w-logo/w-cart.svg" alt="#">
            </a></li>
        </ul> -->
        <!-- 漢堡 -->
        <div id="webapp_cover">
            <div id="menu_button">
              <input type="checkbox" id="menu_checkbox">
              <label for="menu_checkbox" id="menu_label">
                <div id="menu_text_bar"></div>
              </label>
            </div>
        </div>

        <!-- mobile展開區域 -->
    
        <div class="menu_body" id="menubody">
            <div class="menu-content">
                <div class="mtw-logo">
                    <a href="index.html">
                        <img src="photo/b-logo/LOGO.png" alt="">
                    </a>
                </div>
                <ul class="mobile-topmenuList">
                    <li>
                        <div class="en">
                            <a href="PL.html">shop online|線上購買</a>
                        </div>
                    </li>
                    <li>
                        <div class="en">
                            <a href="Art.html">bean Art Present|線上探索豆間</a>
                        </div>
                    </li>
                    <li>
                        <div class="en">
                            <a href="RM.html">bean Menu|豆間菜單</a>
                        </div>
                    </li>
                    <li>
                        <div class="en">
                            <a href="MP.html">where? bean|尋找豆間</a>
                        </div>
                    </li>
                </ul>
    
                <ul class="mobile-linkList">
                    <li class="lw-fb">
                        <a href="#" target="_blank">
                            <img src="photo/p-logo/p-fb.svg" alt="#">
                        </a>
                    </li>
                    <li class="lw-ig">
                        <a href="#" target="_blank">
                            <img src="photo/p-logo/p-ig.svg" alt="#">
                        </a>
                    </li>
                    <li class="lw-ask">
                        <a href="AK.html">
                            <img src="photo/p-logo/p-ask.svg" alt="#">
                        </a>
                    </li>
                    <li class="lw-bag">
                        <a href="SC.html">
                            <img src="photo/p-logo/p-cart.svg" alt="#">
                        </a>
                    </li>
                </ul>
            </div>
            <!-- 漢堡的mask -->
            <div class="mask"></div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'MainHeader',
  props: {
    msg: String
  },
  data() {
    return {
      logoImg: require('@/assets/photo/ui-icons/light-style/LightLogo.png')
    }; // photo/w-logo/W-LOGO.png
  }
}
</script>

<style scoped>
@media (min-width: 1025px){
    .desktop-topmenuWrap{
        width: 100%;
        position: fixed; 
        z-index: 1;
        display: flex;
        justify-content: center;

        transition: all 0.3s linear;
    }
    
    .BLOGO{ 
        margin-top: 30px;
        padding-right: 50px;
    }   
    
    .BLOGO img{
        width: 95px;
    }
    
    .desktop-topmenuWrap ul{
        list-style: none;
        overflow: hidden;
    }
    
    
    .desktop-topmenuList{
        width: 598px;
    }
    
    nav a {
        position: relative;
        display: inline-block;
        
        outline: none;
        color: #FFF;
        text-decoration: none;
        letter-spacing: 1px;
        text-shadow: 0 0 1px rgba(255,255,255,0.3);
        font-family: "Bree Serif", serif;
       
    }
    
    nav a:hover,
    nav a:focus {
        outline: none;
    }
    
    .desktop-topmenuList .en{
        padding: 41px 0;
    
        font-size: 15px;
        line-height: 1.5;
        font-family: "Bree Serif", serif;;
    }
    
    .en a {
        overflow: hidden;
        height: 20px;
        margin: 15px 15px;
    }
    
    .en a span {
        position: relative;
        display: inline-block;
        -webkit-transition: -webkit-transform 0.3s;
        -moz-transition: -moz-transform 0.3s;
        transition: transform 0.3s;
    }
    
    .en a span::before {
        position: absolute;
        top: 100%;
        content: attr(data-hover);
        font-weight: 700;
        -webkit-transform: translate3d(0,0,0);
        -moz-transform: translate3d(0,0,0);
        transform: translate3d(0,0,0);
    }
    
    .en a:hover span,
    .en a:focus span {
        -webkit-transform: translateY(-100%);
        -moz-transform: translateY(-100%);
        transform: translateY(-100%);
    }
    
    /* .desktop-topmenuList .en{
        font: 15px/1 "Bree Serif", serif;
    }
    
    .desktop-topmenuList li{
        float: left;
        font-size: 24px;
        padding: 0 20px;
        padding-top: 60px;
    }
    
    .desktop-topmenuList a{
        text-decoration: none;
        color: #fff;
    }
    
    .desktop-topmenuList ul{
        list-style: none;
        overflow: hidden;
        
    }
    */
    /* 
    .desktop-topmenuList a:hover{
        color: #D9ADA0;
    }  */
    
    .top-linkList {
        display: inline-flex;
        padding-top: 50px;
        width: 210px;
    }
    
    .top-linkList li{
            padding: 0 10px;
    }
    
    .top-linkList li img{
        width: 30px;
        height: 30px;
    }
    
    .top-linkList a img{
        transition: all 0.3s linear;
    }
    
    .top-linkList a:hover img{
        transform: scale(1.5);
    }

    /* 藏住漢堡 */
    #webapp_cover{
        display: none;
    }

    /* 藏住內頁 */
    .menu_body{
        display: none;
    }

    /* 藏住mask */
    .mask{
        display: none;
    }
}

@media (max-width: 1024px){

    /* 整列 */
    .desktop-topmenuWrap{
        width: 100%;
        top: 25px;
        z-index: 49;
        position: fixed;
        padding: 0 20px;
        display: inline-block;
        transition: all 0.3s linear;
    }


    /* LOGO */
    .BLOGO{
        margin-top: 0;
    }

    .BLOGO img{
        width: 80px;
    } 

    
    /* 關掉中間 */
    .desktop-topmenuList, .lw-fb, .lw-ig, .lw-reservation, .lw-bag{
        display: none;
    }
    
    /* 購物車 */

    /* .top-linkList{
        display: flex;
        padding-top: 27px;
        max-width: 960px;
        margin-right: auto;
        margin-left: auto;
    }
    
    .top-linkList li img{
        width: 30px;
    }

    .top-linkList a img{
        transition: all 0.3s linear;
    }

    .top-linkList a:hover img{
        transform: scale(1.5);
    
    }

    .lw-bag{
        position: absolute;
        top: 25px;
        right: 30px;
    } */
    
    /* 漢堡 */

    #webapp_cover {
        position: absolute;
        top: 45px;
        right: 32px;
        /* width: 39px; */
        margin: 0 auto;
        transform: translateY(-50%) scale(2);
        z-index: 200;
    }
      
    #menu_button {
        width: 21px;
        overflow: hidden;
    }
      
    #menu_checkbox {
        display: none;
    }
      
    #menu_label {
        position: relative;
        display: block;
        height: 21px;
        cursor: pointer;
    }
      
    #menu_label:before,
    #menu_label:after,
    #menu_text_bar {
        position: absolute;
        left: 0;
        width: 100%;
        height: 3px;
        background-color: #FFF;
    }
      
    #menu_label:before,
    #menu_label:after {
        content: "";
        transition: 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55) left;
    }
      
    #menu_label:before {
        top: 0;
    }
      
    #menu_label:after {
        top: 8px;
    }
      
    #menu_text_bar {
        top: 16px;
    }
      
    #menu_text_bar:before {
        content: "豆!";
        position: absolute;
        top: 5px;
        right: 0;
        left: 0;
        color: #FFF;
        font-size: 12px;
        font-weight: bold;
        font-family: "Montserrat", sans-serif;
        text-align: center;
    }
      
    #menu_checkbox:checked + #menu_label:before {
        left: -39px;
    }
      
    #menu_checkbox:checked + #menu_label:after {
        left: 39px;
    }
      
    #menu_checkbox:checked + #menu_label #menu_text_bar:before {
        animation: moveUpThenDown 0.8s ease 0.2s forwards,
          shakeWhileMovingUp 0.8s ease 0.2s forwards,
          shakeWhileMovingDown 0.2s ease 0.8s forwards;
    }
      
    @keyframes moveUpThenDown {
        0% {
          top: 0;
        }
        50% {
          top: -27px;
        }
        100% {
          top: -14px;
        }
    }
      
    @keyframes shakeWhileMovingUp {
        0% {
          transform: rotateZ(0);
        }
        25% {
          transform: rotateZ(-10deg);
        }
        50% {
          transform: rotateZ(0deg);
        }
        75% {
          transform: rotateZ(10deg);
        }
        100% {
          transform: rotateZ(0);
        }
    }
      
    @keyframes shakeWhileMovingDown {
        0% {
          transform: rotateZ(0);
        }
        80% {
          transform: rotateZ(3deg);
        }
        90% {
          transform: rotateZ(-3deg);
        }
        100% {
          transform: rotateZ(0);
        }
    }

    /* 展開區域 */
    .menu-content{
        width: 70%;
        height: 100vh;
        background-color: #fff;
        padding: 49px 20px;

    }

    .menu_body {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 100vh;
       
        transform: translateX(-100%);
        transition: 0.5s all ease; 
        z-index: 99;
        }
    
    
    
    .menu_body.open {
        transform: translateX(0); 
    }

    .mtw-logo{
        margin-bottom: 30px;
    }
    .mtw-logo a{
        text-decoration: none;
        color: inherit;
    }

    .mtw-logo img{
        width: 60px;
    }

    .mobile-topmenuList {
        list-style: none;
        padding: 0px;
    }

    .mobile-topmenuList li{
        margin-bottom:35px;
    }


    .mobile-topmenuList a{
        font: 13px/1 "Bree Serif", serif;
        letter-spacing: 1px;
        color: #000;
        text-decoration: none;
        line-height: 40px;
        display: block;
        height: 40px;
    }

    .mobile-linkList{
        list-style: none;
        margin: 40px 0px;
        padding: 0px;
    }

    .mobile-linkList li{
        position: relative;
        display: inline-block;
        vertical-align: middle;
        margin-right: 9px;
    }

    .mobile-linkList a{
        text-decoration: none;
        color: inherit;
    }

    .mobile-linkList img{
        width: 30px;
    }

    /* .mask{
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        width: 30%;
        
        height: 100vh;
        background-color: #0000000f;
        z-index: 90;
    } */
}
</style>
