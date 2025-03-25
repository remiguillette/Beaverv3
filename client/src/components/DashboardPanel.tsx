import React from 'react';
import { Link } from 'react-router-dom';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface DashboardPanelProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  linkTo: string;
  buttonText: string;
}

export default function DashboardPanel({ 
  title, 
  description, 
  icon, 
  linkTo, 
  buttonText 
}: DashboardPanelProps) {
  useKeyboardShortcuts([
    { key: 'h', ctrl: true, handler: () => window.location.href = '/' },
    { key: 's', ctrl: true, handler: () => window.location.href = '/settings' },
    { key: 'f', ctrl: true, handler: () => document.querySelector<HTMLInputElement>('[role="search"]')?.focus() },
    { key: 'Escape', handler: () => document.activeElement instanceof HTMLElement && document.activeElement.blur() }
  ]);

  return (
    <Card className="flex flex-col justify-between h-full">
      <CardContent className="pt-6">
        <div className="mb-4">{React.cloneElement(icon, { className: `${(icon.props.className || '')} text-primary` })}</div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        <Link
          to={linkTo}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          {buttonText}
          <ArrowRight className="ml-2 h-4 w-4 text-primary" />
        </Link>
      </CardContent>
    </Card>
  );
}