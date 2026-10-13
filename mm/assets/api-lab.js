document.querySelectorAll('[data-copy-code]').forEach(button=>{
  button.addEventListener('click',async()=>{
    const code=document.getElementById(button.dataset.copyCode);
    const status=document.getElementById(button.getAttribute('aria-describedby'));
    try{
      if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(code.textContent);
      status.textContent=button.dataset.copyReference ? 'Reference copied. These setup commands are already done; do not run them again.' : 'Copied. Replace the example name with your own values before use.';
    }catch{
      const range=document.createRange();range.selectNodeContents(code);
      const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);
      status.textContent=button.dataset.copyReference ? 'Reference selected. Press Ctrl+C or Command+C to copy. Do not run these setup commands again.' : 'Code selected. Press Ctrl+C (Windows) or Command+C (Mac). Replace the example name before running.';
    }
  });
});