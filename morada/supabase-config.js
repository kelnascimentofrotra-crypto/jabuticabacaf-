// Endereço e chave pública do Supabase, usados pelo site e pelo painel /admin.
//
// Na Vercel eles vêm das variáveis de ambiente SUPABASE_URL e SUPABASE_ANON_KEY,
// entregues pela função /api/config (api/config.js). Nada fica escrito no código.
//
// A chave "anon" (ou "publishable") é pública por natureza: quem protege os dados
// são as políticas RLS do banco. A chave service_role / secret NUNCA vai para o navegador;
// se ela aparecer aqui por engano, o site se recusa a usá-la.
//
// moradaConfig() devolve { url, anonKey }; null quando o Supabase não está configurado;
// ou { error } quando não deu para falar com o servidor.
// moradaGoogleAtivo() diz se o login com Google está ativado no Supabase.
(function () {
  'use strict';

  function isSecretKey(key) {
    if (/^sb_secret_/i.test(key)) return true;
    try {
      const payload = JSON.parse(atob(key.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      return payload.role === 'service_role';
    } catch (_) {
      return false;
    }
  }

  let pending = null;
  window.moradaConfig = function moradaConfig() {
    if (pending) return pending;
    pending = (async () => {
      if (location.protocol === 'file:') return null; // arquivo aberto direto do computador: sem banco
      try {
        const res = await fetch('/api/config', { cache: 'no-store', headers: { accept: 'application/json' } });
        if (!res.ok) return null;
        const c = await res.json();
        if (!c || !c.url || !c.anonKey) return null;
        if (isSecretKey(String(c.anonKey))) {
          console.error('Morada: SUPABASE_ANON_KEY contém uma chave secreta (service_role). Troque pela chave anon/publishable na Vercel.');
          return null;
        }
        return { url: String(c.url).replace(/\/+$/, ''), anonKey: String(c.anonKey) };
      } catch (_) {
        pending = null; // sem conexão: tenta de novo na próxima chamada
        return { error: 'rede' };
      }
    })();
    return pending;
  };

  // O Google está ativado no Supabase (Authentication → Sign In / Providers → Google)?
  // true ou false; null quando não deu para perguntar (sem Supabase ou sem conexão).
  let googlePending = null;
  window.moradaGoogleAtivo = function moradaGoogleAtivo() {
    if (googlePending) return googlePending;
    googlePending = (async () => {
      const c = await window.moradaConfig();
      if (!c || c.error) { googlePending = null; return null; }
      try {
        const headers = { apikey: c.anonKey };
        if (/^eyJ/.test(c.anonKey)) headers.Authorization = `Bearer ${c.anonKey}`;
        const res = await fetch(`${c.url}/auth/v1/settings`, { headers });
        if (!res.ok) throw new Error(String(res.status));
        const s = await res.json();
        return s?.external?.google === true;
      } catch (_) {
        googlePending = null;
        return null;
      }
    })();
    return googlePending;
  };
})();
