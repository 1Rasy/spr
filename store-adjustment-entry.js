(function(){
  const addEntry=()=>{const gates=document.querySelector('.store-top-gates');if(!gates||gates.querySelector('[data-stock-adjustment-entry]'))return;
    gates.insertAdjacentHTML('beforeend',`<button class="btn-gate-half" data-stock-adjustment-entry onclick="navigateStorePage('stock.html')">📝 库存调整申请</button>`);
  };
  new MutationObserver(addEntry).observe(document.getElementById('list'),{childList:true,subtree:true}); addEntry();
})();

