"use strict";const e=require("../../common/vendor.js"),t=require("../../utils/config.js"),o=require("../../common/assets.js"),a={data:()=>({mini_program_title:""}),onLoad(){try{const o=e.index.getAccountInfoSync().miniProgram.appId;t.getMiniProgramInfo(o).then((e=>{this.mini_program_title=e.title}))}catch(o){console.error("获取小程序信息失败:",o)}e.index.getStorageSync("logged_in")||e.index.navigateTo({url:"/pages/login/login"})},methods:{navigateTo(t){e.index.switchTab({url:t})},goToMarket(){e.index.switchTab({url:"/pages/market/market"})}}};const r=e._export_sfc(a,[["render",function(t,a,r,i,n,g){return{a:o._imports_0,b:e.t(n.mini_program_title),c:e.o((e=>g.navigateTo("/pages/market/market"))),d:e.o((e=>g.navigateTo("/pages/my_avatars/my_avatars"))),e:e.o((e=>g.navigateTo("/pages/script_review/script_review"))),f:e.o((e=>g.navigateTo("/pages/profile/profile"))),g:e.o(((...e)=>g.goToMarket&&g.goToMarket(...e)))}}]]);wx.createPage(r);
