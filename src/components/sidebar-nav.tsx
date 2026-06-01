'use client';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Calculator,
  Minus,
  RotateCw,
  TrendingUp,
  Crosshair,
  CircleOff,
  Waves,
  Globe,
  PenTool,
  Terminal,
  LineChart,
  Hammer,
  Settings2,
  BookOpen,
  Sigma,
  Variable,
  FileText,
  Map,
  ArrowRightLeft
} from 'lucide-react';
import {usePathname} from 'next/navigation';
import Link from 'next/link';

export function SidebarNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const menuTextStyle = "text-[10px] font-bold uppercase tracking-widest";

  return (
    <SidebarMenu className="gap-0">
      <SidebarMenuItem>
        <Link href="/" passHref>
          <SidebarMenuButton
            isActive={pathname === '/'}
            tooltip={{children: 'Dashboard', side: 'right'}}
            className="h-8"
          >
            <LayoutDashboard className="size-3" />
            <span className={menuTextStyle}>Dashboard</span>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>

      <SidebarGroup className="py-0.5">
        <SidebarGroupLabel className="text-[8px] uppercase tracking-[0.2em] h-5">Core Systems</SidebarGroupLabel>
        <SidebarMenuItem>
          <Link href="/calculators/arithma-console" passHref>
            <SidebarMenuButton isActive={isActive('/calculators/arithma-console')} className="h-7">
              <Terminal className="size-2.5 text-blue-400" /><span className={menuTextStyle}>Console</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link href="/arithma-sketch" passHref>
            <SidebarMenuButton isActive={isActive('/arithma-sketch')} className="h-7">
              <PenTool className="size-2.5 text-amber-400" /><span className={menuTextStyle}>Sketch</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link href="/calculators/interactive-demo" passHref>
            <SidebarMenuButton isActive={isActive('/calculators/interactive-demo')} className="h-7">
              <LineChart className="size-2.5 text-primary" /><span className={menuTextStyle}>Labs</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarGroup>
      
      <SidebarGroup className="py-0.5">
        <SidebarGroupLabel className="text-[8px] uppercase tracking-[0.2em] h-5">Horizontal</SidebarGroupLabel>
        <SidebarMenuItem>
          <Link href="/calculators/geometry" passHref>
            <SidebarMenuButton isActive={isActive('/calculators/geometry')} className="h-7">
              <Calculator className="size-2.5" /><span className={menuTextStyle}>Inverse</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link href="/calculators/geometry/sideshot" passHref>
            <SidebarMenuButton isActive={isActive('/calculators/geometry/sideshot')} className="h-7">
              <Minus className="size-2.5" /><span className={menuTextStyle}>Sideshot</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
         <SidebarMenuItem>
          <Link href="/calculators/resection" passHref>
            <SidebarMenuButton isActive={isActive('/calculators/resection')} className="h-7">
              <Crosshair className="size-2.5" /><span className={menuTextStyle}>Resection</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link href="/calculators/geometry/loop-closure" passHref>
            <SidebarMenuButton isActive={isActive('/calculators/geometry/loop-closure')} className="h-7">
              <RotateCw className="size-2.5" /><span className={menuTextStyle}>Loop Closure</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link href="/calculators/geometry/area-by-coordinates" passHref>
            <SidebarMenuButton isActive={isActive('/calculators/geometry/area-by-coordinates')} className="h-7">
              <Map className="size-2.5" /><span className={menuTextStyle}>Area by Coord</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarGroup>

      <SidebarGroup className="py-0.5">
        <SidebarGroupLabel className="text-[8px] uppercase tracking-[0.2em] h-5">Vertical</SidebarGroupLabel>
        <SidebarMenuItem>
          <Link href="/calculators/geometry/level-notes" passHref>
            <SidebarMenuButton isActive={isActive('/calculators/geometry/level-notes')} className="h-7">
              <TrendingUp className="size-2.5" /><span className={menuTextStyle}>Level Notes</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link href="/calculators/vertical/slope-to-horizontal" passHref>
            <SidebarMenuButton isActive={isActive('/calculators/vertical/slope-to-horizontal')} className="h-7">
              <ArrowRightLeft className="size-2.5" /><span className={menuTextStyle}>Slope to Horiz</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link href="/calculators/vertical/vertical-curve" passHref>
            <SidebarMenuButton isActive={isActive('/calculators/vertical/vertical-curve')} className="h-7">
              <TrendingUp className="size-2.5" /><span className={menuTextStyle}>Vertical Curve</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarGroup>

      <SidebarGroup className="py-0.5">
        <SidebarGroupLabel className="text-[8px] uppercase tracking-[0.2em] h-5">Curves</SidebarGroupLabel>
        <SidebarMenuItem>
          <Link href="/calculators/geometry/curve" passHref>
            <SidebarMenuButton isActive={isActive('/calculators/geometry/curve')} className="h-7">
              <CircleOff className="size-2.5" /><span className={menuTextStyle}>Horizontal</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link href="/calculators/curves/compound-curve" passHref>
            <SidebarMenuButton isActive={isActive('/calculators/curves/compound-curve')} className="h-7">
              <RotateCw className="size-2.5" /><span className={menuTextStyle}>Compound</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
           <Link href="/calculators/curves/spiral-curve" passHref>
            <SidebarMenuButton isActive={isActive('/calculators/curves/spiral-curve')} className="h-7">
              <Waves className="size-2.5" /><span className={menuTextStyle}>Spiral</span>
            </SidebarMenuButton>
            </Link>
        </SidebarMenuItem>
      </SidebarGroup>

      <SidebarGroup className="py-0.5">
        <SidebarGroupLabel className="text-[8px] uppercase tracking-[0.2em] h-5">Geodetic</SidebarGroupLabel>
        <SidebarMenuItem>
          <Link href="/calculators/transformation" passHref>
            <SidebarMenuButton isActive={isActive('/calculators/transformation')} className="h-7">
              <RotateCw className="size-2.5" /><span className={menuTextStyle}>Transform</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link href="/calculators/geodetic/spcs-converter" passHref>
            <SidebarMenuButton isActive={isActive('/calculators/geodetic/spcs-converter')} className="h-7">
              <Globe className="size-2.5" /><span className={menuTextStyle}>SPCS Conv</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link href="/calculators/geodetic/combined-factor" passHref>
            <SidebarMenuButton isActive={isActive('/calculators/geodetic/combined-factor')} className="h-7">
              <Globe className="size-2.5" /><span className={menuTextStyle}>Comb. Factor</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarGroup>

      <SidebarGroup className="py-0.5">
        <SidebarGroupLabel className="text-[8px] uppercase tracking-[0.2em] h-5">Storm Water</SidebarGroupLabel>
        <SidebarMenuItem>
          <Link href="/calculators/storm-water" passHref>
            <SidebarMenuButton isActive={isActive('/calculators/storm-water')} className="h-7">
              <Waves className="size-2.5" /><span className={menuTextStyle}>Rational</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link href="/calculators/storm-water/mannings-equation" passHref>
            <SidebarMenuButton isActive={isActive('/calculators/storm-water/mannings-equation')} className="h-7">
              <Waves className="size-2.5" /><span className={menuTextStyle}>Manning's</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link href="/calculators/storm-water/nrcs-curve-number" passHref>
            <SidebarMenuButton isActive={isActive('/calculators/storm-water/nrcs-curve-number')} className="h-7">
              <Waves className="size-2.5" /><span className={menuTextStyle}>NRCS CN</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link href="/calculators/storm-water/orifice-equation" passHref>
            <SidebarMenuButton isActive={isActive('/calculators/storm-water/orifice-equation')} className="h-7">
              <Waves className="size-2.5" /><span className={menuTextStyle}>Orifice Eq</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarGroup>

      <SidebarGroup className="py-0.5">
        <SidebarGroupLabel className="text-[8px] uppercase tracking-[0.2em] h-5">General & AI</SidebarGroupLabel>
        <SidebarMenuItem>
          <Link href="/calculators/tools/unit-converter" passHref>
            <SidebarMenuButton isActive={isActive('/calculators/tools/unit-converter')} className="h-7">
              <Hammer className="size-2.5" /><span className={menuTextStyle}>Unit Conv</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link href="/calculators/algebra/derivative" passHref>
            <SidebarMenuButton isActive={isActive('/calculators/algebra/derivative')} className="h-7">
              <Sigma className="size-2.5" /><span className={menuTextStyle}>Derivative</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link href="/calculators/algebra/integral" passHref>
            <SidebarMenuButton isActive={isActive('/calculators/algebra/integral')} className="h-7">
              <Sigma className="size-2.5" /><span className={menuTextStyle}>Integral</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link href="/calculators/algebra/factor-polynomial" passHref>
            <SidebarMenuButton isActive={isActive('/calculators/algebra/factor-polynomial')} className="h-7">
              <Variable className="size-2.5" /><span className={menuTextStyle}>Factoring</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarGroup>

      <SidebarGroup className="py-0.5">
        <SidebarGroupLabel className="text-[8px] uppercase tracking-[0.2em] h-5">Knowledge</SidebarGroupLabel>
        <SidebarMenuItem>
          <Link href="/learn/survey-standards" passHref>
            <SidebarMenuButton isActive={isActive('/learn/survey-standards')} className="h-7">
              <BookOpen className="size-2.5" /><span className={menuTextStyle}>Standards</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link href="/documents" passHref>
            <SidebarMenuButton isActive={isActive('/documents')} className="h-7">
              <FileText className="size-2.5" /><span className={menuTextStyle}>Docs</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarGroup>
    </SidebarMenu>
  );
}
