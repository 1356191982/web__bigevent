"use strict";$(function(){var r=layui.layer,i=$("#image"),n={aspectRatio:1,preview:".img-preview"};i.cropper(n),$("#upLoadBtn").on("click",function(){$("#file").click()}),$("#file").on("change",function(t){if(0===t.target.files.length)return r.msg("请选择文件！");var e=t.target.files[0],a=URL.createObjectURL(e);i.cropper("destroy").attr("src",a).cropper(n)}),$("#confirmBtn").on("click",function(){var t=i.cropper("getCroppedCanvas",{width:100,height:100}).toDataURL("image/png");$.ajax({method:"POST",url:"my/update/avatar",data:{avatar:t},success:function(t){if(0!==t.status)return r.msg("更换头像失败！");r.msg("更换头像成功！"),window.parent.getUserInfo()}})})});