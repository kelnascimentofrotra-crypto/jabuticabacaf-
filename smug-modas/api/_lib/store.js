// Armazenamento do painel: Vercel Blob em produção; uma pasta local no servidor de
// desenvolvimento (scripts/dev-server.mjs), para testar sem conta na Vercel.
import { promises as fs } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const LOCAL_DIR = !process.env.BLOB_READ_WRITE_TOKEN ? process.env.SMUG_LOCAL_BLOB_DIR || '' : '';

export class ConflictError extends Error {}

let sdk;
const blobSdk = async () => (sdk ||= await import('@vercel/blob'));
const digest = (text) => crypto.createHash('sha1').update(text).digest('hex');
const localPath = (pathname) => path.join(LOCAL_DIR, pathname.replace(/\.\.+/g, ''));

export const storageReady = () => Boolean(LOCAL_DIR || process.env.BLOB_READ_WRITE_TOKEN);

// Lê um JSON → { data, etag } ou null quando não existe. Sempre a versão mais recente (sem cache).
export async function readJson(pathname) {
  if (LOCAL_DIR) {
    try {
      const text = await fs.readFile(localPath(pathname), 'utf8');
      return { data: JSON.parse(text), etag: digest(text) };
    } catch (error) {
      if (error.code === 'ENOENT') return null;
      throw error;
    }
  }
  const { get } = await blobSdk();
  const result = await get(pathname, { access: 'public', useCache: false });
  if (!result || result.statusCode !== 200) return null;
  return { data: JSON.parse(await new Response(result.stream).text()), etag: result.blob.etag };
}

// Grava um JSON público. `etag`: undefined = sem conferência; null = só se ainda não existir;
// string = só se a versão atual for essa (senão ConflictError).
export async function writeJson(pathname, data, { etag, cacheSeconds = 60 } = {}) {
  const text = JSON.stringify(data);
  if (LOCAL_DIR) {
    const file = localPath(pathname);
    if (etag !== undefined) {
      let current = null;
      try {
        current = digest(await fs.readFile(file, 'utf8'));
      } catch {
        /* ainda não existe */
      }
      if (current !== etag) throw new ConflictError();
    }
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, text);
    return { url: `/_local-blob/${pathname}`, etag: digest(text) };
  }
  const { put, BlobPreconditionFailedError } = await blobSdk();
  try {
    const result = await put(pathname, text, {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: etag !== null,
      contentType: 'application/json; charset=utf-8',
      cacheControlMaxAge: cacheSeconds,
      ...(typeof etag === 'string' ? { ifMatch: etag } : {}),
    });
    return { url: result.url, etag: result.etag };
  } catch (error) {
    if (error instanceof BlobPreconditionFailedError || /already exists/i.test(error.message)) throw new ConflictError();
    throw error;
  }
}

// Grava uma foto pública com nome único → { url }
export async function putFile(pathname, buffer, contentType) {
  if (LOCAL_DIR) {
    const unique = pathname.replace(/(\.\w+)$/, `-${crypto.randomBytes(4).toString('hex')}$1`);
    const file = localPath(unique);
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, buffer);
    return { url: `/_local-blob/${unique}` };
  }
  const { put } = await blobSdk();
  const result = await put(pathname, buffer, { access: 'public', addRandomSuffix: true, contentType, cacheControlMaxAge: 31536000 });
  return { url: result.url };
}
