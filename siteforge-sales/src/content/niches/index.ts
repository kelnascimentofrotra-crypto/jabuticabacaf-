import type { Niche } from '../../types';
import { BELEZA } from './beleza';
import { SAUDE } from './saude';
import { ALIMENTACAO } from './alimentacao';
import { CONSTRUCAO } from './construcao';
import { PROFISSIONAIS } from './profissionais';
import { COMERCIO } from './comercio';
import { INDUSTRIA } from './industria';

export const NICHES: Niche[] = [...BELEZA, ...SAUDE, ...ALIMENTACAO, ...CONSTRUCAO, ...PROFISSIONAIS, ...COMERCIO, ...INDUSTRIA];
