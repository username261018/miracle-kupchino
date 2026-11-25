/* Miracle v2 · grid motion */
(function(){
  var d=document,h=d.documentElement,W=window;
  var top=d.querySelector('.top');
  function setTop(){if(top)h.style.setProperty('--top-h',top.offsetHeight+'px');}
  setTop();W.addEventListener('resize',setTop);W.addEventListener('load',setTop);

  var bt=d.querySelector('.burger'),mn=d.getElementById('menu');
  if(bt&&mn){
    var set=function(o){bt.setAttribute('aria-expanded',o?'true':'false');mn.classList.toggle('open',o);setTop();};
    bt.addEventListener('click',function(){set(bt.getAttribute('aria-expanded')!=='true');});
    mn.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){set(false);});});
    d.addEventListener('keydown',function(e){if(e.key==='Escape')set(false);});
    W.addEventListener('resize',function(){if(W.innerWidth>=900)set(false);});
  }
  d.querySelectorAll('[data-map]').forEach(function(b){
    b.addEventListener('click',function(){
      var box=b.closest('.map'),f=d.createElement('iframe');
      f.src=b.getAttribute('data-map');f.title='Карта: Miracle Beauty Studio';f.setAttribute('allowfullscreen','');f.loading='lazy';
      box.classList.add('live');box.innerHTML='';box.appendChild(f);
    });
  });

  var fine=W.matchMedia('(hover:hover) and (pointer:fine)').matches;
  var reduce=W.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var spot=d.querySelector('.spot');
  if(spot&&fine&&!reduce){
    var sx=0,sy=0,q=false;
    W.addEventListener('pointermove',function(e){sx=e.clientX;sy=e.clientY;if(!q){q=true;requestAnimationFrame(function(){spot.style.transform='translate('+(sx-300)+'px,'+(sy-300)+'px)';spot.classList.add('on');q=false;});}},{passive:true});
  }
  if(fine&&!reduce){
    d.querySelectorAll('[data-tilt]').forEach(function(el){
      var p=el.parentElement;
      p.addEventListener('pointermove',function(e){var r=p.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform='perspective(1000px) rotateY('+(x*6).toFixed(2)+'deg) rotateX('+(-y*5).toFixed(2)+'deg)';});
      p.addEventListener('pointerleave',function(){el.style.transform='';});
    });
  }

  if(!h.classList.contains('m-on'))return;
  h.classList.add('m-ready');

  d.querySelectorAll('[data-split]').forEach(function(el){
    var i=0;
    (function walk(n){
      Array.prototype.slice.call(n.childNodes).forEach(function(c){
        if(c.nodeType===3){
          var fr=d.createDocumentFragment();
          c.textContent.split(/([\s\u00a0]+)/).forEach(function(p){
            if(!p)return;
            if(/^[\s\u00a0]+$/.test(p)){fr.appendChild(d.createTextNode(p));return;}
            var w=d.createElement('span'),wi=d.createElement('span');
            w.className='w';wi.className='wi';wi.style.setProperty('--k',i++);wi.textContent=p;w.appendChild(wi);fr.appendChild(w);
          });
          n.replaceChild(fr,c);
        }else if(c.nodeType===1)walk(c);
      });
    })(el);
    el.setAttribute('aria-label',el.textContent.replace(/\u00a0/g,' '));
  });
  d.querySelectorAll('[data-st]').forEach(function(g){var k=0;g.querySelectorAll('[data-rv],[data-pin]').forEach(function(c){c.style.setProperty('--i',k++);});});

  var sel='[data-rv],[data-split],[data-pin],[data-ln],[data-mark]';
  var hero=d.querySelector('.hero');
  var all=Array.prototype.slice.call(d.querySelectorAll(sel)).filter(function(e){return !hero.contains(e);});
  /* lines lead their rows: a random part of sections draws the rule first, the row ~200ms later */
  var heads=d.querySelectorAll('.sec-head');
  var lead=Math.floor(Math.random()*heads.length);
  heads.forEach(function(hd,i){if(i%2===lead%2)hd.classList.add('lead-ln');});
  var show=function(e){
    if(e.classList.contains('in'))return;
    var hd=e.closest('.sec-head');
    if(hd&&hd.classList.contains('lead-ln')&&e.hasAttribute('data-split')){var r=hd.querySelector('[data-ln]');if(r)r.classList.add('in');setTimeout(function(){e.classList.add('in');},200);return;}
    e.classList.add('in');
    e.querySelectorAll('[data-mark]').forEach(mark);if(e.hasAttribute('data-mark'))mark(e);
  };
  var noise='+×·/|:–';
  function mark(el){var nz=el.querySelector('.nz');if(!nz||el.dataset.done)return;el.dataset.done='1';var txt=nz.textContent,t0=performance.now(),dur=700;
    (function step(t){var p=Math.min(1,(t-t0)/dur),n=Math.floor(txt.length*p),s=txt.slice(0,n);for(var j=n;j<txt.length;j++)s+=txt[j]===' '?' ':noise[(j+Math.floor(t/60))%noise.length];nz.textContent=s;if(p<1)requestAnimationFrame(step);else nz.textContent=txt;})(t0);}
  var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){show(x.target);io.unobserve(x.target);}});},{rootMargin:'0px 0px -8% 0px',threshold:.01});
  all.forEach(function(e){io.observe(e);});
  var sweep=function(){var vh=W.innerHeight;all.forEach(function(e){if(!e.classList.contains('in')&&e.getBoundingClientRect().top<vh)show(e);});};

  var go=function(){setTimeout(function(){hero.querySelectorAll(sel).forEach(show);},300);};
  if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',go);else go();

  var gl=[];
  d.querySelectorAll('[data-glow]').forEach(function(p){
    var ws=[],txt=p.textContent.trim().split(/\s+/);p.textContent='';
    txt.forEach(function(w,i){var s=d.createElement('span');s.className='gw';s.textContent=w;p.appendChild(s);if(i<txt.length-1)p.appendChild(d.createTextNode(' '));ws.push(s);});
    p.classList.add('gl');gl.push({p:p,ws:ws});
  });
  var panels=d.querySelectorAll('[data-panel]'),tick=false;
  var frame=function(){
    tick=false;var vh=W.innerHeight;
    gl.forEach(function(g){var r=g.p.getBoundingClientRect();if(r.bottom<0||r.top>vh)return;
      var pr=Math.max(0,Math.min(1,(vh*.9-r.top)/(vh*.45))),n=Math.round(pr*g.ws.length);
      g.ws.forEach(function(s,i){s.classList.toggle('lit',i<n);});});
    panels.forEach(function(p){var t=p.getBoundingClientRect().top,k=Math.max(0,Math.min(1,(t-vh*.4)/(vh*.6)));if(W.scrollY+vh>=h.scrollHeight-4)k=0;p.style.setProperty('--fx',(Math.min(48,W.innerWidth*.06)*k).toFixed(1)+'px');});
    sweep();
  };
  var on=function(){if(!tick){tick=true;requestAnimationFrame(frame);}};
  W.addEventListener('scroll',on,{passive:true});W.addEventListener('resize',on);W.addEventListener('load',on);
  W.addEventListener('beforeprint',function(){all.forEach(show);gl.forEach(function(g){g.ws.forEach(function(s){s.classList.add('lit');});});});
  frame();
})();
