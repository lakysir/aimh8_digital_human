"use strict";const e=require("../../common/vendor.js"),t={onShareAppMessage(e){const t=getApp().globalData.currentOptions;var a=0,o="";return t&&t.document_id&&(a=t.document_id),t&&t.document_title&&(o=t.document_title),console.log(a),console.log(o),{title:`邀请您审阅文档:${o}`||"数字人文案审核",path:`/pages/document/detail?document_id=${a}`,imageUrl:""}}},a=Object.assign(t,{__name:"detail",setup(t){const a=e.ref({title:"",operator:"",editor:"",submissionTime:"",status:"",mainContent:"",thumbnailUrl:"/placeholder.svg?height=320&width=180",videoUrl:""}),o=e.ref(""),n=e.index.getStorageSync("phoneNum"),i=e.index.getStorageSync("user_id"),d=e.ref(!1),s=e.ref(!1),l=e.ref(null);e.onUnmounted((()=>{l.value&&(clearTimeout(l.value),l.value=null)})),e.onMounted((async()=>{const t=getCurrentPages(),d=t[t.length-1],l=d.options;console.log(d),o.value=l.document_id;try{e.index.showLoading({title:"加载中...",mask:!0});const t=await e.index.request({url:"https://www.aimh8.com/wechat_index.php",method:"POST",data:{getOneDocument:!0,username:n,user_id:i,document_id:o.value}});if(console.log(t.data),t.data.code>=0){const n=t.data.document_Info;a.value={title:n[1],owner_id:n[8][0],owner_name:n[8][1],operator_username:n[9][2],operator_id:n[9][0],operator:n[9][1],editor_id:n[10][0],editor:n[10][1],submissionTime:n[5],muban_id:n[6],generate_fileid:n[7],status:n[3],mainContent:"",thumbnailUrl:n[11]+"/thumb.jpg",videoUrl:n[11]+"/main.mp4"},s.value=n[8][0]===i,getApp().globalData.currentOptions={document_id:o.value,document_title:n[1]};try{const t=await e.index.request({url:n[2],method:"GET"});t.data&&(a.value.mainContent=t.data)}catch(u){console.error("获取文本内容失败:",u),e.index.showToast({title:"获取文本内容失败",icon:"none"})}}else e.index.showToast({title:t.data.msg||"获取数据失败",icon:"none"})}catch(r){e.index.showToast({title:"网络请求失败",icon:"none"})}finally{e.index.hideLoading()}}));const u=()=>{const t=e.index.createVideoContext("myVideo");d.value?(t.pause(),d.value=!1):(t.play(),d.value=!0)},r=async t=>{try{const d=await e.index.request({url:"https://www.aimh8.com/wechat_index.php",method:"POST",data:{generate_progress:!0,username:n,user_id:i}});if(console.log(d.data),d.data.code>=0){const s=d.data.value;if(e.index.showLoading({title:`合成中${s}%...本次预计扣除[运营方]费用${t}U...`,mask:!0}),s>=100){e.index.showLoading({title:"获取合成视频...",mask:!0}),await new Promise((e=>setTimeout(e,6e3)));const t=await e.index.request({url:"https://www.aimh8.com/wechat_index.php",method:"POST",data:{getNewestOpVideoFile:!0,username:n,user_id:i,document_id:o.value}});t.data.code>=0?(a.value.status=4,a.value.generate_fileid=t.data.videoData[0],e.index.hideLoading(),getApp().globalData.currentOptions={video_id:t.data.videoData[0],file_type:0},e.index.navigateTo({url:"/pages/video/detail2"})):e.index.showToast({title:"获取视频信息失败",icon:"none"})}else l.value=setTimeout((()=>r(t)),5e3)}else e.index.hideLoading(),e.index.showToast({title:"获取进度失败",icon:"none"})}catch(d){console.error("检查进度失败:",d),e.index.hideLoading(),e.index.showToast({title:"获取进度失败",icon:"none"})}},c=async()=>{const t=a.value.status;if(4===t)getApp().globalData.currentOptions={video_id:a.value.generate_fileid},e.index.navigateTo({url:"/pages/video/detail2"});else if(1===t){e.index.showToast({title:"已同意合成",icon:"success"});let t=a.value.title.trim();if(t.length<2)return void e.index.showToast({title:"标题不能低于2个字",icon:"none"});if(!a.value.mainContent)return void e.index.showToast({title:"正文不能为空",icon:"none"});let s=a.value.mainContent.trim();if(s.length<6)return void e.index.showToast({title:"正文不能低于6个字",icon:"none"});const l=s.length,u=10*Math.ceil(l/150);e.index.showLoading({title:`合成中...本次预计扣除[运营方]费用${u}U...`,mask:!0});try{const d=await e.index.request({url:"https://www.aimh8.com/wechat_index.php",method:"POST",data:{media_generate_debit:!0,username:n,user_id:i,operator_id:a.value.operator_id,operator_username:a.value.operator_username,document_id:o.value,muban_id:a.value.muban_id,text:s,text_title:t,cost:u}});d.data.code>=0?r(u):(e.index.showToast({title:"提交失败:"+d.data.msg,icon:"none"}),e.index.hideLoading())}catch(d){console.error("提交失败:",d),e.index.showToast({title:"提交失败，请重试",icon:"none"}),e.index.hideLoading()}}},m=async()=>{if(1===a.value.status){e.index.showToast({title:"拒绝中",icon:"success"});try{const t=await e.index.request({url:"https://www.aimh8.com/wechat_index.php",method:"POST",data:{rejectDocument:!0,username:n,user_id:i,document_id:o.value}});t.data.code>=0?a.value.status=2:(e.index.showToast({title:"提交失败:"+t.data.msg,icon:"none"}),e.index.hideLoading())}catch(t){console.error("提交失败:",t),e.index.showToast({title:"提交失败，请重试",icon:"none"}),e.index.hideLoading()}}},h=e.computed((()=>2!==a.value.status)),v=e.computed((()=>{const e=a.value.status;return 3===e?"口播视频合成中":4===e?"查看视频":"同意合成"})),g=e.computed((()=>3===a.value.status?"btn-disabled":"btn-primary"));return(t,o)=>{return e.e({a:e.t(a.value.title),b:e.t(a.value.operator),c:e.t(a.value.editor),d:e.t(a.value.owner_name),e:e.t(a.value.submissionTime),f:e.t((n=a.value.status,{1:"待[版权方]审批",2:"[版权方]已拒绝",3:"[版权方]合成中",4:"[版权方]已合成"}[n]||"未知状态")),g:a.value.videoUrl,h:a.value.thumbnailUrl,i:e.o(u),j:e.o((e=>d.value=!1)),k:e.t(a.value.mainContent),l:s.value&&h.value},s.value&&h.value?{m:e.t(v.value),n:e.n(g.value),o:e.o(c),p:3===a.value.status}:{},{q:s.value&&h.value&&1===a.value.status},s.value&&h.value&&1===a.value.status?{r:e.n(g.value),s:e.o(m)}:{});var n}}});a.__runtimeHooks=2,wx.createPage(a);
