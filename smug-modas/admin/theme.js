// Aplica o tema escolhido (claro/escuro) antes de o painel aparecer.
try {
  if (localStorage.getItem('smug:admin-tema') === 'escuro') document.documentElement.dataset.theme = 'dark';
} catch (e) {
  /* sem armazenamento: fica no tema claro */
}
