import {
  Briefcase,
  CircleDollarSign,
  Clock,
  Code2,
  Database,
  Factory,
  Ghost,
  Globe,
  HardHat,
  HelpCircle,
  LayoutTemplate,
  RefreshCw,
  Scissors,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Stethoscope,
  Swords,
  TrendingUp,
  Users,
  UtensilsCrossed,
  Wallet,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import type { NicheCategoryId, ObjectionCategory, ServiceKind } from '../types';

export const CATEGORY_ICON: Record<ObjectionCategory, LucideIcon> = {
  preco: CircleDollarSign,
  necessidade: HelpCircle,
  confianca: ShieldCheck,
  concorrencia: Swords,
  prazo: Clock,
  pagamento: Wallet,
  resultados: TrendingUp,
  manutencao: Wrench,
  sistemas: Code2,
  decisao: Users,
  sumiu: Ghost,
};

export const NICHE_ICON: Record<NicheCategoryId, LucideIcon> = {
  beleza: Scissors,
  saude: Stethoscope,
  alimentacao: UtensilsCrossed,
  construcao: HardHat,
  profissionais: Briefcase,
  comercio: ShoppingBag,
  industria: Factory,
};

export const SERVICE_ICON: Record<ServiceKind, LucideIcon> = {
  site: Globe,
  landing: LayoutTemplate,
  loja: ShoppingCart,
  sistema: Database,
  recorrente: RefreshCw,
};
