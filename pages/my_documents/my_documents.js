"use strict";const e=require("../../common/vendor.js"),t=require("../../utils/config.js"),s=require("../../common/assets.js"),o={data:()=>({tabs:["全部","待审核","已通过","被拒绝","已合成"],currentTab:0,documents:[],loading:!0,loadingMore:!1,currentPage:1,pageSize:10,totalPages:1,hasMorePages:!1,statusMap:{0:"草稿",1:["待审核","审核通过"],2:"被拒绝",3:"合成中",4:"已合成"},scrollTop:0,processing_task_id:0,progressTimer:null,generateProgress:0}),computed:{emptyText(){return{0:"暂无文案，快来创建您的第一个文案吧！",1:"暂无待审核的文案",2:"暂无已通过的文案",3:"暂无已合成的文案"}[this.currentTab]}},onLoad(){this.loadDocuments()},onUnload(){this.progressTimer&&(clearInterval(this.progressTimer),this.progressTimer=null)},methods:{switchTab(e){this.currentTab!==e&&(this.currentTab=e,this.documents=[],this.currentPage=1,this.loadDocuments())},loadDocuments(){this.loading=!0,this.currentPage=1;const s={uni_token:t.getUserUniToken(),page:this.currentPage,page_size:this.pageSize,filter_status:this.currentTab};e.index.request({url:t.SERVER_URL+"get_user_documents",method:"POST",data:s,header:{"Content-Type":"application/json"},success:t=>{this.loading=!1;const s=t.data;console.log(s),s.code>0?(this.documents=s.list||[],this.totalPages=s.total_pages||Math.ceil(s.total/this.pageSize)||1,this.hasMorePages=this.currentPage<this.totalPages,this.getGenerateProgress()):e.index.showToast({title:s.msg||"获取文案列表失败",icon:"none"})},fail:t=>{this.loading=!1,e.index.showToast({title:"网络错误，请稍后重试",icon:"none"}),console.error("获取文案列表失败:",t)}})},loadMore(){if(this.loadingMore||!this.hasMorePages)return;this.loadingMore=!0,this.currentPage++;const s={uni_token:t.getUserUniToken(),page:this.currentPage,page_size:this.pageSize,filter_status:this.currentTab};e.index.request({url:t.SERVER_URL+"get_user_documents",method:"POST",data:s,header:{"Content-Type":"application/json"},success:t=>{this.loadingMore=!1;const s=t.data;console.log("加载更多:",s),"获取成功"===s.msg&&s.list&&s.list.length>0?(this.documents=[...this.documents,...s.list],this.totalPages=s.total_pages||Math.ceil(s.total/this.pageSize)||1,this.hasMorePages=this.currentPage<this.totalPages):(this.hasMorePages=!1,e.index.showToast({title:"没有更多数据了",icon:"none",duration:1500}))},fail:t=>{this.loadingMore=!1,e.index.showToast({title:"网络错误，请稍后重试",icon:"none"}),console.error("加载更多失败:",t)}})},getStatusText(e,t){return 1===e?t>=0?this.statusMap[e][1]:this.statusMap[e][0]:this.statusMap[e]||"未知状态"},getStatusClass(e,t){const s={0:"status-unknown",1:["status-pending","status-approved"],2:"status-rejected",3:"status-processing",4:"status-completed"};return 1===e?t>=0?s[e][1]:s[e][0]:s[e]||"status-unknown"},formatTime(e){if(!e)return"未知时间";if("string"==typeof e){const t=new Date(e);if(isNaN(t.getTime())){const t=parseInt(e);return isNaN(t)?"无效时间格式":this.formatTime(t)}return`${t.getFullYear()}-${(t.getMonth()+1).toString().padStart(2,"0")}-${t.getDate().toString().padStart(2,"0")} ${t.getHours().toString().padStart(2,"0")}:${t.getMinutes().toString().padStart(2,"0")}`}const t=new Date(1e3*e);return`${t.getFullYear()}-${(t.getMonth()+1).toString().padStart(2,"0")}-${t.getDate().toString().padStart(2,"0")} ${t.getHours().toString().padStart(2,"0")}:${t.getMinutes().toString().padStart(2,"0")}`},getVideoInfo(s){if(!s)return;if(!t.hasVideoPermission())return;const o=t.getUserUniToken();e.index.showLoading({title:"获取视频信息..."}),e.index.request({url:this.$serverUrl+"get_generate_video",method:"POST",data:{uni_token:o,video_id:s},success:t=>{var s;if(e.index.hideLoading(),t.data.code>0&&t.data.videoData&&t.data.videoData.full_file_path){const o=t.data.videoData.full_file_path,i=t.data.videoData.filename||(null==(s=this.avatar)?void 0:s.title)||"视频预览";e.index.navigateTo({url:`/pages/preview/preview?video=${encodeURIComponent(o)}&title=${encodeURIComponent(i)}&download=true`})}else e.index.showToast({title:"获取视频信息失败，无法播放",icon:"none"})},fail:t=>{e.index.hideLoading(),console.error("获取视频信息出错:",t),e.index.showToast({title:"获取视频信息失败，请稍后再试",icon:"none"})}})},playVideo(e){this.getVideoInfo(e.generate_video_id),console.log(e)},handleVideoError(t){console.error("视频播放错误:",t),e.index.showToast({title:"视频播放失败，请稍后重试",icon:"none"})},editDocument(t){e.index.navigateTo({url:`/pages/script_editor/script_editor?avatar_id=${t.avatar_id}&&document_id=${t.id}`})},confirmDelete(t){e.index.showModal({title:"删除文案",content:"确定要删除此文案吗？此操作不可恢复。",success:e=>{e.confirm&&this.deleteDocument(t.id)}})},deleteDocument(s){e.index.showLoading({title:"删除中...",mask:!0}),e.index.request({url:t.SERVER_URL+"delete_document",method:"POST",data:{uni_token:t.getUserUniToken(),document_id:s},header:{"Content-Type":"application/json"},success:t=>{e.index.hideLoading();const o=t.data;if(o.code>0){e.index.showToast({title:"删除成功",icon:"success",duration:2e3});const t=this.documents.findIndex((e=>e.id===s));-1!==t&&this.documents.splice(t,1),0===this.documents.length&&this.currentPage>1&&(this.currentPage=1,this.loadDocuments())}else e.index.showToast({title:o.msg||"删除失败",icon:"none",duration:2e3})},fail:t=>{e.index.hideLoading(),console.error("删除文档失败:",t),e.index.showToast({title:"网络错误，请稍后重试",icon:"none",duration:2e3})}})},getGenerateProgress(){const e=()=>{t.getGenerateProgress((e=>{e.error?console.error("获取进度失败:",e.error):e.taskId>0&&(this.generateProgress=e.progress,this.processing_task_id=e.taskId,e.isComplete&&(clearInterval(this.progressTimer),this.progressTimer=null,setTimeout((()=>{this.loadDocuments()}),5e3)))}))};e(),this.progressTimer||(this.progressTimer=setInterval(e,5e3))},onScroll(e){this.scrollTop=e.detail.scrollTop}}};const i=e._export_sfc(o,[["render",function(t,o,i,a,n,r){return e.e({a:e.f(n.tabs,((t,s,o)=>({a:e.t(t),b:s,c:n.currentTab===s?1:"",d:e.o((e=>r.switchTab(s)),s)}))),b:0===n.documents.length&&!n.loading},0!==n.documents.length||n.loading?{}:{c:s._imports_0$6,d:e.t(r.emptyText)},{e:n.loading},(n.loading,{}),{f:n.documents.length>0&&!n.loading},n.documents.length>0&&!n.loading?e.e({g:e.f(n.documents,((t,o,i)=>e.e({a:e.t(t.title||"无标题文案"),b:e.t(r.getStatusText(t.status,t.generate_video_id)),c:e.n(r.getStatusClass(t.status,t.generate_video_id)),d:e.t(t.name||"未指定数字人"),e:e.t(r.formatTime(t.submitTime)),f:4===t.status&&t.video_url},4===t.status&&t.video_url?{g:"video-"+t.id,h:t.video_url,i:t.oss_path||"",j:e.o(((...e)=>r.handleVideoError&&r.handleVideoError(...e)),t.id),k:s._imports_3,l:e.o((e=>r.playVideo(t)),t.id)}:{},{m:3===t.status},(t.status,{}),{n:e.o((e=>r.editDocument(t)),t.id),o:3===t.status},3===t.status?{p:s._imports_5,q:e.t(n.generateProgress)}:{},{r:4===t.status},4===t.status?{s:s._imports_3,t:e.o((e=>r.playVideo(t)),t.id)}:{},{v:1!==t.status&&4!==t.status},(1!==t.status&&t.status,{}),{w:0===t.status&&t.fail_reason},0===t.status&&t.fail_reason?{x:e.t(t.fail_reason)}:{},{y:2===t.status&&t.reject_reason},2===t.status&&t.reject_reason?{z:e.t(t.reject_reason)}:{},{A:3!==t.status},3!==t.status?{B:s._imports_6,C:e.o((e=>r.confirmDelete(t)),t.id)}:{},{D:t.id}))),h:s._imports_1$1,i:s._imports_2,j:s._imports_4,k:n.hasMorePages&&!n.loadingMore},n.hasMorePages&&!n.loadingMore?{l:e.o(((...e)=>r.loadMore&&r.loadMore(...e)))}:{},{m:n.loadingMore},(n.loadingMore,{}),{n:!n.hasMorePages&&n.documents.length>0},(!n.hasMorePages&&n.documents.length,{}),{o:n.scrollTop,p:e.o(((...e)=>r.onScroll&&r.onScroll(...e))),q:e.o(((...e)=>r.loadMore&&r.loadMore(...e)))}):{})}]]);wx.createPage(i);
