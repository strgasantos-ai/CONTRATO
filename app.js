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
  document.getElementById('print').addEventListener('click',()=>window.print());
  document.addEventListener('keydown',event=>{
    if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='p'){
      event.preventDefault();window.print();
    }
  });
})();
