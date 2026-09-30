(() => {
  const tbody=document.getElementById('items');
  const rows=Array.from({length:12},()=>['','']);
  function renderItems(){
    tbody.replaceChildren();
    rows.forEach((values,index)=>{
      const row=document.createElement('tr');
      for(let col=0;col<2;col++){
        const cell=document.createElement('td'),input=document.createElement('input');
        input.setAttribute('aria-label',col===0?'Quantidade do item':'Descrição das mercadorias');
        input.value=values[col]||'';
        input.addEventListener('input',()=>{values[col]=input.value;});
        cell.append(input);
        if(col===1){
          const remove=document.createElement('button');remove.type='button';remove.className='remove-line';remove.textContent='×';remove.title='Remover linha';remove.setAttribute('aria-label',`Remover linha ${index+1}`);
          remove.addEventListener('click',()=>{rows.splice(index,1);renderItems();});
          cell.append(remove);
        }
        row.append(cell);
      }
      tbody.append(row);
    });
    document.querySelector('.goods-box').classList.toggle('expanded',rows.length>12);
  }
  renderItems();
  document.getElementById('add-line').addEventListener('click',()=>{rows.push(['','']);renderItems();});
  const payments=document.getElementById('payments');
  for(let i=0;i<6;i++){
    const row=document.createElement('div');row.className='payment-row';
    const amount=document.createElement('label');amount.className='pay-amount';
    const currency=document.createElement('span');currency.textContent='R$';
    const amountInput=document.createElement('input');amountInput.setAttribute('aria-label','Valor recebido');amount.append(currency,amountInput);
    const choices=document.createElement('div');choices.className='payment-options';
    for(const text of ['CHEQUE','PIX','TRANSF.']){
      const label=document.createElement('label'),checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.setAttribute('aria-label',text);
      label.append(checkbox,document.createTextNode(text));choices.append(label);
    }
    const bank=document.createElement('label');bank.className='bank';const bankName=document.createElement('span');bankName.textContent='BANCO';const bankInput=document.createElement('input');bankInput.setAttribute('aria-label','Banco');bank.append(bankName,bankInput);
    const day=document.createElement('label');day.className='pay-date';const dayText=document.createElement('span');dayText.textContent='PARA DIA';const dayInput=document.createElement('input');dayInput.setAttribute('aria-label','Data do pagamento');day.append(dayText,dayInput);
    row.append(amount,choices,bank,day);payments.append(row);
  }
  async function saveContractPdf(){
    const button=document.getElementById('print');
    const oldLabel=button.textContent;
    button.disabled=true;button.textContent='Gerando PDF...';
    try{
      if(!window.html2canvas||!window.jspdf)throw new Error('PDF generation library did not load.');
      await document.fonts.ready;
      const page=document.querySelector('.page');
      const canvas=await window.html2canvas(page,{scale:2,backgroundColor:'#ffffff',useCORS:true,logging:false});
      const pdf=new window.jspdf.jsPDF({orientation:'portrait',unit:'mm',format:'a4',compress:true});
      const maxWidth=210,maxHeight=297,fit=Math.min(maxWidth/canvas.width,maxHeight/canvas.height);
      const width=canvas.width*fit,height=canvas.height*fit;
      const image=canvas.toDataURL('image/jpeg',0.94);
      pdf.addImage(image,'JPEG',(maxWidth-width)/2,(maxHeight-height)/2,width,height,undefined,'FAST');
      const number=document.getElementById('contractNumber').value.trim();
      const customer=document.getElementById('customerName').value.trim();
      const suffix=[number,customer].filter(Boolean).join('_')||'SUN_LINE';
      const safe=suffix.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9_-]+/g,'_').replace(/^_+|_+$/g,'');
      pdf.save('Contrato_'+safe+'.pdf');
    }catch(error){
      console.error(error);
      alert('Could not generate the PDF. Please try again.');
    }finally{button.disabled=false;button.textContent=oldLabel;}
  }
  document.getElementById('print').addEventListener('click',saveContractPdf);
  document.addEventListener('keydown',event=>{
    if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='p'){
      event.preventDefault();window.print();
    }
  });
})();
