var GAS="https://script.google.com/macros/s/AKfycbxoy05fpGvPruH9NeIipaGYLbvyJgcNPNjhXZC2tb8C-W8H_meuYfOgJtzzoF1cZvZb/exec";
var MODS=["0. Cfg. Inicial","1. Contabilidad","2. C. Presupuestal","3. Ctas. por Pagar","4. Bancos","5. Ctas. por Cobrar","6. Adquisiciones"];
var SUBS=["Cat\u00e1logos","Registros","Procesos","Informes"];
var CC={"Cat\u00e1logos":"#1D9E75","Registros":"#378ADD","Procesos":"#BA7517","Informes":"#7F77DD"};
var MB=["Julio C\u00e9sar","Cristian","Eunice","Joshua",""];
var COL={"Julio C\u00e9sar":["#E8EAF6","#283593","#3949AB"],"Eunice":["#E8F5E9","#1B5E20","#388E3C"],"Joshua":["#FFF3E0","#E65100","#F57C00"],"Cristian":["#FCE4EC","#880E4F","#C2185B"]};
var INI={"Julio C\u00e9sar":"JC","Eunice":"EU","Joshua":"JO","Cristian":"CR"};
var PTS={A:1,B:2,C:3};
var FC2={"analisis":"#5C6BC0","desarrollo":"#26A69A","revision":"#FFA726","validacion":"#EC407A"};
var FS=["analisis","desarrollo","revision","validacion"];
var FL={"analisis":"Analisis","desarrollo":"Desarrollo","revision":"Revision","validacion":"Validacion"};
var MF={A:{analisis:20,desarrollo:40,revision:20,validacion:20},B:{analisis:40,desarrollo:300,revision:20,validacion:20},C:{analisis:90,desarrollo:600,revision:20,validacion:20}};
var D=480,W=2400,M=9600,N=4;
var T=TDATA;
var fi="t",at="t";
var mo=new Set(["0. Cfg. Inicial","1. Contabilidad"]);
var so=new Set();

function r1(x){return Math.round(x*10)/10}
function tm(t){var f=MF[t.tipo]||{analisis:0,desarrollo:0,revision:0,validacion:0};return f.analisis+f.desarrollo+f.revision+f.validacion}
function sf(t){return FS.reduce(function(s,f){return s+(t["done_"+f]?1:0)},0)}
function el(id){return document.getElementById(id)}

function calcK(){
  var tot=T.length,dn=0,ds=0,pt=0,pd=0,mt=0,md=0;
  T.forEach(function(t){
    pt+=(PTS[t.tipo]||0); mt+=tm(t); ds+=sf(t);
    if(t.done==="\u2713"){dn++;pd+=(PTS[t.tipo]||0);md+=tm(t)}
  });
  var av=pt>0?Math.round(pd/pt*100):0;
  var rs=mt-md;
  el("kAv").textContent=av+"%";
  el("kTr").innerHTML="<b>"+dn+"</b>/"+tot+" tar &nbsp;<b>"+pd+"</b>/"+pt+" pts";
  el("kSf").textContent=Math.round(ds/504*100)+"%";
  el("kSfS").innerHTML="<b>"+ds+"</b>/504 subfases";
  el("kMn").textContent=md.toLocaleString();
  el("kMnS").innerHTML="<b>"+r1(md/(N*D))+"</b>d &nbsp;<b>"+r1(md/(N*W))+"</b>s";
  el("kRs").textContent=r1(rs/(N*D));
  el("kRsS").innerHTML="<span>"+r1(rs/(N*W))+"</span>s &nbsp;<span>"+r1(rs/(N*M))+"</span>m";
}

function vis(){
  var q=el("srch").value.toLowerCase();
  return T.filter(function(t){
    var qm=!q||t.tarea.toLowerCase().indexOf(q)>=0||t.modulo.toLowerCase().indexOf(q)>=0;
    var fm=fi==="t"||(fi==="d"&&t.done==="\u2713")||(fi==="p"&&t.done!=="\u2713");
    return qm&&fm;
  });
}

function mkFase(t,fa){
  var f=MF[t.tipo]||{analisis:0,desarrollo:0,revision:0,validacion:0};
  var on=t["done_"+fa], mins=f[fa], resp=t["resp_"+fa]||"";
  var color=FC2[fa];
  var d=document.createElement("div");
  d.className="fc";
  d.style.borderTop="2px solid "+color;
  var lbl=document.createElement("div");
  lbl.className="fl2"; lbl.style.color=color;
  lbl.textContent=FL[fa]+" "+mins+"m";
  var chk=document.createElement("div");
  chk.className="fck";
  var box=document.createElement("span");
  box.className="fckb"+(on?" on":"");
  var lbchk=document.createElement("span");
  lbchk.className="fckl"; lbchk.textContent=on?"Listo":"Pendiente";
  chk.appendChild(box); chk.appendChild(lbchk);
  chk.onclick=(function(tid,fase){return function(){togF(tid,fase)}})(t.id,fa);
  var sel=document.createElement("select");
  sel.className="fcs";
  MB.forEach(function(m){
    var opt=document.createElement("option");
    opt.value=m; opt.textContent=m||"-";
    if(resp===m) opt.selected=true;
    sel.appendChild(opt);
  });
  sel.onchange=(function(tid,campo){return function(){updR(tid,campo,this.value)}})(t.id,"resp_"+fa);
  d.appendChild(lbl); d.appendChild(chk); d.appendChild(sel);
  return d;
}

function mkTarea(t){
  var dn=t.done==="\u2713";
  var f=MF[t.tipo]||{analisis:0,desarrollo:0,revision:0,validacion:0};
  var mT=f.analisis+f.desarrollo+f.revision+f.validacion;
  var tc=t.tipo==="A"?"tA":t.tipo==="B"?"tB":t.tipo==="C"?"tC":"tX";
  var row=document.createElement("div");
  row.className="tr"+(dn?" dr":"");
  // top row
  var top=document.createElement("div"); top.className="tr-top";
  var chk=document.createElement("div");
  chk.className="chk"+(dn?" on":"");
  chk.onclick=(function(id){return function(){togD(id)}})(t.id);
  var name=document.createElement("span");
  name.className="tn"+(dn?" dt":""); name.textContent=t.tarea;
  var badge=document.createElement("span");
  badge.className="tt "+tc; badge.textContent=t.tipo;
  top.appendChild(chk); top.appendChild(name); top.appendChild(badge);
  // dots subfases
  var sfp=document.createElement("div"); sfp.className="sfp";
  FS.forEach(function(fa){
    var on=t["done_"+fa];
    var dot=document.createElement("span");
    dot.className="sfd";
    dot.style.background=on?FC2[fa]:"var(--bg3)";
    dot.style.color=on?"#fff":"var(--t3)";
    dot.textContent=on?"\u2713":"\u00b7";
    sfp.appendChild(dot);
  });
  var sfct=document.createElement("span");
  sfct.style.cssText="font-size:10px;color:var(--t3);margin-left:4px";
  sfct.textContent=sf(t)+"/4";
  sfp.appendChild(sfct);
  // fases grid
  var fg=document.createElement("div"); fg.className="fg";
  FS.forEach(function(fa){fg.appendChild(mkFase(t,fa))});
  // tiempo
  var tt=document.createElement("div"); tt.className="tr-t";
  tt.innerHTML="<span>Total: <b>"+mT+" min</b></span><span>Dias: <b>"+r1(mT/D)+"</b></span><span>Sem: <b>"+r1(mT/W)+"</b></span>";
  row.appendChild(top); row.appendChild(sfp); row.appendChild(fg); row.appendChild(tt);
  return row;
}

function render(){
  var v=vis(), cont=el("MC");
  cont.innerHTML="";
  if(!v.length){cont.innerHTML="<p style='padding:20px;text-align:center;color:var(--t2)'>Sin resultados</p>";return}
  var pm={};
  MODS.forEach(function(m){pm[m]={}});
  v.forEach(function(t){
    if(!pm[t.modulo])pm[t.modulo]={};
    if(!pm[t.modulo][t.subsistema])pm[t.modulo][t.subsistema]=[];
    pm[t.modulo][t.subsistema].push(t);
  });
  MODS.forEach(function(mod){
    var subs=pm[mod];
    if(!subs||!Object.keys(subs).length)return;
    var all=[]; Object.values(subs).forEach(function(a){all=all.concat(a)});
    var dn=all.filter(function(t){return t.done==="\u2713"}).length;
    var dsf=all.reduce(function(s,t){return s+sf(t)},0);
    var pct=all.length?Math.round(dn/all.length*100):0;
    var op=mo.has(mod);
    var bg=pct===100?"#1D9E75":pct>0?"#378ADD":"#888780";
    // card
    var mc=document.createElement("div"); mc.className="mc";
    // header
    var mh=document.createElement("div"); mh.className="mh";
    mh.onclick=(function(m){return function(){togM(m)}})(mod);
    var chev=document.createElement("span"); chev.className="chev"+(op?" op":""); chev.innerHTML="&#9654;";
    var mn=document.createElement("span"); mn.className="mn"; mn.textContent=mod;
    var ms=document.createElement("div"); ms.className="ms";
    var pp=document.createElement("span"); pp.className="pp"; pp.style.background=bg; pp.textContent=pct+"%";
    var pb=document.createElement("div"); pb.className="pb";
    var pf=document.createElement("div"); pf.className="pf"; pf.style.width=pct+"%"; pf.style.background=bg;
    pb.appendChild(pf);
    var ct=document.createElement("span"); ct.style.cssText="font-size:10px;color:var(--t3)"; ct.textContent=dn+"/"+all.length+" | "+dsf+"/"+(all.length*4)+"sf";
    ms.appendChild(pp); ms.appendChild(pb); ms.appendChild(ct);
    mh.appendChild(chev); mh.appendChild(mn); mh.appendChild(ms);
    mc.appendChild(mh);
    if(op){
      SUBS.forEach(function(sub){
        var items=subs[sub];
        if(!items||!items.length)return;
        var dc=CC[sub]||"#888";
        var dt=items.filter(function(t){return t.done==="\u2713"}).length;
        var ds2=items.reduce(function(s,t){return s+sf(t)},0);
        var sk=mod+"||"+sub, sop=so.has(sk);
        var sdiv=document.createElement("div"); sdiv.className="sub";
        var sh=document.createElement("div"); sh.className="sh";
        sh.onclick=(function(k){return function(){togS(k)}})(sk);
        var dot=document.createElement("span"); dot.className="sd"; dot.style.background=dc;
        var sn=document.createElement("span"); sn.className="sn"; sn.textContent=sub;
        var sc=document.createElement("span"); sc.className="sc"; sc.textContent=dt+"/"+items.length+" | "+ds2+"/"+(items.length*4)+"sf";
        sh.appendChild(dot); sh.appendChild(sn); sh.appendChild(sc);
        sdiv.appendChild(sh);
        if(sop){items.forEach(function(t){sdiv.appendChild(mkTarea(t))})}
        mc.appendChild(sdiv);
      });
    }
    cont.appendChild(mc);
  });
}

function renderF(){
  var mf={};
  MB.filter(function(m){return m}).forEach(function(m){mf[m]={analisis:0,desarrollo:0,revision:0,validacion:0}});
  T.forEach(function(t){
    FS.forEach(function(fa){
      if(!t["done_"+fa])return;
      var resp=t["resp_"+fa];
      if(resp&&mf[resp]){var f=MF[t.tipo]||{analisis:0,desarrollo:0,revision:0,validacion:0};mf[resp][fa]+=f[fa]}
    });
  });
  var totEq=Object.values(mf).reduce(function(s,v){return s+v.analisis+v.desarrollo+v.revision+v.validacion},0);
  var md=T.filter(function(t){return t.done==="\u2713"}).reduce(function(s,t){return s+tm(t)},0);
  var mt=T.reduce(function(s,t){return s+tm(t)},0), mr=mt-md;
  var dsf=T.reduce(function(s,t){return s+sf(t)},0);
  var fc=el("FC"); fc.innerHTML="";
  // kpis sistema
  var sg=document.createElement("div"); sg.className="sg";
  var kpis=[
    [md.toLocaleString()+" min","Consumidos","var(--gr)","<b>"+r1(md/(N*D))+"</b>d <b>"+r1(md/(N*W))+"</b>s"],
    [mr.toLocaleString()+" min","Restantes","var(--am)","<span>"+r1(mr/(N*D))+"</span>d <span>"+r1(mr/(N*W))+"</span>s"],
    [mt.toLocaleString()+" min","Total","var(--t2)","<b>"+r1(mt/(N*D))+"</b>d <b>"+r1(mt/(N*W))+"</b>s"],
    [dsf+"/504","Subfases","var(--pu)","<b>"+Math.round(dsf/504*100)+"%</b>"]
  ];
  kpis.forEach(function(k){
    var kc=document.createElement("div"); kc.className="kc";
    kc.innerHTML='<div class="kv" style="color:'+k[2]+'">'+k[0]+'</div><div class="kl">'+k[1]+'</div><div class="ks">'+k[3]+'</div>';
    sg.appendChild(kc);
  });
  fc.appendChild(sg);
  ["Julio C\u00e9sar","Eunice","Joshua","Cristian"].forEach(function(m){
    var f=mf[m]||{analisis:0,desarrollo:0,revision:0,validacion:0};
    var tot=f.analisis+f.desarrollo+f.revision+f.validacion;
    var pct=totEq>0?r1(tot/totEq*100):0;
    var col=COL[m]||["#f1efe8","#444","#888"];
    var ini=INI[m]||m.slice(0,2).toUpperCase();
    var card=document.createElement("div"); card.className="fcard";
    var fh=document.createElement("div"); fh.className="fh";
    var av=document.createElement("div"); av.className="av";
    av.style.background=col[0]; av.style.color=col[1]; av.textContent=ini;
    var info=document.createElement("div");
    info.innerHTML='<div class="fnh">'+m+'</div><div class="fsb">'+pct+'% fuerza</div>';
    var fpct=document.createElement("div"); fpct.className="fpc";
    fpct.innerHTML='<div class="fpv" style="color:'+col[1]+'">'+pct+'%</div><div class="fpl">fuerza</div>';
    fh.appendChild(av); fh.appendChild(info); fh.appendChild(fpct);
    // 4 fases
    var f4=document.createElement("div"); f4.className="f4";
    FS.forEach(function(fa){
      var fc4=document.createElement("div"); fc4.className="f4c";
      fc4.style.borderTop="2px solid "+FC2[fa];
      fc4.innerHTML='<div class="f4l" style="color:'+FC2[fa]+'">'+FL[fa]+'</div><div class="f4v" style="color:'+col[1]+'">'+f[fa].toLocaleString()+' min</div><div class="f4m">'+r1(f[fa]/60)+'h '+r1(f[fa]/D)+'d</div>';
      f4.appendChild(fc4);
    });
    // barra
    var dv=document.createElement("div"); dv.className="dv";
    var fbh=document.createElement("div"); fbh.className="fbh";
    fbh.innerHTML='<span>Fuerza acumulada</span><span><b>'+tot.toLocaleString()+' min &middot; '+r1(tot/60)+'h &middot; '+r1(tot/W)+' sem</b></span>';
    var fbar=document.createElement("div"); fbar.className="fbar";
    var ff=document.createElement("div"); ff.className="fbar-f"; ff.style.width=pct+"%"; ff.style.background=col[2];
    fbar.appendChild(ff);
    // tiempo grid
    var ftg=document.createElement("div"); ftg.className="ftg";
    var tcs=[["Minutos",tot.toLocaleString(),""],["Dias/Sem",r1(tot/D),"/"+r1(tot/W)],["Meses",r1(tot/M),""]];
    tcs.forEach(function(tc){
      var ftc=document.createElement("div"); ftc.className="ftc";
      ftc.innerHTML='<div class="ftl">'+tc[0]+'</div><div class="ftv"><span class="ftn">'+tc[1]+'</span><span class="ftr">'+tc[2]+'</span></div>';
      ftg.appendChild(ftc);
    });
    card.appendChild(fh); card.appendChild(f4); card.appendChild(dv);
    card.appendChild(fbh); card.appendChild(fbar); card.appendChild(ftg);
    fc.appendChild(card);
  });
}

function togD(id){
  var t=T.find(function(x){return x.id===id}); if(!t)return;
  t.done=t.done==="\u2713"?"":"\u2713";
  FS.forEach(function(f){t["done_"+f]=t.done==="\u2713"});
  upd(); toast(t.done==="\u2713"?"Tarea completa":"Desmarcada");
  post({action:"updateDone",id:id,valor:t.done==="\u2713"});
}
function togF(id,fa){
  var t=T.find(function(x){return x.id===id}); if(!t)return;
  t["done_"+fa]=!t["done_"+fa];
  t.done=FS.every(function(f){return t["done_"+f]})?"\u2713":"";
  upd(); toast(FL[fa]+(t["done_"+fa]?" listo":" desmarcado"));
  post({action:"updateFase",id:id,campo:"done_"+fa,valor:t["done_"+fa]?"\u2713":""});
}
function updR(id,campo,valor){
  var t=T.find(function(x){return x.id===id}); if(!t)return;
  t[campo]=valor; if(at==="f")renderF();
  post({action:"updateFase",id:id,campo:campo,valor:valor});
}
function upd(){calcK();render();if(at==="f")renderF()}
function togM(m){mo.has(m)?mo.delete(m):mo.add(m);render()}
function togS(k){so.has(k)?so.delete(k):so.add(k);render()}
function filt(f,btn){fi=f;document.querySelectorAll(".fb").forEach(function(b){b.classList.remove("on")});btn.classList.add("on");render()}
function cambiaTab(t,btn){
  at=t; document.querySelectorAll(".tab").forEach(function(b){b.classList.remove("on")});
  btn.classList.add("on");
  el("pT").style.display=t==="t"?"block":"none";
  el("pF").style.display=t==="f"?"block":"none";
  if(t==="f")renderF();
}
function post(data){try{fetch(GAS,{method:"POST",body:JSON.stringify(data)})}catch(e){}}
function guardar(){
  toast("Guardando...");
  var payload=T.map(function(t){return{
    id:t.id,done:t.done,
    done_analisis:t.done_analisis?"\u2713":"",
    done_desarrollo:t.done_desarrollo?"\u2713":"",
    done_revision:t.done_revision?"\u2713":"",
    done_validacion:t.done_validacion?"\u2713":"",
    resp_analisis:t.resp_analisis||"",
    resp_desarrollo:t.resp_desarrollo||"",
    resp_revision:t.resp_revision||"",
    resp_validacion:t.resp_validacion||""
  }});
  fetch(GAS,{method:"POST",body:JSON.stringify({action:"bulkUpdate",tareas:payload})})
    .then(function(r){return r.json()})
    .then(function(d){toast(d.ok?"Guardado ("+d.updated+" tareas)":"Error")})
    .catch(function(){toast("Error de conexion")});
}
function sincronizar(){
  toast("Sincronizando...");
  fetch(GAS+"?action=getTareas")
    .then(function(r){return r.json()})
    .then(function(d){
      if(!d.ok){toast("Error del servidor");return}
      d.tareas.forEach(function(rem){
        var loc=T.find(function(t){return t.id==rem.id}); if(!loc)return;
        loc.done=rem.done||"";
        FS.forEach(function(f){loc["done_"+f]=rem["done_"+f]==="\u2713"});
        ["resp_analisis","resp_desarrollo","resp_revision","resp_validacion"].forEach(function(c){loc[c]=rem[c]||""});
      });
      upd(); toast("Sincronizado");
    })
    .catch(function(){toast("Error de conexion")});
}
function toast(msg){
  var e=el("tst"); e.textContent=msg; e.classList.add("on");
  clearTimeout(e._t); e._t=setTimeout(function(){e.classList.remove("on")},2400);
}
calcK();
render();
